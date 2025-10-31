import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ka } from "date-fns/locale";

interface EnrolledCourse {
  id: string;
  enrolled_at: string;
  price_paid: number;
  courses: {
    id: string;
    title: string;
    slug: string;
    subtitle: string;
    image_url: string;
    start_date: string;
    end_date: string;
    duration: string;
  };
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadCourses();
  }, []);

  const checkAuthAndLoadCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Verify user has 'user' role (not admin)
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role === 'admin') {
        navigate("/admin");
        return;
      }

      const { data, error } = await supabase
        .from("course_enrollments")
        .select(`
          id,
          enrolled_at,
          price_paid,
          courses (
            id,
            title,
            slug,
            subtitle,
            image_url,
            start_date,
            end_date,
            duration
          )
        `)
        .eq("user_id", session.user.id)
        .order("enrolled_at", { ascending: false });

      if (error) {
        throw error;
      }

      setEnrollments(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getCourseStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { label: "მალე იწყება", color: "text-blue-600" };
    if (now > end) return { label: "დასრულებული", color: "text-gray-600" };
    return { label: "მიმდინარე", color: "text-green-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">თქვენი კურსები იტვირთება...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-12 bg-cream">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold uppercase mb-2">ჩემი კურსები</h1>
            <p className="text-lg text-muted-foreground">
              იხილეთ თქვენი კურსები და სასწავლო მასალები
            </p>
          </div>

          {enrollments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">კურსი არ გაქვს</h3>
                <p className="text-muted-foreground mb-6">
                  ჯერჯერობით კურსზე არ დარეგისტრირებულხარ. გაეცანი კურსებს და შემოგვიერთდი სასურველზე.
                </p>
                <Button onClick={() => navigate("/courses")}>
                  კურსების ნახვა
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.courses;
                const status = getCourseStatus(course.start_date, course.end_date);
                
                return (
                  <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={course.image_url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {course.duration}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription>{course.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(course.start_date), "d MMM", { locale: ka })} - {format(new Date(course.end_date), "d MMM, yyyy", { locale: ka })}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        ჩაწერის თარიღი: {format(new Date(enrollment.enrolled_at), "d MMM, yyyy", { locale: ka })}
                      </div>

                      <Button 
                        className="w-full gap-2" 
                        onClick={() => navigate(`/student/courses/${course.slug}`)}
                      >
                        კურსის გახსნა
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
