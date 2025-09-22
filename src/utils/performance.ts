/**
 * Performance Monitoring and Optimization Utilities
 * @fileoverview Advanced performance tracking and optimization tools
 */

import { useRef, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface LayoutShiftEntry extends PerformanceEntry {
  readonly value: number;
  readonly hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  readonly processingStart: number;
}

interface PerformanceMetrics {
  readonly lcp: number | null; // Largest Contentful Paint
  readonly fid: number | null; // First Input Delay
  readonly cls: number | null; // Cumulative Layout Shift
  readonly fcp: number | null; // First Contentful Paint
  readonly ttfb: number | null; // Time to First Byte
}

interface ComponentMetrics {
  readonly renderTime: number;
  readonly renderCount: number;
  readonly averageRenderTime: number;
  readonly lastRenderTime: Date;
}

interface BundleAnalysis {
  readonly totalSize: number;
  readonly gzippedSize: number;
  readonly chunks: readonly ChunkInfo[];
}

interface ChunkInfo {
  readonly name: string;
  readonly size: number;
  readonly gzippedSize: number;
  readonly modules: number;
}

// ============================================================================
// PERFORMANCE OBSERVER UTILITIES
// ============================================================================

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private componentMetrics = new Map<string, ComponentMetrics>();

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Largest Contentful Paint
    this.createObserver(['largest-contentful-paint'], (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      }
    });

    // First Input Delay
    this.createObserver(['first-input'], (entries) => {
      const firstEntry = entries[0] as FirstInputEntry | undefined;
      if (firstEntry) {
        const fid = firstEntry.processingStart - firstEntry.startTime;
        this.metrics.fid = fid;
        this.reportMetric('FID', fid);
      }
    });

    // Cumulative Layout Shift
    this.createObserver(['layout-shift'], (entries) => {
      let cls = 0;
      entries.forEach((entry) => {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          cls += layoutShiftEntry.value;
        }
      });
      this.metrics.cls = cls;
      this.reportMetric('CLS', cls);
    });

    // First Contentful Paint & Time to First Byte
    this.createObserver(['paint', 'navigation'], (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('FCP', entry.startTime);
        }
      });
    });

    // Navigation timing for TTFB
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        this.reportMetric('TTFB', this.metrics.ttfb);
      }
    }
  }

  private createObserver(entryTypes: string[], callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ entryTypes });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Failed to create performance observer:', error);
    }
  }

  private reportMetric(name: string, value: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Performance: ${name} = ${value.toFixed(2)}ms`);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value);
    }
  }

  private sendToAnalytics(metric: string, value: number): void {
    // Example: Google Analytics 4
    if ('gtag' in window) {
      const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric,
        value: Math.round(value),
        custom_map: { metric_value: value },
      });
    }

    // Example: Custom analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/metrics', JSON.stringify({
        metric,
        value,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }));
    }
  }

  // Component-level performance tracking
  recordComponentRender(componentName: string, renderTime: number): void {
    const existing = this.componentMetrics.get(componentName);

    if (existing) {
      const newRenderCount = existing.renderCount + 1;
      const newAverageRenderTime =
        (existing.averageRenderTime * existing.renderCount + renderTime) / newRenderCount;

      this.componentMetrics.set(componentName, {
        renderTime,
        renderCount: newRenderCount,
        averageRenderTime: newAverageRenderTime,
        lastRenderTime: new Date(),
      });
    } else {
      this.componentMetrics.set(componentName, {
        renderTime,
        renderCount: 1,
        averageRenderTime: renderTime,
        lastRenderTime: new Date(),
      });
    }

    // Warn about slow components in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`⚠️  Slow component render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics {
    return {
      lcp: this.metrics.lcp || null,
      fid: this.metrics.fid || null,
      cls: this.metrics.cls || null,
      fcp: this.metrics.fcp || null,
      ttfb: this.metrics.ttfb || null,
    };
  }

  getComponentMetrics(): ReadonlyMap<string, ComponentMetrics> {
    return this.componentMetrics;
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.componentMetrics.clear();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const performanceMonitor = new PerformanceMonitor();

// ============================================================================
// REACT HOOKS FOR PERFORMANCE MONITORING
// ============================================================================

export function useComponentPerformance(componentName: string) {
  const startTimeRef = useRef(performance.now());

  const recordRender = useCallback(() => {
    const renderTime = performance.now() - startTimeRef.current;
    performanceMonitor.recordComponentRender(componentName, renderTime);
    // Reset start time for next measurement
    startTimeRef.current = performance.now();
  }, [componentName]);

  return {
    recordRender,
  };
}

export function usePerformanceMetrics() {
  return {
    getMetrics: () => performanceMonitor.getMetrics(),
    getComponentMetrics: () => performanceMonitor.getComponentMetrics(),
  };
}

// ============================================================================
// BUNDLE SIZE ANALYSIS
// ============================================================================

export async function analyzeBundleSize(): Promise<BundleAnalysis> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Bundle analysis is only available in development mode');
  }

  // This would typically be integrated with webpack-bundle-analyzer or similar
  const mockAnalysis: BundleAnalysis = {
    totalSize: 0,
    gzippedSize: 0,
    chunks: [],
  };

  return mockAnalysis;
}

// ============================================================================
// MEMORY MONITORING
// ============================================================================

interface MemoryInfo {
  readonly usedJSHeapSize: number;
  readonly totalJSHeapSize: number;
  readonly jsHeapSizeLimit: number;
}

export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as typeof performance & { memory: MemoryInfo }).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }

  return null;
}

// ============================================================================
// PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * RequestAnimationFrame-based throttle
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// ============================================================================
// PRELOADING UTILITIES
// ============================================================================

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(sources: readonly string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

// ============================================================================
// RESOURCE HINTS
// ============================================================================

export function addResourceHint(href: string, rel: 'preload' | 'prefetch' | 'dns-prefetch' | 'preconnect', as?: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;

  if (as) {
    link.as = as;
  }

  document.head.appendChild(link);
}

// ============================================================================
// CLEANUP ON PAGE UNLOAD
// ============================================================================

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.destroy();
  });
}