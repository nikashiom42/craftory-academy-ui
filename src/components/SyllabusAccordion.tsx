import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

interface SyllabusModule {
  module: number;
  title: string;
  topics: string[];
}

interface SyllabusAccordionProps {
  modules: SyllabusModule[];
  courseSlug: string;
}

export function SyllabusAccordion({ modules, courseSlug }: SyllabusAccordionProps) {
  return (
    <section id="syllabus" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase text-center mb-12">
            სილაბუსი
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {modules.map((module, index) => (
              <motion.div
                key={module.module}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`module-${module.module}`}
                  className="border border-border rounded-lg overflow-hidden shadow-soft"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-muted/50">
                    <span className="font-bold text-left">{module.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2 mt-2">
                      {module.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-accent mt-1">•</span>
                          <span className="text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to={`/syllabus/${courseSlug}`}>
                <FileText className="mr-2 h-4 w-4" />
                სრული სილაბუსი
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
