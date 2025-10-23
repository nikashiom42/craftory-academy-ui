/**
 * PaymentReturn page
 * Handles user return from TBC hosted checkout page
 * Confirms payment status and redirects to student dashboard
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type PaymentStatus = "checking" | "paid" | "failed" | "pending";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    const payId = searchParams.get("payId");

    if (!payId) {
      setStatus("failed");
      setError("Payment ID not found");
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/tbc-payment/confirm?payId=${payId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      setStatus("failed");
      setError("Failed to confirm payment status");
      return;
    }

    const data = await response.json();

    if (data.status === "paid") {
      setStatus("paid");
      setTimeout(() => navigate("/student/dashboard"), 3000);
    } else if (data.status === "failed") {
      setStatus("failed");
      setError("Payment was not successful");
    } else {
      setStatus("pending");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "checking" && (
            <>
              <div className="mx-auto mb-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
              <CardTitle>Confirming Payment</CardTitle>
              <CardDescription>Please wait while we verify your payment...</CardDescription>
            </>
          )}

          {status === "paid" && (
            <>
              <div className="mx-auto mb-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <CardTitle className="text-green-600">Payment Successful!</CardTitle>
              <CardDescription>
                Your enrollment has been confirmed. Redirecting to your dashboard...
              </CardDescription>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="mx-auto mb-4">
                <XCircle className="w-16 h-16 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Payment Failed</CardTitle>
              <CardDescription>
                {error || "There was an issue processing your payment."}
              </CardDescription>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="mx-auto mb-4">
                <Loader2 className="w-16 h-16 text-yellow-600 animate-spin" />
              </div>
              <CardTitle className="text-yellow-600">Payment Pending</CardTitle>
              <CardDescription>
                Your payment is still being processed. Please check back later.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "paid" && (
            <Button onClick={() => navigate("/student/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          )}

          {status === "failed" && (
            <div className="space-y-2">
              <Button onClick={() => navigate("/courses")} className="w-full">
                Back to Courses
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}

          {status === "pending" && (
            <div className="space-y-2">
              <Button onClick={() => navigate("/student/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Refresh Status
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

