import { useEffect, useState } from "react";
import {
  Header,
  Footer,
  HeroSection,
  ExpertiseSection,
  ContactSection,
  FloatingCursor,
  TerminalWindow,
} from "@/components";
import { useGlitchEffect } from "./hooks";

function App() {
  const [glitchText, setGlitchText] = useState<string>("JC LAMY");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useGlitchEffect({
    setGlitchText,
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Cybernetic Grid Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 cybergrid-color"></div>
      </div>
      <FloatingCursor />

      <main className="relative z-10">
        <Header
          currentTime={currentTime}
          onTerminalClick={() => setIsTerminalOpen(true)}
        />
        <HeroSection
          glitchText={glitchText}
          onTerminalClick={() => setIsTerminalOpen(true)}
        />
        <ExpertiseSection />
        <ContactSection />
        <Footer />
      </main>

      <TerminalWindow
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
  );
}

export default App;
