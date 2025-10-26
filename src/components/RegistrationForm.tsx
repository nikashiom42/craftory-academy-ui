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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  lastName: z.string().min(2, "გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{9,}$/, "საკონტაქტო ნომერი არასწორია"),
  email: z.string().email("ელფოსტის მისამართი არასწორია"),
  personalId: z.string().length(11, "პირადი ნომერი უნდა იყოს 11 ციფრი").regex(/^\d{11}$/, "პირადი ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს"),
  city: z.string().min(2, "გთხოვთ შეიყვანოთ ქალაქი"),
  createAccount: z.boolean().default(false),
  password: z.string().optional(),
}).refine((data) => {
  if (data.createAccount && (!data.password || data.password.length < 6)) {
    return false;
  }
  return true;
}, {
  message: "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს",
  path: ["password"],
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
      createAccount: false,
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // First, register for consultation
      const { error: registrationError } = await supabase
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

      if (registrationError) throw registrationError;

      // If user wants to create account, sign them up
      if (data.createAccount && data.password) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: `${data.firstName} ${data.lastName}`,
            },
          },
        });

        if (signUpError) throw signUpError;

        toast.success("წარმატებით დარეგისტრირდით კონსულტაციაზე და ანგარიში შეიქმნა!");
      } else {
        toast.success("გაგვიგზავნეთ! ჩვენ მალე დაგიკავშირდებით.");
      }
      
      form.reset();
    } catch (error) {
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
              უფასო საინფორმაციო შეხვედრა
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              დარეგისტრირდი უფასო კონსულტაციაზე და გაიგე ყველაფერი კურსის შესახებ
            </p>
            <p className="text-sm text-muted-foreground">
              არ ქმნის ანგარიშს საიტზე - მხოლოდ საინფორმაციო შეხვედრისთვის
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
                      <Input placeholder="505 05 01 08" {...field} />
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

              <div className="pt-4 border-t">
                <FormField
                  control={form.control}
                  name="createAccount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-accent/10">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-semibold">
                          ასევე შექმენი ანგარიში საიტზე
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          მიიღე წვდომა კურსებთან, მასალებთან და შენს პროფილთან
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("createAccount") && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>პაროლი ანგარიშისთვის</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="მინიმუმ 6 სიმბოლო"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "იგზავნება..." : "დარეგისტრირდი"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
