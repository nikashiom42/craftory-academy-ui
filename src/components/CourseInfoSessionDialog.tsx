import { useState, type ChangeEvent, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const infoSessionSchema = z.object({
  firstName: z.string().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  lastName: z.string().min(2, "გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{9,}$/, "საკონტაქტო ნომერი არასწორია"),
  email: z.string().email("ელფოსტის მისამართი არასწორია"),
});

interface CourseInfoSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  courseId: string;
}

export function CourseInfoSessionDialog({ open, onOpenChange, courseTitle, courseId }: CourseInfoSessionDialogProps) {
  const { toast } = useToast();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof formValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validation = infoSessionSchema.safeParse(formValues);
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("course_registrations").insert([
        {
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          phone: formValues.phone,
          email: formValues.email,
          personal_id: "",
          city: "",
          course_id: courseId,
        },
      ]);

      if (error) throw error;

      toast({
        title: "გაიგზავნა!",
        description: "ჩვენი გუნდი მალე დაგიკავშირდებათ უფასო საინფორმაციო შეხვედრის ორგანიზებისთვის.",
      });

      setFormValues({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "შეტყობინების გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>უფასო საინფორმაციო შეხვედრა</DialogTitle>
          <DialogDescription>
            დატოვეთ საკონტაქტო ინფორმაცია და მალევე დაგიკავშირდებით კურსზე &quot;{courseTitle}&quot; კონსულტაციისთვის.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="info-first-name">სახელი</Label>
              <Input
                id="info-first-name"
                placeholder="თქვენი სახელი"
                value={formValues.firstName}
                onChange={handleChange("firstName")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="info-last-name">გვარი</Label>
              <Input
                id="info-last-name"
                placeholder="თქვენი გვარი"
                value={formValues.lastName}
                onChange={handleChange("lastName")}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="info-phone">საკონტაქტო ნომერი</Label>
            <Input
              id="info-phone"
              placeholder="505 05 01 08"
              value={formValues.phone}
              onChange={handleChange("phone")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="info-email">ელექტრონული ფოსტა</Label>
            <Input
              id="info-email"
              type="email"
              placeholder="example@email.com"
              value={formValues.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "გაგზავნა..." : "შეხვედრაზე რეგისტრაცია"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
