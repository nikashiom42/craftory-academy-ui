import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { academyConfig } from "@/config/academy";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

export default function Syllabus() {
  const { slug } = useParams();
  const course = academyConfig.courses.find(c => c.slug === slug);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <Button variant="ghost" asChild className="mb-6">
              <Link to={`/courses/${course.slug}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                უკან კურსზე
              </Link>
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              სრული სილაბუსი
            </h1>
            <h2 className="text-2xl text-muted-foreground mb-6">
              {course.title}
            </h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold">ხანგრძლივობა:</span>
                <span>{course.cohort.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">შეხვედრები:</span>
                <span>{course.cohort.sessionsCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">ფორმატი:</span>
                <span>{course.cohort.format}</span>
              </div>
            </div>
          </div>

          {/* Full Syllabus */}
          <div className="space-y-8">
            {course.syllabus.map((module, index) => (
              <motion.div
                key={module.module}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 shadow-soft"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {module.module}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                  </div>
                </div>

                <div className="ml-18 space-y-4">
                  <h4 className="font-semibold text-lg mb-3">თემები:</h4>
                  <ul className="space-y-3">
                    {module.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-accent font-bold mt-1">•</span>
                        <span className="text-foreground leading-relaxed">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center bg-cream rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">გადმოწერე სილაბუსი PDF ფორმატში</h3>
            <p className="text-muted-foreground mb-6">
              შეინახე სილაბუსი შენს მოწყობილობაზე და გაეცანი მას ნებისმიერ დროს
            </p>
            <Button size="lg" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              გადმოწერა (მალე)
            </Button>
          </motion.div>

          {/* Registration CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <Button size="lg" asChild>
              <Link to={`/courses/${course.slug}#registration`}>
                დარეგისტრირდი კურსზე
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
