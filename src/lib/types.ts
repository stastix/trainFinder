export interface Departure {
  id?: string;
  time?: string;
  platform?: string;
  name?: string;
}

export interface TrainConnection {
  id: string;
  departure: {
    time: string;
    station: string;
    platform?: string;
    date?: string;
  };
  arrival: {
    time: string;
    station: string;
    platform?: string;
    date?: string;
  };
  duration: string;
  price: number;
  currency: string;
  changes: number;
  trainType: string;
  carrier: string;
  available: boolean;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  tripType: "oneway" | "roundtrip";
  returnDate?: string;
  overnightStays?: number;
}

export interface SearchResult {
  outbound: TrainConnection[];
  return?: TrainConnection[];
  searchParams: SearchParams;
}
