import { useEffect, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { useTerminal } from "@/hooks/useTerminal";
import { getLineClassName } from "@/utils/terminalCommands";
import { TERMINAL_STYLES, combineClasses } from "@/utils/terminalStyles";

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalWindow = ({ isOpen, onClose }: TerminalWindowProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    terminalLines,
    currentInput,
    setCurrentInput,
    isMaximized,
    handleKeyDown,
    toggleMaximize,
    inputRef,
    outputRef,
  } = useTerminal({ isOpen, onClose });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={combineClasses(
        TERMINAL_STYLES.overlay.base,
        isOpen ? TERMINAL_STYLES.overlay.open : TERMINAL_STYLES.overlay.closed,
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal Window"
    >
      <div
        className={combineClasses(
          TERMINAL_STYLES.window.base,
          isOpen ? TERMINAL_STYLES.window.open : TERMINAL_STYLES.window.closed,
          isMaximized
            ? TERMINAL_STYLES.window.maximized
            : TERMINAL_STYLES.window.normal,
        )}
      >
        {/* Cybernetic border effects */}
        <div className={TERMINAL_STYLES.decorations.borders}>
          <div
            className={combineClasses(
              TERMINAL_STYLES.decorations.cornerBorder,
              TERMINAL_STYLES.decorations.topLeft,
            )}
          />
          <div
            className={combineClasses(
              TERMINAL_STYLES.decorations.cornerBorder,
              TERMINAL_STYLES.decorations.topRight,
            )}
          />
          <div
            className={combineClasses(
              TERMINAL_STYLES.decorations.cornerBorder,
              TERMINAL_STYLES.decorations.bottomLeft,
            )}
          />
          <div
            className={combineClasses(
              TERMINAL_STYLES.decorations.cornerBorder,
              TERMINAL_STYLES.decorations.bottomRight,
            )}
          />
        </div>

        {/* Scanning line animation */}
        <div className={TERMINAL_STYLES.decorations.scanLine.container}>
          <div className={TERMINAL_STYLES.decorations.scanLine.line} />
        </div>

        {/* Terminal Header */}
        <header className={TERMINAL_STYLES.header.container}>
          <div className={TERMINAL_STYLES.header.leftSection}>
            <span className={TERMINAL_STYLES.header.title}>
              terminal@cybernetic:~
            </span>
          </div>
          <div className={TERMINAL_STYLES.header.controls}>
            <button
              onClick={toggleMaximize}
              className={TERMINAL_STYLES.header.button}
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
              title={isMaximized ? "Restore (Alt+F10)" : "Maximize (Alt+F10)"}
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className={TERMINAL_STYLES.header.closeButton}
              aria-label="Close terminal"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* Terminal Content */}
        <main className={TERMINAL_STYLES.content.container}>
          {/* Output Area */}
          <div
            ref={outputRef}
            className={TERMINAL_STYLES.content.output}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            <div className={TERMINAL_STYLES.content.outputInner}>
              {terminalLines.map((line, index) => (
                <div
                  key={`${index}-${line.timestamp?.getTime() || 0}`}
                  className={getLineClassName(line)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {line.content || "\u00A0"}
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className={TERMINAL_STYLES.content.input.container}>
            <div className={TERMINAL_STYLES.content.input.wrapper}>
              <span
                className={TERMINAL_STYLES.content.input.prompt}
                aria-hidden="true"
              >
                $
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={TERMINAL_STYLES.content.input.field}
                placeholder="Type a command... (try 'help')"
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TerminalWindow;
