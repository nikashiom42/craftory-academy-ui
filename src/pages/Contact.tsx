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
 * Contact page - displays contact information and contact form
 * Dedicated page accessible from navigation
 */
export default function Contact() {
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
      // Here you would send the contact form data to your backend
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
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
            დაგვიკავშირდით
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            გაქვთ შეკითხვები? მოგვწერეთ ან დაგვირეკეთ და ჩვენ დაგეხმარებით
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">საკონტაქტო ინფორმაცია</h2>
              
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">ტელეფონი</p>
                    <a 
                      href={`tel:${academyConfig.contact.phone}`}
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {academyConfig.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">ელექტრონული ფოსტა</p>
                    <a 
                      href={`mailto:${academyConfig.contact.email}`}
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {academyConfig.contact.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">მისამართი</p>
                    <p className="text-muted-foreground">{academyConfig.contact.address}</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">სამუშაო საათები</p>
                    <p className="text-muted-foreground">{academyConfig.contact.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold mb-4">გამოგვყევით სოციალურ მედიაში</h3>
              <div className="flex gap-4">
                <a
                  href={academyConfig.contact.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={academyConfig.contact.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={academyConfig.contact.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-muted/30 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">გამოგვწერეთ</h2>
              
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
                            placeholder="რით შეგვიძლია დაგეხმაროთ?"
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}

