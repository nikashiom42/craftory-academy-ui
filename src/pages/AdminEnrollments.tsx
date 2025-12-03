/**
 * AdminEnrollments - Admin page for managing course enrollments
 * Allows admins to view all enrollments and manually enroll students
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { UserPlus, Search, Trash2, GraduationCap, ArrowLeft, Users } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  price: number | null;
}

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string | null;
  payment_status: string;
  price_paid: number;
  profiles: Profile | null;
  courses: Course | null;
}

export default function AdminEnrollments() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state for new enrollment
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load user session, enrollments, profiles, and courses
   */
  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }

    await Promise.all([
      loadEnrollments(),
      loadProfiles(),
      loadCourses(),
    ]);
    setLoading(false);
  };

  /**
   * Fetch all enrollments with user and course details
   */
  const loadEnrollments = async () => {
    const { data, error } = await supabase
      .from("course_enrollments")
      .select(`
        id,
        user_id,
        course_id,
        enrolled_at,
        payment_status,
        price_paid,
        profiles:user_id (id, email, full_name),
        courses:course_id (id, title, slug, price)
      `)
      .order("enrolled_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load enrollments",
      });
      return;
    }

    setEnrollments((data as unknown as Enrollment[]) || []);
  };

  /**
   * Fetch all user profiles for enrollment dropdown
   */
  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .order("email");

    if (error) {
      console.error("Failed to load profiles:", error);
      return;
    }

    setProfiles(data || []);
    setFilteredProfiles(data || []);
  };

  /**
   * Fetch all courses for enrollment dropdown
   */
  const loadCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug, price")
      .order("title");

    if (error) {
      console.error("Failed to load courses:", error);
      return;
    }

    setCourses(data || []);
  };

  /**
   * Create manual enrollment for a student
   */
  const handleEnrollStudent = async () => {
    if (!selectedUserId || !selectedCourseId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both a student and a course",
      });
      return;
    }

    // Check if enrollment already exists
    const existingEnrollment = enrollments.find(
      e => e.user_id === selectedUserId && e.course_id === selectedCourseId
    );
    if (existingEnrollment) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This student is already enrolled in this course",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("course_enrollments")
      .insert({
        user_id: selectedUserId,
        course_id: selectedCourseId,
        payment_status: "completed",
        price_paid: 0, // Admin enrollment is free
        enrolled_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to enroll student",
      });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Success",
      description: "Student enrolled successfully",
    });

    // Reset form and reload
    setSelectedUserId("");
    setSelectedCourseId("");
    setUserSearchTerm("");
    setDialogOpen(false);
    setSubmitting(false);
    await loadEnrollments();
  };

  /**
   * Delete an enrollment
   */
  const handleDeleteEnrollment = async (enrollmentId: string) => {
    const { error } = await supabase
      .from("course_enrollments")
      .delete()
      .eq("id", enrollmentId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete enrollment",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Enrollment deleted successfully",
    });

    await loadEnrollments();
  };

  // Filter enrollments based on search term
  const filteredEnrollments = enrollments.filter(enrollment => {
    const searchLower = searchTerm.toLowerCase();
    const email = enrollment.profiles?.email?.toLowerCase() || "";
    const name = enrollment.profiles?.full_name?.toLowerCase() || "";
    const courseTitle = enrollment.courses?.title?.toLowerCase() || "";
    return email.includes(searchLower) || name.includes(searchLower) || courseTitle.includes(searchLower);
  });

  // Filter profiles for user search in dialog
  useEffect(() => {
    if (!userSearchTerm.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const searchLower = userSearchTerm.toLowerCase();
    const nextFiltered = profiles.filter((profile) => {
      const email = profile.email?.toLowerCase() || "";
      const name = profile.full_name?.toLowerCase() || "";
      return email.includes(searchLower) || name.includes(searchLower);
    });

    setFilteredProfiles(nextFiltered);

    if (selectedUserId && !nextFiltered.some((profile) => profile.id === selectedUserId)) {
      setSelectedUserId("");
    }
  }, [userSearchTerm, profiles, selectedUserId]);

  // Refresh student list whenever the dialog opens to ensure new users show up in search
  useEffect(() => {
    if (dialogOpen) {
      loadProfiles();
      setUserSearchTerm("");
      setSelectedUserId("");
    }
  }, [dialogOpen]);

  /**
   * Get badge color based on payment status
   */
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading enrollments...</p>
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
              <Button variant="ghost" asChild className="mb-4">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">/admin/enrollments</p>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Student Enrollments</h1>
                  <p className="text-muted-foreground">
                    View and manage course enrollments. Manually enroll students without payment.
                  </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="shadow-medium">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Enroll Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Enroll Student</DialogTitle>
                      <DialogDescription>
                        Manually enroll a student in a course. This will create a free enrollment without requiring payment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-search">Search Student</Label>
                        <Input
                          id="user-search"
                          placeholder="Search by email or name..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Select Student</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {filteredProfiles.length === 0 ? (
                              <SelectItem value="no-results" disabled>
                                No matching students found
                              </SelectItem>
                            ) : (
                              filteredProfiles.map((profile) => (
                                <SelectItem key={profile.id} value={profile.id}>
                                  <span className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {profile.email || "No email"} 
                                    {profile.full_name && <span className="text-muted-foreground">({profile.full_name})</span>}
                                  </span>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Select Course</Label>
                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                <span className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4" />
                                  {course.title}
                                  {course.price !== null && course.price > 0 && (
                                    <span className="text-muted-foreground">(₾{course.price})</span>
                                  )}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEnrollStudent} disabled={submitting}>
                        {submitting ? "Enrolling..." : "Enroll Student"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Enrollments</p>
                      <p className="text-3xl font-bold text-foreground">{enrollments.length}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active Students</p>
                      <p className="text-3xl font-bold text-foreground">
                        {new Set(enrollments.map(e => e.user_id)).size}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Registered Users</p>
                      <p className="text-3xl font-bold text-foreground">{profiles.length}</p>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <UserPlus className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student email, name, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Enrollments Table */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>All Enrollments</CardTitle>
                <CardDescription>
                  List of all course enrollments. Use the "Enroll Student" button to manually add students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEnrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No enrollments found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Start by enrolling students in courses"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Enroll First Student
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price Paid</TableHead>
                        <TableHead>Enrolled At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{enrollment.profiles?.email || "Unknown"}</p>
                              {enrollment.profiles?.full_name && (
                                <p className="text-sm text-muted-foreground">{enrollment.profiles.full_name}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link 
                              to={`/admin/courses/${enrollment.course_id}`}
                              className="text-primary hover:underline"
                            >
                              {enrollment.courses?.title || "Unknown Course"}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(enrollment.payment_status)}>
                              {enrollment.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {enrollment.price_paid > 0 ? `₾${enrollment.price_paid}` : "Free"}
                          </TableCell>
                          <TableCell>
                            {enrollment.enrolled_at 
                              ? new Date(enrollment.enrolled_at).toLocaleDateString("ka-GE")
                              : "N/A"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Enrollment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this enrollment? The student will lose access to the course.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
