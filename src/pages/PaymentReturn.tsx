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

      // Try to get order_id from URL params
      let orderId = searchParams.get("order_id");
      const externalOrderId = searchParams.get("external_order_id");

      // If no ID in URL, fetch the most recent order for this user
      // Check redirected, pending, or success status (callback may have already processed)
      if (!orderId && !externalOrderId) {
        console.log("No order ID in URL, checking latest order...");
        const { data: recentOrder } = await supabase
          .from("payment_orders")
          .select("ipay_order_id, status, course_id, courses(slug, title)")
          .eq("user_id", session.user.id)
          .in("status", ["redirected", "pending", "success"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recentOrder?.ipay_order_id) {
          orderId = recentOrder.ipay_order_id;
          console.log("Found recent order:", orderId, "status:", recentOrder.status);

          // If already successful, show success immediately
          if (recentOrder.status === "success") {
            const courseData = recentOrder.courses as { slug: string; title: string } | null;
            if (courseData) {
              setPaymentOrder({
                id: "",
                status: "success",
                course_id: recentOrder.course_id,
                courses: courseData,
              });
            }
            setStatus("success");
            return;
          }
        } else {
          console.error("No recent orders found");
          if (pollCount >= MAX_POLLS) {
            setStatus("not_found");
            setError("გადახდის ინფორმაცია ვერ მოიძებნა");
          }
          return;
        }
      }

      // Call verify-payment Edge Function to check with BOG directly
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-payment", {
        body: { orderId },
      });

      if (verifyError) {
        console.error("Verify payment error:", verifyError);
        if (pollCount >= MAX_POLLS) {
          setStatus("failed");
          setError("დაფიქსირდა შეცდომა გადახდის შემოწმებისას");
        }
        return;
      }

      const result = verifyData as { status: string; message: string; course?: { slug: string; title: string } };
      
      if (result.course) {
        setPaymentOrder({
          id: "",
          status: result.status,
          course_id: "",
          courses: result.course,
        });
      }

      if (result.status === "success") {
        setStatus("success");
      } else if (result.status === "failed") {
        setStatus("failed");
        setError(result.message || "გადახდა ვერ შესრულდა");
      } else if (result.status === "not_found") {
        if (pollCount >= MAX_POLLS) {
          setStatus("not_found");
          setError("გადახდის ინფორმაცია ვერ მოიძებნა");
        }
      } else {
        // pending or other
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

