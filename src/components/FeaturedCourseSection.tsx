import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoFrame from "@/assets/logo_frame.svg";

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  duration: string;
  price: number;
  cohort: {
    startDate?: string;
    duration: string;
    sessionsCount: string;
    format?: string;
  } | null;
}

/**
 * FeaturedCourseSection - Showcases the main course on home page
 * Displays course details, price, and enrollment options to reduce friction
 */
export function FeaturedCourseSection() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, slug, title, subtitle, description, image_url, duration, price, cohort")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setCourse(data as Course);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">იტვირთება...</p>
        </div>
      </section>
    );
  }

  if (!course) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header - Dynamic from DB */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-2">
              {course.title}
            </h2>
            {course.subtitle && (
              <p className="text-base text-muted-foreground">
                {course.subtitle}
              </p>
            )}
          </div>

          {/* Course Showcase Card */}
          <div className="grid lg:grid-cols-2 gap-6 items-center bg-muted/30 rounded-xl shadow-md overflow-hidden border border-border">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-full min-h-[300px] lg:min-h-[350px]"
            >
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              
              {/* Price Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-xs font-semibold opacity-90">ფასი</p>
                  <p className="text-2xl font-bold">{course.price} ₾</p>
                </div>
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
            </motion.div>

            {/* Right Side - Course Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 lg:p-8 space-y-4"
            >
              {/* Course Title */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>

              {/* Course Quick Info */}
              {course.cohort && (
                <div className="grid grid-cols-2 gap-3">
                  {course.cohort.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{course.cohort.duration}</span>
                    </div>
                  )}

                  {course.cohort.sessionsCount && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{course.cohort.sessionsCount}</span>
                    </div>
                  )}

                  {course.cohort.startDate && (
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{course.cohort.startDate}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Format Info - from DB */}
              {course.cohort?.format && (
                <div className="flex items-center gap-2 text-xs bg-accent/5 p-2 rounded-md border border-accent/20">
                  <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                  <span>{course.cohort.format}</span>
                </div>
              )}

              {/* Primary CTA - Enrollment */}
              <div className="space-y-3 pt-2">
                {/* Main Enroll Button - HERO CTA */}
                <Button 
                  asChild 
                  className="w-full h-12 font-bold shadow-md hover:shadow-lg transition-all group bg-accent hover:bg-accent/90"
                >
                  <Link to={`/courses/${course.slug}`}>
                    კურსზე ჩაწერა - {course.price} ₾
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" asChild className="group">
                    <Link to={`/courses/${course.slug}`}>
                      დეტალები
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  
                  <Button size="sm" variant="outline" asChild>
                    <a href="#registration">
                      კონსულტაცია
                    </a>
                  </Button>
                </div>
              </div>

              {/* Bank Installment Note */}
              <div className="flex items-center justify-center gap-2 pt-3 border-t border-border/50">
                <img 
                  src={logoFrame} 
                  alt="საქართველოს ბანკი" 
                  className="h-8 w-auto object-contain"
                />
                <p className="text-sm font-medium text-muted-foreground">
                  ხელმისაწვდომია საქართველოს ბანკის განვადება
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
