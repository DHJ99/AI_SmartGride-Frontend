// Infrastructure security configuration
export const infrastructureConfig = {
  // Server hardening configuration
  serverHardening: {
    operatingSystem: {
      name: 'Ubuntu Server',
      version: '22.04 LTS',
      kernel: 'Linux 5.15.0-secure',
      hardening: 'CIS Level 1',
      lastUpdate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      autoUpdates: true,
      securityPatches: 'automatic'
    },
    
    services: {
      ssh: {
        port: 2222, // Non-standard port
        keyOnly: true,
        rootLogin: false,
        maxAuthTries: 3,
        clientAliveInterval: 300,
        protocol: 2,
        allowUsers: ['admin', 'operator'],
        denyUsers: ['root', 'guest']
      },
      
      firewall: {
        status: 'active',
        defaultPolicy: 'deny',
        rules: 'restrictive',
        logLevel: 'medium',
        rateLimiting: true,
        geoBlocking: true
      },
      
      fail2ban: {
        enabled: true,
        maxRetries: 3,
        banTime: 3600, // 1 hour
        findTime: 600, // 10 minutes
        jails: ['ssh', 'apache', 'nginx', 'postfix']
      },
      
      auditd: {
        enabled: true,
        logFile: '/var/log/audit/audit.log',
        maxLogFile: 100, // MB
        numLogs: 10,
        rules: 'comprehensive'
      }
    },
    
    filesystem: {
      encryption: 'LUKS2',
      integrityChecking: 'AIDE',
      permissions: 'restrictive',
      noexec: ['/tmp', '/var/tmp', '/dev/shm'],
      readonly: ['/boot', '/usr'],
      separatePartitions: ['/var', '/tmp', '/home', '/var/log']
    
    },
    
    networking: {
      ipv6: false,
      tcpWrappers: true,
      synCookies: true,
      icmpRedirects: false,
      sourceRouting: false,
      logMartians: true,
      rpFilter: 'strict'
    }
  },

  // Container security configuration
  containerSecurity: {
    runtime: {
      name: 'Docker',
      version: '24.0.7',
      mode: 'rootless',
      daemon: 'hardened',
      userNamespaces: true,
      seccomp: 'default',
      apparmor: 'enabled'
    },
    
    imageScanning: {
      enabled: true,
      scanner: 'Trivy',
      scanOnPush: true,
      scanOnPull: true,
      vulnerabilityThreshold: 'medium',
      allowedRegistries: [
        'docker.io',
        'gcr.io',
        'registry.company.com'
      ],
      signatureVerification: true
    },
    
    secretsManagement: {
      provider: 'Docker Secrets',
      encryption: 'AES-256-GCM',
      rotation: 'automatic',
      rotationInterval: '90 days',
      accessLogging: true
    },
    
    networkPolicies: {
      enabled: true,
      defaultDeny: true,
      segmentation: 'micro',
      encryption: 'TLS 1.3',
      monitoring: 'comprehensive'
    },
    
    resourceLimits: {
      memory: '2GB',
      cpu: '1.0',
      storage: '10GB',
      processes: 1024,
      fileDescriptors: 65536,
      networkConnections: 1000
    },
    
    compliance: {
      cis: 'Level 1',
      nist: 'SP 800-190',
      pci: 'DSS 4.0',
      scanning: 'continuous'
    }
  },

  // Cloud security configuration
  cloudSecurity: {
    provider: 'AWS',
    region: 'us-east-1',
    
    iam: {
      policy: 'least-privilege',
      mfa: 'required',
      passwordPolicy: 'strong',
      accessKeys: 'rotated',
      roles: 'assumed',
      crossAccountAccess: 'restricted'
    },
    
    vpc: {
      isolation: 'complete',
      subnets: 'private',
      natGateway: 'managed',
      flowLogs: 'enabled',
      dnsResolution: 'private'
    },
    
    securityGroups: {
      defaultDeny: true,
      leastPrivilege: true,
      documentation: 'required',
      review: 'quarterly',
      automation: 'terraform'
    },
    
    encryption: {
      atRest: 'AES-256',
      inTransit: 'TLS 1.3',
      keyManagement: 'AWS KMS',
      keyRotation: 'automatic',
      envelopeEncryption: true
    },
    
    monitoring: {
      cloudTrail: 'enabled',
      cloudWatch: 'comprehensive',
      config: 'enabled',
      guardDuty: 'enabled',
      securityHub: 'enabled',
      inspector: 'enabled'
    },
    
    backup: {
      frequency: 'daily',
      retention: '30 days',
      crossRegion: true,
      encryption: true,
      testing: 'monthly'
    },
    
    compliance: {
      soc2: 'Type II',
      iso27001: 'certified',
      pci: 'Level 1',
      hipaa: 'compliant',
      gdpr: 'compliant'
    }
  },

  // Network security architecture
  networkSecurity: {
    architecture: 'zero-trust',
    
    perimeter: {
      waf: 'AWS WAF',
      ddos: 'AWS Shield Advanced',
      cdn: 'CloudFlare',
      loadBalancer: 'Application Load Balancer',
      ssl: 'TLS 1.3'
    },
    
    segmentation: {
      dmz: 'isolated',
      internal: 'microsegmented',
      database: 'isolated',
      management: 'separate',
      guest: 'quarantined'
    },
    
    monitoring: {
      ids: 'Suricata',
      ips: 'Snort',
      siem: 'Splunk',
      netflow: 'enabled',
      packetCapture: 'selective'
    },
    
    vpn: {
      type: 'WireGuard',
      authentication: 'certificate',
      encryption: 'ChaCha20-Poly1305',
      perfectForwardSecrecy: true,
      splitTunneling: false
    }
  },

  // Database security
  databaseSecurity: {
    engine: 'PostgreSQL',
    version: '15.4',
    
    encryption: {
      atRest: 'AES-256',
      inTransit: 'TLS 1.3',
      columnLevel: 'sensitive data',
      keyManagement: 'external'
    },
    
    access: {
      authentication: 'certificate',
      authorization: 'RBAC',
      auditing: 'comprehensive',
      connectionLimits: 'enforced',
      timeouts: 'configured'
    },
    
    backup: {
      frequency: 'continuous',
      encryption: true,
      compression: true,
      retention: '1 year',
      testing: 'weekly'
    },
    
    monitoring: {
      performance: 'real-time',
      security: 'comprehensive',
      compliance: 'automated',
      alerting: 'immediate'
    }
  },

  // Application security
  applicationSecurity: {
    framework: 'React',
    version: '18.3.1',
    
    dependencies: {
      scanning: 'automated',
      updates: 'managed',
      vulnerabilities: 'tracked',
      licenses: 'compliant'
    },
    
    codeQuality: {
      staticAnalysis: 'SonarQube',
      dynamicAnalysis: 'OWASP ZAP',
      dependencyCheck: 'OWASP Dependency Check',
      secretScanning: 'GitLeaks'
    },
    
    runtime: {
      waf: 'ModSecurity',
      rasp: 'Contrast Security',
      monitoring: 'New Relic',
      logging: 'structured'
    }
  },

  // Incident response infrastructure
  incidentResponse: {
    soc: {
      tier1: '24/7',
      tier2: 'business hours',
      tier3: 'on-call',
      escalation: 'automated'
    },
    
    tools: {
      siem: 'Splunk Enterprise',
      soar: 'Phantom',
      ticketing: 'ServiceNow',
      communication: 'Slack'
    },
    
    forensics: {
      imaging: 'automated',
      analysis: 'SANS SIFT',
      chain_of_custody: 'digital',
      retention: '7 years'
    }
  },

  // Business continuity
  businessContinuity: {
    rto: '4 hours', // Recovery Time Objective
    rpo: '1 hour',  // Recovery Point Objective
    
    backup: {
      strategy: '3-2-1',
      frequency: 'continuous',
      testing: 'monthly',
      automation: 'full'
    },
    
    disaster_recovery: {
      site: 'hot standby',
      location: 'geographically separate',
      testing: 'quarterly',
      documentation: 'current'
    }
  }
};

// Infrastructure monitoring utilities
export const infrastructureMonitoring = {
  // Health check endpoints
  healthChecks: {
    application: '/health',
    database: '/health/db',
    cache: '/health/cache',
    external: '/health/external'
  },

  // Metrics collection
  metrics: {
    system: ['cpu', 'memory', 'disk', 'network'],
    application: ['response_time', 'error_rate', 'throughput'],
    security: ['failed_logins', 'blocked_requests', 'vulnerability_count'],
    business: ['active_users', 'transactions', 'revenue']
  },

  // Alerting thresholds
  alerts: {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 80, critical: 95 },
    disk: { warning: 85, critical: 95 },
    response_time: { warning: 2000, critical: 5000 },
    error_rate: { warning: 5, critical: 10 },
    failed_logins: { warning: 10, critical: 50 }
  },

  // Log aggregation
  logging: {
    format: 'JSON',
    level: 'INFO',
    retention: '90 days',
    compression: true,
    encryption: true
  }
};

// Security baseline validation
export const securityBaseline = {
  // CIS Controls implementation
  cisControls: {
    'CIS-1': 'Inventory and Control of Hardware Assets',
    'CIS-2': 'Inventory and Control of Software Assets',
    'CIS-3': 'Continuous Vulnerability Management',
    'CIS-4': 'Controlled Use of Administrative Privileges',
    'CIS-5': 'Secure Configuration for Hardware and Software',
    'CIS-6': 'Maintenance, Monitoring and Analysis of Audit Logs',
    'CIS-7': 'Email and Web Browser Protections',
    'CIS-8': 'Malware Defenses',
    'CIS-9': 'Limitation and Control of Network Ports',
    'CIS-10': 'Data Recovery Capabilities'
  },

  // NIST Framework mapping
  nistMapping: {
    identify: ['Asset Management', 'Business Environment', 'Governance'],
    protect: ['Access Control', 'Awareness Training', 'Data Security'],
    detect: ['Anomalies and Events', 'Security Monitoring'],
    respond: ['Response Planning', 'Communications', 'Analysis'],
    recover: ['Recovery Planning', 'Improvements', 'Communications']
  },

  // Validation checks
  validationChecks: [
    'Password policy enforcement',
    'Multi-factor authentication',
    'Encryption at rest and in transit',
    'Network segmentation',
    'Patch management',
    'Backup and recovery',
    'Incident response procedures',
    'Security awareness training',
    'Vulnerability management',
    'Access control reviews'
  ]
};