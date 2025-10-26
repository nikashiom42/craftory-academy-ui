import { motion } from "framer-motion";
import { TrendingUp, Award, Briefcase, Laptop, LucideIcon } from "lucide-react";

interface WhyPoint {
  title: string;
  description: string;
  icon: string;
}

interface WhySectionProps {
  points: WhyPoint[];
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Award,
  Briefcase,
  Laptop,
};

export function WhySection({ points }: WhySectionProps) {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">
              რატომ უნდა გახდე ავეჯის კონსტრუქტორი ?
            </h2>
          </motion.div>

          {/* Right side - Key points */}
          <div className="space-y-6 order-2">
            {points.map((point, index) => {
              const Icon = iconMap[point.icon] || iconMap.TrendingUp;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-soft hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
