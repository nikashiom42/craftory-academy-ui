import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Plus, Calendar, BookOpen, TrendingUp, CheckCircle2, Clock } from "lucide-react";
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

  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.published).length;
  const draftCourses = courses.filter(c => !c.published).length;
  const upcomingCourses = courses.filter(c => {
    if (!c.start_date) return false;
    return new Date(c.start_date) > new Date();
  }).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-cream">
        <AdminSidebar userEmail={user?.email} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">/admin</p>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage your academy's course catalog and monitor activity
                  </p>
                </div>
                <Button asChild size="lg" className="shadow-medium">
                  <Link to="/admin/courses/new">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Course
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                      <p className="text-3xl font-bold text-foreground">{totalCourses}</p>
                      <p className="text-xs text-muted-foreground mt-1">All courses in catalog</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Published</p>
                      <p className="text-3xl font-bold text-foreground">{publishedCourses}</p>
                      <p className="text-xs text-muted-foreground mt-1">Live on website</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Drafts</p>
                      <p className="text-3xl font-bold text-foreground">{draftCourses}</p>
                      <p className="text-xs text-muted-foreground mt-1">Unpublished courses</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
                      <p className="text-3xl font-bold text-foreground">{upcomingCourses}</p>
                      <p className="text-xs text-muted-foreground mt-1">Starting soon</p>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses Section Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
            </div>

            {/* Courses Grid */}
            {courses.length === 0 ? (
              <Card className="shadow-soft border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Get started by creating your first course and begin building your academy's catalog
                  </p>
                  <Button asChild size="lg">
                    <Link to="/admin/courses/new">
                      <Plus className="h-5 w-5 mr-2" />
                      Create First Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="hover-lift shadow-soft hover:shadow-elevated transition-all cursor-pointer group border-border"
                    onClick={() => navigate(`/admin/courses/${course.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant={course.published ? "default" : "secondary"}
                          className="font-medium"
                        >
                          {course.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {course.subtitle || "No subtitle provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {(course.start_date || course.end_date) && (
                          <div className="flex items-start text-muted-foreground bg-muted/30 rounded-md p-3">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-xs leading-relaxed">
                              {course.start_date && course.end_date
                                ? `${course.start_date} - ${course.end_date}`
                                : course.start_date || course.end_date}
                            </span>
                          </div>
                        )}
                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
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
