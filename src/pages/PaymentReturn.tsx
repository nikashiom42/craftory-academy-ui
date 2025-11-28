/**
 * Payment Return Page
 * Handles redirect from BOG payment gateway after payment attempt.
 * Polls payment status and redirects to course page on success.
 */
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

type PaymentStatus = "loading" | "success" | "failed" | "pending" | "not_found";

interface PaymentOrder {
  id: string;
  status: string;
  course_id: string;
  courses?: {
    slug: string;
    title: string;
  };
}

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const MAX_POLLS = 20;
  const POLL_INTERVAL = 2000;

  const checkPaymentStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Try to get order_id from URL params (BOG may include this)
      const orderId = searchParams.get("order_id");
      const externalOrderId = searchParams.get("external_order_id");

      // Query payment_orders by order_id or user's most recent order
      let query = supabase
        .from("payment_orders")
        .select(`
          id,
          status,
          course_id,
          courses (
            slug,
            title
          )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (orderId) {
        query = query.eq("ipay_order_id", orderId);
      } else if (externalOrderId) {
        query = query.eq("shop_order_id", externalOrderId);
      }

      const { data, error: queryError } = await query.limit(1).single();

      if (queryError || !data) {
        if (pollCount >= MAX_POLLS) {
          setStatus("not_found");
          setError("გადახდის ინფორმაცია ვერ მოიძებნა");
        }
        return;
      }

      setPaymentOrder(data as PaymentOrder);

      // Map status
      if (data.status === "success") {
        setStatus("success");
      } else if (data.status === "failed" || data.status === "cancelled") {
        setStatus("failed");
        setError(data.status === "cancelled" ? "გადახდა გაუქმებულია" : "გადახდა ვერ შესრულდა");
      } else if (data.status === "pending" || data.status === "redirected") {
        setStatus("pending");
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      if (pollCount >= MAX_POLLS) {
        setStatus("failed");
        setError("დაფიქსირდა შეცდომა გადახდის სტატუსის შემოწმებისას");
      }
    }
  }, [searchParams, navigate, pollCount]);

  // Initial check and polling
  useEffect(() => {
    checkPaymentStatus();
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (status === "loading" || status === "pending") {
      if (pollCount < MAX_POLLS) {
        const timer = setTimeout(() => {
          setPollCount((prev) => prev + 1);
          checkPaymentStatus();
        }, POLL_INTERVAL);
        return () => clearTimeout(timer);
      } else {
        // Max polls reached, show pending message
        setStatus("pending");
      }
    }
  }, [status, pollCount, checkPaymentStatus]);

  // Auto-redirect on success after delay
  useEffect(() => {
    if (status === "success" && paymentOrder?.courses?.slug) {
      const timer = setTimeout(() => {
        navigate(`/student/courses/${paymentOrder.courses?.slug}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, paymentOrder, navigate]);

  const handleRetry = () => {
    setPollCount(0);
    setStatus("loading");
    setError(null);
    checkPaymentStatus();
  };

  const handleGoToCourse = () => {
    if (paymentOrder?.courses?.slug) {
      navigate(`/student/courses/${paymentOrder.courses.slug}`);
    } else {
      navigate("/student/dashboard");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12 bg-cream">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="text-center">
            <CardHeader>
              {(status === "loading" || status === "pending") && (
                <>
                  <div className="mx-auto mb-4">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  </div>
                  <CardTitle className="text-2xl">
                    {status === "loading" ? "გადახდის შემოწმება..." : "გადახდა მუშავდება..."}
                  </CardTitle>
                  <CardDescription>
                    {status === "loading" 
                      ? "გთხოვთ დაელოდოთ, მოწმდება გადახდის სტატუსი"
                      : "გადახდა მუშავდება, გთხოვთ დაელოდოთ რამდენიმე წამი"}
                  </CardDescription>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="mx-auto mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl text-green-600">
                    გადახდა წარმატებულია!
                  </CardTitle>
                  <CardDescription>
                    გილოცავთ! თქვენ წარმატებით შეიძინეთ კურსი
                    {paymentOrder?.courses?.title && (
                      <span className="block font-semibold mt-2 text-foreground">
                        "{paymentOrder.courses.title}"
                      </span>
                    )}
                  </CardDescription>
                </>
              )}

              {(status === "failed" || status === "not_found") && (
                <>
                  <div className="mx-auto mb-4">
                    <XCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl text-red-600">
                    {status === "not_found" ? "გადახდა ვერ მოიძებნა" : "გადახდა ვერ შესრულდა"}
                  </CardTitle>
                  <CardDescription>
                    {error || "გთხოვთ სცადოთ თავიდან ან დაუკავშირდით მხარდაჭერას"}
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {status === "success" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    ავტომატურად გადამისამართდებით კურსზე 3 წამში...
                  </p>
                  <Button onClick={handleGoToCourse} className="w-full">
                    კურსის გახსნა
                  </Button>
                </>
              )}

              {status === "pending" && pollCount >= MAX_POLLS && (
                <>
                  <p className="text-sm text-muted-foreground">
                    გადახდის დადასტურებას შეიძლება რამდენიმე წუთი დასჭირდეს.
                    შეგიძლიათ შეამოწმოთ თქვენი კურსები პანელზე.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRetry} className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      ხელახლა შემოწმება
                    </Button>
                    <Button onClick={handleGoToDashboard} className="flex-1">
                      პანელზე გადასვლა
                    </Button>
                  </div>
                </>
              )}

              {(status === "failed" || status === "not_found") && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRetry} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    ხელახლა შემოწმება
                  </Button>
                  <Button onClick={handleGoToDashboard} className="flex-1">
                    პანელზე გადასვლა
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

