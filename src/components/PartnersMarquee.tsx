import { academyConfig } from "@/config/academy";

export function PartnersMarquee() {
  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...academyConfig.partners, ...academyConfig.partners];

  return (
    <section className="py-20 bg-background border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">ჩვენი პარტნიორები</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ვთანამშრომლობთ წამყვან კომპანიებთან სტუდენტების სტაჟირებისა და დასაქმების მიზნით
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 mx-6 flex items-center justify-center bg-card border border-border/30 rounded-xl p-6 shadow-soft hover-lift transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
}
