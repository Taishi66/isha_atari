import { useEffect } from "react";

const useGlitchEffect = ({
  setGlitchText,
}: {
  setGlitchText: (text: string) => void;
}) => {
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const original = "JC LAMY";
      const glitched = original
        .split("")
        .map((char) =>
          Math.random() > 0.9
            ? String.fromCharCode(33 + Math.floor(Math.random() * 94))
            : char,
        )
        .join("");

      setGlitchText(glitched);

      setTimeout(() => setGlitchText(original), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);
};
export default useGlitchEffect;
