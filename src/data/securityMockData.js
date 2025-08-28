// Comprehensive security mock data
export const securityEvents = [
  {
    id: 'evt_001',
    type: 'login_success',
    user: 'admin@company.com',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: { sessionId: 'sess_abc123', location: 'New York, NY' }
  },
  {
    id: 'evt_002',
    type: 'failed_login',
    user: 'unknown@hacker.com',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    ip: '45.123.456.789',
    userAgent: 'curl/7.68.0',
    details: { reason: 'Invalid credentials', attempts: 3 }
  },
  {
    id: 'evt_003',
    type: 'data_access',
    user: 'analyst@company.com',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.105',
    resource: 'grid_topology',
    details: { action: 'view', nodeId: 'gen-1' }
  },
  {
    id: 'evt_004',
    type: 'permission_denied',
    user: 'viewer@company.com',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    ip: '192.168.1.110',
    resource: 'optimization_settings',
    details: { requiredRole: 'operator', userRole: 'viewer' }
  },
  {
    id: 'evt_005',
    type: 'suspicious_activity',
    user: 'operator@company.com',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    ip: '10.0.0.50',
    details: { activity: 'Multiple rapid API calls', count: 150, timeWindow: '1 minute' }
  },
  {
    id: 'evt_006',
    type: 'password_change',
    user: 'admin@company.com',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    details: { method: '2FA_verified' }
  },
  {
    id: 'evt_007',
    type: 'api_key_created',
    user: 'admin@company.com',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    details: { keyName: 'Production API', permissions: ['read', 'write'] }
  },
  {
    id: 'evt_008',
    type: 'session_timeout',
    user: 'operator@company.com',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.102',
    details: { sessionDuration: 3600000, reason: 'inactivity' }
  }
];

export const userSessions = [
  {
    id: 'sess_123',
    user: 'admin@company.com',
    userId: 'user_1',
    loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'New York, NY',
    status: 'active'
  },
  {
    id: 'sess_456',
    user: 'operator@company.com',
    userId: 'user_2',
    loginTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    location: 'San Francisco, CA',
    status: 'active'
  },
  {
    id: 'sess_789',
    user: 'analyst@company.com',
    userId: 'user_3',
    loginTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    location: 'Chicago, IL',
    status: 'expired'
  }
];

export const securityMetrics = {
  totalUsers: 127,
  activeUsers: 23,
  activeSessions: 45,
  failedLogins: 8,
  securityScore: 95,
  lastSecurityScan: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  vulnerabilities: {
    critical: 0,
    high: 1,
    medium: 3,
    low: 7
  },
  compliance: {
    gdpr: 98,
    sox: 95,
    iso27001: 92
  }
};

export const apiKeys = [
  {
    id: 'key_1',
    name: 'Production API',
    key: 'sk-prod-***************abc123',
    created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    permissions: ['read', 'write'],
    status: 'active',
    usage: {
      requests: 15420,
      rateLimit: 1000,
      quotaUsed: 65
    }
  },
  {
    id: 'key_2',
    name: 'Development API',
    key: 'sk-dev-***************def456',
    created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    permissions: ['read'],
    status: 'active',
    usage: {
      requests: 8930,
      rateLimit: 500,
      quotaUsed: 45
    }
  },
  {
    id: 'key_3',
    name: 'Analytics API',
    key: 'sk-analytics-***************ghi789',
    created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    permissions: ['read'],
    status: 'revoked',
    usage: {
      requests: 5670,
      rateLimit: 200,
      quotaUsed: 0
    }
  }
];

export const securityAlerts = [
  {
    id: 'alert_001',
    type: 'critical',
    title: 'Multiple Failed Login Attempts',
    message: 'Detected 5 failed login attempts from IP 45.123.456.789 in the last 10 minutes',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'active',
    source: 'authentication_system',
    details: {
      ip: '45.123.456.789',
      attempts: 5,
      timeWindow: '10 minutes',
      targetUsers: ['admin@company.com', 'operator@company.com']
    }
  },
  {
    id: 'alert_002',
    type: 'warning',
    title: 'Unusual API Usage Pattern',
    message: 'API key "Production API" exceeded normal usage by 300% in the last hour',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'investigating',
    source: 'api_monitoring',
    details: {
      keyId: 'key_1',
      normalUsage: 100,
      currentUsage: 400,
      timeWindow: '1 hour'
    }
  },
  {
    id: 'alert_003',
    type: 'info',
    title: 'Security Scan Completed',
    message: 'Weekly security scan completed successfully with 95% security score',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'resolved',
    source: 'security_scanner',
    details: {
      score: 95,
      previousScore: 93,
      improvement: 2,
      scanDuration: '45 minutes'
    }
  }
];

export const complianceReports = [
  {
    id: 'comp_001',
    standard: 'GDPR',
    score: 98,
    lastAudit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextAudit: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'compliant',
    findings: [
      { type: 'minor', description: 'Data retention policy documentation needs update' }
    ]
  },
  {
    id: 'comp_002',
    standard: 'SOX',
    score: 95,
    lastAudit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    nextAudit: new Date(Date.now() + 78 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'compliant',
    findings: [
      { type: 'medium', description: 'Access control review process needs enhancement' }
    ]
  },
  {
    id: 'comp_003',
    standard: 'ISO 27001',
    score: 92,
    lastAudit: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    nextAudit: new Date(Date.now() + 71 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'compliant',
    findings: [
      { type: 'medium', description: 'Incident response plan requires update' },
      { type: 'minor', description: 'Security awareness training completion tracking' }
    ]
  }
];

export const generateSecurityTimelineData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      loginAttempts: Math.floor(Math.random() * 50) + 20,
      failedLogins: Math.floor(Math.random() * 10),
      securityEvents: Math.floor(Math.random() * 15) + 5,
      apiCalls: Math.floor(Math.random() * 1000) + 500,
      securityScore: Math.floor(Math.random() * 10) + 90
    });
  }
  
  return data;
};

export const generateThreatIntelligence = () => {
  return [
    {
      id: 'threat_001',
      type: 'malware',
      severity: 'high',
      source: 'external_feed',
      indicator: '45.123.456.789',
      description: 'Known botnet command and control server',
      firstSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      confidence: 95
    },
    {
      id: 'threat_002',
      type: 'phishing',
      severity: 'medium',
      source: 'internal_detection',
      indicator: 'suspicious-grid-login.com',
      description: 'Domain mimicking legitimate grid management portal',
      firstSeen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      confidence: 87
    },
    {
      id: 'threat_003',
      type: 'vulnerability',
      severity: 'critical',
      source: 'vulnerability_scanner',
      indicator: 'CVE-2024-1234',
      description: 'Remote code execution in grid management software',
      firstSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 100
    }
  ];
};