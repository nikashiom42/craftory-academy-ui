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
    
    setOpen(true);
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
            title: "უკვე ჩაწერილი ხართ",
            description: "თქვენ უკვე ჩაწერილი ხართ ამ კურსზე.",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "წარმატებით ჩაიწერეთ! 🎉",
        description: `თქვენ წარმატებით ჩაიწერეთ კურსზე ${courseTitle}. იხილეთ თქვენი სტუდენტის პანელი.`,
      });
      
      setOpen(false);
      setTimeout(() => navigate("/student/dashboard"), 1500);
    } catch (error) {
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
        ჩაწერა კურსზე - {price} ₾
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>კურსზე ჩაწერა</DialogTitle>
            <DialogDescription>
              კურსი: {courseTitle} • ფასი: {price} ₾
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnroll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">ბარათის ნომერი</Label>
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
                <Label htmlFor="expiry">ვადა</Label>
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
              <span>სატესტო რეჟიმი - რეალური გადახდა არ განხორციელდება</span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "მუშავდება..." : `გადახდა ${price} ₾ და ჩაწერა`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
