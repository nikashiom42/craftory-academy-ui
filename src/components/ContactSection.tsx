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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { academyConfig } from "@/config/academy";

// TikTok icon component
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const contactFormSchema = z.object({
  name: z.string().min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
  email: z.string().email("ელფოსტის მისამართი არასწორია"),
  phone: z.string().regex(/^[\d\s\+\-\(\)]{9,}$/, "საკონტაქტო ნომერი არასწორია"),
  message: z.string().min(10, "შეტყობინება უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * ContactSection component - displays contact information and contact form
 * Used when user clicks on "კონტაქტი" in navigation menu
 */
export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the contact form data to your backend
      // For now, we'll just show a success message
      console.log("Contact form data:", data);
      
      toast.success("თქვენი შეტყობინება გაიგზავნა! ჩვენ მალე დაგიკავშირდებით.");
      form.reset();
    } catch (error) {
      toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">
              კონტაქტი
            </h2>
            <p className="text-lg text-muted-foreground">
              დაგვიკავშირდით ნებისმიერი კითხვისთვის
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">საკონტაქტო ინფორმაცია</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone size={20} className="mt-1 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">ტელეფონი</p>
                      <p className="text-muted-foreground">{academyConfig.contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail size={20} className="mt-1 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">ელექტრონული ფოსტა</p>
                      <p className="text-muted-foreground">{academyConfig.contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="mt-1 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">მისამართი</p>
                      <p className="text-muted-foreground">{academyConfig.contact.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock size={20} className="mt-1 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">სამუშაო საათები</p>
                      <p className="text-muted-foreground">{academyConfig.contact.workingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold mb-4">გამოგვყევით</h3>
                <div className="flex space-x-4">
                  <a
                    href={academyConfig.contact.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href={academyConfig.contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href={academyConfig.contact.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="TikTok"
                  >
                    <TikTokIcon size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-muted/30 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">გამოგვწერეთ</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>შეტყობინება</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="დაწერეთ თქვენი კითხვა ან შეტყობინება..."
                            className="min-h-[120px]"
                            {...field} 
                          />
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
