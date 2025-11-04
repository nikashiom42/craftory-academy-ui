import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  display_order: number;
  active: boolean;
}

// Partner logo marquee with auto-scroll, manual controls, and drag functionality
export function PartnersMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [partners, setPartners] = useState<Partner[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    const { data } = await supabase
      .from("partners")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (data) {
      setPartners(data);
    }
  };
  
  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  // Scroll left by one item width
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      setIsPaused(true);
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(() => setIsPaused(false), 1000);
    }
  };

  // Scroll right by one item width
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      setIsPaused(true);
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(() => setIsPaused(false), 1000);
    }
  };

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeftPos(scrollContainerRef.current?.scrollLeft || 0);
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 500);
  };

  // Drag to scroll
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
    }
  };

  // Stop dragging when mouse leaves
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setIsPaused(false), 500);
    }
  };

  return (
    <section className="py-20 bg-background border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">ჩვენი პარტნიორები</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ვთანამშრომლობთ წამყვან კომპანიებთან სტუდენტების სტაჟირებისა და დასაქმების მიზნით
          </p>
        </div>
        
        <div className="relative">
          <div className="relative overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className={`flex overflow-x-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`flex ${isPaused ? '' : 'animate-scroll'}`}>
                {duplicatedPartners.map((partner, index) => (
                  <div
                    key={`${partner.name}-${index}`}
                    className="flex-shrink-0 mx-6 flex items-center justify-center bg-card border border-border/30 rounded-xl p-6 shadow-soft hover-lift transition-all duration-300"
                  >
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-12 w-auto object-contain"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient overlays for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
          </div>
          
          {/* Navigation arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full shadow-medium hover:shadow-elevated bg-card/90 backdrop-blur-sm"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full shadow-medium hover:shadow-elevated bg-card/90 backdrop-blur-sm"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
