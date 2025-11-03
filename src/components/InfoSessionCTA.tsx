import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight } from "lucide-react";

interface InfoSessionCTAProps {
  onRegisterClick: () => void;
  heading?: string;
  description?: string;
}

export function InfoSessionCTA({ 
  onRegisterClick, 
  heading = "დარეგისტრირდი უფასო საინფორმაციო შეხვედრაზე ახლავე",
  description = "მიიღე სრული ინფორმაცია კურსის შესახებ, ისაუბრე ტრენერთან და დასვი შენთვის საინტერესო კითხვები"
}: InfoSessionCTAProps) {
  return (
    <section className="py-20 bg-cream">
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
              <Video className="text-accent-foreground" size={36} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <Button size="lg" onClick={onRegisterClick} className="group">
            დარეგისტრირდი ახლავე
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
