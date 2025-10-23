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
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cream/30 to-background" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Tag/Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold">
                პროფესიული განათლება
              </span>
            </div>

            {/* Main heading - much smaller and refined */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight max-w-4xl mx-auto">
              {claims[0]}
            </h1>

            {/* Supporting claims in a grid */}
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-8">
              {claims.slice(1).map((claim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg border border-border shadow-soft"
                >
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-base md:text-lg font-medium">{claim}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
