import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, ExternalLink } from "lucide-react";
import { format } from "date-fns";

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

    if (now < start) return { label: "Upcoming", color: "text-blue-600" };
    if (now > end) return { label: "Completed", color: "text-gray-600" };
    return { label: "Ongoing", color: "text-green-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your courses...</p>
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
            <h1 className="text-4xl font-bold uppercase mb-2">My Courses</h1>
            <p className="text-lg text-muted-foreground">
              Access your enrolled courses and learning materials
            </p>
          </div>

          {enrollments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't enrolled in any courses. Browse our catalog to get started.
                </p>
                <Button onClick={() => navigate("/courses")}>
                  Browse Courses
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
                    {course.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
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
                          {format(new Date(course.start_date), "MMM d")} - {format(new Date(course.end_date), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Enrolled: {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                      </div>

                      <Button 
                        className="w-full gap-2" 
                        onClick={() => navigate(`/student/courses/${course.slug}`)}
                      >
                        Access Course
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
