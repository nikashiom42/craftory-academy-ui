/**
 * ResetPassword page component
 * Handles password reset flow after user clicks the reset link from their email
 * Validates recovery session and allows user to set a new password
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const passwordSchema = z.object({
  password: z.string().min(6, "პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "პაროლები არ ემთხვევა",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setHasValidSession(false);
          toast({
            variant: "destructive",
            title: "ბმული არასწორია ან ვადა გაუვიდა",
            description: "პაროლის აღდგენის ბმული არასწორია ან ვადა გაუვიდა. გთხოვთ მოითხოვოთ ახალი ბმული.",
          });
        } else {
          setHasValidSession(true);
        }
      } catch (error) {
        setHasValidSession(false);
        toast({
          variant: "destructive",
          title: "შეცდომა",
          description: "სესიის შემოწმება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.",
        });
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = passwordSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "შეცდომა",
          description: validation.error.errors[0].message,
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "შეცდომა",
          description: "პაროლის განახლება ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.",
        });
        return;
      }

      toast({
        title: "წარმატება",
        description: "პაროლი წარმატებით განახლდა! ახლა შეგიძლიათ შესვლა.",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/auth?mode=login");
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "მოხდა მოულოდნელი შეცდომა. გთხოვთ სცადოთ თავიდან.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-cream p-4 pt-28">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">იტვირთება...</div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasValidSession) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO
          title="პაროლის აღდგენა"
          description="პაროლის აღდგენის გვერდი Craftory Academy-სთვის"
        />
        <Header />
        <div className="flex-1 flex items-center justify-center bg-cream p-4 pt-28">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">ბმული არასწორია</CardTitle>
              <CardDescription>
                პაროლის აღდგენის ბმული არასწორია ან ვადა გაუვიდა
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate("/auth?mode=forgot")}
              >
                მოითხოვეთ ახალი ბმული
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => navigate("/auth?mode=login")}
              >
                დაბრუნება შესვლაზე
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="პაროლის აღდგენა"
        description="დააყენეთ ახალი პაროლი თქვენი Craftory Academy ანგარიშისთვის"
      />
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-cream p-4 pt-28">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">ახალი პაროლის დაყენება</CardTitle>
            <CardDescription>
              შეიყვანეთ ახალი პაროლი თქვენი ანგარიშისთვის
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">ახალი პაროლი</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">დაადასტურეთ პაროლი</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "იტვირთება..." : "პაროლის განახლება"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/auth?mode=login")}
              >
                დაბრუნება შესვლაზე
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

