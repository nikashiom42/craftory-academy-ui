import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  lastName: z.string().min(2, "გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  phone: z.string().min(9, "საკონტაქტო ნომერი არასწორია"),
  email: z.string().email("ელფოსტის მისამართი არასწორია"),
  personalId: z.string().min(11, "პირადი ნომერი არასწორია").max(11, "პირადი ნომერი არასწორია"),
  city: z.string().min(2, "გთხოვთ შეიყვანოთ ქალაქი"),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      personalId: "",
      city: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("course_registrations")
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            email: data.email,
            personal_id: data.personalId,
            city: data.city,
          },
        ]);

      if (error) throw error;

      toast.success("გაგვიგზავნეთ! ჩვენ მალე დაგიკავშირდებით.");
      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">
              დარეგისტრირდი კურსზე
            </h2>
            <p className="text-lg text-muted-foreground">
              შეავსე შენი მონაცემები და ჩვენ დაგიკავშირდებით
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>სახელი</FormLabel>
                      <FormControl>
                        <Input placeholder="თქვენი სახელი" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>გვარი</FormLabel>
                      <FormControl>
                        <Input placeholder="თქვენი გვარი" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>საკონტაქტო ნომერი</FormLabel>
                    <FormControl>
                      <Input placeholder="+995 555 123 456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ელექტრონული ფოსტა</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>პირადი ნომერი</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678901" maxLength={11} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>საცხოვრებელი ქალაქი</FormLabel>
                    <FormControl>
                      <Input placeholder="თბილისი" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "იგზავნება..." : "გაგზავნა"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
