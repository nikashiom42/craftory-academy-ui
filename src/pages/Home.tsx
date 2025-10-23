import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { RegistrationForm } from "@/components/RegistrationForm";
import { StatsSection } from "@/components/StatsSection";
import { FeatureCards } from "@/components/FeatureCards";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroWorkshop from "@/assets/hero-workshop.jpg";

export default function Home() {
  const scrollToRegistration = () => {
    const element = document.getElementById("home-cta");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroWorkshop} 
            alt="Craftory Academy Workshop" 
            className="w-full h-full object-cover"
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
                  საქართველოს პირველი ავეჯის აკადემია
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                ავეჯის კონსტრუირების პირველი კურსი საქართველოში
              </h1>
              
              {/* Key points */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-lg md:text-xl font-medium">2 თვეში - 0-დან პროფესიონალამდე</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-lg md:text-xl font-medium">სტაჟირება პარტნიორ კომპანიებში</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={scrollToRegistration} className="group">
                  დარეგისტრირდი ახლავე
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            {/* Right side - empty for image visibility */}
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      <StatsSection 
        stats={[
          { value: 500, suffix: "+", label: "კურსდამთავრებული" },
          { value: 95, suffix: "%", label: "დასაქმების მაჩვენებელი" },
          { value: 6, suffix: "+", label: "პარტნიორი კომპანია" },
          { value: 12, suffix: "+", label: "წლიანი გამოცდილება" },
        ]}
      />

      <PartnersMarquee />

      <FeatureCards />

      {/* CTA Section */}
      <section id="home-cta" className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                <BookOpen className="text-accent-foreground" size={36} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6">
              დაიწყე შენი კარიერა ავეჯის ინდუსტრიაში
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              დარეგისტრირდი უფასო საინფორმაციო შეხვედრაზე და გაიგე ყველაფერი კურსის შესახებ
            </p>
            <Button size="lg" asChild className="group">
              <Link to="/courses">
                ნახე ყველა კურსი
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <RegistrationForm />
    </div>
  );
}
