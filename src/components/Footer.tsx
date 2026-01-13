import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react";
import { academyConfig } from "@/config/academy";
import { processLatinText } from "@/components/LatinText";

// TikTok icon component
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-secondary">{processLatinText(academyConfig.siteName)}</h3>
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
                href={academyConfig.contact.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">კონტაქტი</h3>
            <div className="space-y-3 text-[1.05rem] leading-relaxed">
              <div className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-latin">{academyConfig.contact.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-latin">{academyConfig.contact.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{processLatinText(academyConfig.contact.address)}</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">სამუშაო საათები</h3>
            <div className="flex items-start space-x-2 text-[1.05rem] leading-relaxed">
              <Clock size={16} className="mt-0.5 flex-shrink-0" />
              <span className="font-medium">{processLatinText(academyConfig.contact.workingHours)}</span>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <Link to="/terms" className="hover:text-accent transition-colors">
              წესები და პირობები
            </Link>
            <span className="text-secondary-foreground/30">|</span>
            <Link to="/privacy" className="hover:text-accent transition-colors">
              კონფიდენციალურობა
            </Link>
            <span className="text-secondary-foreground/30">|</span>
            <Link to="/refund" className="hover:text-accent transition-colors">
              თანხის დაბრუნება
            </Link>
          </div>
          <div className="text-sm text-secondary-foreground/60 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>© <span className="text-latin">{new Date().getFullYear()}</span> {processLatinText(academyConfig.siteName)}. ყველა უფლება დაცულია.</p>
            <p className="text-xs text-secondary-foreground/40 md:text-right">
              ვებსაიტი დამზადებული{" "}
              <a
                href="https://digitalalchemy.ge/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-foreground/60 transition-colors text-latin"
              >
                digitalalchemy.ge
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
