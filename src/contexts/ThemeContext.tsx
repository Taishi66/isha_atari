import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Theme color schemes
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    primary: string;
    secondary: string;
    active: string;
  };
  background: {
    primary: string;
    secondary: string;
    active: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  colors: ThemeColors;
  status: 'active' | 'ready' | 'locked';
}

// Theme definitions
const THEMES: Record<string, Theme> = {
  cybernetic: {
    id: 'cybernetic',
    name: 'CYBERNETIC',
    displayName: 'Cybernetic Blue',
    status: 'ready',
    colors: {
      primary: '#00D9FF',
      secondary: '#0EA5E9',
      accent: '#38BDF8',
      success: '#22C55E',
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E7EB',
        muted: '#9CA3AF',
      },
      border: {
        primary: 'rgba(0, 217, 255, 0.2)',
        secondary: 'rgba(0, 217, 255, 0.3)',
        active: 'rgba(0, 217, 255, 0.6)',
      },
      background: {
        primary: 'rgba(0, 0, 0, 0.4)',
        secondary: 'rgba(0, 0, 0, 0.3)',
        active: 'rgba(0, 217, 255, 0.05)',
      },
    },
  },
  matrix: {
    id: 'matrix',
    name: 'MATRIX_GREEN',
    displayName: 'Matrix Green',
    status: 'ready',
    colors: {
      primary: '#00FF41',
      secondary: '#00CC33',
      accent: '#FFEB3B',
      success: '#00FF41',
      text: {
        primary: '#FFFFFF',
        secondary: '#E0FFE0',
        muted: '#FFD54F',
      },
      border: {
        primary: 'rgba(0, 255, 65, 0.2)',
        secondary: 'rgba(0, 255, 65, 0.3)',
        active: 'rgba(255, 235, 59, 0.6)',
      },
      background: {
        primary: 'rgba(0, 0, 0, 0.4)',
        secondary: 'rgba(0, 0, 0, 0.3)',
        active: 'rgba(255, 235, 59, 0.05)',
      },
    },
  },
  neon: {
    id: 'neon',
    name: 'NEON_PURPLE',
    displayName: 'Neon Purple',
    status: 'ready',
    colors: {
      primary: '#FF00FF',
      secondary: '#CC00CC',
      accent: '#00FFFF',
      success: '#00FFFF',
      text: {
        primary: '#FFFFFF',
        secondary: '#FFE0FF',
        muted: '#00E5FF',
      },
      border: {
        primary: 'rgba(255, 0, 255, 0.2)',
        secondary: 'rgba(255, 0, 255, 0.3)',
        active: 'rgba(0, 255, 255, 0.6)',
      },
      background: {
        primary: 'rgba(0, 0, 0, 0.4)',
        secondary: 'rgba(0, 0, 0, 0.3)',
        active: 'rgba(0, 255, 255, 0.05)',
      },
    },
  },
  ember: {
    id: 'ember',
    name: 'EMBER_TERM',
    displayName: 'Ember Terminal',
    status: 'ready',
    colors: {
      primary: '#FF6B35',
      secondary: '#FF8E53',
      accent: '#64B5F6',
      success: '#00D9FF',
      text: {
        primary: '#FFFFFF',
        secondary: '#FFF4F1',
        muted: '#90CAF9',
      },
      border: {
        primary: 'rgba(255, 107, 53, 0.2)',
        secondary: 'rgba(255, 107, 53, 0.3)',
        active: 'rgba(100, 181, 246, 0.6)',
      },
      background: {
        primary: 'rgba(0, 0, 0, 0.4)',
        secondary: 'rgba(0, 0, 0, 0.3)',
        active: 'rgba(100, 181, 246, 0.05)',
      },
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>('cybernetic');

  const currentTheme = THEMES[currentThemeId];
  const themes = Object.values(THEMES);

  const setTheme = useCallback((themeId: string) => {
    if (THEMES[themeId] && THEMES[themeId].status !== 'locked') {
      setCurrentThemeId(themeId);

      // Apply theme to CSS custom properties
      const root = document.documentElement;
      const colors = THEMES[themeId].colors;

      root.style.setProperty('--theme-primary', colors.primary);
      root.style.setProperty('--theme-secondary', colors.secondary);
      root.style.setProperty('--theme-accent', colors.accent);
      root.style.setProperty('--theme-success', colors.success);

      root.style.setProperty('--theme-text-primary', colors.text.primary);
      root.style.setProperty('--theme-text-secondary', colors.text.secondary);
      root.style.setProperty('--theme-text-muted', colors.text.muted);

      root.style.setProperty('--theme-border-primary', colors.border.primary);
      root.style.setProperty('--theme-border-secondary', colors.border.secondary);
      root.style.setProperty('--theme-border-active', colors.border.active);

      root.style.setProperty('--theme-bg-primary', colors.background.primary);
      root.style.setProperty('--theme-bg-secondary', colors.background.secondary);
      root.style.setProperty('--theme-bg-active', colors.background.active);
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    setTheme(currentThemeId);
  }, [setTheme, currentThemeId]);

  const value: ThemeContextType = {
    currentTheme,
    themes,
    setTheme,
    colors: currentTheme.colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};