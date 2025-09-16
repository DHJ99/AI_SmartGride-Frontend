type SecurityLevel = 'info' | 'warning' | 'error' | 'critical'

export interface SecurityEventDetails {
  ip?: string
  userAgent?: string
  url?: string
  [key: string]: unknown
}

export interface SecurityEvent {
  id: string
  timestamp: string
  event: string
  level: SecurityLevel
  details: SecurityEventDetails
}

class SecurityLogger {
  private events: SecurityEvent[] = []
  private maxEvents = 1000

  log(event: string, details: SecurityEventDetails = {}, level: SecurityLevel = 'info'): SecurityEvent {
    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      event,
      level,
      details: {
        ...details,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        ip: details.ip || 'unknown'
      }
    }

    this.events.unshift(securityEvent)

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents)
    }

    switch (level) {
      case 'error':
      case 'critical':
        console.error('Security Event:', securityEvent)
        break
      case 'warning':
        console.warn('Security Event:', securityEvent)
        break
      default:
        console.info('Security Event:', securityEvent)
    }

    this.sendToMonitoring(securityEvent)
    return securityEvent
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async sendToMonitoring(event: SecurityEvent): Promise<void> {
    return
  }

  getEvents(filter: { level?: SecurityLevel; event?: string; since?: string | Date } = {}): SecurityEvent[] {
    let filteredEvents = [...this.events]

    if (filter.level) {
      filteredEvents = filteredEvents.filter(e => e.level === filter.level)
    }

    if (filter.event) {
      filteredEvents = filteredEvents.filter(e => e.event.toLowerCase().includes(filter.event!.toLowerCase()))
    }

    if (filter.since) {
      const sinceDate = new Date(filter.since)
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) >= sinceDate)
    }

    return filteredEvents
  }

  clearEvents(): void {
    this.events = []
  }
}

export const securityLogger = new SecurityLogger()

export const logSecurityEvent = (event: string, details: SecurityEventDetails = {}) => {
  return securityLogger.log(event, details, 'info')
}

export const logSecurityWarning = (event: string, details: SecurityEventDetails = {}) => {
  return securityLogger.log(event, details, 'warning')
}

export const logSecurityError = (event: string, details: SecurityEventDetails = {}) => {
  return securityLogger.log(event, details, 'error')
}

export const logSecurityCritical = (event: string, details: SecurityEventDetails = {}) => {
  return securityLogger.log(event, details, 'critical')
}

export const logLoginAttempt = (email: string, success: boolean, details: SecurityEventDetails = {}) => {
  const event = success ? 'login_success' : 'login_failed'
  const level: SecurityLevel = success ? 'info' : 'warning'
  return securityLogger.log(
    event,
    {
      email,
      success,
      ...details
    },
    level
  )
}

export const logDataAccess = (resource: string, action: string, details: SecurityEventDetails = {}) => {
  return securityLogger.log('data_access', { resource, action, ...details })
}

export const logPermissionDenied = (
  resource: string,
  requiredRole: string,
  userRole: string,
  details: SecurityEventDetails = {}
) => {
  return securityLogger.log('permission_denied', { resource, requiredRole, userRole, ...details }, 'warning')
}

export const logSuspiciousActivity = (activity: string, details: SecurityEventDetails = {}) => {
  return securityLogger.log('suspicious_activity', { activity, ...details }, 'error')
}


