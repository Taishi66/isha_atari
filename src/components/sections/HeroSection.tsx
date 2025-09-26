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
        <section className="min-h-screen flex items-center justify-center px-8 pt-16 relative">
            {/* System Status Bar */}
            <div className="absolute top-24 left-8 right-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400/60">
                        <div className="flex items-center space-x-4">
                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                            <span>SYSTEM_ACTIVE</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span>CPU: 42%</span>
                            <span>MEM: 68%</span>
                            <span>CONN: STABLE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full">
                {/* Main Interface Grid */}
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Primary Console - Left */}
                    <div className="col-span-12 lg:col-span-7">
                        {/* Header Matrix */}
                        <div className="mb-12">
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="w-2 h-2 border border-cyan-400/60 rotate-45 animate-pulse" />
                                <div className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
                                    {HERO_TOP_TITLE}
                                </div>
                            </div>

                            {/* Identity Display */}
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-6xl font-mono font-light tracking-wider leading-none">
                                    <span className="block text-white/95 glitch-text">
                                        {glitchText}
                                    </span>
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <div className="h-px w-16 bg-gradient-to-r from-cyan-400 to-transparent" />
                                    <p className="text-lg font-mono font-light text-cyan-300/80">
                                        {HERO_JOB_TITLE}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Panel */}
                        <div className="relative bg-black/30 border border-cyan-500/20 p-6 mb-8 group hover:border-cyan-400/30 transition-all duration-300">
                            {/* Corner indicators */}
                            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-mono text-cyan-400/60">DESCRIPTION_INTERFACE</div>
                                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                                </div>
                                <p className="text-sm text-gray-400/90 leading-relaxed font-light">
                                    {HERO_DESC}
                                </p>
                            </div>
                        </div>

                        {/* Technology Stack Matrix */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                                <div className="text-xs font-mono text-cyan-400/70 tracking-[0.2em]">
                                    CORE_TECHNOLOGIES
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {CORE_TECH.map((tech, index) => (
                                    <div
                                        key={tech}
                                        className="relative bg-black/40 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-all duration-300 p-3 cursor-pointer group"
                                    >
                                        {/* Hover-triggered active indicator */}
                                        <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />

                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-white/90 group-hover:text-cyan-300 transition-colors duration-300">
                                                {tech}
                                            </span>
                                            <span className="text-xs font-mono text-cyan-400/50">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terminal Interface - Right */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="space-y-6">
                            {/* Terminal Access Panel */}
                            <div
                                className="relative bg-black/40 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 p-6 cursor-pointer group"
                                onClick={onTerminalClick}
                            >
                                {/* Corner indicators */}
                                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-mono text-cyan-400/60">{CUBE_TITLE}</div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-xs font-mono text-green-400/80">READY</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300">
                                            <Terminal size={24} className="text-cyan-400/80" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-mono text-sm text-white/90 group-hover:text-cyan-300 transition-colors duration-300">
                                                ACCESS_TERMINAL
                                            </p>
                                            <p className="text-xs text-gray-400/80">
                                                Interactive command interface
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 pt-2">
                                        <Play size={12} className="text-cyan-400/60" />
                                        <span className="text-xs font-mono text-cyan-400/60">CLICK_TO_INITIALIZE</span>
                                    </div>
                                </div>

                                {/* Hover scan effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                                </div>
                            </div>

                            {/* System Status Modules */}
                            <div className="space-y-3">
                                <div className="text-xs font-mono text-cyan-400/60 tracking-[0.2em]">
                                    SYSTEM_MODULES
                                </div>

                                {['COMPONENT_SYSTEM', 'UI_RENDERER', 'STATE_MANAGER'].map((module, index) => (
                                    <div
                                        key={module}
                                        className={`relative bg-black/30 border p-3 transition-all duration-300 ${
                                            activeModule === index
                                                ? 'border-cyan-400/60 bg-cyan-400/5'
                                                : 'border-cyan-500/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-white/80">
                                                {module}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-1 h-1 rounded-full ${
                                                    activeModule === index ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                                                }`} />
                                                <span className={`text-xs font-mono ${
                                                    activeModule === index ? 'text-green-400' : 'text-gray-500'
                                                }`}>
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
