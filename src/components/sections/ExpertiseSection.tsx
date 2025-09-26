import {
  SKILLS_DESC,
  SKILLS_DESC_TITLE,
  SKILLS_LIST,
  SKILLS_SUBTITLE,
  SKILLS_TITLE,
} from "@/constants/ui";

const ExpertiseSection = () => {
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
              {SKILLS_TITLE}
            </div>
          </div>
          <h2 className="text-2xl font-mono font-light text-white/90 mb-1">
            {SKILLS_SUBTITLE}
          </h2>
          <p className="text-sm font-mono max-w-md" style={{ color: 'var(--theme-accent)' }}>
            {SKILLS_DESC_TITLE}
          </p>
        </div>

        {/* Expertise Grid - Modern Cybernetic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 bg-gradient-to-br to-transparent p-1 border" style={{ backgroundImage: `linear-gradient(to bottom right, var(--theme-bg-primary), transparent)`, borderColor: 'var(--theme-border-primary)' }}>
          {SKILLS_LIST.map((item, index) => (
            <div
              key={index}
              className="group relative bg-black/40 border transition-all duration-300 p-6" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}
            >
              {/* Corner indicators */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Icon with minimal frame */}
                <div className="flex items-center justify-between">
                  <div className="p-1 border transition-all duration-300" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}>
                    <item.icon size={16} style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Title and description */}
                <div className="space-y-2">
                  <h3 className="font-mono text-sm text-white/90 transition-colors duration-300" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400/80 leading-relaxed group-hover:text-gray-300/80 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
                  <div className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>ACTIVE</div>
                </div>
              </div>

              {/* Hover scan effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, var(--theme-primary), transparent)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom description */}
        <div className="mt-12 max-w-2xl">
          <p className="text-sm text-gray-400/80 leading-relaxed font-light">
            {SKILLS_DESC}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
