/**
 * Application Context Hooks
 * @fileoverview Hooks for consuming AppContext with optimized selectors
 */

import { useContext, useMemo } from 'react';
import { AppContext } from '@/contexts/AppContextDefinition';
import type { AppContextValue } from '@/types';

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

// ============================================================================
// SELECTOR HOOKS (Advanced pattern for performance)
// ============================================================================

export function useTerminalState() {
  const { isTerminalOpen, actions } = useAppContext();
  return useMemo(() => ({ isTerminalOpen, actions }), [isTerminalOpen, actions]);
}

export function useTheme() {
  const { theme } = useAppContext();
  return theme;
}

export function useCurrentTime() {
  const { currentTime } = useAppContext();
  return currentTime;
}