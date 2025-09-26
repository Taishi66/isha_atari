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
import { Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-24 px-8 relative">
      {/* Subtle scanning line separator */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header Matrix */}
        <div className="mb-16 relative">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-2 h-2 border border-cyan-400/60 rotate-45 animate-pulse" />
            <div className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
              {CONTACT_TITLE}
            </div>
          </div>
          <h2 className="text-2xl font-mono font-light text-white/90 mb-4">
            {CONTACT_SUBTITLE}
          </h2>
          <p className="text-sm text-gray-400/80 leading-relaxed font-light max-w-2xl">
            {CONTACT_DESC}
          </p>
        </div>

        {/* Connection Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Primary Contact */}
          <div className="relative bg-black/40 border border-cyan-500/20 p-6 group hover:border-cyan-400/40 transition-all duration-300">
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-cyan-400/60">PRIMARY_CHANNEL</div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
              </div>

              <a
                href="mailto:lamypro66@gmail.com"
                className="flex items-center space-x-3 group/mail transition-all duration-300"
              >
                <div className="p-2 border border-cyan-500/30 group-hover/mail:border-cyan-400/60 transition-all duration-300">
                  <Mail size={16} className="text-cyan-400/80" />
                </div>
                <span className="font-mono text-sm text-white/90 group-hover/mail:text-cyan-300 transition-colors duration-300">
                  {MAIL}
                </span>
              </a>
            </div>
          </div>

          {/* Location Data */}
          <div className="relative bg-black/40 border border-cyan-500/20 p-6 group hover:border-cyan-400/40 transition-all duration-300">
            {/* Corner indicators */}
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-cyan-400/60">LOCATION_DATA</div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 border border-cyan-500/30 mt-1">
                  <MapPin size={16} className="text-cyan-400/80" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-sm text-white/90">{LOCATION_LAT_LONG}</p>
                  <p className="text-xs text-cyan-300/80">{REMOTE}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Network Matrix */}
        <div className="relative">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-1 h-1 bg-cyan-400 rounded-full" />
              <div className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
                {SOCIAL_NETWORKS}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href="#"
                className="relative group bg-black/40 border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 p-3"
                aria-label={social.label}
              >
                {/* Hover scan line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <social.icon
                  size={18}
                  className="text-cyan-400/70 group-hover:text-cyan-300 transition-colors duration-300"
                />

                {/* Network ID */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-mono text-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-12 flex items-center space-x-3">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          <div className="text-xs font-mono text-green-400/80">STATUS: AVAILABLE_FOR_COLLABORATION</div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
