import {
  CORE_TECH,
  CUBE_TITLE,
  HERO_DESC,
  HERO_JOB_TITLE,
  HERO_TOP_TITLE,
} from "@/constants/ui";
import { Terminal } from "lucide-react";

const HeroSection = ({ glitchText }: { glitchText: string }) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-8 pt-20">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-xs font-mono text-cyan-400 tracking-widest">
                  {HERO_TOP_TITLE}
                </div>
                <h1 className="text-5xl lg:text-7xl font-light tracking-wider leading-none font-mono">
                  <span
                    className="block text-white glitch-text"
                    data-text="JC LAMY"
                  >
                    {glitchText}
                  </span>
                </h1>
                <div className="h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent"></div>
              </div>

              <div className="space-y-6 max-w-lg">
                <p className="text-xl font-light tracking-wide text-gray-300">
                  {HERO_JOB_TITLE}
                </p>
                <p className="text-gray-400 leading-relaxed font-light">
                  {HERO_DESC}
                </p>
              </div>
              {/* Tech Stack */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-cyan-400 tracking-widest"></div>
                <div className="flex flex-wrap gap-3">
                  {CORE_TECH.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200 transition-all duration-300 cursor-pointer"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cybernetic Visual Element */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative">
              <div className="w-64 h-64 border border-cyan-500/30 relative group">
                {/* Animated corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 transition-all duration-500 group-hover:w-12 group-hover:h-12"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 transition-all duration-500 group-hover:w-12 group-hover:h-12"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 transition-all duration-500 group-hover:w-12 group-hover:h-12"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 transition-all duration-500 group-hover:w-12 group-hover:h-12"></div>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Terminal size={48} className="text-cyan-400 mx-auto" />
                    <div className="text-xs font-mono text-gray-400">
                      {CUBE_TITLE}
                    </div>
                  </div>
                </div>

                {/* Scanning line */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
