import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Image, Plus, Pencil, Trash2, Upload, GripVertical, Eye, EyeOff } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export default function AdminPartners() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setUser(session.user);
    }

    await loadPartners();
    setLoading(false);
  };

  const loadPartners = async () => {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load partners",
      });
      return;
    }

    setPartners(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: "Please upload an image file",
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
        });
        return;
      }
      
      setLogoFile(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return formData.logo_url;

    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('partner-logos')
      .upload(filePath, logoFile);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: uploadError.message,
      });
      return null;
    }

    const { data } = supabase.storage
      .from('partner-logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload logo if new file selected
      const logoUrl = await uploadLogo();
      if (!logoUrl) {
        setUploading(false);
        return;
      }

      if (editingPartner) {
        // Update existing partner
        const { error } = await supabase
          .from("partners")
          .update({
            name: formData.name,
            logo_url: logoUrl,
          })
          .eq("id", editingPartner.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Partner updated successfully",
        });
      } else {
        // Create new partner
        const maxOrder = Math.max(...partners.map(p => p.display_order), 0);
        
        const { error } = await supabase
          .from("partners")
          .insert([{
            name: formData.name,
            logo_url: logoUrl,
            display_order: maxOrder + 1,
            active: true,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Partner added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadPartners();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete partner",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Partner deleted successfully",
    });
    loadPartners();
  };

  const toggleActive = async (partner: Partner) => {
    const { error } = await supabase
      .from("partners")
      .update({ active: !partner.active })
      .eq("id", partner.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update partner status",
      });
      return;
    }

    loadPartners();
  };

  const movePartner = async (partnerId: string, direction: 'up' | 'down') => {
    const currentIndex = partners.findIndex(p => p.id === partnerId);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const currentPartner = partners[currentIndex];
    const targetPartner = partners[targetIndex];

    // Swap display orders
    await supabase
      .from("partners")
      .update({ display_order: targetPartner.display_order })
      .eq("id", currentPartner.id);

    await supabase
      .from("partners")
      .update({ display_order: currentPartner.display_order })
      .eq("id", targetPartner.id);

    loadPartners();
  };

  const resetForm = () => {
    setFormData({ name: "", logo_url: "" });
    setLogoFile(null);
    setEditingPartner(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">/admin/partners</p>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Partner Logos</h1>
                  <p className="text-muted-foreground">
                    Manage partner logos displayed on the homepage slider
                  </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </div>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>All Partners</CardTitle>
                <CardDescription>
                  Drag to reorder, toggle visibility, or edit partner information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {partners.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="rounded-full bg-primary/10 p-6 mb-6">
                      <Image className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No partners yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      Add your first partner logo to display on the homepage
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Partner
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Order</TableHead>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner, index) => (
                        <TableRow key={partner.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => movePartner(partner.id, 'up')}
                                disabled={index === 0}
                              >
                                <GripVertical className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => movePartner(partner.id, 'down')}
                                disabled={index === partners.length - 1}
                              >
                                <GripVertical className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <img
                              src={partner.logo_url}
                              alt={partner.name}
                              className="h-12 w-20 object-contain bg-white rounded border"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{partner.name}</TableCell>
                          <TableCell>
                            <Badge variant={partner.active ? "default" : "secondary"}>
                              {partner.active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleActive(partner)}
                                title={partner.active ? "Hide" : "Show"}
                              >
                                {partner.active ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(partner)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(partner.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Edit Partner" : "Add New Partner"}
            </DialogTitle>
            <DialogDescription>
              Upload a partner logo and enter the company name
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Partner Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Company Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="logo">Logo Image</Label>
                <div className="mt-2">
                  {formData.logo_url && !logoFile && (
                    <div className="mb-4">
                      <img
                        src={formData.logo_url}
                        alt="Current logo"
                        className="h-20 w-auto object-contain border rounded p-2 bg-white"
                      />
                    </div>
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingPartner}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 2MB. Recommended: transparent background
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    {editingPartner ? "Update" : "Add"} Partner
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
