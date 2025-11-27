import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CreditCard, Lock } from "lucide-react";

type PaymentState = "idle" | "creating" | "redirecting" | "error";

type PaymentOrderSummary = {
  status: "pending" | "redirected" | "success" | "failed" | "cancelled";
  status_description: string | null;
  updated_at: string | null;
  amount: number;
  currency_code: string;
};

export interface EnrollmentButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isEnrolled: boolean;
}

export interface EnrollmentButtonHandle {
  openPayment: () => Promise<void>;
}

/**
 * EnrollmentButton orchestrates auth checks, payment order creation, and status surfacing.
 */
export const EnrollmentButton = forwardRef<EnrollmentButtonHandle, EnrollmentButtonProps>(function EnrollmentButton(
  { courseId, courseTitle, price, isEnrolled },
  ref
) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [statusMessage, setStatusMessage] = useState("გადადით შემდეგ ნაბიჯზე რომ გადახდა შედგეს iPay-ზე.");
  const [latestOrder, setLatestOrder] = useState<PaymentOrderSummary | null>(null);
  const previousStatus = useRef<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Loads the latest payment order to surface its status in the UI.
   */
  const loadLatestOrder = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLatestOrder(null);
      return;
    }

    const { data, error } = await supabase
      .from("payment_orders")
      .select("status, status_description, updated_at, amount, currency_code")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      // 404 might mean table doesn't exist or no rows found - both are acceptable
      if (error.code === "PGRST116" || error.message?.includes("404")) {
        setLatestOrder(null);
        return;
      }
      console.error("Failed to load payment order summary", error);
      return;
    }

    setLatestOrder(data as PaymentOrderSummary | null);
  }, [courseId]);

  useEffect(() => {
    loadLatestOrder();
  }, [loadLatestOrder]);

  useEffect(() => {
    if (!latestOrder) {
      return;
    }

    if (
      previousStatus.current !== latestOrder.status &&
      (latestOrder.status === "success" || latestOrder.status === "failed" || latestOrder.status === "cancelled")
    ) {
      if (latestOrder.status === "success") {
        toast({
          title: "გადახდა დასრულებულია",
          description: "თქვენი ჩარიცხვა დადასტურდა. იხილეთ სტუდენტის პანელი.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "გადახდა ვერ შესრულდა",
          description: "გთხოვთ სცადოთ თავიდან ან მიმართეთ მხარდაჭერას.",
        });
      }
    }

    previousStatus.current = latestOrder.status;
  }, [latestOrder, toast]);

  useEffect(() => {
    if (!latestOrder) return;
    if (latestOrder.status === "pending" || latestOrder.status === "redirected") {
      const interval = setInterval(() => loadLatestOrder(), 8000);
      return () => clearInterval(interval);
    }
  }, [latestOrder, loadLatestOrder]);

  /**
   * Verifies user authentication before opening the checkout dialog.
   */
  const checkAuthAndOpenDialog = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        variant: "destructive",
        title: "გაიარეთ ავტორიზაცია",
        description: "კურსზე ჩასაწერად საჭiroა ავტორიზაცია. შექმენით ანგარიში ან შედით სისტემაში.",
      });
      navigate("/auth");
      return;
    }
    
    setPaymentState("idle");
    setStatusMessage("გადახდა მოხდება iPay-ის უსაფრთხო ფანჯარაში.");
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    openPayment: () => checkAuthAndOpenDialog(),
  }));

  /**
   * Request an iPay checkout session and redirect the user to the PSP.
   */
  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentState("creating");
    setStatusMessage("იტვირთება iPay-ის უსაფრთხო სესია...");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "გაიარეთ ავტორიზაცია",
          description: "კურსზე ჩასაწერად საჭiroა ავტორიზაცია.",
        });
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("ipay-create-order", {
        body: {
          courseId,
          locale: "ka",
        },
      });

      if (error || !data?.redirectUrl) {
        console.error("Failed to create iPay order", error);
        setPaymentState("error");
        setStatusMessage("გადახდის სესია ვერ შეიქმნა. სცადეთ ხელახლა.");
        toast({
          variant: "destructive",
          title: "გადახდის სესია ვერ შეიქმნა",
          description: "გთხოვთ სცადოთ თავიდან ან მოგვწერეთ მხარდაჭერას.",
        });
        return;
      }

      setPaymentState("redirecting");
      setStatusMessage("მიმდინარეობს გადამისამართება iPay-ზე. გთხოვთ არ დახუროთ ფანჯარა.");

      setTimeout(() => {
        window.location.href = data.redirectUrl;
      }, 400);
    } catch (error) {
      console.error("Enrollment checkout failed", error);
      setPaymentState("error");
      setStatusMessage("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.");
      toast({
        variant: "destructive",
        title: "ჩაწერა ვერ მოხერხდა",
        description: "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button size="lg" onClick={() => navigate("/student/dashboard")}>
        ჩემი კურსები
      </Button>
    );
  }

  return (
    <>
      <Button size="lg" className="gap-2" onClick={checkAuthAndOpenDialog}>
        <CreditCard className="w-5 h-5" />
        კურსის შეძენა - {price} ₾
      </Button>
      {latestOrder && (
        <div className="mt-4 rounded-xl border border-dashed border-accent/40 bg-muted/30 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">ბოლო გადახდა</span>
            <span
              className={
                latestOrder.status === "success"
                  ? "text-green-600 font-semibold"
                  : latestOrder.status === "failed" || latestOrder.status === "cancelled"
                  ? "text-red-600 font-semibold"
                  : "text-amber-600 font-semibold"
              }
            >
              {statusLabels[latestOrder.status] ?? latestOrder.status}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">
            {latestOrder.status_description || "სერვერი ამუშავებს გადახდას."}
          </p>
          <p className="mt-2 text-muted-foreground">
            თანხა: {latestOrder.amount} {latestOrder.currency_code}
          </p>
        </div>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>კურსის შეძენა</DialogTitle>
            <DialogDescription>
              კურსი: {courseTitle} • ფასი: {price} ₾ • გადახდა iPay-ზე
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnroll} className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">როგორ მუშაობს:</p>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                <li>დაადასტურეთ, რომ გსურთ ანგარიშის გადახდა.</li>
                <li>გადახდის ღილაკზე დაკლიკვის შემდეგ გადამისამართდებით iPay პლატფორმაზე.</li>
                <li>ბანკის დაცულ ფანჯარაში შეიყვანეთ ბარათის ან ინტერნეტ ბანკის მონაცემები.</li>
                <li>დასრულების შემდეგ ავტომატურად დაბრუნდებით სტუდენტის პანელში.</li>
              </ol>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>გადახდა ხორციელდება საქართველოს ბანკის iPay-ის დაცულ გარემოში.</span>
            </div>

            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                paymentState === "error" ? "border-destructive text-destructive" : "text-muted-foreground"
              }`}
            >
              {statusMessage}
            </div>

            <Button type="submit" className="w-full" disabled={loading || paymentState === "redirecting"}>
              {loading ? "მუშავდება..." : `გადასვლა iPay-ზე`}
            </Button>

            {paymentState === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>შეამოწმეთ ინტერნეტი ან სცადეთ კიდევ ერთხელ რამდენიმე წუთში.</span>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
});

const statusLabels: Record<string, string> = {
  pending: "მუშავდება",
  redirected: "ელოდება დადასტურებას",
  success: "დასრულებულია",
  failed: "შეცდომა",
  cancelled: "გაუქმებულია",
};
