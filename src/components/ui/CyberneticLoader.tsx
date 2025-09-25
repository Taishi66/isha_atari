/**
 * Cybernetic Loading Bar Component
 * @fileoverview Smooth, minimalistic loading animation for website initialization
 */

import { useState, useEffect, useRef } from 'react';

interface CyberneticLoaderProps {
    readonly onComplete: () => void;
    readonly duration?: number;
    readonly className?: string;
}

// Removed progressKeyframes as it's no longer used for linear progression

const CyberneticLoader = ({
    onComplete,
    duration = 4000,
    className = ''
}: CyberneticLoaderProps) => {
    const [stage, setStage] = useState<'initializing' | 'loading' | 'completing' | 'done'>('initializing');
    const [loadingText, setLoadingText] = useState('INITIALIZING CYBERNETIC INTERFACE');
    const [isVisible, setIsVisible] = useState(true);
    const [displayProgress, setDisplayProgress] = useState(0);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        // Text change timeline
        const textTimers = [
            setTimeout(() => setLoadingText('LOADING PORTFOLIO DATA'), duration * 0.2),
            setTimeout(() => setLoadingText('CONNECTING TO NEURAL NETWORK'), duration * 0.45),
            setTimeout(() => setLoadingText('CALIBRATING VISUAL SYSTEMS'), duration * 0.7),
            setTimeout(() => setLoadingText('SYSTEM READY • ENGAGE'), duration * 0.9),
        ];

        // Stage change timeline
        const stageTimers = [
            setTimeout(() => setStage('loading'), duration * 0.1),
            setTimeout(() => setStage('completing'), duration * 0.9),
            setTimeout(() => setStage('done'), duration * 0.98),
        ];

        const startTime = Date.now();

        const animateProgress = () => {
            const elapsed = (Date.now() - startTime) / duration;
            const clampedElapsed = Math.min(elapsed, 1);

            // Direct linear calculation for smooth 0-100% progression
            const currentValue = clampedElapsed * 100;

            setDisplayProgress(currentValue);

            if (clampedElapsed < 1) {
                animationFrameId.current = requestAnimationFrame(animateProgress);
            } else {
                // Ensure it always lands exactly on 100
                setDisplayProgress(100);
            }
        };

        animationFrameId.current = requestAnimationFrame(animateProgress);

        // Final completion
        const completionTimer = setTimeout(() => {
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(onComplete, 600);
            }, 800);
        }, duration);

        return () => {
            [...textTimers, ...stageTimers, completionTimer].forEach(clearTimeout);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [duration, onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-all duration-700 ease-out ${!isVisible ? 'opacity-0 pointer-events-none scale-110 blur-md' : 'opacity-100 scale-100 blur-0'
                } ${className}`}
        >
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/20 via-transparent to-[#00D9FF]/20"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Main loading container */}
            <div className="relative z-10 w-full max-w-2xl px-8">

                {/* System header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-2 h-2 bg-[#00D9FF] animate-pulse rounded-full" />
                        <h1 className="text-2xl font-mono font-bold text-[#00D9FF] tracking-wider">
                            ISHA ATARI
                        </h1>
                        <div className="w-2 h-2 bg-[#00D9FF] animate-pulse rounded-full" />
                    </div>
                    <p className="text-sm font-mono text-[#00D9FF]/70 tracking-widest">
                        PORTFOLIO SYSTEM v2.4.1
                    </p>
                </div>

                {/* Loading text */}
                <div className="text-center mb-8 h-8 relative">
                    <div className={`font-mono text-sm text-[#00D9FF]/80 mb-2 transition-opacity duration-300 absolute inset-0 flex items-center justify-center ${stage === 'done' ? 'opacity-0' : 'opacity-100'}`}>
                        {loadingText}
                    </div>
                    <div
                        className={`text-green-400 text-sm font-mono tracking-wider absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${stage === 'done' ? 'opacity-100 animate-fade-in-out' : 'opacity-0'}`}
                        style={{
                            textShadow: stage === 'done' ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
                        }}
                    >
                        COMPLETE
                    </div>
                </div>

                {/* Progress bar container */}
                <div className="relative">
                    {/* Progress bar background */}
                    <div className="w-full h-1 bg-gray-800/50 rounded-full overflow-hidden border border-[#00D9FF]/20">

                        {/* Progress fill */}
                        <div
                            className={`h-full relative transition-all duration-200 ease-out ${stage === 'done'
                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                : stage === 'completing'
                                    ? 'bg-gradient-to-r from-[#00D9FF] to-green-400'
                                    : 'bg-[#00D9FF]'
                                }`}
                            style={{
                                width: `${Math.floor(displayProgress)}%`,
                                boxShadow:
                                    stage === 'done'
                                        ? '0 0 20px rgba(34, 197, 94, 0.8)'
                                        : '0 0 10px rgba(0, 217, 255, 0.5)',
                            }}
                        >
                            {/* Animated glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${stage !== 'done' ? 'animate-pulse' : ''}`} />

                            {/* Moving scanning line */}

                        </div>
                    </div>

                    {/* Corner accent lines */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#00D9FF]/40" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#00D9FF]/40" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#00D9FF]/40" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#00D9FF]/40" />
                </div>

                {/* Progress percentage */}
                <div className="text-center mt-6">
                    <div
                        className={`font-mono text-lg transition-all duration-300 ${stage === 'done' ? 'text-green-400' : stage === 'completing' ? 'text-green-400' : 'text-[#00D9FF]'
                            }`}
                    >
                        {Math.floor(displayProgress)}%
                    </div>
                </div>

                {/* System status indicators */}
                <div className="flex justify-between items-center mt-8 text-xs font-mono text-[#00D9FF]/60">
                    <div className="flex items-center space-x-2">
                        <div className={`w-1 h-1 rounded-full ${stage === 'initializing' ? 'bg-yellow-400' :
                            stage === 'loading' ? 'bg-[#00D9FF]' :
                                stage === 'completing' ? 'bg-green-400' : 'bg-gray-400'
                            } ${stage !== 'done' ? 'animate-pulse' : ''}`} />
                        <span>SYSTEM STATUS</span>
                    </div>
                    <div>
                        {stage === 'initializing' && 'INIT'}
                        {stage === 'loading' && 'ACTIVE'}
                        {stage === 'completing' && 'READY'}
                        {stage === 'done' && 'COMPLETE'}
                    </div>
                </div>

                {/* Scanning line effect */}

            </div>
        </div>
    );
};

export default CyberneticLoader;