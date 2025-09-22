/**
 * Advanced Terminal Hook
 * @fileoverview Comprehensive terminal management with performance optimization and error handling
 */

import { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import {
  executeCommand as executeTerminalCommand,
  INITIAL_LINES,
  type TerminalLine,
  // type CommandResult - imported but used in parameter types
} from '@/utils/terminalCommands';

// ============================================================================
// LOCAL TYPES (to avoid circular dependencies)
// ============================================================================

interface TerminalState {
  readonly lines: readonly TerminalLine[];
  readonly isMaximized: boolean;
  readonly currentInput: string;
  readonly commandHistory: readonly string[];
  readonly historyIndex: number;
}

interface UseTerminalReturn {
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

// Simple error handler to avoid circular dependency
function useErrorHandler() {
  return useCallback((error: Error, context?: Record<string, unknown>) => {
    console.error('Error:', error, context);
  }, []);
}

// ============================================================================
// TYPES
// ============================================================================

interface UseTerminalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialCommands?: readonly string[];
  readonly maxHistorySize?: number;
  readonly enableAutoComplete?: boolean;
}

// ============================================================================
// REDUCER FOR COMPLEX STATE MANAGEMENT
// ============================================================================

type TerminalAction =
  | { type: 'INITIALIZE'; payload: { lines: readonly TerminalLine[] } }
  | { type: 'ADD_LINES'; payload: { lines: readonly TerminalLine[] } }
  | { type: 'CLEAR_TERMINAL' }
  | { type: 'SET_INPUT'; payload: { input: string } }
  | { type: 'ADD_TO_HISTORY'; payload: { command: string } }
  | { type: 'SET_HISTORY_INDEX'; payload: { index: number } }
  | { type: 'TOGGLE_MAXIMIZE' }
  | { type: 'SET_MAXIMIZE'; payload: { isMaximized: boolean } };

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        lines: action.payload.lines,
        currentInput: '',
        historyIndex: -1,
      };

    case 'ADD_LINES':
      return {
        ...state,
        lines: [...state.lines, ...action.payload.lines],
      };

    case 'CLEAR_TERMINAL':
      return {
        ...state,
        lines: [],
      };

    case 'SET_INPUT':
      return {
        ...state,
        currentInput: action.payload.input,
      };

    case 'ADD_TO_HISTORY': {
      const newHistory = [...state.commandHistory, action.payload.command];
      return {
        ...state,
        commandHistory: newHistory.slice(-50), // Keep last 50 commands
        historyIndex: -1,
      };
    }

    case 'SET_HISTORY_INDEX':
      return {
        ...state,
        historyIndex: action.payload.index,
      };

    case 'TOGGLE_MAXIMIZE':
      return {
        ...state,
        isMaximized: !state.isMaximized,
      };

    case 'SET_MAXIMIZE':
      return {
        ...state,
        isMaximized: action.payload.isMaximized,
      };

    default:
      return state;
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useTerminal = ({
  isOpen,
  onClose,
  enableAutoComplete = true,
}: Omit<UseTerminalProps, 'initialCommands' | 'maxHistorySize'>): UseTerminalReturn => {
  const [state, dispatch] = useReducer(terminalReducer, {
    lines: [],
    isMaximized: false,
    currentInput: '',
    commandHistory: [],
    historyIndex: -1,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const errorHandler = useErrorHandler();

  // Keep state ref up to date
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const availableCommands = useMemo(() => [
    'test', 'help', 'clear', 'about', 'skills', 'contact', 'projects', 'exit', 'whoami', 'ls', 'pwd'
  ], []);

  // ============================================================================
  // COMMAND EXECUTION (moved up to avoid dependency issues)
  // ============================================================================

  const executeCommand = useCallback((input: string) => {
    if (!input.trim()) return;

    try {
      // Add command to history
      dispatch({ type: 'ADD_TO_HISTORY', payload: { command: input } });

      // Create command line with unique ID
      const commandLine: TerminalLine = {
        id: `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        content: `$ ${input}`,
        type: 'command',
        timestamp: new Date(),
      };

      // Execute command and get result
      const result = executeTerminalCommand(input);

      // Handle special command results
      if (result.shouldClose) {
        setTimeout(onClose, 500);
        return;
      }

      if (result.shouldClear) {
        dispatch({ type: 'CLEAR_TERMINAL' });
        return;
      }

      // Add command and output to terminal with proper IDs
      const linesWithIds = result.lines.map((line, index) => ({
        ...line,
        id: line.id || `line_${Date.now()}_${index}`,
      }));

      dispatch({
        type: 'ADD_LINES',
        payload: { lines: [commandLine, ...linesWithIds] }
      });

    } catch (error) {
      errorHandler(error as Error, {
        context: 'command_execution',
        command: input
      });

      // Add error line to terminal
      const errorLine: TerminalLine = {
        id: `error_${Date.now()}`,
        content: `Error: ${(error as Error).message}`,
        type: 'error',
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_LINES', payload: { lines: [errorLine] } });
    }
  }, [onClose, errorHandler]);

  // Auto-scroll to bottom when terminal lines change
  useEffect(() => {
    if (outputRef.current && state.lines.length > 0) {
      const element = outputRef.current;
      // Use requestAnimationFrame to avoid blocking renders
      requestAnimationFrame(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [state.lines.length]); // Only depend on length, not the entire array

  // Initialize terminal when opened
  useEffect(() => {
    if (isOpen) {
      try {
        dispatch({ type: 'INITIALIZE', payload: { lines: INITIAL_LINES } });
        dispatch({ type: 'SET_MAXIMIZE', payload: { isMaximized: false } });

        // Focus input when terminal opens with slight delay for animation
        const focusTimer = setTimeout(() => {
          inputRef.current?.focus();
        }, 150);

        return () => clearTimeout(focusTimer);
      } catch (error) {
        errorHandler(error as Error, { context: 'terminal_initialization' });
        return;
      }
    }
    return;
  }, [isOpen, errorHandler]);

  // ============================================================================
  // KEYBOARD HANDLERS
  // ============================================================================

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      const currentState = stateRef.current;
      
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          executeCommand(currentState.currentInput);
          dispatch({ type: 'SET_INPUT', payload: { input: '' } });
          break;

        case 'ArrowUp': {
          e.preventDefault();
          if (currentState.commandHistory.length > 0) {
            const newIndex = Math.min(
              currentState.historyIndex + 1,
              currentState.commandHistory.length - 1
            );
            const command = currentState.commandHistory[currentState.commandHistory.length - 1 - newIndex] || '';
            dispatch({ type: 'SET_HISTORY_INDEX', payload: { index: newIndex } });
            dispatch({ type: 'SET_INPUT', payload: { input: command } });
          }
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          if (currentState.historyIndex > 0) {
            const newIndex = currentState.historyIndex - 1;
            const command = currentState.commandHistory[currentState.commandHistory.length - 1 - newIndex] || '';
            dispatch({ type: 'SET_HISTORY_INDEX', payload: { index: newIndex } });
            dispatch({ type: 'SET_INPUT', payload: { input: command } });
          } else if (currentState.historyIndex === 0) {
            dispatch({ type: 'SET_HISTORY_INDEX', payload: { index: -1 } });
            dispatch({ type: 'SET_INPUT', payload: { input: '' } });
          }
          break;
        }

        case 'Tab': {
          e.preventDefault();
          if (enableAutoComplete) {
            const matches = availableCommands.filter(cmd =>
              cmd.startsWith(currentState.currentInput.toLowerCase())
            );
            if (matches.length === 1) {
              dispatch({ type: 'SET_INPUT', payload: { input: matches[0] || '' } });
            } else if (matches.length > 1) {
              // Show available completions
              const completionLine: TerminalLine = {
                id: `completion_${Date.now()}`,
                content: `Available: ${matches.join(', ')}`,
                type: 'info',
                timestamp: new Date(),
              };
              dispatch({ type: 'ADD_LINES', payload: { lines: [completionLine] } });
            }
          }
          break;
        }

        case 'Escape':
          e.preventDefault();
          onClose();
          break;

        case 'l':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch({ type: 'CLEAR_TERMINAL' });
          }
          break;

        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch({ type: 'SET_INPUT', payload: { input: '' } });
          }
          break;
      }
    } catch (error) {
      errorHandler(error as Error, { context: 'keyboard_handler', key: e.key });
    }
  }, [
    executeCommand,
    onClose,
    enableAutoComplete,
    availableCommands,
    errorHandler,
  ]);

  // ============================================================================
  // ACTION CREATORS
  // ============================================================================

  const toggleMaximize = useCallback(() => {
    dispatch({ type: 'TOGGLE_MAXIMIZE' });
  }, []);

  const clearTerminal = useCallback(() => {
    dispatch({ type: 'CLEAR_TERMINAL' });
  }, []);

  const updateInput = useCallback((input: string) => {
    dispatch({ type: 'SET_INPUT', payload: { input } });
  }, []);

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  // Create stable action objects
  const actions = useMemo(() => ({
    executeCommand,
    clearTerminal,
    toggleMaximize,
    updateInput,
  }), [executeCommand, clearTerminal, toggleMaximize, updateInput]);

  const refs = useMemo(() => ({
    inputRef,
    outputRef,
  }), []);

  const handlers = useMemo(() => ({
    handleKeyDown,
  }), [handleKeyDown]);

  return {
    state,
    actions,
    refs,
    handlers,
  };
};

// ============================================================================
// PERFORMANCE OPTIMIZATION HOOK
// ============================================================================

export function useTerminalPerformance() {
  const [metrics, setMetrics] = useState({
    commandCount: 0,
    averageExecutionTime: 0,
    lastExecutionTime: 0,
  });

  const recordCommandExecution = useCallback((executionTime: number) => {
    setMetrics(prev => ({
      commandCount: prev.commandCount + 1,
      averageExecutionTime: (prev.averageExecutionTime * prev.commandCount + executionTime) / (prev.commandCount + 1),
      lastExecutionTime: executionTime,
    }));
  }, []);

  return { metrics, recordCommandExecution };
}