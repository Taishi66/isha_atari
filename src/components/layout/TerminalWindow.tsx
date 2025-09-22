/**
 * Advanced Terminal Window Component
 * @fileoverview Optimized terminal interface with enhanced accessibility and performance
 */

import { useEffect, useState, memo, useCallback } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { getLineClassName } from "@/utils/terminalCommands";
import { TERMINAL_STYLES, combineClasses } from "@/utils/terminalStyles";
import type { TerminalLine } from "@/types";
// ============================================================================
// LOCAL TYPES (to avoid circular dependencies)
// ============================================================================

interface TerminalWindowProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly className?: string;
    readonly testId?: string;
}

// Simple error boundary to avoid circular dependency
const SimpleErrorBoundary = ({ children, onError }: {
    children: React.ReactNode;
    onError?: (error: Error) => void;
}) => {
    try {
        return <>{children}</>;
    } catch (error) {
        if (onError) onError(error as Error);
        return (
            <div className="p-4 text-red-400 text-center">
                <p>Something went wrong. Please refresh the page.</p>
            </div>
        );
    }
};

// ============================================================================
// MEMOIZED COMPONENTS FOR PERFORMANCE
// ============================================================================

const TerminalHeader = memo(({
    isMaximized,
    onToggleMaximize,
    onClose
}: {
    readonly isMaximized: boolean;
    readonly onToggleMaximize: () => void;
    readonly onClose: () => void;
}) => (
    <header className={TERMINAL_STYLES.header.container}>
        <div className={TERMINAL_STYLES.header.leftSection}>
            <div className="flex items-center space-x-2">
                {/* macOS-style traffic lights */}
                <div className="flex items-center space-x-1.5">
                    <div
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors"
                        onClick={onClose}
                        role="button"
                        aria-label="Close terminal"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onClose()}
                        title="Close terminal"
                    />
                    <div
                        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors"
                        onClick={onClose}
                        role="button"
                        aria-label="Close terminal"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onClose()}
                        title="Close terminal (minimize not available in web)"
                    />
                    <div
                        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors"
                        onClick={onToggleMaximize}
                        role="button"
                        aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onToggleMaximize()}
                        title={isMaximized ? "Restore terminal" : "Maximize terminal"}
                    />
                </div>
                <span className={TERMINAL_STYLES.header.title}>
                    terminal@cybernetic:~
                </span>
            </div>
        </div>
        {/* Keyboard shortcuts info */}
        <div className="hidden sm:flex items-center text-xs text-gray-400 font-mono">
            <span>Alt+F10: Maximize • Esc: Close</span>
        </div>
    </header>
));

TerminalHeader.displayName = 'TerminalHeader';

// ============================================================================
// VIRTUALIZED OUTPUT FOR PERFORMANCE
// ============================================================================

const TerminalOutput = memo(({
    lines,
    outputRef
}: {
    readonly lines: readonly TerminalLine[];
    readonly outputRef: React.RefObject<HTMLDivElement>;
}) => (
    <div
        ref={outputRef}
        className={TERMINAL_STYLES.content.output}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
    >
        <div className={TERMINAL_STYLES.content.outputInner}>
            {lines.map((line, index) => (
                <div
                    key={line.id || `${index}-${line.timestamp?.getTime() || 0}`}
                    className={getLineClassName(line)}
                    style={{
                        animationDelay: `${Math.min(index * 50, 1000)}ms`,
                        animationFillMode: "backwards",
                    }}
                >
                    {line.content || "\u00A0"}
                </div>
            ))}
        </div>
    </div>
));

TerminalOutput.displayName = 'TerminalOutput';

// ============================================================================
// INPUT COMPONENT WITH ENHANCED FEATURES
// ============================================================================

const TerminalInput = memo(({
    currentInput,
    onInputChange,
    onKeyDown,
    inputRef,
    disabled = false
}: {
    readonly currentInput: string;
    readonly onInputChange: (value: string) => void;
    readonly onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly inputRef: React.RefObject<HTMLInputElement>;
    readonly disabled?: boolean;
}) => {
    const handleContainerClick = useCallback(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled, inputRef]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(e.target.value);
    }, [onInputChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown(e);
    }, [onKeyDown]);
    return (
        <div
            className={TERMINAL_STYLES.content.input.container}
            onClick={handleContainerClick}
            style={{ cursor: disabled ? 'not-allowed' : 'text' }}
        >
            <div className={TERMINAL_STYLES.content.input.wrapper}>
                <span
                    className={TERMINAL_STYLES.content.input.prompt}
                    aria-hidden="true"
                >
                    user@terminal:~$
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={combineClasses(
                        TERMINAL_STYLES.content.input.field,
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    placeholder={disabled ? "Terminal disabled..." : "Type a command... (try 'help')"}
                    aria-label="Terminal command input"
                    autoComplete="off"
                    spellCheck="false"
                    disabled={disabled}
                    tabIndex={disabled ? -1 : 0}
                    autoFocus={!disabled}
                />
                {/* Cursor indicator */}
                <span className="animate-pulse text-cyan-400 select-none" aria-hidden="true">
                    {currentInput.length === 0 ? '_' : ''}
                </span>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if currentInput or disabled state changes
    return prevProps.currentInput === nextProps.currentInput &&
        prevProps.disabled === nextProps.disabled;
});

TerminalInput.displayName = 'TerminalInput';

// ============================================================================
// MAIN TERMINAL WINDOW COMPONENT
// ============================================================================

const TerminalWindow = ({ isOpen, onClose, className, testId }: TerminalWindowProps) => {
    const [isLoading, setIsLoading] = useState(true);

    const {
        state,
        actions,
        refs,
        handlers,
    } = useTerminal({
        isOpen,
        onClose,
        enableAutoComplete: true,
    });

    // ============================================================================
    // VISIBILITY MANAGEMENT
    // ============================================================================

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);

            // Simulate loading time for smooth animation
            const loadingTimer = setTimeout(() => {
                setIsLoading(false);
            }, 300);

            return () => clearTimeout(loadingTimer);
        } else {
            setIsLoading(false);
        }
        return;
    }, [isOpen]);

    // Focus input after loading completes
    useEffect(() => {
        if (!isLoading && isOpen && refs.inputRef.current) {
            const focusTimer = setTimeout(() => {
                refs.inputRef.current?.focus();
                refs.inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
            return () => clearTimeout(focusTimer);
        }
        return;
    }, [isLoading, isOpen, refs.inputRef]);

    // ============================================================================
    // KEYBOARD SHORTCUTS
    // ============================================================================

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Alt + F10 for maximize toggle
            if (e.altKey && e.key === 'F10') {
                e.preventDefault();
                actions.toggleMaximize();
            }

            // Ctrl/Cmd + Shift + C for clear
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                actions.clearTerminal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleGlobalKeyDown);
            return () => document.removeEventListener('keydown', handleGlobalKeyDown);
        }
        return undefined;
    }, [isOpen, actions]);

    // ============================================================================
    // ERROR HANDLING
    // ============================================================================

    const handleError = useCallback((error: Error) => {
        console.error('Terminal Window Error:', error);
        // Optionally add error reporting service here
    }, []);

    // ============================================================================
    // RENDER GUARDS
    // ============================================================================

    if (!isOpen) return null;

    return (
        <SimpleErrorBoundary onError={handleError}>
            <div
                className={combineClasses(
                    TERMINAL_STYLES.overlay.base,
                    isOpen ? TERMINAL_STYLES.overlay.open : TERMINAL_STYLES.overlay.closed,
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Terminal Window"
                data-testid={testId}
            >
                <div
                    className={combineClasses(
                        TERMINAL_STYLES.window.base,
                        isOpen ? TERMINAL_STYLES.window.open : TERMINAL_STYLES.window.closed,
                        state.isMaximized
                            ? TERMINAL_STYLES.window.maximized
                            : TERMINAL_STYLES.window.normal,
                    )}
                >
                    {/* Cybernetic border effects - positioned behind content */}
                    <div className="absolute inset-0 pointer-events-none z-0">
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

                    {/* Scanning line animation - positioned behind content */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <div className={TERMINAL_STYLES.decorations.scanLine.line} />
                    </div>

                    {/* Terminal Header - positioned above decorations */}
                    <div className="relative z-10 flex-shrink-0">
                        <TerminalHeader
                            isMaximized={state.isMaximized}
                            onToggleMaximize={actions.toggleMaximize}
                            onClose={onClose}
                        />
                    </div>

                    {/* Terminal Content - positioned above decorations */}
                    <main className={combineClasses(TERMINAL_STYLES.content.container, "relative z-10 flex-1 min-h-0")}>
                        {/* Output Area */}
                        <TerminalOutput
                            lines={state.lines}
                            outputRef={refs.outputRef}
                        />

                        {/* Input Area */}
                        <TerminalInput
                            currentInput={state.currentInput}
                            onInputChange={actions.updateInput}
                            onKeyDown={handlers.handleKeyDown}
                            inputRef={refs.inputRef}
                            disabled={false}
                        />

                        {/* Loading Overlay - Only covers main content */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 pointer-events-none">
                                <div className="text-cyan-400 font-mono">
                                    <div className="animate-pulse">Initializing terminal...</div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Status Bar (Optional) */}
                    {import.meta.env.DEV && (
                        <div className="px-4 py-1 text-xs text-gray-500 border-t border-cyan-500/20 bg-gray-900/50">
                            Lines: {state.lines.length} | History: {state.commandHistory.length} |
                            {state.isMaximized ? ' Maximized' : ' Normal'}
                        </div>
                    )}
                </div>
            </div>
        </SimpleErrorBoundary>
    );
};

TerminalWindow.displayName = 'TerminalWindow';

export default memo(TerminalWindow);