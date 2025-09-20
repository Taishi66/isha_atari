import { useEffect, useState } from "react";

const FloatingCursor = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl bg-cyan-400"
      style={{
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
      }}
    ></div>
  );
};

export default FloatingCursor;
