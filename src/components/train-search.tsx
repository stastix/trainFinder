"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CalendarDays,
  MapPin,
  ArrowRightLeft,
  Loader2,
  Info,
} from "lucide-react";
import { searchTrains } from "../lib/action";
import { TrainResults } from "@/components/train-results";
import { type SearchResult } from "../lib/types";

export function TrainSearch() {
  const [tripType, setTripType] = useState("roundtrip");
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [returnDate, setReturnDate] = useState("");
  const [overnightStays, setOvernightStays] = useState("2");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!departureDate) {
      setError("Please select a departure date");
      return;
    }

    if (tripType === "roundtrip" && !returnDate && !overnightStays) {
      setError("Please select a return date or specify overnight stays");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const results = await searchTrains({
        from: "Hamburg",
        to: "Amsterdam",
        date: departureDate,
        tripType: tripType as "oneway" | "roundtrip",
        returnDate: tripType === "roundtrip" ? returnDate : undefined,
        overnightStays:
          tripType === "roundtrip" && overnightStays
            ? Number.parseInt(overnightStays)
            : undefined,
      });

      setSearchResults(results);
    } catch (err) {
      setError("Failed to search trains. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg border-0 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Plan Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">Hamburg</div>
              <div className="text-sm text-muted-foreground font-medium">
                Germany
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
              <div className="text-xs text-muted-foreground font-medium">
                6h journey
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">Amsterdam</div>
              <div className="text-sm text-muted-foreground font-medium">
                Netherlands
              </div>
            </div>
          </div>

          {/* Trip Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Trip Type</Label>
            <RadioGroup
              value={tripType}
              onValueChange={setTripType}
              className="flex gap-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oneway" id="oneway" />
                <Label htmlFor="oneway" className="font-medium">
                  One-way
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roundtrip" id="roundtrip" />
                <Label htmlFor="roundtrip" className="font-medium">
                  Round-trip
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="departure-date"
                className="flex items-center gap-2 font-semibold"
              >
                <CalendarDays className="h-4 w-4" />
                Departure Date
              </Label>
              <Input
                id="departure-date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full h-11"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {tripType === "roundtrip" && (
              <div className="space-y-2">
                <Label htmlFor="return-date" className="font-semibold">
                  Return Date
                </Label>
                <Input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-11"
                  min={departureDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            )}
          </div>

          {/* Overnight Stays for Round-trip */}
          {tripType === "roundtrip" && (
            <div className="space-y-2">
              <Label htmlFor="overnight-stays" className="font-semibold">
                Number of Overnight Stays
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="overnight-stays"
                  type="number"
                  min="1"
                  max="30"
                  value={overnightStays}
                  onChange={(e) => setOvernightStays(e.target.value)}
                  className="w-32 h-11"
                  placeholder="2"
                />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>Leave return date empty to use overnight stays</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <Info className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching Trains...
              </>
            ) : (
              "Search Trains"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {searchResults && <TrainResults results={searchResults} />}
    </div>
  );
}
