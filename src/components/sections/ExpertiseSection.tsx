import { useState } from "react";
import {
    SKILLS_DESC,
    SKILLS_DESC_TITLE,
    SKILLS_LIST,
    SKILLS_SUBTITLE,
    SKILLS_TITLE,
} from "@/constants/ui";

const ExpertiseSection = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    return (
        <section className="py-12 xs:py-16 sm:py-20 md:py-24 px-3 xs:px-4 sm:px-6 md:px-7 lg:px-8 relative">
            {/* Subtle scanning line separator */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, var(--theme-primary), transparent)` }} />

            <div className="max-w-7xl mx-auto">
                {/* Header Matrix */}
                <div className="mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 relative">
                    <div className="flex items-center space-x-3 xs:space-x-4 mb-2">
                        <div className="w-2 h-2 border rotate-45 animate-pulse" style={{ borderColor: 'var(--theme-border-secondary)' }} />
                        <div className="text-xs sm:text-sm font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                            {SKILLS_TITLE}
                        </div>
                    </div>
                    <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-light text-white/90 mb-1">
                        {SKILLS_SUBTITLE}
                    </h2>
                    <p className="text-xs xs:text-sm sm:text-base font-mono max-w-sm xs:max-w-md sm:max-w-lg" style={{ color: 'var(--theme-accent)' }}>
                        {SKILLS_DESC_TITLE}
                    </p>
                </div>

                {/* Expertise Grid - Modern Cybernetic Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gradient-to-br to-transparent p-1 border" style={{ backgroundImage: `linear-gradient(to bottom right, var(--theme-bg-primary), transparent)`, borderColor: 'var(--theme-border-primary)' }}>
                    {SKILLS_LIST.map((item, index) => (
                        <div
                            key={index}
                            className="group relative bg-black/40 border transition-all duration-300 p-4 xs:p-5 sm:p-6"
                            style={{ borderColor: "var(--theme-border-primary)" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--theme-border-secondary)";
                                setHoveredCard(index);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--theme-border-primary)";
                                setHoveredCard(null);
                            }}
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
                                    <h3
                                        className="font-mono text-sm xs:text-sm sm:text-base md:text-lg transition-colors duration-300"
                                        style={{
                                            color:
                                                hoveredCard === index
                                                    ? "var(--theme-accent)"
                                                    : "rgba(255, 255, 255, 0.9)",
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="text-xs xs:text-xs sm:text-sm leading-relaxed transition-colors duration-300"
                                        style={{
                                            color:
                                                hoveredCard === index
                                                    ? "rgba(209, 213, 219, 0.8)"
                                                    : "rgba(156, 163, 175, 0.8)",
                                        }}
                                    >
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
