import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Mail, Phone, MapPin, Calendar, UserCheck, Clock, XCircle, CheckCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

export default function AdminLeads() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
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

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

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
      loadRegistrations();
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    const { data, error } = await supabase
      .from("course_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load registrations",
      });
      return;
    }

    setRegistrations(data || []);
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

  const totalLeads = registrations.length;
  const newLeads = registrations.filter(r => r.status === 'new').length;
  const contactedLeads = registrations.filter(r => r.status === 'contacted').length;
  const enrolledLeads = registrations.filter(r => r.status === 'enrolled').length;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "secondary" as const, icon: Clock, label: "New" },
      contacted: { variant: "default" as const, icon: Phone, label: "Contacted" },
      enrolled: { variant: "default" as const, icon: CheckCircle, label: "Enrolled" },
      rejected: { variant: "destructive" as const, icon: XCircle, label: "Rejected" },
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
            </div>

            {/* Registrations Grid */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">All Registrations</h2>
            </div>

            {registrations.length === 0 ? (
              <Card className="shadow-soft border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <UserCheck className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No registrations yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    When users submit the registration form, they will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {registrations.map((registration) => (
                  <Card key={registration.id} className="shadow-soft hover:shadow-medium transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        {getStatusBadge(registration.status)}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(registration.created_at).toLocaleDateString('ka-GE')}
                        </span>
                      </div>
                      <CardTitle className="text-xl">
                        {registration.first_name} {registration.last_name}
                      </CardTitle>
                      <CardDescription>ID: {registration.personal_id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <a href={`mailto:${registration.email}`} className="hover:text-foreground transition-colors">
                            {registration.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <a href={`tel:${registration.phone}`} className="hover:text-foreground transition-colors">
                            {registration.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{registration.city}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <label className="text-sm font-medium mb-2 block">Update Status</label>
                        <Select
                          value={registration.status}
                          onValueChange={(value) => updateStatus(registration.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="enrolled">Enrolled</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
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
