// Error reporting and logging utilities
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
  buildVersion: string;
  environment: string;
}

class ErrorReporter {
  private sessionId: string;
  private buildVersion: string;
  private environment: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.buildVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
    this.environment = import.meta.env.MODE || 'development';
    
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        buildVersion: this.buildVersion,
        environment: this.environment,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        buildVersion: this.buildVersion,
        environment: this.environment,
      });
    });
  }

  reportError(errorReport: ErrorReport) {
    // Log to console in development
    if (this.environment === 'development') {
      console.error('Error Report:', errorReport);
    }

    // In production, send to error reporting service
    if (this.environment === 'production') {
      this.sendToErrorService(errorReport);
    }

    // Store locally for debugging
    this.storeErrorLocally(errorReport);
  }

  private async sendToErrorService(errorReport: ErrorReport) {
    try {
      // In a real app, this would send to services like Sentry, LogRocket, etc.
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  private storeErrorLocally(errorReport: ErrorReport) {
    try {
      const errors = JSON.parse(localStorage.getItem('error-reports') || '[]');
      errors.push(errorReport);
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('error-reports', JSON.stringify(errors));
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  getStoredErrors(): ErrorReport[] {
    try {
      return JSON.parse(localStorage.getItem('error-reports') || '[]');
    } catch {
      return [];
    }
  }

  clearStoredErrors() {
    localStorage.removeItem('error-reports');
  }
}

export const errorReporter = new ErrorReporter();