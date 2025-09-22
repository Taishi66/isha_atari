/**
 * Accessibility Utilities
 * @fileoverview Comprehensive accessibility helpers and ARIA utilities
 */

// ============================================================================
// TYPES
// ============================================================================

interface A11yConfig {
  readonly reducedMotion: boolean;
  readonly highContrast: boolean;
  readonly largeText: boolean;
  readonly screenReader: boolean;
}

interface FocusManagementOptions {
  readonly restoreFocus?: boolean;
  readonly preventScroll?: boolean;
  readonly selectText?: boolean;
}

// ============================================================================
// ACCESSIBILITY STATE DETECTION
// ============================================================================

export class AccessibilityManager {
  private config: A11yConfig;
  private listeners: Array<(config: A11yConfig) => void> = [];

  constructor() {
    this.config = this.detectA11yPreferences();
    this.setupMediaQueryListeners();
  }

  private detectA11yPreferences(): A11yConfig {
    if (typeof window === 'undefined') {
      return {
        reducedMotion: false,
        highContrast: false,
        largeText: false,
        screenReader: false,
      };
    }

    return {
      reducedMotion: this.prefersReducedMotion(),
      highContrast: this.prefersHighContrast(),
      largeText: this.prefersLargeText(),
      screenReader: this.detectScreenReader(),
    };
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  private prefersLargeText(): boolean {
    return window.matchMedia('(prefers-reduced-data: reduce)').matches;
  }

  private detectScreenReader(): boolean {
    // Multiple methods to detect screen readers
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaderIndicators = [
      'nvda', 'jaws', 'windoweyes', 'voiceover', 'talkback'
    ];

    // Check user agent
    const hasScreenReaderUA = screenReaderIndicators.some(
      indicator => userAgent.includes(indicator)
    );

    // Check for screen reader specific APIs
    const hasScreenReaderAPI = 'speechSynthesis' in window;

    // Check for accessibility tree modifications
    const hasA11yEnhancements = document.documentElement.classList.contains('screenreader');

    return hasScreenReaderUA || hasScreenReaderAPI || hasA11yEnhancements;
  }

  private setupMediaQueryListeners(): void {
    if (typeof window === 'undefined') return;

    const queries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: high)',
      '(prefers-reduced-data: reduce)',
    ];

    queries.forEach(query => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', this.handleMediaQueryChange.bind(this));
    });
  }

  private handleMediaQueryChange(): void {
    const newConfig = this.detectA11yPreferences();
    const hasChanged = JSON.stringify(newConfig) !== JSON.stringify(this.config);

    if (hasChanged) {
      this.config = newConfig;
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }

  public getConfig(): A11yConfig {
    return { ...this.config };
  }

  public subscribe(listener: (config: A11yConfig) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public destroy(): void {
    this.listeners = [];
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const a11yManager = new AccessibilityManager();

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

export class FocusManager {
  private focusStack: HTMLElement[] = [];
  private trapStack: HTMLElement[] = [];

  /**
   * Save current focus and optionally move focus to a new element
   */
  saveFocus(newFocusElement?: HTMLElement | null): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus && currentFocus !== document.body) {
      this.focusStack.push(currentFocus);
    }

    if (newFocusElement) {
      this.setFocus(newFocusElement);
    }
  }

  /**
   * Restore previously saved focus
   */
  restoreFocus(): void {
    const lastFocus = this.focusStack.pop();
    if (lastFocus) {
      this.setFocus(lastFocus);
    }
  }

  /**
   * Set focus to an element with options
   */
  setFocus(element: HTMLElement, options: FocusManagementOptions = {}): void {
    if (!element) return;

    try {
      if (options.selectText && 'select' in element) {
        (element as HTMLInputElement).select();
      } else {
        element.focus({
          preventScroll: options.preventScroll,
        });
      }
    } catch (error) {
      console.warn('Failed to set focus:', error);
    }
  }

  /**
   * Trap focus within a container
   */
  trapFocus(container: HTMLElement): () => void {
    if (!container) return () => {};

    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.trapStack.push(container);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Set initial focus
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      this.trapStack = this.trapStack.filter(el => el !== container);
    };
  }

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
    ];

    const elements = container.querySelectorAll(focusableSelectors.join(','));

    return Array.from(elements).filter((element) => {
      const el = element as HTMLElement;
      return (
        !el.disabled &&
        !el.hidden &&
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        getComputedStyle(el).visibility !== 'hidden'
      );
    }) as HTMLElement[];
  }

  /**
   * Clear all saved focus states
   */
  clearFocusStack(): void {
    this.focusStack = [];
  }
}

// ============================================================================
// FOCUS MANAGER INSTANCE
// ============================================================================

export const focusManager = new FocusManager();

// ============================================================================
// ARIA HELPERS
// ============================================================================

export const aria = {
  /**
   * Set ARIA attributes on an element
   */
  set(element: HTMLElement, attributes: Record<string, string | boolean | number>): void {
    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`;
      element.setAttribute(ariaKey, String(value));
    });
  },

  /**
   * Remove ARIA attributes from an element
   */
  remove(element: HTMLElement, attributes: string[]): void {
    attributes.forEach(attr => {
      const ariaKey = attr.startsWith('aria-') ? attr : `aria-${attr}`;
      element.removeAttribute(ariaKey);
    });
  },

  /**
   * Toggle ARIA attribute
   */
  toggle(element: HTMLElement, attribute: string): void {
    const ariaKey = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`;
    const current = element.getAttribute(ariaKey);
    const newValue = current === 'true' ? 'false' : 'true';
    element.setAttribute(ariaKey, newValue);
  },

  /**
   * Set up live region announcements
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const liveRegion = this.getLiveRegion(priority);
    liveRegion.textContent = message;

    // Clear after announcement to allow repeat announcements
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  },

  /**
   * Get or create live region for announcements
   */
  getLiveRegion(priority: 'polite' | 'assertive'): HTMLElement {
    const id = `live-region-${priority}`;
    let region = document.getElementById(id);

    if (!region) {
      region = document.createElement('div');
      region.id = id;
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      region.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `;
      document.body.appendChild(region);
    }

    return region;
  },
};