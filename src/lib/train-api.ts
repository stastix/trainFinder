// Deutsche Bahn API service for Hamburg-Amsterdam train routes
// Server-side only implementation

import { generateMockConnections } from "./mock";
import { cache, CACHE_TTL, RATE_LIMIT } from "./cache";
import type { SearchResult, TrainConnection, SearchParams } from "./types";
import { delay, isTestEnvironment } from "./utils";

const TRANSPORT_API_BASE = "https://v6.db.transport.rest";

export const STATION_MAP: Record<string, { eva: string; displayName: string }> =
  {
    Hamburg: { eva: "8002549", displayName: "Hamburg Hbf" },
    Amsterdam: { eva: "8400058", displayName: "Amsterdam Centraal" },
  };

interface DBJourneyLeg {
  departure: string;
  arrival: string;
  origin: {
    name: string;
  };
  destination: {
    name: string;
  };
  departurePlatform?: string;
  arrivalPlatform?: string;
  line?: {
    product?: string;
  };
}

interface DBJourney {
  id?: string;
  legs: DBJourneyLeg[];
  price?: {
    amount: number;
    currency: string;
  };
}

interface DBApiResponse {
  journeys?: DBJourney[];
}

function calculateDuration(departure: string, arrival: string): string {
  const [depHours, depMinutes] = departure.split(":").map(Number);
  const [arrHours, arrMinutes] = arrival.split(":").map(Number);

  let totalMinutes = arrHours * 60 + arrMinutes - (depHours * 60 + depMinutes);
  if (totalMinutes < 0) totalMinutes += 24 * 60;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

async function fetchDBConnections(
  fromId: string,
  toId: string,
  date: string,
  time = "06:00"
): Promise<TrainConnection[]> {
  const cacheKey = `connections:${fromId}:${toId}:${date}:${time}`;
  const cached = cache.get<TrainConnection[]>(cacheKey);
  if (cached) return cached;

  if (
    !cache.checkRateLimit(
      "connections-api",
      RATE_LIMIT.MAX_REQUESTS,
      RATE_LIMIT.WINDOW_MS
    )
  ) {
    if (!isTestEnvironment()) {
      console.log("Rate limit exceeded for connections API");
    }
    throw new Error("Rate limit exceeded");
  }

  try {
    const response = await fetch(
      `${TRANSPORT_API_BASE}/journeys?from=${fromId}&to=${toId}&departure=${date}T${time}&results=5`
    );

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`
      );
    }

    const data: DBApiResponse = await response.json();
    const connections: TrainConnection[] =
      data.journeys?.map((journey: DBJourney, index: number) => {
        const departureTime = new Date(
          journey.legs[0].departure
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const arrivalTime = new Date(
          journey.legs[journey.legs.length - 1].arrival
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          id: `transport-${journey.id || index}`,
          departure: {
            time: departureTime,
            date: new Date(journey.legs[0].departure).toLocaleDateString(
              "en-CA"
            ), // Added departure date in YYYY-MM-DD format
            station: journey.legs[0].origin.name,
            platform: journey.legs[0].departurePlatform,
          },
          arrival: {
            time: arrivalTime,
            date: new Date(
              journey.legs[journey.legs.length - 1].arrival
            ).toLocaleDateString("en-CA"), // Added arrival date in YYYY-MM-DD format
            station: journey.legs[journey.legs.length - 1].destination.name,
            platform: journey.legs[journey.legs.length - 1].arrivalPlatform,
          },
          duration: calculateDuration(departureTime, arrivalTime),
          price: journey.price?.amount || 35 + Math.random() * 40,
          currency: journey.price?.currency || "EUR",
          changes: journey.legs.length - 1,
          trainType: journey.legs[0].line?.product || "IC",
          carrier: "DB/NS",
          available: true,
        };
      }) || [];

    if (connections.length === 0) {
      throw new Error("No connections found");
    }

    connections.sort((a, b) => {
      const timeA = a.departure.time.split(":").map(Number);
      const timeB = b.departure.time.split(":").map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });

    cache.set(cacheKey, connections, CACHE_TTL.CONNECTIONS);
    return connections;
  } catch (error: unknown) {
    if (!isTestEnvironment()) {
      if (error instanceof Error) {
        console.log(`Transport API request failed:`, error.message);
      } else {
        console.log(`Transport API request failed:`, error);
      }
    }
    throw error;
  }
}

export async function searchTrainsServer(
  params: SearchParams
): Promise<SearchResult> {
  const cacheKey = `search:${JSON.stringify(params)}`;
  const cached = cache.get<SearchResult>(cacheKey);
  if (cached) return cached;

  try {
    const fromStation = STATION_MAP["Hamburg"];
    const toStation = STATION_MAP["Amsterdam"];

    const outbound: TrainConnection[] = await fetchDBConnections(
      fromStation.eva,
      toStation.eva,
      params.date
    );
    let returnConnections: TrainConnection[] | undefined;

    if (params.tripType === "roundtrip") {
      let returnDate = params.returnDate;
      if (!returnDate && params.overnightStays) {
        const depDate = new Date(params.date);
        depDate.setDate(depDate.getDate() + params.overnightStays);
        returnDate = depDate.toISOString().split("T")[0];
      }
      if (returnDate) {
        returnConnections = await fetchDBConnections(
          toStation.eva,
          fromStation.eva,
          returnDate
        );
      }
    }

    const result: SearchResult = {
      outbound,
      return: returnConnections,
      searchParams: params,
    };
    cache.set(cacheKey, result, CACHE_TTL.CONNECTIONS);
    return result;
  } catch (err) {
    if (!isTestEnvironment()) console.error("Train search error:", err);

    await delay(1500);
    const outbound = generateMockConnections(params.date);
    outbound.sort((a, b) => {
      const timeA = a.departure.time.split(":").map(Number);
      const timeB = b.departure.time.split(":").map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });

    let returnConnections: TrainConnection[] | undefined;
    if (params.tripType === "roundtrip") {
      let returnDate = params.returnDate;
      if (!returnDate && params.overnightStays) {
        const depDate = new Date(params.date);
        depDate.setDate(depDate.getDate() + params.overnightStays);
        returnDate = depDate.toISOString().split("T")[0];
      }
      if (returnDate) {
        returnConnections = generateMockConnections(returnDate, true);
        returnConnections.sort((a, b) => {
          const timeA = a.departure.time.split(":").map(Number);
          const timeB = b.departure.time.split(":").map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          return minutesA - minutesB;
        });
      }
    }

    return { outbound, return: returnConnections, searchParams: params };
  }
}
