import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { User } from "@supabase/supabase-js";

interface SyllabusModule {
  module: number;
  title: string;
  topics: string[];
}

export default function CourseManage() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Basic fields
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [participantNumber, setParticipantNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);

  // Syllabus
  const [syllabus, setSyllabus] = useState<SyllabusModule[]>([]);

  useEffect(() => {
    checkAuth();
    if (!isNew) {
      loadCourse();
    }
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  const loadCourse = async () => {
    if (isNew) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load course",
      });
      setLoading(false);
      return;
    }

    // Set all fields
    setSlug(data.slug || "");
    setTitle(data.title || "");
    setSubtitle(data.subtitle || "");
    setDescription(data.description || "");
    setImageUrl(data.image_url || "");
    setDuration(data.duration || "");
    setParticipantNumber(data.participant_number?.toString() || "");
    setStartDate(data.start_date || "");
    setEndDate(data.end_date || "");
    setGoogleMeetLink(data.google_meet_link || "");
    setGoogleDriveLink(data.google_drive_link || "");
    setPrice(data.price?.toString() || "");
    setPublished(data.published || false);
    setSyllabus((data.syllabus as unknown as SyllabusModule[]) || []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("course-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("course-images")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);
    setUploading(false);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const courseData = {
      slug,
      title,
      subtitle,
      description,
      image_url: imageUrl,
      duration,
      participant_number: participantNumber ? parseInt(participantNumber) : null,
      start_date: startDate || null,
      end_date: endDate || null,
      google_meet_link: googleMeetLink || null,
      google_drive_link: googleDriveLink || null,
      price: price ? parseFloat(price) : 0,
      published,
      syllabus: syllabus as any,
    };

    if (isNew) {
      const { error } = await supabase
        .from("courses")
        .insert([courseData]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("courses")
        .update(courseData)
        .eq("id", id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setLoading(false);
        return;
      }
    }

    toast({
      title: "Success",
      description: `Course ${isNew ? "created" : "updated"} successfully`,
    });
    navigate("/admin");
  };

  const addSyllabusModule = () => {
    setSyllabus([
      ...syllabus,
      {
        module: syllabus.length + 1,
        title: "",
        topics: [""],
      },
    ]);
  };

  const updateSyllabusModule = (index: number, field: string, value: any) => {
    const updated = [...syllabus];
    updated[index] = { ...updated[index], [field]: value };
    setSyllabus(updated);
  };

  const addTopic = (moduleIndex: number) => {
    const updated = [...syllabus];
    updated[moduleIndex].topics.push("");
    setSyllabus(updated);
  };

  const updateTopic = (moduleIndex: number, topicIndex: number, value: string) => {
    const updated = [...syllabus];
    updated[moduleIndex].topics[topicIndex] = value;
    setSyllabus(updated);
  };

  const removeTopic = (moduleIndex: number, topicIndex: number) => {
    const updated = [...syllabus];
    updated[moduleIndex].topics.splice(topicIndex, 1);
    setSyllabus(updated);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-cream">
        <AdminSidebar userEmail={user?.email} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-8 py-8 max-w-5xl">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Link>
              </Button>
              <h1 className="text-4xl font-bold text-foreground">
                {isNew ? "Create New Course" : "Edit Course"}
              </h1>
            </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="furniture-constructor"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Course Image</Label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Course"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2 months"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participantNumber">Max Participants</Label>
                  <Input
                    id="participantNumber"
                    type="number"
                    value={participantNumber}
                    onChange={(e) => setParticipantNumber(e.target.value)}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₾)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleMeetLink">Google Meet Link</Label>
                <Input
                  id="googleMeetLink"
                  type="url"
                  value={googleMeetLink}
                  onChange={(e) => setGoogleMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleDriveLink">Google Drive Link</Label>
                <Input
                  id="googleDriveLink"
                  type="url"
                  value={googleDriveLink}
                  onChange={(e) => setGoogleDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/xxx"
                />
              </div>
            </CardContent>
          </Card>

          {/* Syllabus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Syllabus
                <Button type="button" size="sm" onClick={addSyllabusModule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {syllabus.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Module {module.module} Title</Label>
                    <Input
                      value={module.title}
                      onChange={(e) =>
                        updateSyllabusModule(moduleIndex, "title", e.target.value)
                      }
                      placeholder="Module title"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Topics</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addTopic(moduleIndex)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Topic
                      </Button>
                    </div>
                    {module.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex gap-2">
                        <Input
                          value={topic}
                          onChange={(e) =>
                            updateTopic(moduleIndex, topicIndex, e.target.value)
                          }
                          placeholder="Topic description"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeTopic(moduleIndex, topicIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isNew ? "Create Course" : "Update Course"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
          </div>
        </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
