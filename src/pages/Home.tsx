import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { RegistrationForm } from "@/components/RegistrationForm";
import { FeaturedCourseSection } from "@/components/FeaturedCourseSection";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroWorkshop from "@/assets/hero-workshop.webp";
import { SEO } from "@/components/SEO";

export default function Home() {
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Craftory Academy",
    "description": "საქართველოს პირველი ავეჯის კონსტრუირების აკადემია",
    "url": "https://craftoryacademy.ge",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "თბილისი",
      "addressCountry": "GE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+995-505-05-01-08",
      "contactType": "customer service",
      "email": "info@craftoryacademy.ge"
    },
    "sameAs": [
      "https://facebook.com/craftoryacademy",
      "https://www.instagram.com/craftory.academy",
      "https://www.tiktok.com/@craftory.academy"
    ]
  };

  return (
    <>
      <SEO
        title="Craftory Academy - საქართველოს პირველი ავეჯის კონსტრუირების აკადემია"
        description="გახდი პროფესიონალი ავეჯის კონსტრუქტორი 2 თვეში. AutoCAD, 3D მოდელირება, ხარჯთაღრიცხვა და სტაჟირება პარტნიორ კომპანიებში."
        keywords={["ავეჯის კონსტრუირება", "AutoCAD", "კურსები საქართველოში", "ავეჯის დიზაინი", "პროფესიული ტრენინგი", "Craftory Academy"]}
        canonical="/"
        ogImage="/logo.png"
        structuredData={structuredData}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroWorkshop} 
            alt="Craftory Academy Workshop - პროფესიული განათლება ავეჯის კონსტრუირებაში" 
            className="w-full h-full object-cover"
            width="1920"
            height="1080"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent/90 text-accent-foreground text-sm font-semibold shadow-lg">
                  Craftory Academy
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                პროფესიული განვითარება რეალური შედეგებით
              </h1>
              
              {/* Key points */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-lg md:text-xl font-medium">პრაქტიკული კურსები ექსპერტებისგან</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-lg md:text-xl font-medium">სერთიფიკატი და კარიერული მხარდაჭერა</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/courses")}
                  className="group h-[3.3rem] px-[2.2rem] text-lg"
                >
                  აირჩიე კურსი
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            {/* Right side - empty for image visibility */}
            <div className="hidden md:block" />
          </div>
        </div>
      </section>
      <PartnersMarquee />

      <FeaturedCourseSection />

      <RegistrationForm />
    </div>
    </>
  );
}
