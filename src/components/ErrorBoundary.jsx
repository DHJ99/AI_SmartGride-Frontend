import React from 'react';
import { logSecurityError } from '@/utils/securityLogger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log security-related errors
    const isSecurityError = this.isSecurityRelatedError(error);
    
    if (isSecurityError) {
      logSecurityError('component_error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        securityRelated: true
      });
    } else {
      console.error('Component Error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });

    // Report to error monitoring service in production
    if (import.meta.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, isSecurityError);
    }
  }

  isSecurityRelatedError(error) {
    const securityKeywords = [
      'permission',
      'unauthorized',
      'forbidden',
      'authentication',
      'csrf',
      'xss',
      'injection',
      'security'
    ];

    const errorMessage = error.message.toLowerCase();
    return securityKeywords.some(keyword => errorMessage.includes(keyword));
  }

  reportError(error, errorInfo, isSecurityError) {
    // In production, send to error monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: sessionStorage.getItem('userId'),
      sessionId: sessionStorage.getItem('sessionId'),
      securityRelated: isSecurityError
    };

    // Mock API call - replace with actual error reporting service
    console.log('Error Report:', errorReport);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but something unexpected happened. The error has been logged and our team has been notified.
            </p>

            {import.meta.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <summary className="cursor-pointer font-medium text-gray-900 dark:text-white mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              Error ID: {Date.now().toString(36)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;