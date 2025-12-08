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
import { ka } from "date-fns/locale";
import { processLatinText } from "@/components/LatinText";

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

      // Check enrollment with paid or completed status (admin enrollments use "completed")
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("course_enrollments")
        .select("id, payment_status")
        .eq("user_id", session.user.id)
        .eq("course_id", courseData.id)
        .in("payment_status", ["paid", "completed"])
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
          <p className="mt-4 text-muted-foreground">კურსი იტვირთება...</p>
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
          <img
            src={course.image_url || "/placeholder.svg"}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <Button
                variant="ghost"
                className="text-white mb-4"
                onClick={() => navigate("/student/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                დაბრუნდი პანელზე
              </Button>
              <Badge className="mb-4">ჩაწერილი</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white uppercase mb-2">
                {course.title}
              </h1>
              <p className="text-xl text-white/90">{course.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Course Access Links */}
        <section className="py-8 bg-primary/5 border-b border-primary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">კურსზე წვდომა</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
              {/* Google Meet Link */}
              <Card className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-secondary">
                    <Video className="w-5 h-5 text-primary" />
                    <span className="text-latin">Google Meet</span> ლინკი
                  </CardTitle>
                  <CardDescription>შეუერთდი ონლაინ გაკვეთილებს</CardDescription>
                </CardHeader>
                <CardContent>
                  {course.google_meet_link ? (
                    <Button asChild className="w-full">
                      <a href={course.google_meet_link} target="_blank" rel="noopener noreferrer">
                        შეერთება
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      ლინკი მალე დაემატება
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Google Drive Link */}
              <Card className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-secondary">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    საკურსო მასალები
                  </CardTitle>
                  <CardDescription>წვდომა სასწავლო რესურსებზე</CardDescription>
                </CardHeader>
                <CardContent>
                  {course.google_drive_link ? (
                    <Button asChild className="w-full" variant="outline">
                      <a href={course.google_drive_link} target="_blank" rel="noopener noreferrer">
                        <span className="text-latin">Drive</span>-ის გახსნა
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      ლინკი მალე დაემატება
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="py-12 bg-cream">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-secondary">
                    <Calendar className="w-5 h-5" />
                    საწყისი თარიღი
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-secondary">
                    {format(new Date(course.start_date), "d MMM, yyyy", { locale: ka })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-secondary">
                    <Calendar className="w-5 h-5" />
                    დასრულების თარიღი
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-secondary">
                    {format(new Date(course.end_date), "d MMM, yyyy", { locale: ka })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-secondary">
                    <Clock className="w-5 h-5" />
                    ხანგრძლივობა
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold font-secondary">{course.duration}</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {course.description && (
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>კურსის აღწერა</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed font-secondary font-bold">{course.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Syllabus */}
            {course.syllabus && Array.isArray(course.syllabus) && (
              <div className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle>სილაბუსი</CardTitle>
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
                    <CardTitle>რას ისწავლით</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.skills.map((skill: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                            <Check className="text-primary-foreground w-4 h-4" />
                          </div>
                          <p className="font-medium font-secondary">{skill}</p>
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
                  <CardTitle>ინსტრუქტორი</CardTitle>
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
                    <div className="font-secondary font-bold">
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
