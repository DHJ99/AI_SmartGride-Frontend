// Network security configuration
export const networkSecurityConfig = {
  // HTTPS enforcement
  httpsConfig: {
    enforceHTTPS: true,
    strictTransportSecurity: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    certificateTransparency: true,
    publicKeyPinning: {
      enabled: false, // Enable in production with proper pins
      pins: [],
      maxAge: 5184000, // 60 days
      includeSubDomains: true
    }
  },

  // CORS configuration
  corsConfig: {
    origin: [
      'https://smartgrid.company.com',
      'https://app.smartgrid.company.com',
      'https://admin.smartgrid.company.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Request-ID',
      'X-API-Key'
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200
  },

  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Remove in production, use nonces
        'https://cdnjs.cloudflare.com',
        'https://cdn.jsdelivr.net'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Remove in production, use nonces
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
        'blob:'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      'connect-src': [
        "'self'",
        'wss:',
        'https:',
        'https://api.smartgrid.company.com'
      ],
      'media-src': ["'self'"],
      'object-src': ["'none'"],
      'frame-src': ["'none'"],
      'worker-src': ["'self'"],
      'manifest-src': ["'self'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': []
    },
    reportUri: '/api/csp-report',
    reportOnly: false
  },

  // Firewall rules simulation
  firewallRules: [
    {
      id: 'rule_001',
      name: 'Allow HTTPS',
      port: 443,
      protocol: 'TCP',
      source: '0.0.0.0/0',
      action: 'ALLOW',
      priority: 100
    },
    {
      id: 'rule_002',
      name: 'Redirect HTTP to HTTPS',
      port: 80,
      protocol: 'TCP',
      source: '0.0.0.0/0',
      action: 'REDIRECT_TO_HTTPS',
      priority: 200
    },
    {
      id: 'rule_003',
      name: 'Allow SSH (Admin IPs only)',
      port: 22,
      protocol: 'TCP',
      source: ['192.168.1.0/24', '10.0.0.0/8'],
      action: 'ALLOW',
      priority: 300
    },
    {
      id: 'rule_004',
      name: 'Block known malicious IPs',
      port: '*',
      protocol: '*',
      source: [
        '45.123.456.0/24',
        '192.0.2.0/24',
        '198.51.100.0/24'
      ],
      action: 'DENY',
      priority: 50
    },
    {
      id: 'rule_005',
      name: 'Rate limit API endpoints',
      port: 443,
      protocol: 'TCP',
      source: '0.0.0.0/0',
      action: 'RATE_LIMIT',
      rateLimit: {
        requests: 100,
        window: 60,
        burst: 200
      },
      priority: 150
    },
    {
      id: 'rule_006',
      name: 'Default deny all',
      port: '*',
      protocol: '*',
      source: '0.0.0.0/0',
      action: 'DENY',
      priority: 9999
    }
  ],

  // DDoS protection configuration
  ddosProtection: {
    enabled: true,
    requestsPerSecond: 100,
    burstSize: 200,
    blacklistDuration: 3600, // 1 hour
    whitelist: [
      '192.168.1.0/24',
      '10.0.0.0/8',
      '172.16.0.0/12'
    ],
    geoBlocking: {
      enabled: true,
      blockedCountries: ['CN', 'RU', 'KP', 'IR'],
      allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU']
    },
    challengeMode: {
      enabled: true,
      threshold: 50, // requests per minute
      challengeType: 'captcha', // captcha, javascript, managed
      duration: 300 // 5 minutes
    }
  },

  // Web Application Firewall (WAF) rules
  wafRules: [
    {
      id: 'waf_001',
      name: 'SQL Injection Protection',
      pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)|(\b(UNION|OR|AND)\s+\d+\s*=\s*\d+)|('.*')|(--.*)|(\/\*.*\*\/)/gi,
      action: 'BLOCK',
      severity: 'HIGH'
    },
    {
      id: 'waf_002',
      name: 'XSS Protection',
      pattern: /(<script[^>]*>.*?<\/script>)|(<iframe[^>]*>)|(<object[^>]*>)|(<embed[^>]*>)|(javascript:)|(on\w+\s*=)/gi,
      action: 'BLOCK',
      severity: 'HIGH'
    },
    {
      id: 'waf_003',
      name: 'Path Traversal Protection',
      pattern: /(\.\.\/)|(\.\.\%2F)|(\.\.\%5C)|(\.\.\\)/gi,
      action: 'BLOCK',
      severity: 'MEDIUM'
    },
    {
      id: 'waf_004',
      name: 'Command Injection Protection',
      pattern: /(\b(cat|ls|pwd|id|whoami|uname|ps|netstat|ifconfig|ping|nslookup|dig|curl|wget)\b)|(\||;|&|`|\$\()/gi,
      action: 'BLOCK',
      severity: 'HIGH'
    },
    {
      id: 'waf_005',
      name: 'File Upload Protection',
      pattern: /\.(php|jsp|asp|aspx|exe|bat|cmd|sh|py|pl|rb)$/gi,
      action: 'BLOCK',
      severity: 'MEDIUM'
    }
  ],

  // SSL/TLS configuration
  tlsConfig: {
    minVersion: 'TLSv1.2',
    preferredVersion: 'TLSv1.3',
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES128-GCM-SHA256'
    ],
    certificateValidation: {
      ocspStapling: true,
      certificateTransparency: true,
      hpkp: false // HTTP Public Key Pinning
    }
  },

  // Network monitoring
  monitoring: {
    enabled: true,
    logLevel: 'INFO',
    metrics: {
      requestCount: true,
      responseTime: true,
      errorRate: true,
      bandwidthUsage: true,
      connectionCount: true
    },
    alerting: {
      enabled: true,
      thresholds: {
        errorRate: 5, // percentage
        responseTime: 2000, // milliseconds
        requestRate: 1000, // requests per minute
        connectionCount: 10000
      }
    }
  },

  // API security
  apiSecurity: {
    rateLimit: {
      windowMs: 60000, // 1 minute
      max: 100, // requests per window
      standardHeaders: true,
      legacyHeaders: false
    },
    authentication: {
      required: true,
      methods: ['bearer', 'api-key'],
      tokenExpiry: 3600 // 1 hour
    },
    validation: {
      requestSize: 1048576, // 1MB
      parameterPollution: false,
      strictMode: true
    }
  }
};

// Network security utilities
export const networkSecurityUtils = {
  // Check if IP is in whitelist
  isWhitelisted: (ip) => {
    const whitelist = networkSecurityConfig.ddosProtection.whitelist;
    return whitelist.some(range => {
      if (range.includes('/')) {
        // CIDR notation check (simplified)
        const [network, mask] = range.split('/');
        return ip.startsWith(network.split('.').slice(0, parseInt(mask) / 8).join('.'));
      }
      return ip === range;
    });
  },

  // Apply WAF rules
  checkWafRules: (input) => {
    const violations = [];
    
    networkSecurityConfig.wafRules.forEach(rule => {
      if (rule.pattern.test(input)) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          action: rule.action
        });
      }
    });
    
    return violations;
  },

  // Generate CSP header
  generateCSPHeader: () => {
    const directives = networkSecurityConfig.contentSecurityPolicy.directives;
    const cspString = Object.entries(directives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
    
    return cspString;
  },

  // Validate request against security policies
  validateRequest: (request) => {
    const violations = [];
    
    // Check WAF rules
    const wafViolations = networkSecurityUtils.checkWafRules(request.body || '');
    violations.push(...wafViolations);
    
    // Check request size
    if (request.size > networkSecurityConfig.apiSecurity.validation.requestSize) {
      violations.push({
        type: 'REQUEST_SIZE',
        message: 'Request size exceeds limit'
      });
    }
    
    return violations;
  }
};