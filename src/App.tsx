import { useEffect, useState } from "react";
import { Footer } from "./components/layout/Footer";
import {
  Mail,
  Linkedin,
  Terminal,
  Code,
  Contrast,
  TrendingUp,
  Github,
} from "lucide-react";
import {
  CORE_TECH,
  CUBE_TITLE,
  CURSOR_GLOW_TRANSITION,
  HEADER_ONLINE,
  HERO_DESC,
  HERO_JOB_TITLE,
  HERO_TOP_TITLE,
  LOCATION,
  SKILLS_DESC,
  SKILLS_DESC_TITLE,
  SKILLS_LIST,
  SKILLS_SUBTITLE,
  SKILLS_TITLE,
} from "./constants/ui";
import { Header } from "./components/layout/Header";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState("JC LAMY");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const original = "JC LAMY";
      const glitched = original
        .split("")
        .map((char) =>
          Math.random() > 0.9
            ? String.fromCharCode(33 + Math.floor(Math.random() * 94))
            : char,
        )
        .join("");

      setGlitchText(glitched);

      setTimeout(() => setGlitchText(original), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Cybernetic Grid Background */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating Cursor Glow */}
      <div
        className={`fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl bg-cyan-400 transition-all duration-${CURSOR_GLOW_TRANSITION}`}
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <main className="relative z-10">
        {/* Header with System Info */}
        <Header currentTime={currentTime} />

        {/* Hero Section */}
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

        {/* Expertise Section */}
        <section className="py-32 px-8 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="text-xs font-mono text-cyan-400 tracking-widest">
                    {SKILLS_TITLE}
                  </div>
                  <h2 className="text-3xl font-light font-mono">
                    {SKILLS_SUBTITLE}
                  </h2>
                  <div className="h-px w-24 bg-gradient-to-r from-cyan-400 to-transparent"></div>
                </div>
              </div>
              <div className="space-y-12">
                <div className="space-y-8">
                  <p className="text-lg leading-relaxed text-gray-300 font-light font-mono">
                    {SKILLS_DESC_TITLE}
                  </p>
                  <p className="text-gray-400 leading-relaxed font-light">
                    {SKILLS_DESC}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {SKILLS_LIST.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 group cursor-pointer"
                    >
                      <div className="p-2 border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300">
                        <item.icon size={20} className="text-cyan-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-mono text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-32 px-8 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="text-xs font-mono text-cyan-400 tracking-widest">
                    ESTABLISH_CONNECTION
                  </div>
                  <h2 className="text-3xl font-light font-mono">
                    Let's Collaborate
                  </h2>
                  <div className="h-px w-24 bg-gradient-to-r from-cyan-400 to-transparent"></div>
                </div>

                <p className="text-gray-400 leading-relaxed font-light">
                  Open to contract work, product collaborations, and frontend
                  consulting. Available for remote positions and short-term
                  engagements.
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
                  <span className="font-light">lamypro66@gmail.com</span>
                </a>

                <div className="space-y-6">
                  <div className="text-xs font-mono text-cyan-400 tracking-widest">
                    SOCIAL_NETWORKS
                  </div>
                  <div className="flex space-x-4">
                    {[
                      { icon: Linkedin, label: "LinkedIn" },
                      { icon: Github, label: "GitHub" },
                    ].map((social, index) => (
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
                    <p>PARIS, FRANCE [48.8566°N, 2.3522°E]</p>
                    <p>REMOTE_WORK_ENABLED: TRUE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}

export default App;
