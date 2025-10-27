import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroStudents from "@/assets/hero-students.webp";

interface CourseHeroProps {
  claims: string[];
  onRegisterClick: () => void;
  onInfoSessionClick: () => void;
}

export function CourseHero({ claims, onRegisterClick, onInfoSessionClick }: CourseHeroProps) {
  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroStudents} 
          alt="Students learning at Craftory Academy" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/50" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Tag/Badge */}
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent/90 text-accent-foreground text-sm font-semibold shadow-lg">
                პროფესიული განათლება
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {claims[0]}
            </h1>

            {/* Supporting claims */}
            <div className="space-y-3">
              {claims.slice(1).map((claim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-base md:text-lg font-medium text-foreground/90">{claim}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
            </div>
          </motion.div>

          {/* Right side - empty for image visibility */}
          <div className="hidden md:block" />
        </div>
      </div>
    </section>
  );
}
