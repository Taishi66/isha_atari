/**
 * Application Context Definition
 * @fileoverview Context definition separated for Fast Refresh compatibility
 */

import { createContext } from 'react';
import type { AppContextValue } from '@/types';

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

export const AppContext = createContext<AppContextValue | null>(null);