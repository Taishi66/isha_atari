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
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, var(--theme-primary), transparent)` }} />

      <div className="max-w-7xl mx-auto">
        {/* Header Matrix */}
        <div className="mb-16 relative">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-2 h-2 border rotate-45 animate-pulse" style={{ borderColor: 'var(--theme-border-secondary)' }} />
            <div className="text-xs font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
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
          <div className="relative bg-black/40 border p-6 group transition-all duration-300" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}>
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>PRIMARY_CHANNEL</div>
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }} />
              </div>

              <a
                href="mailto:lamypro66@gmail.com"
                className="flex items-center space-x-3 group/mail transition-all duration-300"
              >
                <div className="p-2 border transition-all duration-300" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}>
                  <Mail size={16} style={{ color: 'var(--theme-primary)' }} />
                </div>
                <span className="font-mono text-sm text-white/90 transition-colors duration-300" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}>
                  {MAIL}
                </span>
              </a>
            </div>
          </div>

          {/* Location Data */}
          <div className="relative bg-black/40 border p-6 group transition-all duration-300" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}>
            {/* Corner indicators */}
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>LOCATION_DATA</div>
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 border mt-1" style={{ borderColor: 'var(--theme-border-primary)' }}>
                  <MapPin size={16} style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-sm text-white/90">{LOCATION_LAT_LONG}</p>
                  <p className="text-xs" style={{ color: 'var(--theme-accent)' }}>{REMOTE}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Network Matrix */}
        <div className="relative">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }} />
              <div className="text-xs font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                {SOCIAL_NETWORKS}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href="#"
                className="relative group bg-black/40 border transition-all duration-300 p-3" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}
                aria-label={social.label}
              >
                {/* Hover scan line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to right, transparent, var(--theme-primary), transparent)` }} />

                <social.icon
                  size={18}
                  className="transition-colors duration-300"
                  style={{ color: 'var(--theme-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-primary)'}
                />

                {/* Network ID */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--theme-text-muted)' }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-12 flex items-center space-x-3">
          <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }} />
          <div className="text-xs font-mono" style={{ color: 'var(--theme-success)' }}>STATUS: AVAILABLE_FOR_COLLABORATION</div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
