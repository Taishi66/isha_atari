export const TERMINAL_STYLES = {
  overlay: {
    base: "fixed inset-0 z-50 transition-all duration-700 ease-out",
    open: "opacity-100 backdrop-blur-sm bg-black/50",
    closed: "opacity-0 pointer-events-none",
    normal: "flex items-center justify-center p-1 xs:p-2 sm:p-3 md:p-4",
    maximized: "p-0",
  },

  window: {
    base: `
      relative bg-black border-[#00D9FF]/50 overflow-hidden
      font-mono shadow-2xl shadow-[#00D9FF]/20 flex flex-col
      transition-all duration-800 cubic-bezier(0.16, 1, 0.3, 1)
    `,
    open: "opacity-100 transform-none",
    closed: "opacity-0 pointer-events-none transform scale-95",
    normal: `w-[98vw] xs:w-[95vw] sm:w-[90vw] md:w-4/5 lg:w-3/4 max-w-4xl
             h-[95vh] xs:h-[92vh] sm:h-[85vh] md:h-3/4
             max-h-[500px] xs:max-h-[550px] sm:max-h-[600px] md:max-h-[650px]
             min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] md:min-h-[400px]
             transition-all duration-800 cubic-bezier(0.16, 1, 0.3, 1)
             hover:shadow-[0_0_30px_rgba(0,217,255,0.3)]`,
    maximized: `w-screen h-screen max-w-none max-h-none min-h-screen
                transition-all duration-800 cubic-bezier(0.16, 1, 0.3, 1)
                shadow-[0_0_50px_rgba(0,217,255,0.4)]`,
  },

  header: {
    container:
      "flex items-center justify-between px-2 xs:px-3 sm:px-4 py-2 xs:py-2 sm:py-3 bg-gray-900/90 border-b border-[#00D9FF]/30 flex-shrink-0",
    leftSection: "flex items-center space-x-2 xs:space-x-2 sm:space-x-3",
    title: "text-[#00D9FF] text-xs xs:text-sm sm:text-base font-mono font-semibold",
    controls: "flex items-center space-x-1 sm:space-x-2",
    button: "text-gray-400 hover:text-[#00D9FF] transition-colors duration-200 p-1 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center",
    closeButton:
      "text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center",
  },

  content: {
    container: "relative flex flex-col h-full min-h-0",
    output: "flex-1 p-2 xs:p-3 sm:p-4 md:p-5 overflow-y-auto bg-black/90 min-h-0 relative",
    outputInner: "space-y-1 text-xs xs:text-xs sm:text-sm md:text-base relative z-10",
    input: {
      container: "flex-shrink-0 px-2 xs:px-3 sm:px-4 py-2 xs:py-2 sm:py-3 border-t border-[#00D9FF]/30 bg-gray-900/30 relative z-10",
      wrapper: "flex items-center space-x-2 text-xs xs:text-xs sm:text-sm md:text-base",
      prompt: "text-[#00D9FF] select-none flex-shrink-0",
      field:
        "flex-1 bg-transparent text-[#FFFFFF] outline-none font-mono placeholder:text-[#FFFFFF]/60 focus:ring-0 focus:border-none min-w-0 text-xs xs:text-xs sm:text-sm md:text-base",
    },
  },

  decorations: {
    borders: "absolute inset-0 pointer-events-none",
    cornerBorder: "absolute w-8 h-8 border-[#00D9FF]",
    topLeft: "top-0 left-0 border-t-2 border-l-2",
    topRight: "top-0 right-0 border-t-2 border-r-2",
    bottomLeft: "bottom-0 left-0 border-b-2 border-l-2",
    bottomRight: "bottom-0 right-0 border-b-2 border-r-2",
    scanLine: {
      container: "absolute inset-0 overflow-hidden pointer-events-none",
      line: "w-full h-px bg-gradient-to-r from-transparent via-[#00D9FF]/25 to-transparent animate-scanSlow",
    },
  },
} as const;

export const combineClasses = (
  ...classes: (string | undefined | false)[]
): string => {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
};
