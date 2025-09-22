export const TERMINAL_STYLES = {
  overlay: {
    base: "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-out",
    open: "opacity-100 backdrop-blur-sm bg-black/50",
    closed: "opacity-0 pointer-events-none",
  },

  window: {
    base: `
      relative bg-black border-2 border-[#00D9FF]/50 rounded-lg overflow-hidden
      transition-all duration-700 ease-out font-mono shadow-2xl shadow-[#00D9FF]/20
      transform-gpu flex flex-col
    `,
    open: "scale-100 opacity-100",
    closed: "scale-75 opacity-0",
    normal: "w-4/5 max-w-4xl h-3/4 max-h-[600px] min-h-[400px]",
    maximized: "w-full h-full max-h-screen",
  },

  header: {
    container:
      "flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-[#00D9FF]/30 flex-shrink-0",
    leftSection: "flex items-center space-x-3",
    title: "text-[#00D9FF] text-sm font-mono font-semibold",
    controls: "flex items-center space-x-2",
    button: "text-gray-400 hover:text-[#00D9FF] transition-colors duration-200",
    closeButton:
      "text-gray-400 hover:text-red-400 transition-colors duration-200",
  },

  content: {
    container: "relative flex flex-col h-full min-h-0",
    output: "flex-1 p-4 overflow-y-auto bg-black/90 min-h-0 relative",
    outputInner: "space-y-1 text-sm relative z-10",
    input: {
      container: "flex-shrink-0 px-4 py-3 border-t border-[#00D9FF]/30 bg-gray-900/30 relative z-10",
      wrapper: "flex items-center space-x-2 text-sm",
      prompt: "text-[#00D9FF] select-none flex-shrink-0",
      field:
        "flex-1 bg-transparent text-[#FFFFFF] outline-none font-mono placeholder:text-[#FFFFFF]/60 focus:ring-0 focus:border-none min-w-0",
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
