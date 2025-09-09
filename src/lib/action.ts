"use server";

import { type SearchParams, type SearchResult } from "./types";
import { searchTrainsServer } from "./train-api";
export async function searchTrains(
  params: SearchParams
): Promise<SearchResult> {
  return await searchTrainsServer(params);
}

export async function bookTrain(
  connectionId: string,
  passengerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }
) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: true,
    bookingReference: `DB${Math.random()
      .toString(36)
      .substr(2, 8)
      .toUpperCase()}`,
    connectionId,
    passengerDetails,
  };
}
