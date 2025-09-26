/**
 * Advanced Terminal Window Component
 * @fileoverview Optimized terminal interface with enhanced accessibility and performance
 */

import { useEffect, useState, memo, useCallback } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { getLineClassName } from "@/utils/terminalCommands";
import { TERMINAL_STYLES, combineClasses } from "@/utils/terminalStyles";
import { useTheme } from "@/contexts/ThemeContext";
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
}) => {
    const { colors } = useTheme();
    return (
    <header className={TERMINAL_STYLES.header.container}>
        <div className={TERMINAL_STYLES.header.leftSection}>
            <div className="flex items-center space-x-2">
                {/* Cybernetic control buttons */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-black/30 border" style={{ borderColor: colors.border.primary }}>
                        <button
                            className="w-2 h-2 bg-red-400/80 hover:bg-red-400 transition-all duration-200 hover:shadow-[0_0_6px_rgba(248,113,113,0.6)] cursor-pointer"
                            onClick={onClose}
                            aria-label="Close terminal"
                            title="Close terminal"
                        />
                        <button
                            className="w-2 h-2 transition-all duration-200 cursor-pointer" style={{ backgroundColor: `${colors.primary}CC`, '--hover-bg': colors.primary, '--hover-shadow': `0_0_6px_${colors.primary}99` } as React.CSSProperties} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.boxShadow = `0 0 6px ${colors.primary}99`; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${colors.primary}CC`; e.currentTarget.style.boxShadow = 'none'; }}
                            onClick={onToggleMaximize}
                            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
                            title={isMaximized ? "Restore terminal" : "Maximize terminal"}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-1 h-4 animate-pulse" style={{ backgroundColor: colors.primary }} />
                    <span className={`${TERMINAL_STYLES.header.title} tracking-wider`}>
                        isha@system:~/portfolio$
                    </span>
                </div>
            </div>
        </div>
        {/* System status indicators */}
        <div className="hidden sm:flex items-center text-xs font-mono space-x-4" style={{ color: colors.text.muted }}>
            <span className="flex items-center space-x-1">
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: colors.success }} />
                <span>ACTIVE</span>
            </span>
            <span>ESC:EXIT</span>
        </div>
    </header>
    );
});

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
}) => {
    const { colors } = useTheme();
    return (
    <div
        ref={outputRef}
        className={TERMINAL_STYLES.content.output}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
    >
        <div className={TERMINAL_STYLES.content.outputInner}>
            {lines.map((line, index) => {
                // Get the base className but override colors
                const baseClassName = getLineClassName(line);
                // Remove hardcoded color classes and apply theme colors
                const themeAwareClassName = baseClassName
                    .replace(/text-\[#00D9FF\]/g, '')
                    .replace(/text-cyan-\d+/g, '');

                // Determine color based on line type
                const getThemeColor = (lineType: string) => {
                    switch (lineType) {
                        case 'command':
                        case 'system':
                            return colors.primary;
                        case 'error':
                            return '#EF4444'; // Keep red for errors
                        case 'success':
                            return colors.success;
                        case 'warning':
                            return '#F59E0B'; // Keep orange for warnings
                        default:
                            return colors.text.secondary;
                    }
                };

                return (
                    <div
                        key={line.id || `${index}-${line.timestamp?.getTime() || 0}`}
                        className={themeAwareClassName}
                        style={{
                            animationDelay: `${Math.min(index * 50, 1000)}ms`,
                            animationFillMode: "backwards",
                            color: getThemeColor(line.type),
                        }}
                    >
                        {line.content || "\u00A0"}
                    </div>
                );
            })}
        </div>
    </div>
    );
}, (prevProps, nextProps) => {
    // Re-render when lines change or theme might have changed
    return prevProps.lines === nextProps.lines;
});

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
    const { colors } = useTheme();
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
            style={{ cursor: disabled ? 'not-allowed' : 'text', borderColor: colors.border.primary }}
        >
            <div className={TERMINAL_STYLES.content.input.wrapper}>
                <span
                    className="select-none flex-shrink-0"
                    style={{ color: colors.primary }}
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
                <span className="animate-pulse select-none" style={{ color: 'var(--theme-primary)' }} aria-hidden="true">
                    {currentInput.length === 0 ? '_' : ''}
                </span>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Re-render if currentInput, disabled state changes, or force re-render for theme changes
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
    const { colors } = useTheme();

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
                    key={`terminal-${colors.primary}`} // Force re-render when theme changes
                    className={combineClasses(
                        TERMINAL_STYLES.window.base,
                        (isOpen && !isClosing) ? TERMINAL_STYLES.window.open : TERMINAL_STYLES.window.closed,
                        state.isMaximized
                            ? TERMINAL_STYLES.window.maximized
                            : TERMINAL_STYLES.window.normal,
                        isClosing && "terminal-closing cybernetic-close digital-glitch",
                        "backdrop-blur-xl bg-black/95"
                    )}
                    style={{
                        // Override hardcoded colors with theme colors
                        '--terminal-primary': colors.primary,
                        '--terminal-border': colors.border.primary,
                        '--terminal-border-active': colors.border.active,
                        '--terminal-border-primary': colors.border.primary,
                        borderColor: colors.border.active,
                        boxShadow: `0 0 30px ${colors.primary}33`
                    } as React.CSSProperties}
                >
                    {/* Minimal cybernetic border effects */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {/* Corner accent lines */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: colors.border.active }} />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: colors.border.active }} />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: colors.border.active }} />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: colors.border.active }} />

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br via-transparent animate-pulse" style={{ backgroundImage: `linear-gradient(to bottom right, ${colors.primary}0D, transparent, ${colors.primary}0D)` }} />
                    </div>

                    {/* Minimal scanning animation */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="w-full h-px bg-gradient-to-r from-transparent to-transparent animate-scanSlow absolute" style={{ backgroundImage: `linear-gradient(to right, transparent, ${colors.primary}33, transparent)` }} />
                        <div className="w-full h-px bg-gradient-to-r from-transparent to-transparent animate-scanSlow absolute" style={{ backgroundImage: `linear-gradient(to right, transparent, ${colors.primary}1A, transparent)`, animationDelay: '2s' }} />
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
                            <div className="w-full h-px bg-gradient-to-r from-transparent to-transparent animate-scanSlow absolute" style={{ backgroundImage: `linear-gradient(to right, transparent, ${colors.primary}0D, transparent)`, animationDelay: '4s' }} />
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
                                <div className="font-mono text-center space-y-2" style={{ color: colors.primary }}>
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-2 h-2 animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '100ms' }} />
                                        <div className="w-2 h-2 animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '200ms' }} />
                                    </div>
                                    <div className="animate-pulse">SYSTEM INITIALIZATION</div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Minimal status bar */}
                    {import.meta.env.DEV && (
                        <div className="px-4 py-2 text-xs border-t bg-black/30 font-mono flex justify-between" style={{ color: colors.text.muted, borderColor: colors.border.primary }}>
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