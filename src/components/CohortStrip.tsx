import { motion } from "framer-motion";
import { Calendar, Clock, Users, Laptop } from "lucide-react";

interface CohortInfo {
  startDate: string;
  duration: string;
  sessionsCount: string;
  format: string;
}

interface CohortStripProps {
  cohort: CohortInfo;
}

export function CohortStrip({ cohort }: CohortStripProps) {
  const items = [
    { icon: Calendar, label: "დასაწყისი", value: cohort.startDate },
    { icon: Clock, label: "ხანგრძლივობა", value: cohort.duration },
    { icon: Users, label: "შეხვედრები", value: cohort.sessionsCount },
    { icon: Laptop, label: "ფორმატი", value: cohort.format },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 text-center shadow-soft hover-lift"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="text-accent" size={24} />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{item.label}</div>
                <div className="font-bold text-lg">{item.value}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
