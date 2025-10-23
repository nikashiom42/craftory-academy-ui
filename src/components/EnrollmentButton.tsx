import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Lock } from "lucide-react";

interface EnrollmentButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isEnrolled: boolean;
}

export function EnrollmentButton({ courseId, courseTitle, price, isEnrolled }: EnrollmentButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please login to enroll in courses.",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("course_enrollments")
        .insert([
          {
            user_id: session.user.id,
            course_id: courseId,
            price_paid: price,
            payment_status: "test",
          },
        ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Enrolled",
            description: "You are already enrolled in this course.",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Enrollment Successful! 🎉",
        description: `You're now enrolled in ${courseTitle}. Check your student dashboard.`,
      });
      
      setOpen(false);
      setTimeout(() => navigate("/student/dashboard"), 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <CreditCard className="w-5 h-5" />
          Enroll Now - {price} ₾
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Enrollment</DialogTitle>
          <DialogDescription>
            Course: {courseTitle} • Price: {price} ₾
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEnroll} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Test mode - No actual payment will be processed</span>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : `Pay ${price} ₾ & Enroll`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
