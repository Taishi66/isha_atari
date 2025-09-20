import {
  CONTACT_DESC,
  CONTACT_SUBTITLE,
  CONTACT_TITLE,
  LOCATION_LAT_LONG,
  MAIL,
  REMOTE,
  SOCIAL_LINKS,
  SOCIAL_NETWORKS,
} from "@/constants/ui";
import { Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-32 px-8 border-t border-cyan-500/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-400 tracking-widest">
                {CONTACT_TITLE}
              </div>
              <h2 className="text-3xl font-light font-mono">
                {CONTACT_SUBTITLE}
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </div>

            <p className="text-gray-400 leading-relaxed font-light">
              {CONTACT_DESC}
            </p>
          </div>

          <div className="space-y-8">
            <a
              href="mailto:lamypro66@gmail.com"
              className="flex items-center space-x-4 text-lg group transition-all duration-300 hover:text-cyan-400 font-mono"
            >
              <div className="p-2 border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300">
                <Mail size={20} />
              </div>
              <span className="font-light">{MAIL}</span>
            </a>

            <div className="space-y-6">
              <div className="text-xs font-mono text-cyan-400 tracking-widest">
                {SOCIAL_NETWORKS}
              </div>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-3 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-10 group"
                    aria-label={social.label}
                  >
                    <social.icon
                      size={20}
                      className="transition-colors duration-300 group-hover:text-cyan-400"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="text-xs font-mono text-cyan-400 tracking-widest">
                LOCATION_DATA
              </div>
              <div className="text-sm text-gray-400 space-y-1 font-mono">
                <p>{LOCATION_LAT_LONG}</p>
                <p>{REMOTE}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
