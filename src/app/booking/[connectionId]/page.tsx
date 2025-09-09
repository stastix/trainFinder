"use client";

import type React from "react";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Train,
  CreditCard,
  User,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { bookTrain } from "@/lib/action";

interface BookingResult {
  success: boolean;
  bookingReference: string;
}
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const connectionId = params.connectionId as string;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [bookingResult, setBookingResult] = useState<BookingResult | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await bookTrain(connectionId, formData);
      setBookingResult(result);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingResult?.success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Train className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Booking Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-semibold">
              Booking Reference: {bookingResult.bookingReference}
            </div>
            <p className="text-muted-foreground">
              Your train ticket has been booked successfully. You will receive a
              confirmation email shortly.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Book Another Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Results
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            Complete Your Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Payment Information</h3>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center text-muted-foreground">
                Payment integration would be implemented here
                <br />
                (Demo mode - no actual payment required)
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                "Complete Booking"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
