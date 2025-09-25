/**
 * Advanced Glitch Effect Hook
 * @fileoverview Enhanced glitch effect with performance optimization and customization
 */

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
// ============================================================================
// LOCAL TYPES (to avoid circular dependencies)
// ============================================================================

interface UseGlitchEffectReturn {
    readonly glitchText: string;
    readonly isGlitching: boolean;
    readonly triggerGlitch: () => void;
}

// ============================================================================
// TYPES
// ============================================================================

interface UseGlitchEffectProps {
    readonly text?: string;
    readonly interval?: number;
    readonly glitchDuration?: number;
    readonly intensity?: number;
    readonly enabled?: boolean;
    readonly onGlitch?: (glitchedText: string) => void;
    readonly randomnessFactor?: number; // New prop for random interval
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_TEXT = "JC LAMY";
const DEFAULT_INTERVAL = 3000;
const DEFAULT_GLITCH_DURATION = 100;
const DEFAULT_INTENSITY = 0.1;

// Character sets for different glitch types
const GLITCH_CHARS = {
    cybernetic: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    matrix: "ﾊﾐﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋﾏﾍﾋ",
    digital: "01",
    symbols: "▓▒░█",
    unicode: "▀▄█▌▐▟▙▜▛",
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getRandomChar = (charset: string): string => {
    return charset[Math.floor(Math.random() * charset.length)] || '';
};

const createGlitchedText = (
    originalText: string,
    intensity: number,
    charset: string = GLITCH_CHARS.cybernetic
): string => {
    return originalText
        .split("")
        .map((char) => {
            if (char === " ") return char; // Preserve spaces
            return Math.random() < intensity ? getRandomChar(charset) : char;
        })
        .join("");
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useGlitchEffect = ({
    text = DEFAULT_TEXT,
    interval = DEFAULT_INTERVAL,
    glitchDuration = DEFAULT_GLITCH_DURATION,
    intensity = DEFAULT_INTENSITY,
    enabled = true,
    onGlitch,
    randomnessFactor = 0.5, // Default randomness
}: UseGlitchEffectProps = {}): UseGlitchEffectReturn => {
    const [currentText, setCurrentText] = useState<string>(text);
    const [isGlitching, setIsGlitching] = useState<boolean>(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ============================================================================
    // MEMOIZED VALUES
    // ============================================================================

    const glitchCharset = useMemo(() => {
        // Combine multiple character sets for more variety
        return GLITCH_CHARS.cybernetic + GLITCH_CHARS.symbols;
    }, []);

    // ============================================================================
    // GLITCH FUNCTION
    // ============================================================================

    const triggerGlitch = useCallback(() => {
        if (!enabled) return;

        setIsGlitching(true);

        // Create multiple glitch frames for more realistic effect
        const glitchFrames = 3;
        let currentFrame = 0;

        const animateGlitch = () => {
            if (currentFrame < glitchFrames) {
                const glitchedText = createGlitchedText(text, intensity, glitchCharset);
                setCurrentText(glitchedText);

                // Call callback if provided
                if (onGlitch) {
                    onGlitch(glitchedText);
                }

                currentFrame++;

                // Shorter delays between frames for more frantic effect
                glitchTimeoutRef.current = setTimeout(animateGlitch, glitchDuration / glitchFrames);
            } else {
                // Reset to original text
                setCurrentText(text);
                setIsGlitching(false);

                if (onGlitch) {
                    onGlitch(text);
                }
            }
        };

        animateGlitch();
    }, [text, intensity, glitchDuration, glitchCharset, enabled, onGlitch]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Main glitch interval effect
    useEffect(() => {
        if (!enabled) {
            setCurrentText(text);
            return;
        }

        const scheduleNextGlitch = (delay: number) => {
            intervalRef.current = setTimeout(() => {
                triggerGlitch();
                const randomDelay = delay * (1 - randomnessFactor) + (Math.random() * delay * 2 * randomnessFactor);
                scheduleNextGlitch(randomDelay);
            }, delay);
        };

        // Initial delay before first glitch, with some randomness
        const initialRandomDelay = interval * (1 - randomnessFactor) + (Math.random() * interval * 2 * randomnessFactor);
        scheduleNextGlitch(initialRandomDelay);

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
            if (glitchTimeoutRef.current) {
                clearTimeout(glitchTimeoutRef.current);
            }
        };
    }, [text, interval, enabled, triggerGlitch, randomnessFactor]);

    // Update text when prop changes
    useEffect(() => {
        if (!isGlitching) {
            setCurrentText(text);
        }
    }, [text, isGlitching]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
            if (glitchTimeoutRef.current) {
                clearTimeout(glitchTimeoutRef.current);
            }
        };
    }, []);

    // ============================================================================
    // PERFORMANCE OPTIMIZATION
    // ============================================================================

    // Pause glitch effect when tab is not visible (performance optimization)
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Pause
                if (intervalRef.current) {
                    clearTimeout(intervalRef.current);
                }
                if (glitchTimeoutRef.current) {
                    clearTimeout(glitchTimeoutRef.current);
                }
            } else {
                // Resume with random delay
                if (enabled && !intervalRef.current) {
                    const randomDelay = interval * (1 - randomnessFactor) + (Math.random() * interval * 2 * randomnessFactor);
                    scheduleNextGlitch(randomDelay); // Need to call the local function here
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled, interval, triggerGlitch, randomnessFactor]); // Added randomnessFactor to dependencies

    // ============================================================================
    // RETURN VALUE
    // ============================================================================

    return useMemo<UseGlitchEffectReturn>(() => ({
        glitchText: currentText,
        isGlitching,
        triggerGlitch,
    }), [currentText, isGlitching, triggerGlitch]);
};

// ============================================================================
// LEGACY COMPATIBILITY HOOK
// ============================================================================

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useGlitchEffect instead
 */
export default function useGlitchEffectLegacy({
    setGlitchText,
}: {
    setGlitchText: (text: string) => void;
}) {
    const { glitchText } = useGlitchEffect({
        onGlitch: setGlitchText,
    });

    // Set initial text
    useEffect(() => {
        setGlitchText(glitchText);
    }, [glitchText, setGlitchText]);
}

// ============================================================================
// ADVANCED GLITCH VARIANTS
// ============================================================================

/**
 * Matrix-style glitch effect
 */
export const useMatrixGlitch = (props?: Omit<UseGlitchEffectProps, 'intensity'>) => {
    return useGlitchEffect({
        ...props,
        intensity: 0.3,
    });
};

/**
 * Subtle corporate glitch effect
 */
export const useSubtleGlitch = (props?: Omit<UseGlitchEffectProps, 'intensity' | 'interval'>) => {
    return useGlitchEffect({
        ...props,
        intensity: 0.05,
        interval: 5000,
    });
};

/**
 * Intense cyberpunk glitch effect
 */
export const useIntenseGlitch = (props?: Omit<UseGlitchEffectProps, 'intensity' | 'glitchDuration'>) => {
    return useGlitchEffect({
        ...props,
        intensity: 0.4,
        glitchDuration: 200,
    });
};