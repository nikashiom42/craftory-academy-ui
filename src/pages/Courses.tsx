import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    duration: string;
    sessionsCount: string;
  };
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, slug, title, subtitle, description, image_url, duration, price, cohort")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCourses(data as Course[]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <p>იტვირთება...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6">
            ჩვენი კურსები
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            აირჩიე შენთვის სასურველი კურსი და დაიწყე სწავლა
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col shadow-medium hover-lift overflow-hidden">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                    {course.price} ₾
                  </Badge>
                </div>
                
                <CardHeader>
                  <h3 className="text-2xl font-bold">{course.title}</h3>
                  <p className="text-muted-foreground mt-2">{course.description}</p>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>{course.cohort.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users size={16} />
                      <span>{course.cohort.sessionsCount}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full group" asChild>
                    <Link to={`/courses/${course.slug}`}>
                      დეტალურად
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Future courses placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-muted rounded-xl p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">მალე გელით ახალი კურსები</h2>
            <p className="text-muted-foreground">
              ვმუშაობთ დამატებითი პროგრამების შემუშავებაზე. გამოიწერე სიახლეები და იყავი პირველი ვინც გაიგებს ახალი კურსების შესახებ.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
