// Performance monitoring utilities
export const performanceMonitor = {
  // Mark performance timing
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        return measure.duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },

  // Get navigation timing
  getNavigationTiming: () => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    }
    return null;
  },

  // Monitor component render time
  measureRender: (componentName: string, renderFn: () => void) => {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    
    performanceMonitor.mark(startMark);
    renderFn();
    performanceMonitor.mark(endMark);
    
    return performanceMonitor.measure(`${componentName}-render`, startMark, endMark);
  },
};

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memory usage monitoring
export const memoryMonitor = {
  getUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100, // MB
        total: Math.round((memory.totalJSHeapSize / 1048576) * 100) / 100, // MB
        limit: Math.round((memory.jsHeapSizeLimit / 1048576) * 100) / 100, // MB
      };
    }
    return null;
  },

  logUsage: (context: string) => {
    const usage = memoryMonitor.getUsage();
    if (usage) {
      console.log(`Memory usage (${context}):`, usage);
    }
  },
};