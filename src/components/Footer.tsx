import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from "lucide-react";
import { academyConfig } from "@/config/academy";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">{academyConfig.siteName}</h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              {academyConfig.siteDescription}
            </p>
            <div className="flex space-x-4">
              <a
                href={academyConfig.contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={academyConfig.contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={academyConfig.contact.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">კონტაქტი</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>{academyConfig.contact.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span>{academyConfig.contact.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{academyConfig.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">სამუშაო საათები</h3>
            <div className="flex items-start space-x-2 text-sm">
              <Clock size={16} className="mt-0.5 flex-shrink-0" />
              <span>{academyConfig.contact.workingHours}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} {academyConfig.siteName}. ყველა უფლება დაცულია.</p>
        </div>
      </div>
    </footer>
  );
}
