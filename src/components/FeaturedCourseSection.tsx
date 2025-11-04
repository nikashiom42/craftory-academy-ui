import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  } | null;
}

/**
 * FeaturedCourseSection - Showcases featured courses in a carousel slider on home page
 * Displays multiple course cards with details, price, and enrollment options
 */
export function FeaturedCourseSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  /**
   * Auto-play carousel - slides every 5 seconds
   * Pauses on hover, focus, or when only 1 course exists
   */
  useEffect(() => {
    if (!api || courses.length <= 1) return;

    const startAutoPlay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!isPaused) {
        intervalRef.current = setInterval(() => {
          api.scrollNext();
        }, 5000);
      }
    };

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, courses.length, isPaused]);

  /**
   * Pause auto-play on user interaction (hover/focus)
   */
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, subtitle, description, image_url, duration, price, cohort")
        .eq("published", true)
        .eq("featured_on_home", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        setError("კურსების ჩატვირთვა ვერ მოხერხდა");
        setCourses([]);
      } else if (data) {
        setCourses(data as Course[]);
      }
    } catch (err) {
      setError("კურსების ჩატვირთვა ვერ მოხერხდა");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-muted rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-lg h-64 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-2">
              ჩვენი კურსები
            </h2>
            <p className="text-xl text-muted-foreground">
              აირჩიე შენთვის სასურველი კურსი და დაიწყე სწავლა
            </p>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <Carousel
              opts={{
                align: "center",
                loop: courses.length > 1,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent>
                {courses.map((course, index) => (
                  <CarouselItem key={course.id} className="basis-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="px-4"
                    >
                      <Card className="h-full flex flex-col md:flex-row shadow-medium hover-lift overflow-hidden max-w-5xl mx-auto">
                        {/* Left Side - Image */}
                        <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto overflow-hidden flex-shrink-0">
                          <img
                            src={course.image_url || "/placeholder.svg"}
                            alt={`${course.title} - ${course.subtitle || course.description}`}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            width="800"
                            height="450"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                            {course.price} ₾
                          </Badge>
                        </div>
                        
                        {/* Right Side - Content */}
                        <div className="flex flex-col flex-grow">
                          <CardHeader>
                            <h3 className="text-2xl font-bold">{course.title}</h3>
                            <p className="text-muted-foreground mt-2">{course.description}</p>
                          </CardHeader>

                          <CardContent className="flex-grow">
                            <div className="space-y-3">
                              {course.cohort?.duration && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Clock size={16} />
                                  <span>{course.cohort?.duration}</span>
                                </div>
                              )}
                              {course.cohort?.sessionsCount && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Users size={16} />
                                  <span>{course.cohort?.sessionsCount}</span>
                                </div>
                              )}
                              {!course.cohort && course.duration && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Clock size={16} />
                                  <span>{course.duration}</span>
                                </div>
                              )}
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
                        </div>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {courses.length > 1 && (
                <>
                  <CarouselPrevious className="-left-2 md:-left-12" />
                  <CarouselNext className="-right-2 md:-right-12" />
                </>
              )}
            </Carousel>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
