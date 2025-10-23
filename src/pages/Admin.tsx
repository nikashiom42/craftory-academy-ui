import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Plus, Calendar, Users as UsersIcon } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  published: boolean;
  start_date: string;
  end_date: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadCourses();
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, subtitle, published, start_date, end_date")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load courses",
      });
      return;
    }

    setCourses(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-cream">
        <AdminSidebar userEmail={user?.email} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Courses</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your academy's course catalog
                </p>
              </div>
              <Button asChild size="lg" className="shadow-medium">
                <Link to="/admin/courses/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Course
                </Link>
              </Button>
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-sm">
                    Get started by creating your first course
                  </p>
                  <Button asChild>
                    <Link to="/admin/courses/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="hover-lift shadow-soft hover:shadow-medium transition-all cursor-pointer"
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant={course.published ? "default" : "secondary"}
                          className="mb-2"
                        >
                          {course.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.subtitle || "No subtitle"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {(course.start_date || course.end_date) && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              {course.start_date && course.end_date
                                ? `${course.start_date} - ${course.end_date}`
                                : course.start_date || course.end_date}
                            </span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/courses/${course.id}`);
                            }}
                          >
                            Edit Course
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
