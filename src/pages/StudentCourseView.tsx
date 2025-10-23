import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Video, FolderOpen, Clock, Check, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  duration: string;
  google_meet_link: string;
  google_drive_link: string;
  participant_number: number;
  syllabus: any;
  skills: any;
  trainer: any;
}

export default function StudentCourseView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    checkEnrollmentAndLoadCourse();
  }, [slug]);

  const checkEnrollmentAndLoadCourse = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Load course
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

      if (courseError || !courseData) {
        navigate("/student/dashboard");
        return;
      }

      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("course_id", courseData.id)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;

      if (!enrollmentData) {
        // Not enrolled, redirect to course detail page
        navigate(`/courses/${slug}`);
        return;
      }

      setIsEnrolled(true);
      setCourse(courseData);
    } catch (error) {
      console.error("Error loading course:", error);
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !isEnrolled) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[300px]">
          {course.image_url && (
            <img
              src={course.image_url}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <Button
                variant="ghost"
                className="text-white mb-4"
                onClick={() => navigate("/student/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Badge className="mb-4">Enrolled</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white uppercase mb-2">
                {course.title}
              </h1>
              <p className="text-xl text-white/90">{course.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Course Access Links */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
              {course.google_meet_link && (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Google Meet Link
                    </CardTitle>
                    <CardDescription>Join live sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <a href={course.google_meet_link} target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {course.google_drive_link && (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Course Materials
                    </CardTitle>
                    <CardDescription>Access learning resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant="outline">
                      <a href={course.google_drive_link} target="_blank" rel="noopener noreferrer">
                        Open Drive
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="py-12 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {format(new Date(course.start_date), "MMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    End Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {format(new Date(course.end_date), "MMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{course.duration}</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {course.description && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{course.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Syllabus */}
            {course.syllabus && Array.isArray(course.syllabus) && (
              <div className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {course.syllabus.map((module: any, index: number) => (
                        <AccordionItem key={index} value={`module-${index}`}>
                          <AccordionTrigger className="text-left font-semibold">
                            {module.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 ml-4">
                              {module.topics?.map((topic: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Skills */}
            {course.skills && Array.isArray(course.skills) && (
              <div className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.skills.map((skill: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                            <Check className="text-primary-foreground w-4 h-4" />
                          </div>
                          <p className="font-medium">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Trainer */}
            {course.trainer && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    {course.trainer.image && (
                      <img
                        src={course.trainer.image}
                        alt={course.trainer.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold mb-1">{course.trainer.name}</h3>
                      <p className="text-muted-foreground mb-2">{course.trainer.title}</p>
                      <p className="leading-relaxed">{course.trainer.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
