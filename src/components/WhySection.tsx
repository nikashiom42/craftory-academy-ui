import { motion } from "framer-motion";
import { TrendingUp, Award, Briefcase, Laptop, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              რატომ გახდე
              <br />
              ავეჯის კონსტრუქტორი?
            </h2>
          </motion.div>

          <div className="grid gap-6">
            {points.map((point, index) => {
              const Icon = iconMap[point.icon] || TrendingUp;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="shadow-soft hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                          <Icon className="text-primary-foreground" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">{point.title}</h3>
                          <p className="text-muted-foreground">{point.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
