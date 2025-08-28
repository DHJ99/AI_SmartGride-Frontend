// Security event logging
class SecurityLogger {
  constructor() {
    this.events = [];
    this.maxEvents = 1000;
  }

  log(event, details = {}, level = 'info') {
    const securityEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      event,
      level,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        url: window.location.href,
        ip: details.ip || 'unknown'
      }
    };

    this.events.unshift(securityEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Log to console based on level
    switch (level) {
      case 'error':
      case 'critical':
        console.error('Security Event:', securityEvent);
        break;
      case 'warning':
        console.warn('Security Event:', securityEvent);
        break;
      default:
        console.info('Security Event:', securityEvent);
    }

    // In production, send to security monitoring service
    this.sendToMonitoring(securityEvent);

    return securityEvent;
  }

  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendToMonitoring(event) {
    // In production, send to security monitoring service.
    // For demo, keep in-memory only to avoid storing identifiers in web storage.
    return;
  }

  getEvents(filter = {}) {
    let filteredEvents = [...this.events];

    if (filter.level) {
      filteredEvents = filteredEvents.filter(event => event.level === filter.level);
    }

    if (filter.event) {
      filteredEvents = filteredEvents.filter(event => 
        event.event.toLowerCase().includes(filter.event.toLowerCase())
      );
    }

    if (filter.since) {
      const sinceDate = new Date(filter.since);
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.timestamp) >= sinceDate
      );
    }

    return filteredEvents;
  }

  clearEvents() {
    this.events = [];
  }
}

export const securityLogger = new SecurityLogger();

// Convenience methods for common security events
export const logSecurityEvent = (event, details = {}) => {
  return securityLogger.log(event, details, 'info');
};

export const logSecurityWarning = (event, details = {}) => {
  return securityLogger.log(event, details, 'warning');
};

export const logSecurityError = (event, details = {}) => {
  return securityLogger.log(event, details, 'error');
};

export const logSecurityCritical = (event, details = {}) => {
  return securityLogger.log(event, details, 'critical');
};

// Specific event loggers
export const logLoginAttempt = (email, success, details = {}) => {
  const event = success ? 'login_success' : 'login_failed';
  const level = success ? 'info' : 'warning';
  
  return securityLogger.log(event, {
    email,
    success,
    ...details
  }, level);
};

export const logDataAccess = (resource, action, details = {}) => {
  return securityLogger.log('data_access', {
    resource,
    action,
    ...details
  });
};

export const logPermissionDenied = (resource, requiredRole, userRole, details = {}) => {
  return securityLogger.log('permission_denied', {
    resource,
    requiredRole,
    userRole,
    ...details
  }, 'warning');
};

export const logSuspiciousActivity = (activity, details = {}) => {
  return securityLogger.log('suspicious_activity', {
    activity,
    ...details
  }, 'error');
};