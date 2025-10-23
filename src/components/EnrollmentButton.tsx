/**
 * EnrollmentButton component
 * Initiates TBC Bank hosted checkout for course enrollment
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";

interface EnrollmentButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isEnrolled: boolean;
}

export function EnrollmentButton({ courseId, courseTitle, price, isEnrolled }: EnrollmentButtonProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEnroll = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to enroll in courses.",
      });
      navigate("/auth");
      setLoading(false);
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const returnUrl = `${window.location.origin}/payment/return`;

    const response = await fetch(`${supabaseUrl}/functions/v1/tbc-payment/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        courseId,
        amount: price,
        returnUrl: `${returnUrl}?courseTitle=${encodeURIComponent(courseTitle)}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: errorData.error || "Something went wrong. Please try again.",
      });
      setLoading(false);
      return;
    }

    const { redirectUrl } = await response.json();
    
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
      });
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button size="lg" onClick={() => navigate("/student/dashboard")}>
        Go to My Courses
      </Button>
    );
  }

  return (
    <Button 
      size="lg" 
      className="gap-2" 
      onClick={handleEnroll}
      disabled={loading}
    >
      <CreditCard className="w-5 h-5" />
      {loading ? "Redirecting to payment..." : `Enroll Now - ${price} ₾`}
    </Button>
  );
}
