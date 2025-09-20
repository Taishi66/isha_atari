export const TERMINAL_STYLES = {
  overlay: {
    base: "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-out",
    open: "opacity-100 backdrop-blur-sm bg-black/50",
    closed: "opacity-0 pointer-events-none",
  },

  window: {
    base: `
      relative bg-black border-2 border-cyan-500/50 rounded-lg overflow-hidden
      transition-all duration-700 ease-out font-mono shadow-2xl shadow-cyan-500/20
      transform-gpu
    `,
    open: "scale-100 opacity-100",
    closed: "scale-75 opacity-0",
    normal: "w-4/5 max-w-4xl h-3/4 max-h-[600px]",
    maximized: "w-full h-full",
  },

  header: {
    container:
      "flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-cyan-500/30",
    leftSection: "flex items-center space-x-3",
    title: "text-cyan-400 text-sm font-mono",
    controls: "flex items-center space-x-2",
    button: "text-gray-400 hover:text-cyan-400 transition-colors duration-200",
    closeButton:
      "text-gray-400 hover:text-red-400 transition-colors duration-200",
  },

  content: {
    container: "flex flex-col h-full",
    output: "flex-1 p-4 overflow-y-auto bg-black/90",
    outputInner: "space-y-1 text-sm",
    input: {
      container: "px-4 py-2 border-t border-cyan-500/30 bg-gray-900/30",
      wrapper: "flex items-center space-x-2 text-sm",
      prompt: "text-cyan-400",
      field:
        "flex-1 bg-transparent text-orange-400 outline-none font-mono placeholder:text-orange-400/60",
    },
  },

  decorations: {
    borders: "absolute inset-0 pointer-events-none",
    cornerBorder: "absolute w-8 h-8 border-cyan-400",
    topLeft: "top-0 left-0 border-t-2 border-l-2",
    topRight: "top-0 right-0 border-t-2 border-r-2",
    bottomLeft: "bottom-0 left-0 border-b-2 border-l-2",
    bottomRight: "bottom-0 right-0 border-b-2 border-r-2",
    scanLine: {
      container: "absolute inset-0 overflow-hidden pointer-events-none",
      line: "w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan2",
    },
  },
} as const;

export const combineClasses = (
  ...classes: (string | undefined | false)[]
): string => {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
};
