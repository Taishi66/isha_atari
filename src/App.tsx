import { useEffect, useState } from "react";
import {
  Header,
  Footer,
  HeroSection,
  ExpertiseSection,
  ContactSection,
  FloatingCursor,
} from "@/components";
import { useGlitchEffect } from "./hooks";

function App() {
  const [glitchText, setGlitchText] = useState<string>("JC LAMY");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

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
      <FloatingCursor />

      <main className="relative z-10">
        <Header currentTime={currentTime} />
        <HeroSection glitchText={glitchText} />
        <ExpertiseSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
