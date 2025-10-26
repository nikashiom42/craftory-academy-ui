import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface TargetAudienceSectionProps {
  audience: string[];
}

export function TargetAudienceSection({ audience }: TargetAudienceSectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase leading-tight">
              კურსი იდეალურია შენთვის თუ:
            </h2>
          </motion.div>

          {/* Right side - List of target audience */}
          <div className="space-y-6 order-2 md:order-2">
            {audience.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-muted/30 rounded-xl p-6 shadow-soft"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Check className="text-accent-foreground" size={20} />
                </div>
                <p className="text-lg font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
