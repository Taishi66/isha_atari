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
                {/* Cybernetic control buttons */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-black/30 border border-[#00D9FF]/20">
                        <button
                            className="w-2 h-2 bg-red-400/80 hover:bg-red-400 transition-all duration-200 hover:shadow-[0_0_6px_rgba(248,113,113,0.6)] cursor-pointer"
                            onClick={onClose}
                            aria-label="Close terminal"
                            title="Close terminal"
                        />
                        <button
                            className="w-2 h-2 bg-[#00D9FF]/80 hover:bg-[#00D9FF] transition-all duration-200 hover:shadow-[0_0_6px_rgba(0,217,255,0.6)] cursor-pointer"
                            onClick={onToggleMaximize}
                            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
                            title={isMaximized ? "Restore terminal" : "Maximize terminal"}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-1 h-4 bg-[#00D9FF] animate-pulse" />
                    <span className={`${TERMINAL_STYLES.header.title} tracking-wider`}>
                        isha@system:~/portfolio$
                    </span>
                </div>
            </div>
        </div>
        {/* System status indicators */}
        <div className="hidden sm:flex items-center text-xs text-[#00D9FF]/60 font-mono space-x-4">
            <span className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <span>ACTIVE</span>
            </span>
            <span>ESC:EXIT</span>
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
                    isha@system:~/portfolio$
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
                <span className="animate-pulse text-[#00D9FF] select-none" aria-hidden="true">
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
    const [isClosing, setIsClosing] = useState(false);

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
    // CYBERNETIC CLOSE HANDLER
    // ============================================================================

    const handleCyberneticClose = useCallback(() => {
        if (isClosing) return; // Prevent multiple triggers

        setIsClosing(true);

        // Trigger cybernetic closing sequence
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 2000); // Extended for more enjoyable experience
    }, [onClose, isClosing]);

    // ============================================================================
    // VISIBILITY MANAGEMENT
    // ============================================================================

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);

            // Extended loading time for more enjoyable opening animation
            const loadingTimer = setTimeout(() => {
                setIsLoading(false);
            }, 800);

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
            // Escape to close
            if (e.key === 'Escape') {
                e.preventDefault();
                handleCyberneticClose();
            }

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
    }, [isOpen, actions, handleCyberneticClose]);

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

    // Keep terminal visible during opening OR closing animation
    if (!isOpen && !isClosing) return null;

    return (
        <SimpleErrorBoundary onError={handleError}>
            <div
                className={combineClasses(
                    TERMINAL_STYLES.overlay.base,
                    (isOpen && !isClosing) ? TERMINAL_STYLES.overlay.open : TERMINAL_STYLES.overlay.closed,
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
                        (isOpen && !isClosing) ? TERMINAL_STYLES.window.open : TERMINAL_STYLES.window.closed,
                        state.isMaximized
                            ? TERMINAL_STYLES.window.maximized
                            : TERMINAL_STYLES.window.normal,
                        isClosing && "terminal-closing cybernetic-close digital-glitch",
                        "backdrop-blur-xl bg-black/95"
                    )}
                >
                    {/* Minimal cybernetic border effects */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {/* Corner accent lines */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00D9FF]/40" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00D9FF]/40" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00D9FF]/40" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00D9FF]/40" />

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 via-transparent to-[#00D9FF]/5 animate-pulse" />
                    </div>

                    {/* Minimal scanning animation */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-transparent animate-scanSlow absolute" />
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D9FF]/10 to-transparent animate-scanSlow absolute" style={{ animationDelay: '2s' }} />
                    </div>



                    {/* Header */}
                    <TerminalHeader
                        isMaximized={state.isMaximized}
                        onToggleMaximize={actions.toggleMaximize}
                        onClose={handleCyberneticClose}
                    />

                    {/* Terminal Content */}
                    <main className={combineClasses(TERMINAL_STYLES.content.container, "relative z-10 flex-1 min-h-0")}>
                        {/* Minimal content area effects */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D9FF]/5 to-transparent animate-scanSlow absolute" style={{ animationDelay: '4s' }} />
                        </div>

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

                        {/* Cybernetic loading overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 pointer-events-none">
                                <div className="text-[#00D9FF] font-mono text-center space-y-2">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-2 h-2 bg-[#00D9FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-[#00D9FF] animate-bounce" style={{ animationDelay: '100ms' }} />
                                        <div className="w-2 h-2 bg-[#00D9FF] animate-bounce" style={{ animationDelay: '200ms' }} />
                                    </div>
                                    <div className="animate-pulse">SYSTEM INITIALIZATION</div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Minimal status bar */}
                    {import.meta.env.DEV && (
                        <div className="px-4 py-2 text-xs text-[#00D9FF]/40 border-t border-[#00D9FF]/10 bg-black/30 font-mono flex justify-between">
                            <span>LINES:{state.lines.length}</span>
                            <span>HIST:{state.commandHistory.length}</span>
                            <span>{state.isMaximized ? 'MAX' : 'WIN'}</span>
                        </div>
                    )}
                </div>
            </div>
        </SimpleErrorBoundary>
    );
};

TerminalWindow.displayName = 'TerminalWindow';

export default memo(TerminalWindow);