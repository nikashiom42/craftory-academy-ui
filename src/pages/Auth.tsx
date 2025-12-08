import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const authSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email("გთხოვთ შეიყვანეთ სწორი ელფოსტა"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").optional(),
});

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(() => searchParams.get("mode") !== "register");
  const mode = searchParams.get("mode");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (mode === "forgot") {
      setSearchParams({}, { replace: true });
      setIsLogin(true);
      return;
    }
    
    setIsLogin(mode !== "register");
  }, [mode, setSearchParams]);

  const switchAuthMode = (mode: "login" | "register") => {
    const nextIsLogin = mode === "login";
    setIsLogin(nextIsLogin);
    setSearchParams(mode === "login" ? {} : { mode }, { replace: true });
    setPassword("");
    if (nextIsLogin) {
      setFullName("");
    }
  };

  useEffect(() => {
    // Check if user is already logged in and redirect to appropriate dashboard
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (roleData?.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/student/dashboard");
        }
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      const validation = authSchema.safeParse({
        email,
        password,
        fullName: isLogin ? undefined : fullName,
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

      const { email: validatedEmail, password: validatedPassword, fullName: validatedFullName } = validation.data;

      if (isLogin) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: validatedEmail,
          password: validatedPassword,
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "შესვლა ვერ მოხერხდა",
            description: "არასწორი ელფოსტა ან პაროლი. გთხოვთ სცადოთ თავიდან.",
          });
          return;
        }

        // Check user role and redirect accordingly
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id)
          .single();

        toast({
          title: "წარმატება",
          description: "წარმატებით შეხვედით სისტემაში!",
        });

        if (roleData?.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: validatedEmail,
          password: validatedPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              full_name: validatedFullName,
            },
          },
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "რეგისტრაცია ვერ მოხერხდა",
            description: error.message.includes("already registered") 
              ? "ეს ელფოსტა უკვე რეგისტრირებულია. გთხოვთ შეხვიდეთ სისტემაში."
              : "ანგარიშის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.",
          });
          return;
        }

        toast({
          title: "წარმატება",
          description: "ანგარიში წარმატებით შეიქმნა! ახლა შეგიძლიათ შესვლა.",
        });
        switchAuthMode("login");
      }
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

  const pageTitle = isLogin ? "შესვლა" : "რეგისტრაცია";
  const pageDescription = isLogin
    ? "შეიყვანეთ თქვენი მონაცემები სისტემაში შესასვლელად"
    : "შექმენით ანგარიში დასაწყებად";

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={pageTitle}
        description={isLogin ? "შედით თქვენს Craftory Academy ანგარიშში" : "შექმენით ახალი ანგარიში Craftory Academy-ში"}
      />
      <Header />
      
      <div className="flex-1 flex items-center justify-center bg-cream p-4 pt-28">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
            <CardDescription>{pageDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">სრული სახელი</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="სახელი გვარი"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">ელფოსტა</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">პაროლი</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "იტვირთება..." : isLogin ? "შესვლა" : "რეგისტრაცია"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => switchAuthMode(isLogin ? "register" : "login")}
              >
                {isLogin
                  ? "არ გაქვთ ანგარიში? დარეგისტრირდით"
                  : "უკვე გაქვთ ანგარიში? შედით"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
