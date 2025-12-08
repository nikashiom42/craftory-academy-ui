import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { z } from "zod";
import { Mail, Phone, MapPin, Calendar, UserCheck, Clock, XCircle, CheckCircle, Search, UserPlus, Trash2, MoreVertical } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  personal_id: string;
  city: string;
  status: string;
  created_at: string;
  course_id: string | null;
  has_account?: boolean;
  course?: {
    title: string;
  };
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string | null;
}

interface CombinedRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  personal_id?: string;
  city?: string;
  status: string;
  created_at: string;
  courseTitle: string;
  hasAccount: boolean;
  source: "registration" | "profile";
  registrationId?: string;
  profile?: Profile | null;
}

export default function AdminLeads() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileStatusMap, setProfileStatusMap] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem("profileStatusMap");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load user session and registration data
   * Auth and role verification handled by ProtectedRoute wrapper
   */
  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
    }

    await Promise.all([loadRegistrations(), loadProfiles()]);
    setLoading(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem("profileStatusMap", JSON.stringify(profileStatusMap));
    } catch {
      // ignore storage errors
    }
  }, [profileStatusMap]);

  /**
   * Fetch all course registrations/leads
   */
  const loadRegistrations = async () => {
    const { data, error } = await supabase
      .from("course_registrations")
      .select(`
        *,
        course:courses(title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load registrations",
      });
      return;
    }

    // Fetch all auth users once
    const { data: userData } = await supabase.auth.admin.listUsers();
    const userEmails = new Set(userData?.users.map(u => u.email) || []);

    // Check if each registration email has a corresponding auth account
    const registrationsWithAccountStatus = (data || []).map((reg) => ({
      ...reg,
      has_account: userEmails.has(reg.email),
    }));

    setRegistrations(registrationsWithAccountStatus);
  };

  /**
   * Fetch all registered student profiles to display alongside leads
   */
  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load registered students",
      });
      return;
    }

    setProfiles(data || []);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("course_registrations")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Status updated successfully",
    });
    loadRegistrations();
  };

  const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

  const closeResetDialog = () => {
    setResetDialogOpen(false);
    setResetTarget(null);
    setNewPassword("");
    setConfirmPassword("");
    setResetting(false);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    setDeleting(false);
  };

  const startReset = (profile: Profile) => {
    setResetTarget(profile);
    setNewPassword("");
    setConfirmPassword("");
    setResetDialogOpen(true);
  };

  const startDelete = (profile: Profile) => {
    setDeleteTarget(profile);
    setDeleteDialogOpen(true);
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;

    const validation = passwordSchema.safeParse(newPassword);
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validation.error.errors[0].message,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setResetting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const { error } = await supabase.functions.invoke("reset-user-password", {
        method: "POST",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        body: { userId: resetTarget.id, newPassword },
      });

      if (error) {
        throw new Error(error.message || "Failed to reset password");
      }

      toast({
        title: "Password reset",
        description: "Share the new password with the student.",
      });
      closeResetDialog();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      toast({
        variant: "destructive",
        title: "Error",
        description: message.includes("not allowed")
          ? "Password reset requires an admin session and deployed reset-user-password function."
          : message,
      });
      setResetting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const { error } = await supabase.functions.invoke("delete-user", {
        method: "POST",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        body: { userId: deleteTarget.id },
      });

      if (error) {
        throw new Error(error.message || "Failed to delete student");
      }

      const targetEmail = deleteTarget.email?.toLowerCase();
      setProfiles((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setProfileStatusMap((prev) => {
        const updated = { ...prev };
        delete updated[deleteTarget.id];
        return updated;
      });
      setRegistrations((prev) =>
        prev.map((reg) =>
          targetEmail && reg.email.toLowerCase() === targetEmail
            ? { ...reg, has_account: false }
            : reg
        )
      );

      toast({
        title: "Student removed",
        description: "The student account was deleted.",
      });
      closeDeleteDialog();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete student";
      toast({
        variant: "destructive",
        title: "Error",
        description: message.includes("not allowed")
          ? "Delete requires an admin session and deployed delete-user function."
          : message,
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading registrations...</p>
        </div>
      </div>
    );
  }

  // Filter registrations
  const registrationRows: CombinedRow[] = registrations.map((reg) => {
    const name = `${reg.first_name} ${reg.last_name}`.trim() || reg.first_name || reg.last_name || "No name";
    const matchedProfile = profiles.find(
      (p) => p.email && reg.email && p.email.toLowerCase() === reg.email.toLowerCase()
    );

    return {
      id: reg.id,
      registrationId: reg.id,
      name,
      email: reg.email,
      phone: reg.phone,
      personal_id: reg.personal_id,
      city: reg.city,
      status: reg.status,
      created_at: reg.created_at,
      courseTitle: reg.course?.title || "No course selected",
      hasAccount: !!reg.has_account,
      source: "registration",
      profile: matchedProfile || null,
    };
  });

  const profilesWithoutRegistration = profiles.filter((profile) => {
    const email = profile.email?.toLowerCase() || "";
    return !registrations.some((reg) => reg.email?.toLowerCase() === email);
  });

  const profileRows: CombinedRow[] = profilesWithoutRegistration.map((profile) => ({
    id: profile.id,
    name: profile.full_name || "No name provided",
    email: profile.email || "No email",
    phone: "",
    status: profileStatusMap[profile.id] || "registered",
    created_at: profile.created_at || "",
    courseTitle: "",
    hasAccount: true,
    source: "profile",
    profile,
  }));

  const combinedRows = [...registrationRows, ...profileRows].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const filteredCombined = combinedRows.filter((row) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      row.name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      row.phone.toLowerCase().includes(query) ||
      (row.personal_id || "").includes(searchQuery);

    const matchesStatus = statusFilter === "all" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalLeads = registrations.length;
  const newLeads = registrations.filter(r => r.status === 'new').length;
  const contactedLeads = registrations.filter(r => r.status === 'contacted').length;
  const enrolledLeads = registrations.filter(r => r.status === 'enrolled').length;
  const totalStudents = profiles.length;

  // Pagination helpers (client-side)
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(filteredCombined.length / ITEMS_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = filteredCombined.slice(pageStartIndex, pageStartIndex + ITEMS_PER_PAGE);
  const showingStart = filteredCombined.length === 0 ? 0 : pageStartIndex + 1;
  const showingEnd = Math.min(filteredCombined.length, pageStartIndex + paginatedRows.length);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Clamp current page when data shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "secondary" as const, icon: Clock, label: "New" },
      contacted: { variant: "default" as const, icon: Phone, label: "Contacted" },
      enrolled: { variant: "default" as const, icon: CheckCircle, label: "Enrolled" },
      rejected: { variant: "destructive" as const, icon: XCircle, label: "Rejected" },
      registered: { variant: "secondary" as const, icon: UserPlus, label: "Registered" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };
  const handleStatusChange = async (row: CombinedRow, newStatus: string) => {
    if (row.source === "registration") {
      await updateStatus(row.registrationId!, newStatus);
    } else {
      setProfileStatusMap((prev) => ({
        ...prev,
        [row.id]: newStatus,
      }));
      toast({
        title: "Status updated",
        description: "Status saved for this student.",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-cream">
        <AdminSidebar userEmail={user?.email} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-8 py-8 pb-14">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">/admin/leads</p>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Course Registrations</h1>
                  <p className="text-muted-foreground">
                    Manage and track all course registration submissions
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
                      <p className="text-3xl font-bold text-foreground">{totalLeads}</p>
                      <p className="text-xs text-muted-foreground mt-1">All submissions</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">New</p>
                      <p className="text-3xl font-bold text-foreground">{newLeads}</p>
                      <p className="text-xs text-muted-foreground mt-1">Pending review</p>
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
                      <p className="text-sm text-muted-foreground mb-1">Contacted</p>
                      <p className="text-3xl font-bold text-foreground">{contactedLeads}</p>
                      <p className="text-xs text-muted-foreground mt-1">In progress</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Enrolled</p>
                      <p className="text-3xl font-bold text-foreground">{enrolledLeads}</p>
                      <p className="text-xs text-muted-foreground mt-1">Converted</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registered Students</p>
                    <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
                    <p className="text-xs text-muted-foreground mt-1">Profiles with an account</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <UserPlus className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">All Registrations</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, phone..."
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
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="registered">Registered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Unified Registrations & Students Table */}
            {combinedRows.length === 0 ? (
              <Card className="shadow-soft border-2 border-dashed mb-8">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <UserCheck className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No records yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    When users submit the registration form or create an account, they will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-soft overflow-hidden mb-8">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCombined.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No records found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{row.name}</span>
                                {row.personal_id && (
                                  <span className="text-xs text-muted-foreground">ID: {row.personal_id}</span>
                                )}
                                {row.city && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {row.city}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 text-sm">
                                {row.email && row.email !== "No email" ? (
                                  <a href={`mailto:${row.email}`} className="hover:text-primary transition-colors flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {row.email}
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    No email
                                  </span>
                                )}
                                {row.phone ? (
                                  <a href={`tel:${row.phone}`} className="hover:text-primary transition-colors flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {row.phone}
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    No phone
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {row.courseTitle ? (
                                <span className="text-sm">{row.courseTitle}</span>
                              ) : row.source === "registration" ? (
                                <span className="text-xs text-muted-foreground">No course selected</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">&nbsp;</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {row.hasAccount ? (
                                <Badge variant="default" className="gap-1">
                                  <UserPlus className="h-3 w-3" />
                                  Yes
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {row.created_at
                                  ? new Date(row.created_at).toLocaleDateString('ka-GE')
                                  : "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={row.status}
                                onValueChange={(value) => handleStatusChange(row, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="enrolled">Enrolled</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="registered">Registered</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      disabled={deleting && deleteTarget?.id === row.profile?.id}
                                    >
                                      {deleting && deleteTarget?.id === row.profile?.id ? "Working..." : "Actions"}
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      disabled={!row.profile}
                                      onClick={() => row.profile && startReset(row.profile)}
                                    >
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      disabled={!row.profile || (deleting && deleteTarget?.id === row.profile?.id)}
                                      onClick={() => row.profile && startDelete(row.profile)}
                                    >
                                      {deleting && deleteTarget?.id === row.profile?.id ? "Deleting..." : "Delete Account"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                {filteredCombined.length > 0 && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t bg-muted/20">
                    <div className="text-sm text-muted-foreground">
                      Showing {showingStart}-{showingEnd} of {filteredCombined.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || filteredCombined.length === 0}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            <Dialog
              open={resetDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  closeResetDialog();
                } else {
                  setResetDialogOpen(true);
                }
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Student Password</DialogTitle>
                  <DialogDescription>
                    {resetTarget?.email
                      ? `Set a new password for ${resetTarget.email}.`
                      : "Set a new password for the selected student."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeResetDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleResetPassword} disabled={resetting || !resetTarget}>
                    {resetting ? "Resetting..." : "Reset Password"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  closeDeleteDialog();
                } else {
                  setDeleteDialogOpen(true);
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete student account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the student account
                    {deleteTarget?.email ? ` (${deleteTarget.email})` : ""}. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteStudent}
                    disabled={deleting || !deleteTarget}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
