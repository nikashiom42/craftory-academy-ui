import { academyConfig } from "@/config/academy";

export function PartnersMarquee() {
  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...academyConfig.partners, ...academyConfig.partners];

  return (
    <section className="py-12 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl font-bold text-center">ჩვენი პარტნიორები</h2>
      </div>
      
      <div className="relative">
        <div className="flex animate-scroll">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
