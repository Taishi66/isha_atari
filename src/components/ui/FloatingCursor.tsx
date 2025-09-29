import { useEffect, useState, useCallback } from "react";

const PULSE_DURATION = 600;

type Pulse = { id: number };

const FloatingCursor = () => {
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [pulses, setPulses] = useState<Pulse[]>([]);
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

    const updateCursorPosition = useCallback((e: MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        setCursorPosition({ x, y });
    }, []);

    const triggerPulse = useCallback(() => {
        const id = Date.now() + Math.random();
        setPulses(prev => [...prev, { id }]);

        window.setTimeout(() => {
            setPulses(prev => prev.filter(pulse => pulse.id !== id));
        }, PULSE_DURATION);
    }, []);

    useEffect(() => {
        // Detect touch devices
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkTouchDevice();

        if (!isTouchDevice) {
            document.addEventListener("mousemove", updateCursorPosition);
            document.addEventListener("mousedown", triggerPulse);
        }

        return () => {
            document.removeEventListener("mousemove", updateCursorPosition);
            document.removeEventListener("mousedown", triggerPulse);
        };
    }, [updateCursorPosition, triggerPulse, isTouchDevice]);

    // Don't render on touch devices
    if (isTouchDevice) {
        return null;
    }

    return (
        <div
            className="fixed pointer-events-none z-50 w-24 lg:w-32 h-24 lg:h-32 -translate-x-1/2 -translate-y-1/2"
            style={{
                left: cursorPosition.x,
                top: cursorPosition.y,
                transition: 'transform 0.1s ease-out',
            }}
        >
            {/* Amplified cybernetic glow */}
            <div
                className="absolute inset-0 rounded-full blur-3xl opacity-80"
                style={{
                    background: 'radial-gradient(circle, rgba(0,217,255,0.25), rgba(0,217,255,0))',
                    filter: 'drop-shadow(0 0 12px rgba(0,217,255,0.45))',
                }}
            />

            {/* Animated rings on click */}
            {pulses.map(pulse => (
                <div
                    key={pulse.id}
                    className="absolute inset-0 rounded-full border animate-ping"
                    style={{
                        borderColor: 'rgba(0,217,255,0.3)',
                        animationDuration: '2.5s',
                    }}
                />
            ))}

            {/* Precise center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full opacity-90" style={{ backgroundColor: 'var(--theme-accent)' }} />
            </div>

            {/* Secondary ring indicator */}
            <div
                className="absolute inset-4 rounded-full border opacity-60"
                style={{
                    borderColor: 'var(--theme-border-active)',
                    boxShadow: '0 0 8px rgba(0,217,255,0.35)',
                }}
            />
        </div>
    );
};

export default FloatingCursor;
