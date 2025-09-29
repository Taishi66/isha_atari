import { useEffect, useState } from "react";
import {
    CORE_TECH,
    CUBE_TITLE,
    HERO_DESC,
    HERO_JOB_TITLE,
    HERO_TOP_TITLE,
} from "@/constants/ui";
import { Terminal, Play } from "lucide-react";
import { useComponentPerformance } from "@/utils/performance";

interface HeroSectionProps {
    glitchText: string;
    onTerminalClick: () => void;
}

const HeroSection = ({ glitchText, onTerminalClick }: HeroSectionProps) => {
    const { recordRender } = useComponentPerformance('HeroSection');
    const [activeModule, setActiveModule] = useState<number>(0);
    const [hoveredTech, setHoveredTech] = useState<Record<string, boolean>>({}); // State to track hovered tech for toggle effect
    const [isTerminalHovered, setIsTerminalHovered] = useState<boolean>(false);

    useEffect(() => {
        recordRender();
    }, [recordRender]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveModule(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 relative">
            {/* System Status Bar */}
            <div className="absolute top-20 sm:top-24 lg:top-28 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }} />
                            <span className="text-xs">SYSTEM_ACTIVE</span>
                        </div>
                        <div className="hidden sm:flex items-center space-x-3 lg:space-x-6">
                            <span>CPU: 42%</span>
                            <span>MEM: 68%</span>
                            <span>CONN: STABLE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full">
                {/* Main Interface Grid */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 items-start">
                    {/* Primary Console - Left */}
                    <div className="lg:col-span-7">
                        {/* Header Matrix */}
                        <div className="mb-12">
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="w-2 h-2 border rotate-45 animate-pulse" style={{ borderColor: 'var(--theme-border-secondary)' }} />
                                <div className="text-xs font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                                    {HERO_TOP_TITLE}
                                </div>
                            </div>

                            {/* Identity Display */}
                            <div className="space-y-4 lg:space-y-6">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-mono font-light tracking-wider leading-tight">
                                    <span className="block text-white/95 glitch-text">
                                        {glitchText}
                                    </span>
                                </h1>
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="h-px w-12 sm:w-16 bg-gradient-to-r to-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--theme-primary), transparent)` }} />
                                    <p className="text-sm sm:text-base lg:text-lg font-mono font-light" style={{ color: 'var(--theme-accent)' }}>
                                        {HERO_JOB_TITLE}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Panel */}
                        <div className="relative bg-black/40 border p-4 sm:p-6 mb-6 sm:mb-8 group transition-all duration-300" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}>
                            {/* Corner indicators */}
                            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
                            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>DESCRIPTION_INTERFACE</div>
                                    <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
                                </div>
                                <p className="text-sm sm:text-base text-gray-400/90 leading-relaxed font-light">
                                    {HERO_DESC}
                                </p>
                            </div>
                        </div>

                        {/* Technology Stack Matrix */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }} />
                                <div className="text-xs font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                                    CORE_TECHNOLOGIES
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                                {CORE_TECH.map((tech, index) => (
                                    <div
                                        key={tech}
                                        className="relative bg-black/40 border p-3 sm:p-4 cursor-pointer group transition-all duration-300 min-h-[44px] flex items-center"
                                        style={{
                                            borderColor: hoveredTech[tech] ? 'var(--theme-border-secondary)' : 'var(--theme-border-primary)',
                                            backgroundColor: hoveredTech[tech] ? 'var(--theme-bg-active)' : 'transparent',
                                        }}
                                        onMouseEnter={() => setHoveredTech(prev => ({ ...prev, [tech]: !prev[tech] }))}
                                        onMouseLeave={() => { /* State persists, do nothing on leave */ }}
                                    >
                                        {/* Hover-triggered active indicator */}
                                        <div className="absolute top-1 right-1 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" style={{ backgroundColor: 'var(--theme-primary)' }} />

                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-xs sm:text-sm font-mono text-white/90 transition-colors duration-300" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}>
                                                {tech}
                                            </span>
                                            <span className="text-xs font-mono ml-2" style={{ color: 'var(--theme-text-muted)' }}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terminal Interface - Right */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="space-y-6">
                            {/* Terminal Access Panel */}
                            <div
                                className="relative bg-black/40 border p-4 sm:p-6 cursor-pointer group transition-all duration-300 min-h-[44px]"
                                style={{ borderColor: 'var(--theme-border-primary)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'; setIsTerminalHovered(true); }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border-primary)'; setIsTerminalHovered(false); }}
                                onClick={onTerminalClick}
                            >
                                {/* Corner indicators */}
                                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />
                                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: 'var(--theme-border-active)' }} />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>{CUBE_TITLE}</div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-success)' }} />
                                            <span className="text-xs font-mono" style={{ color: 'var(--theme-success)' }}>READY</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 border transition-all duration-300" style={{ borderColor: 'var(--theme-border-primary)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-secondary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-primary)'}>
                                            <Terminal size={24} style={{ color: 'var(--theme-primary)' }} />
                                        </div>
                                        <div className="space-y-1">
                                            <p
                                                className="font-mono text-sm transition-colors duration-300"
                                                style={{
                                                    color: isTerminalHovered
                                                        ? "var(--theme-accent)"
                                                        : "rgba(255, 255, 255, 0.9)",
                                                }}
                                            >
                                                ACCESS_TERMINAL
                                            </p>
                                            <p
                                                className="text-xs transition-colors duration-300"
                                                style={{
                                                    color: isTerminalHovered
                                                        ? "rgba(209, 213, 219, 0.8)"
                                                        : "rgba(156, 163, 175, 0.8)",
                                                }}
                                            >
                                                Interactive command interface
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 pt-2">
                                        <Play size={12} style={{ color: 'var(--theme-text-muted)' }} />
                                        <span className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>CLICK_TO_INITIALIZE</span>
                                    </div>
                                </div>

                                {/* Hover scan effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, var(--theme-primary), transparent)` }} />
                                </div>
                            </div>

                            {/* System Status Modules */}
                            <div className="space-y-3">
                                <div className="text-xs font-mono tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                                    SYSTEM_MODULES
                                </div>

                                {['COMPONENT_SYSTEM', 'UI_RENDERER', 'STATE_MANAGER'].map((module, index) => (
                                    <div
                                        key={module}
                                        className="relative bg-black/30 border p-3 transition-all duration-300"
                                        style={{
                                            borderColor: activeModule === index ? 'var(--theme-border-secondary)' : 'var(--theme-border-primary)',
                                            backgroundColor: activeModule === index ? 'var(--theme-bg-active)' : 'transparent'
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-white/80">
                                                {module}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-1 h-1 rounded-full ${activeModule === index ? 'animate-pulse' : ''}`}
                                                    style={{ backgroundColor: activeModule === index ? 'var(--theme-success)' : '#6B7280' }}
                                                />
                                                <span
                                                    className="text-xs font-mono"
                                                    style={{ color: activeModule === index ? 'var(--theme-success)' : '#6B7280' }}
                                                >
                                                    {activeModule === index ? 'ACTIVE' : 'STANDBY'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
