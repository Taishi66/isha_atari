/**
 * Core application types and interfaces
 * @fileoverview Centralized type definitions for type safety and code intelligence
 */

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Makes all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract the value type from a readonly array
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Creates a union type from object values
 */
export type ValueOf<T> = T[keyof T];

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Branded type for better type safety
 */
export type Brand<T, B> = T & { readonly __brand: B };

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Standard async operation states
 */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic API response structure
 */
export interface ApiResponse<T = unknown> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
  readonly timestamp: Date;
}

/**
 * Error with structured information
 */
export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
}

/**
 * Animation timing configuration
 */
export interface AnimationConfig {
  readonly duration: number;
  readonly delay?: number;
  readonly easing?: string;
  readonly iterations?: number;
}

// ============================================================================
// TERMINAL TYPES
// ============================================================================

/**
 * Terminal line types for different command outputs
 */
export type TerminalLineType =
  | 'command'
  | 'output'
  | 'error'
  | 'success'
  | 'info'
  | 'warning'
  | 'system';

/**
 * Individual terminal line structure
 */
export interface TerminalLine {
  readonly id: string;
  readonly content: string;
  readonly type: TerminalLineType;
  readonly timestamp: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Terminal command execution result
 */
export interface CommandResult {
  readonly lines: readonly TerminalLine[];
  readonly shouldClear: boolean;
  readonly shouldClose: boolean;
  readonly exitCode: number;
}

/**
 * Terminal command definition
 */
export interface TerminalCommand {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
  readonly aliases: readonly string[];
  readonly execute: (args: readonly string[]) => CommandResult;
}

/**
 * Terminal state configuration
 */
export interface TerminalState {
  readonly lines: readonly TerminalLine[];
  readonly isMaximized: boolean;
  readonly currentInput: string;
  readonly commandHistory: readonly string[];
  readonly historyIndex: number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Base props for all components
 */
export interface BaseComponentProps {
  readonly className?: string;
  readonly testId?: string;
  readonly ariaLabel?: string;
}

/**
 * Props for components that can be in loading state
 */
export interface LoadableProps {
  readonly isLoading?: boolean;
  readonly loadingText?: string;
}

/**
 * Props for interactive components
 */
export interface InteractiveProps {
  readonly onClick?: () => void;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly disabled?: boolean;
}

/**
 * Hero section specific props
 */
export interface HeroSectionProps extends BaseComponentProps {
  readonly glitchText: string;
  readonly onTerminalClick: () => void;
}

/**
 * Terminal window component props
 */
export interface TerminalWindowProps extends BaseComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialCommands?: readonly string[];
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Terminal hook return interface
 */
export interface UseTerminalReturn {
  readonly state: TerminalState;
  readonly actions: {
    readonly executeCommand: (command: string) => void;
    readonly clearTerminal: () => void;
    readonly toggleMaximize: () => void;
    readonly updateInput: (input: string) => void;
  };
  readonly refs: {
    readonly inputRef: React.RefObject<HTMLInputElement>;
    readonly outputRef: React.RefObject<HTMLDivElement>;
  };
  readonly handlers: {
    readonly handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };
}

/**
 * Glitch effect hook return interface
 */
export interface UseGlitchEffectReturn {
  readonly glitchText: string;
  readonly isGlitching: boolean;
  readonly triggerGlitch: () => void;
}

/**
 * Animation hook return interface
 */
export interface UseAnimationReturn {
  readonly isAnimating: boolean;
  readonly progress: number;
  readonly start: () => void;
  readonly stop: () => void;
  readonly reset: () => void;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Application theme configuration
 */
export interface ThemeConfig {
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly error: string;
  readonly warning: string;
  readonly success: string;
}

/**
 * Application state context
 */
export interface AppContextValue {
  readonly theme: ThemeConfig;
  readonly isTerminalOpen: boolean;
  readonly currentTime: Date;
  readonly actions: {
    readonly openTerminal: () => void;
    readonly closeTerminal: () => void;
    readonly toggleTerminal: () => void;
  };
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  readonly enableMetrics: boolean;
  readonly sampleRate: number;
  readonly thresholds: {
    readonly lcp: number;
    readonly fid: number;
    readonly cls: number;
  };
}

/**
 * Application configuration
 */
export interface AppConfig {
  readonly version: string;
  readonly environment: 'development' | 'staging' | 'production';
  readonly features: {
    readonly enableTerminal: boolean;
    readonly enableAnalytics: boolean;
    readonly enableDevTools: boolean;
  };
  readonly performance: PerformanceConfig;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Custom application events
 */
export type AppEvent =
  | { type: 'TERMINAL_OPENED'; payload: { timestamp: Date } }
  | { type: 'TERMINAL_CLOSED'; payload: { duration: number } }
  | { type: 'COMMAND_EXECUTED'; payload: { command: string; exitCode: number } }
  | { type: 'ERROR_OCCURRED'; payload: AppError }
  | { type: 'THEME_CHANGED'; payload: { theme: string } };

/**
 * Event handler type
 */
export type EventHandler<T extends AppEvent> = (event: T) => void;