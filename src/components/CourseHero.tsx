import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CourseHeroProps {
  claims: string[];
  onRegisterClick: () => void;
  onInfoSessionClick: () => void;
}

export function CourseHero({ claims, onRegisterClick, onInfoSessionClick }: CourseHeroProps) {
  return (
    <section className="pt-32 pb-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {claims.map((claim, index) => (
              <h1
                key={index}
                className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {claim}
              </h1>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Button
              size="lg"
              onClick={onRegisterClick}
              className="group"
            >
              დარეგისტრირდი ახლავე
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onInfoSessionClick}
            >
              უფასო საინფორმაციო შეხვედრა
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
