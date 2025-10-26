import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Plus, Search, BookOpen, CheckCircle2, Clock, Edit, Trash2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  published: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function AdminCourses() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load user session and courses data
   * Auth and role verification handled by ProtectedRoute wrapper
   */
  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
    }

    await loadCourses();
    setLoading(false);
  };

  /**
   * Fetch all courses for course management
   */
  const loadCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
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

  /**
   * Delete a course from the database
   */
  const deleteCourse = async (courseId: string, courseTitle: string) => {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete course",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Course "${courseTitle}" has been deleted`,
    });

    // Reload courses to update the list
    await loadCourses();
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.subtitle && course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "published" && course.published) ||
      (statusFilter === "draft" && !course.published);
    
    return matchesSearch && matchesStatus;
  });

  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.published).length;
  const draftCourses = courses.filter(c => !c.published).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

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
                  <p className="text-sm text-muted-foreground mb-1">/admin/courses</p>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Courses</h1>
                  <p className="text-muted-foreground">
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
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                      <p className="text-3xl font-bold text-foreground">{totalCourses}</p>
                      <p className="text-xs text-muted-foreground mt-1">All courses</p>
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
                      <p className="text-xs text-muted-foreground mt-1">Unpublished</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">All Courses</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            {courses.length === 0 ? (
              <Card className="shadow-soft border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Get started by creating your first course
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
              <Card className="shadow-soft">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subtitle</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No courses found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                            <TableCell className="font-medium max-w-xs">
                              <div className="line-clamp-1">{course.title}</div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="line-clamp-1 text-muted-foreground text-sm">
                                {course.subtitle || "—"}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {course.start_date && course.end_date
                                ? `${course.start_date} - ${course.end_date}`
                                : course.start_date || course.end_date || "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={course.published ? "default" : "secondary"}>
                                {course.published ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(course.created_at).toLocaleDateString('ka-GE')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/courses/${course.id}`);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{course.title}"? This action cannot be undone and will also remove all associated registrations and enrollments.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteCourse(course.id, course.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete Course
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
