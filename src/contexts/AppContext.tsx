/**
 * Application Context Provider
 * @fileoverview Centralized state management using React Context with advanced patterns
 */

import {
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { AppContextValue, AppEvent, ThemeConfig } from '@/types';
import { AppContext } from './AppContextDefinition';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_THEME: ThemeConfig = {
  primary: '#00ffff',
  secondary: '#0099cc',
  accent: '#ff6600',
  background: '#000000',
  surface: '#111111',
  text: '#ffffff',
  error: '#ff4444',
  warning: '#ffaa00',
  success: '#00ff88',
} as const;

// ============================================================================
// STATE TYPES
// ============================================================================

interface AppState {
  readonly isTerminalOpen: boolean;
  readonly currentTime: Date;
  readonly theme: ThemeConfig;
  readonly lastActivity: Date;
  readonly sessionDuration: number;
}

type AppAction =
  | { type: 'OPEN_TERMINAL' }
  | { type: 'CLOSE_TERMINAL' }
  | { type: 'UPDATE_TIME'; payload: Date }
  | { type: 'UPDATE_SESSION_DURATION'; payload: number }
  | { type: 'SET_THEME'; payload: ThemeConfig };

// ============================================================================
// REDUCER
// ============================================================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'OPEN_TERMINAL':
      return {
        ...state,
        isTerminalOpen: true,
        lastActivity: new Date(),
      };

    case 'CLOSE_TERMINAL':
      return {
        ...state,
        isTerminalOpen: false,
        lastActivity: new Date(),
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        currentTime: action.payload,
      };

    case 'UPDATE_SESSION_DURATION':
      return {
        ...state,
        sessionDuration: action.payload,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        lastActivity: new Date(),
      };

    default:
      return state;
  }
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface AppProviderProps {
  readonly children: ReactNode;
  readonly initialTheme?: ThemeConfig;
}

export function AppProvider({ children, initialTheme = DEFAULT_THEME }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    isTerminalOpen: false,
    currentTime: new Date(),
    theme: initialTheme,
    lastActivity: new Date(),
    sessionDuration: 0,
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME', payload: new Date() });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track session duration
  useEffect(() => {
    const sessionStart = Date.now();

    const timer = setInterval(() => {
      const duration = Date.now() - sessionStart;
      dispatch({ type: 'UPDATE_SESSION_DURATION', payload: duration });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Persist theme preference
  useEffect(() => {
    try {
      localStorage.setItem('app-theme', JSON.stringify(state.theme));
    } catch (error) {
      console.warn('Failed to persist theme preference:', error);
    }
  }, [state.theme]);

  // Load persisted theme on mount
  useEffect(() => {
    try {
      const persistedTheme = localStorage.getItem('app-theme');
      if (persistedTheme) {
        const theme = JSON.parse(persistedTheme) as ThemeConfig;
        dispatch({ type: 'SET_THEME', payload: theme });
      }
    } catch (error) {
      console.warn('Failed to load persisted theme:', error);
    }
  }, []);

  // ============================================================================
  // ACTION CREATORS
  // ============================================================================

  const openTerminal = useCallback(() => {
    dispatch({ type: 'OPEN_TERMINAL' });

    // Dispatch app event
    const event: AppEvent = {
      type: 'TERMINAL_OPENED',
      payload: { timestamp: new Date() },
    };

    // Custom event for analytics/tracking
    window.dispatchEvent(new CustomEvent('app-event', { detail: event }));
  }, []);

  const closeTerminal = useCallback(() => {
    const openDuration = Date.now() - state.lastActivity.getTime();

    dispatch({ type: 'CLOSE_TERMINAL' });

    // Dispatch app event
    const event: AppEvent = {
      type: 'TERMINAL_CLOSED',
      payload: { duration: openDuration },
    };

    window.dispatchEvent(new CustomEvent('app-event', { detail: event }));
  }, [state.lastActivity]);

  const toggleTerminal = useCallback(() => {
    if (state.isTerminalOpen) {
      closeTerminal();
    } else {
      openTerminal();
    }
  }, [state.isTerminalOpen, openTerminal, closeTerminal]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue = useMemo<AppContextValue>(() => ({
    theme: state.theme,
    isTerminalOpen: state.isTerminalOpen,
    currentTime: state.currentTime,
    actions: {
      openTerminal,
      closeTerminal,
      toggleTerminal,
    },
  }), [
    state.theme,
    state.isTerminalOpen,
    state.currentTime,
    openTerminal,
    closeTerminal,
    toggleTerminal,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================================
// NOTE: Hooks are exported from @/hooks/useAppContext for Fast Refresh compatibility
// ============================================================================