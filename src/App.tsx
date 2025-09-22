import { useEffect, useState } from "react";
import {
    Header,
    Footer,
    HeroSection,
    ExpertiseSection,
    ContactSection,
    FloatingCursor,
    TerminalWindow,
    ErrorBoundary,
} from "@/components";
import { useGlitchEffect } from "@/hooks";

function App() {
    const { glitchText } = useGlitchEffect({ text: "JC LAMY" });
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

    const handleTerminalToggle = () => {
        setIsTerminalOpen(!isTerminalOpen);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-black text-white overflow-hidden relative">
                {/* Cybernetic Grid Background */}
                <div className="fixed inset-0 opacity-5">
                    <div className="absolute inset-0 cybergrid-color"></div>
                </div>
                <FloatingCursor />

                <main className="relative z-10">
                    <Header
                        currentTime={currentTime}
                        onTerminalClick={handleTerminalToggle}
                    />
                    <HeroSection
                        glitchText={glitchText}
                        onTerminalClick={handleTerminalToggle}
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
        </ErrorBoundary>
    );
}

export default App;