// Craftory Academy Configuration
// All editable content for easy client updates
import partner1Logo from "@/assets/partners/1.webp";
import partner2Logo from "@/assets/partners/2.webp";
import partner3Logo from "@/assets/partners/3.webp";
import partner4Logo from "@/assets/partners/4.png";
import partner5Logo from "@/assets/partners/5.webp";
import partner6Logo from "@/assets/partners/6.png";
import partner7Logo from "@/assets/partners/7.png";

export const academyConfig = {
  // Site Meta
  siteName: "Craftory Academy",
  siteDescription: "საქართველოს პირველი ავეჯის კონსტრუირების აკადემია",
  
  // Navigation
  nav: [
    { name: "მთავარი", path: "/" },
    { name: "კურსები", path: "/courses" },
    { name: "კონტაქტი", path: "/contact" },
  ],

  // Contact Info
  contact: {
    phone: "505 05 01 08",
    email: "info@craftoryacademy.ge",
    address: "თბილისი, საქართველო",
    workingHours: "ორშ-პარ: 10:00-19:00, შაბ: 11:00-17:00",
    social: {
      facebook: "https://facebook.com/craftoryacademy",
      instagram: "https://www.instagram.com/craftory.academy",
      tiktok: "https://www.tiktok.com/@craftory.academy",
    },
  },

  // Partners
  partners: [
    { name: "Partner 1", logo: partner1Logo },
    { name: "Partner 2", logo: partner2Logo },
    { name: "Partner 3", logo: partner3Logo },
    { name: "Partner 4", logo: partner4Logo },
    { name: "Partner 5", logo: partner5Logo },
    { name: "Partner 6", logo: partner6Logo },
    { name: "Partner 7", logo: partner7Logo },
  ],

  // Note: Course data is managed in the Supabase database
  // All course content is fetched dynamically from the 'courses' table
};
