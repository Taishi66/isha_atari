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
    const { glitchText } = useGlitchEffect({
        text: "ISHA ATARI",
        interval: 4000, // Base interval of 4 seconds
        randomnessFactor: 0.25, // Small randomness factor for tight control
        glitchDuration: 80, // Slightly longer but still snappy
        intensity: 0.12, // Reduced intensity for subtler effect
    });
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleTerminalToggle = useCallback(() => {
        setIsTerminalOpen((prev) => !prev);
    }, []);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
        // Scroll to top when loading is complete
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Prevent scrolling during loading
    useEffect(() => {
        if (isLoading) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Prevent scrolling by setting overflow hidden on body
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
        } else {
            // Restore scrolling
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';

            // Restore scroll position briefly, then scroll to top
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY.replace('px', '')) * -1);
            }
            // Immediately scroll to top
            setTimeout(() => window.scrollTo(0, 0), 0);
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        };
    }, [isLoading]);

    return (
        <ErrorBoundary>
            {/* Global FloatingCursor - outside overflow container */}
            <FloatingCursor />

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