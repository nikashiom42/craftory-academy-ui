import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { RegistrationForm } from "@/components/RegistrationForm";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { academyConfig } from "@/config/academy";

export default function Home() {
  const scrollToRegistration = () => {
    const element = document.getElementById("home-cta");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-cream/30 to-background" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              {/* Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                  საქართველოს პირველი ავეჯის აკადემია
                </span>
              </div>

              {/* Main heading - refined size */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                გახდი პროფესიონალი
                <br />
                <span className="text-accent">ავეჯის ინდუსტრიაში</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                პრაქტიკული კურსები გამოცდილ ტრენერებთან და სტაჟირება წამყვან კომპანიებში
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <Button size="lg" asChild className="group">
                <Link to="/courses">
                  ნახე კურსები
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToRegistration}>
                უფასო საინფორმაციო შეხვედრა
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <PartnersMarquee />

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8">
              რატომ Craftory Academy?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-card border border-border rounded-xl p-8 shadow-soft hover-lift">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">პრაქტიკული უნარები</h3>
                <p className="text-muted-foreground">
                  რეალურ პროექტებზე მუშაობა და პარტნიორ კომპანიებში სტაჟირება
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 shadow-soft hover-lift">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">ექსპერტი ტრენერები</h3>
                <p className="text-muted-foreground">
                  სწავლა ინდუსტრიის გამოცდილი პროფესიონალებისგან
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 shadow-soft hover-lift">
                <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">კარიერული მხარდაჭერა</h3>
                <p className="text-muted-foreground">
                  დახმარება სამსახურის მოძიებასა და კარიერის განვითარებაში
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
