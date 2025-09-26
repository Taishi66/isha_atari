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
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header Matrix */}
        <div className="mb-16 relative">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-2 h-2 border border-cyan-400/60 rotate-45 animate-pulse" />
            <div className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
              {SKILLS_TITLE}
            </div>
          </div>
          <h2 className="text-2xl font-mono font-light text-white/90 mb-1">
            {SKILLS_SUBTITLE}
          </h2>
          <p className="text-sm font-mono text-cyan-300/80 max-w-md">
            {SKILLS_DESC_TITLE}
          </p>
        </div>

        {/* Expertise Grid - Modern Cybernetic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 bg-gradient-to-br from-cyan-500/5 to-transparent p-1 border border-cyan-500/10">
          {SKILLS_LIST.map((item, index) => (
            <div
              key={index}
              className="group relative bg-black/40 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 p-6"
            >
              {/* Corner indicators */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Icon with minimal frame */}
                <div className="flex items-center justify-between">
                  <div className="p-1 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300">
                    <item.icon size={16} className="text-cyan-400/80" />
                  </div>
                  <div className="text-xs font-mono text-cyan-400/50">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Title and description */}
                <div className="space-y-2">
                  <h3 className="font-mono text-sm text-white/90 group-hover:text-cyan-300/90 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400/80 leading-relaxed group-hover:text-gray-300/80 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="text-xs font-mono text-cyan-400/60">ACTIVE</div>
                </div>
              </div>

              {/* Hover scan effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
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
