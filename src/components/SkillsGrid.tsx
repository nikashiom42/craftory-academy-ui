import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SkillsGridProps {
  skills: string[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold uppercase text-center mb-12"
        >
          რას ისწავლი?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4 bg-background rounded-xl p-6 shadow-medium hover-lift"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Check className="text-primary-foreground" size={20} />
              </div>
              <p className="text-lg font-medium">{skill}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
