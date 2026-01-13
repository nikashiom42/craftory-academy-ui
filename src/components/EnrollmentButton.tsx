import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CreditCard, Lock, Banknote, CalendarClock, Check } from "lucide-react";

type PaymentState = "idle" | "creating" | "redirecting" | "error";

type PaymentOrderSummary = {
  status: "pending" | "redirected" | "success" | "failed" | "cancelled";
  status_description: string | null;
  updated_at: string | null;
  amount: number;
  currency_code: string;
};

type PaymentMethod = "full" | "bog_loan" | "bnpl";

// BOG minimum amounts for installment products
const BNPL_MIN_AMOUNT = 45;      // ნაწილ-ნაწილ minimum: 45 GEL
const BOG_LOAN_MIN_AMOUNT = 100; // განვადება minimum: 100 GEL

interface InstallmentPlan {
  amount: number;      // Monthly payment amount
  month: number;       // Duration in months (e.g., 6, 12, 18, 24)
  discountCode?: string; // Optional discount code
  type: "bog_loan" | "bnpl";
}

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("full");
  const [installmentPlan, setInstallmentPlan] = useState<InstallmentPlan | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
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
   * Selects an installment plan with the given duration
   */
  const selectInstallmentPlan = useCallback((months: number, type: "bog_loan" | "bnpl") => {
    const monthlyAmount = Math.round(price / months);
    setInstallmentPlan({
      amount: monthlyAmount,
      month: months,
      type: type,
    });
  }, [price]);

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
          ...(paymentMethod !== "full" && installmentPlan ? {
            paymentMethod: installmentPlan.type,
            installmentMonths: installmentPlan.month,
            discountCode: installmentPlan.discountCode,
          } : {}),
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

  const showInstallmentConfig = paymentMethod === "bog_loan" || paymentMethod === "bnpl";
  const canUseBnpl = price >= BNPL_MIN_AMOUNT;
  const canUseBogLoan = price >= BOG_LOAN_MIN_AMOUNT;

  return (
    <>
      <Button size="lg" className="gap-2" onClick={checkAuthAndOpenDialog}>
        <CreditCard className="w-5 h-5" />
        კურსის შეძენა - {price} ₾
      </Button>
      {latestOrder && (
        <div className="mt-4 rounded-xl border border-dashed border-accent/40 bg-muted/30 p-4 text-sm font-secondary">
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
        <DialogContent className={`font-secondary p-0 overflow-hidden gap-0 border-none shadow-2xl transition-all duration-300 ${
          showInstallmentConfig ? "sm:max-w-4xl" : "sm:max-w-lg"
        }`}>
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Payment Methods */}
            <div className={`bg-white p-6 ${showInstallmentConfig ? "md:w-1/2 md:border-r border-gray-100" : "w-full"}`}>
              <DialogHeader className="pb-5 space-y-2">
                <DialogTitle className="text-3xl font-bold text-gray-900 font-secondary">კურსის შეძენა</DialogTitle>
                <DialogDescription className="text-lg text-gray-500">
                  <span className="font-medium text-gray-900">{courseTitle}</span> • <span className="font-semibold text-gray-900">{price} ₾</span>
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleEnroll} className="space-y-5">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">გადახდის მეთოდი</h3>

                  {/* Full Payment Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("full");
                      setInstallmentPlan(null);
                    }}
                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      paymentMethod === "full"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                          paymentMethod === "full" ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
                        }`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-base">სრული გადახდა</p>
                          <p className={`text-sm mt-1 ${paymentMethod === "full" ? "text-white/80" : "text-gray-600"}`}>ერთჯერადი</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-xl">{price} ₾</p>
                        {paymentMethod === "full" && <Check className="w-6 h-6" />}
                      </div>
                    </div>
                  </button>

                  {/* BOG Loan (Standard Installment) */}
                  <button
                    type="button"
                    disabled={!canUseBogLoan}
                    onClick={() => {
                      if (!canUseBogLoan) return;
                      setPaymentMethod("bog_loan");
                      if (!installmentPlan || installmentPlan.type !== "bog_loan") {
                        selectInstallmentPlan(12, "bog_loan");
                      }
                    }}
                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      !canUseBogLoan
                        ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                        : paymentMethod === "bog_loan"
                        ? "border-[#ff5c0a] bg-gradient-to-r from-[#ff5c0a] to-[#e64a00] text-white"
                        : "border-gray-200 bg-white hover:border-[#ff5c0a]/50 hover:bg-orange-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                          !canUseBogLoan ? "bg-gray-100 text-gray-400" : paymentMethod === "bog_loan" ? "bg-white text-[#ff5c0a]" : "bg-orange-100 text-[#ff5c0a]"
                        }`}>
                          <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-base">ონლაინ განვადება</p>
                          <p className={`text-sm mt-1 ${!canUseBogLoan ? "text-gray-400" : paymentMethod === "bog_loan" ? "text-white/80" : "text-gray-600"}`}>
                            {canUseBogLoan ? "6-24 თვე" : `მინ. ${BOG_LOAN_MIN_AMOUNT} ₾`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!canUseBogLoan ? (
                          <p className="text-sm font-medium text-gray-400">მიუწვდომელი</p>
                        ) : installmentPlan && installmentPlan.type === "bog_loan" ? (
                          <p className="font-bold text-xl">≈{installmentPlan.amount} ₾<span className="text-sm font-normal opacity-80">/თვე</span></p>
                        ) : (
                          <p className={`text-sm font-medium ${paymentMethod === "bog_loan" ? "text-white/80" : "text-gray-500"}`}>აირჩიეთ →</p>
                        )}
                        {paymentMethod === "bog_loan" && canUseBogLoan && <Check className="w-6 h-6" />}
                      </div>
                    </div>
                  </button>

                  {/* BNPL (Natsil-Natsil) */}
                  <button
                    type="button"
                    disabled={!canUseBnpl}
                    onClick={() => {
                      if (!canUseBnpl) return;
                      setPaymentMethod("bnpl");
                      selectInstallmentPlan(4, "bnpl");
                    }}
                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      !canUseBnpl
                        ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                        : paymentMethod === "bnpl"
                        ? "border-[#ff5c0a] bg-gradient-to-r from-[#ff5c0a] to-[#e64a00] text-white"
                        : "border-gray-200 bg-white hover:border-[#ff5c0a]/50 hover:bg-orange-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                          !canUseBnpl ? "bg-gray-100 text-gray-400" : paymentMethod === "bnpl" ? "bg-white text-[#ff5c0a]" : "bg-orange-100 text-[#ff5c0a]"
                        }`}>
                          <CalendarClock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-base">ნაწილ-ნაწილ</p>
                          <p className={`text-sm mt-1 ${!canUseBnpl ? "text-gray-400" : paymentMethod === "bnpl" ? "text-white/80" : "text-gray-600"}`}>
                            {canUseBnpl ? "4 თვე • 0%" : `მინ. ${BNPL_MIN_AMOUNT} ₾`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!canUseBnpl ? (
                          <p className="text-sm font-medium text-gray-400">მიუწვდომელი</p>
                        ) : (
                          <p className="font-bold text-xl">≈{Math.round(price / 4)} ₾<span className="text-sm font-normal opacity-80">/თვე</span></p>
                        )}
                        {paymentMethod === "bnpl" && canUseBnpl && <Check className="w-6 h-6" />}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Status Message */}
                {paymentState !== "idle" && (
                  <div
                    className={`rounded-xl border px-5 py-4 text-base font-medium flex items-center gap-3 ${
                      paymentState === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                     {paymentState === "error" ? <AlertCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>}
                    {statusMessage}
                  </div>
                )}

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms-checkbox" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                    ვეთანხმები{" "}
                    <Link to="/terms" target="_blank" className="text-accent hover:underline font-medium">
                      წესებსა და პირობებს
                    </Link>
                    ,{" "}
                    <Link to="/privacy" target="_blank" className="text-accent hover:underline font-medium">
                      კონფიდენციალურობის პოლიტიკას
                    </Link>{" "}
                    და{" "}
                    <Link to="/refund" target="_blank" className="text-accent hover:underline font-medium">
                      თანხის დაბრუნების პირობებს
                    </Link>
                  </label>
                </div>

                {/* Submit Button - Only show on left when no installment config */}
                {!showInstallmentConfig && (
                  <div className="pt-3">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-bold rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
                      disabled={loading || paymentState === "redirecting" || !termsAccepted}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          მუშავდება...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          გადახდა
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>უსაფრთხო გადახდა iPay-ით</span>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Side - Installment Configuration */}
            {showInstallmentConfig && (
              <div className="md:w-1/2 bg-gradient-to-br from-[#ff5c0a] to-[#e64a00] p-6 text-white">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="#ff5c0a"/>
                        <path d="M16 8C14.4 8 13 9.4 13 11C13 11.8 13.4 12.5 13.9 13L10.8 16.1C10.2 15.8 9.4 15.5 8.5 15.5C6.9 15.5 5.5 16.9 5.5 18.5C5.5 20.1 6.9 21.5 8.5 21.5C9.4 21.5 10.2 21.2 10.8 20.9L13 23.1V26.5C13 28.1 14.4 29.5 16 29.5C17.6 29.5 19 28.1 19 26.5V23.1L21.2 20.9C21.8 21.2 22.6 21.5 23.5 21.5C25.1 21.5 26.5 20.1 26.5 18.5C26.5 16.9 25.1 15.5 23.5 15.5C22.6 15.5 21.8 15.8 21.2 16.1L18.1 13C18.6 12.5 19 11.8 19 11C19 9.4 17.6 8 16 8Z" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wider opacity-80 font-medium">საქართველოს ბანკი</p>
                      <p className="font-bold text-2xl">
                        {paymentMethod === "bnpl" ? "ნაწილ-ნაწილ" : "განვადება"}
                      </p>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="bg-white/10 rounded-2xl p-5 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-80 uppercase tracking-wider font-medium">თანხა</p>
                        <p className="text-4xl font-bold mt-1">{price} ₾</p>
                      </div>
                      {installmentPlan && (
                        <div className="text-right">
                          <p className="text-sm opacity-80 uppercase tracking-wider font-medium">თვიური</p>
                          <p className="text-3xl font-bold mt-1">≈{installmentPlan.amount} ₾</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div className="flex-1">
                    <p className="text-sm uppercase tracking-wider opacity-80 mb-4 font-medium">აირჩიეთ ვადა</p>
                    
                    {paymentMethod === "bnpl" ? (
                      /* BNPL - Single option, auto-selected */
                      <div className="bg-white text-[#ff5c0a] rounded-2xl p-6 text-center">
                        <div className="text-5xl font-bold">4</div>
                        <div className="text-base font-medium opacity-80 mt-1">თვე</div>
                        <div className="mt-3 pt-3 border-t border-orange-100">
                          <div className="text-2xl font-bold">≈{Math.round(price / 4)} ₾</div>
                          <div className="text-sm opacity-70 mt-1">თვეში</div>
                        </div>
                        <div className="mt-3 inline-block px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-bold">
                          0%
                        </div>
                      </div>
                    ) : (
                      /* BOG Loan - Multiple options */
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { months: 6, rate: "0%" },
                          { months: 12, rate: "0%" },
                          { months: 18, rate: "5%" },
                          { months: 24, rate: "8%" }
                        ].map(({ months, rate }) => {
                          const monthlyPayment = Math.round(price / months);
                          const isSelected = installmentPlan?.month === months;

                          return (
                            <button
                              key={months}
                              type="button"
                              onClick={() => selectInstallmentPlan(months, "bog_loan")}
                              className={`relative rounded-xl p-4 transition-all duration-200 text-center ${
                                isSelected
                                  ? "bg-white text-[#ff5c0a] shadow-lg"
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              }`}
                            >
                              <div className="text-3xl font-bold">{months}</div>
                              <div className="text-sm opacity-80 mt-1">თვე</div>
                              <div className={`mt-2 pt-2 border-t ${isSelected ? "border-orange-100" : "border-white/20"}`}>
                                <div className="text-base font-bold">≈{monthlyPayment}₾</div>
                              </div>
                              {rate === "0%" && (
                                <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                                  isSelected ? "bg-gray-900 text-white" : "bg-white text-[#ff5c0a]"
                                }`}>
                                  0%
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <Button
                      type="submit"
                      form="payment-form"
                      size="lg"
                      onClick={handleEnroll}
                      className="w-full h-14 text-lg font-bold rounded-xl bg-white text-[#ff5c0a] hover:bg-gray-100"
                      disabled={loading || paymentState === "redirecting" || !installmentPlan || !termsAccepted}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          მუშავდება...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          გადახდა • {installmentPlan?.month} თვე
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/70">
                      <Lock className="w-4 h-4" />
                      <span>უსაფრთხო გადახდა iPay-ით</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
