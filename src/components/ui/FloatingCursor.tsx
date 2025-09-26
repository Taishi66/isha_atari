import { useEffect, useState, useCallback } from "react";

const FloatingCursor = () => {
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const updateCursorPosition = useCallback((e: MouseEvent) => {
    // Convert page coordinates to viewport coordinates for fixed positioning
    const x = e.clientX;
    const y = e.clientY;

    setCursorPosition({ x, y });
  }, []);

  useEffect(() => {
    // Use mousemove on document for better coverage
    document.addEventListener("mousemove", updateCursorPosition);

    return () => {
      document.removeEventListener("mousemove", updateCursorPosition);
    };
  }, [updateCursorPosition]);

  return (
    <div
      className="fixed pointer-events-none z-50 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: cursorPosition.x,
        top: cursorPosition.y,
        transition: 'all 0.1s ease-out',
      }}
    >
      {/* Minimal cybernetic glow - only visible, no automatic animation */}
      <div className="absolute inset-0 rounded-full blur-xl" style={{ backgroundColor: 'var(--theme-bg-active)' }} />

      {/* Precise center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 rounded-full opacity-60" style={{ backgroundColor: 'var(--theme-accent)' }} />
      </div>

      {/* Subtle ring indicator */}
      <div className="absolute inset-4 rounded-full border opacity-40" style={{ borderColor: 'var(--theme-border-primary)' }} />
    </div>
  );
};

export default FloatingCursor;
