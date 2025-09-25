import { useEffect, useState, useCallback } from "react";
import {
    Header,
    Footer,
    HeroSection,
    ExpertiseSection,
    ContactSection,
    FloatingCursor,
    TerminalWindow,
    CyberneticLoader,
    ErrorBoundary,
} from "@/components";
import { useGlitchEffect } from "@/hooks";

function App() {
    const { glitchText } = useGlitchEffect({ text: "ISHA ATARI" });
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleTerminalToggle = useCallback(() => {
        setIsTerminalOpen((prev) => !prev);
    }, []);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <ErrorBoundary>
            {/* Cybernetic Loader */}
            {isLoading && (
                <CyberneticLoader
                    onComplete={handleLoadingComplete}
                    duration={4500} // 4.5 seconds for enjoyable experience
                />
            )}

            {/* Main Application */}
            <div className={`min-h-screen bg-black text-white overflow-hidden relative transition-all duration-1000 ease-out ${isLoading
                    ? 'opacity-0 scale-105 blur-sm'
                    : 'opacity-100 scale-100 blur-0'
                }`}>
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