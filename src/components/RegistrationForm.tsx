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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GEORGIAN_PHONE_REGEX, normalizePhone } from "@/lib/validation";

// Form schema with conditional password validation based on createAccount checkbox
const formSchema = z.object({
  firstName: z.string().trim().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  lastName: z.string().trim().min(2, "გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  phone: z
    .string()
    .trim()
    .transform((value) => normalizePhone(value))
    .refine((value) => GEORGIAN_PHONE_REGEX.test(value), "ფორმატი: 505050108 ან +995505050108"),
  email: z.string().trim().email("ელფოსტის მისამართი არასწორია"),
  createAccount: z.boolean().default(false),
  password: z.string().optional(),
}).refine((data) => {
  if (data.createAccount) {
    return data.password && data.password.length >= 6;
  }
  return true;
}, {
  message: "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს",
  path: ["password"],
});

type FormValues = z.infer<typeof formSchema>;

/**
 * RegistrationForm - Free consultation form with optional account creation
 * Users can optionally check a box to create an account during consultation signup
 */
export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      createAccount: false,
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // If user wants to create an account, sign them up first
      if (data.createAccount && data.password) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              phone: data.phone,
            },
          },
        });

        if (signUpError) throw signUpError;

        toast.success("ანგარიში შექმნილია! გთხოვთ შეამოწმოთ თქვენი ელფოსტა დასადასტურებლად.");
      }

      // Register for free consultation
      const { error: registrationError } = await supabase
        .from("course_registrations")
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            email: data.email,
            personal_id: null,
            city: null,
          },
        ]);

      if (registrationError) throw registrationError;

      if (!data.createAccount) {
        toast.success("გაგვიგზავნეთ! ჩვენ მალე დაგიკავშირდებით უფასო კონსულტაციისთვის.");
      }
      form.reset();
    } catch (error) {
      toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration" className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6">
              უფასო კონსულტაცია
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              დარეგისტრირდი უფასო კონსულტაციაზე და გაიგე ყველაფერი კურსის შესახებ
            </p>
            <p className="text-sm text-muted-foreground">
              სწრაფი და მარტივი რეგისტრაცია - სურვილისამებრ შეგიძლიათ ანგარიშის შექმნაც
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
                      <Input placeholder="505050108 ან +995505050108" {...field} />
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
                name="createAccount"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-background/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        მინდა ანგარიშის შექმნა
                      </FormLabel>
                      <FormDescription>
                        შექმენით ანგარიში რომ მიიღოთ წვდომა კურსებზე და თქვენს პირად კაბინეტზე
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("createAccount") && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>პაროლი</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="მინიმუმ 6 სიმბოლო" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="pt-8">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "იგზავნება..." : "უფასო კონსულტაციისთვის დარეგისტრირება"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
