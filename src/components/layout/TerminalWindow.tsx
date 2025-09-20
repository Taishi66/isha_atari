import { useEffect, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalWindow = ({ isOpen, onClose }: TerminalWindowProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Initialize terminal with welcome message
      setTerminalLines([
        "CYBERNETIC TERMINAL v2.4.1",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "System initialized successfully",
        "Type 'help' for available commands",
        "",
      ]);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    const newLines = [...terminalLines, `$ ${cmd}`];

    switch (cmd.toLowerCase().trim()) {
      case "help":
        newLines.push(
          "Available commands:",
          "  help     - Show this help message",
          "  clear    - Clear terminal",
          "  about    - About this system",
          "  exit     - Close terminal",
        );
        break;
      case "clear":
        setTerminalLines([]);
        return;
      case "about":
        newLines.push(
          "CYBERNETIC PORTFOLIO SYSTEM",
          "Built with React + TypeScript",
          "Designed for the future",
        );
        break;
      case "exit":
        onClose();
        return;
      default:
        newLines.push(`Command not found: ${cmd}`);
    }

    newLines.push("");
    setTerminalLines(newLines);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen
          ? "opacity-100 backdrop-blur-sm bg-black/50"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Terminal Window */}
      <div
        className={`
        relative bg-black border-2 border-cyan-500/50 rounded-lg overflow-hidden
        transition-all duration-500 ease-out font-mono
        ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        ${isMaximized ? "w-full h-full" : "w-4/5 max-w-4xl h-3/4 max-h-[600px]"}
        shadow-2xl shadow-cyan-500/20
      `}
      >
        {/* Cybernetic border effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
        </div>

        {/* Scanning line animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan2"></div>
        </div>

        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-cyan-400 text-sm font-mono">
              terminal@cybernetic:~
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-400 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex flex-col h-full">
          {/* Output Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-black/90">
            <div className="space-y-1 text-sm">
              {terminalLines.map((line, index) => (
                <div
                  key={index}
                  className={`
                    ${line.startsWith("$") ? "text-cyan-400" : "text-green-400"}
                    ${line.includes("━") ? "text-cyan-500" : ""}
                    ${line.includes("CYBERNETIC") ? "text-cyan-300 font-bold" : ""}
                    animate-pulse duration-75
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {line || "\u00A0"}
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-4 py-2 border-t border-cyan-500/30 bg-gray-900/30">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-cyan-400">$</span>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-green-400 outline-none font-mono placeholder:text-cyan-400/60"
                placeholder="Type a command..."
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalWindow;
