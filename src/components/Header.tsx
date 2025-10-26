import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { academyConfig } from "@/config/academy";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import craftoryLogo from "@/assets/craftory-logo.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith("#")) {
      // Map contact to registration section for smooth scroll to free consultation form
      const targetPath = path === "#contact" ? "#registration" : path;
      // For registration and contact, first navigate to home page if not already there
      if ((path === "#registration" || path === "#contact") && location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.querySelector(targetPath);
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.querySelector(targetPath);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("წარმატებით გახვედით სისტემიდან");
      navigate("/");
    } catch (error) {
      toast.error("გასვლისას დაფიქსირდა შეცდომა");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/98 backdrop-blur-lg shadow-soft border-b border-border/50"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={craftoryLogo} alt="Craftory Academy" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-8">
              {academyConfig.nav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "text-base font-semibold transition-all hover:text-primary relative py-2",
                    location.pathname === item.path
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : "text-foreground/70"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button variant="default" size="default" asChild className="shadow-soft gap-2">
                  <Link to="/student/dashboard">
                    <BookOpen className="w-4 h-4" />
                    My Courses
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="default" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  გასვლა
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {academyConfig.nav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "text-base font-semibold transition-colors px-4 py-3 rounded-lg",
                    location.pathname === item.path
                      ? "text-primary bg-muted"
                      : "text-foreground/70 hover:bg-muted/50"
                  )}
                >
                  {item.name}
              </Link>
              ))}
              {isLoggedIn && (
                <div className="px-4 pt-4 space-y-2">
                  <Button variant="default" className="w-full shadow-soft gap-2" asChild>
                    <Link to="/student/dashboard">
                      <BookOpen className="w-4 h-4" />
                      My Courses
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    გასვლა
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
