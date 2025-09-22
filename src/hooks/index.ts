/**
 * Hooks Index
 * @fileoverview Centralized exports for all custom hooks
 */

// Core hooks
export { useTerminal, useTerminalPerformance } from './useTerminal';
export { useGlitchEffect, useMatrixGlitch, useSubtleGlitch, useIntenseGlitch } from './useGlitchEffect';

// Context hooks
export { useAppContext, useTerminalState, useTheme, useCurrentTime } from './useAppContext';

// Legacy compatibility
export { default as useGlitchEffectLegacy } from './useGlitchEffect';