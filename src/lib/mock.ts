import { TrainConnection } from "./types";

export function generateMockConnections(
  date: string,
  isReturn = false
): TrainConnection[] {
  const baseConnections = [
    {
      id: `conn-1-${date}`,
      departure: {
        time: "06:45",
        station: isReturn ? "Amsterdam Centraal" : "Hamburg Hbf",
        platform: "7",
      },
      arrival: {
        time: "12:55",
        station: isReturn ? "Hamburg Hbf" : "Amsterdam Centraal",
        platform: "4",
      },
      duration: "6h 10m",
      price: 39.9,
      currency: "EUR",
      changes: 1,
      trainType: "IC + NS",
      carrier: "DB/NS",
      available: true,
    },
    {
      id: `conn-2-${date}`,
      departure: {
        time: "08:15",
        station: isReturn ? "Amsterdam Centraal" : "Hamburg Hbf",
        platform: "12",
      },
      arrival: {
        time: "13:25",
        station: isReturn ? "Hamburg Hbf" : "Amsterdam Centraal",
        platform: "2",
      },
      duration: "5h 10m",
      price: 59.9,
      currency: "EUR",
      changes: 0,
      trainType: "ICE",
      carrier: "DB",
      available: true,
    },
    {
      id: `conn-3-${date}`,
      departure: {
        time: "10:45",
        station: isReturn ? "Amsterdam Centraal" : "Hamburg Hbf",
        platform: "9",
      },
      arrival: {
        time: "16:05",
        station: isReturn ? "Hamburg Hbf" : "Amsterdam Centraal",
        platform: "6",
      },
      duration: "5h 20m",
      price: 45.5,
      currency: "EUR",
      changes: 1,
      trainType: "IC + Sprinter",
      carrier: "DB/NS",
      available: true,
    },
    {
      id: `conn-4-${date}`,
      departure: {
        time: "14:15",
        station: isReturn ? "Amsterdam Centraal" : "Hamburg Hbf",
        platform: "5",
      },
      arrival: {
        time: "20:35",
        station: isReturn ? "Hamburg Hbf" : "Amsterdam Centraal",
        platform: "8",
      },
      duration: "6h 20m",
      price: 29.9,
      currency: "EUR",
      changes: 2,
      trainType: "Regional + IC",
      carrier: "DB/NS",
      available: true,
    },
    {
      id: `conn-5-${date}`,
      departure: {
        time: "16:45",
        station: isReturn ? "Amsterdam Centraal" : "Hamburg Hbf",
        platform: "11",
      },
      arrival: {
        time: "21:55",
        station: isReturn ? "Hamburg Hbf" : "Amsterdam Centraal",
        platform: "3",
      },
      duration: "5h 10m",
      price: 52.9,
      currency: "EUR",
      changes: 0,
      trainType: "ICE",
      carrier: "DB",
      available: true,
    },
  ];

  return baseConnections;
}
