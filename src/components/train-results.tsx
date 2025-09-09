"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Euro, ArrowRight, Train, MapPin, Calendar } from "lucide-react";
import type { SearchResult, TrainConnection } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TrainResultsProps {
  results: SearchResult;
}
``
function ConnectionCard({
  connection,
  label,
}: {
  connection: TrainConnection;
  label?: string;
}) {
  const router = useRouter();

  const handleSelectTrain = () => {
    router.push(`/booking/${connection.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 sm:p-6">
        {label && (
          <div className="flex items-center gap-2 mb-4">
            <Train className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Journey Details - Stack on mobile, horizontal on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1">
            {/* Departure */}
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-lg font-bold text-foreground">
                {connection.departure.time}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                {formatDate(connection.departure.date ?? "")}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {connection.departure.station}
              </div>
              {connection.departure.platform && (
                <div className="text-xs text-muted-foreground">
                  Platform {connection.departure.platform}
                </div>
              )}
            </div>

            {/* Journey Info - Horizontal on mobile, vertical on desktop */}
            <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-1 min-w-[120px] px-4 py-2 bg-muted/50 rounded-lg sm:bg-transparent sm:p-0">
              <ArrowRight className="h-4 w-4 text-muted-foreground sm:mb-1" />
              <div className="text-sm font-medium text-foreground">
                {connection.duration}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {connection.changes === 0
                  ? "Direct"
                  : `${connection.changes} change${
                      connection.changes > 1 ? "s" : ""
                    }`}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-lg font-bold text-foreground">
                {connection.arrival.time}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                {formatDate(connection.arrival.date ?? "")}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {connection.arrival.station}
              </div>
              {connection.arrival.platform && (
                <div className="text-xs text-muted-foreground">
                  Platform {connection.arrival.platform}
                </div>
              )}
            </div>
          </div>

          {/* Price and Details */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {connection.trainType}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {connection.carrier}
              </div>
            </div>
            <div className="flex items-center gap-1 text-2xl sm:text-xl font-bold text-foreground">
              <Euro className="h-5 w-5 sm:h-4 sm:w-4" />
              {connection.price.toFixed(2)}
            </div>
          </div>
        </div>

        <Button
          className="w-full font-medium hover:bg-primary/90 transition-colors"
          size="lg"
          onClick={handleSelectTrain}
        >
          Select This Train
        </Button>
      </CardContent>
    </Card>
  );
}

export function TrainResults({ results }: TrainResultsProps) {
  const [sortBy, setSortBy] = useState<"price" | "duration" | "changes">(
    "price"
  );

  const sortConnections = (connections: TrainConnection[]) => {
    return [...connections].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          const aDuration =
            Number.parseInt(a.duration.split("h")[0]) * 60 +
            Number.parseInt(a.duration.split("h")[1]?.split("m")[0] || "0");
          const bDuration =
            Number.parseInt(b.duration.split("h")[0]) * 60 +
            Number.parseInt(b.duration.split("h")[1]?.split("m")[0] || "0");
          return aDuration - bDuration;
        case "changes":
          return a.changes - b.changes;
        default:
          return 0;
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "price" | "duration" | "changes")
            }
            className="text-xs border rounded px-2 py-1 bg-background"
          >
            <option value="price">Sort by Price</option>
            <option value="duration">Sort by Duration</option>
            <option value="changes">Sort by Changes</option>
          </select>
        </div>
      </div>

      {/* Outbound Journey */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Outbound Journey
          </h3>
          <span className="text-sm text-muted-foreground ml-auto">
            {new Date(results.searchParams.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="grid gap-4">
          {sortConnections(results.outbound).map((connection) => (
            <ConnectionCard key={connection.id} connection={connection} />
          ))}
        </div>
      </div>

      {/* Return Journey */}
      {results.return && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Return Journey
            </h3>
            <span className="text-sm text-muted-foreground ml-auto">
              {results.searchParams.returnDate &&
                new Date(results.searchParams.returnDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }
                )}
            </span>
          </div>
          <div className="grid gap-4">
            {sortConnections(results.return).map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
