export interface SystemSettings {
  gridParameters: {
    voltageThresholds: {
      high: number;
      low: number;
      critical: number;
    };
    frequencyLimits: {
      nominal: number;
      tolerance: number;
      emergency: number;
    };
    loadThresholds: {
      normal: number;
      high: number;
      critical: number;
    };
    efficiencyTargets: {
      minimum: number;
      target: number;
      excellent: number;
    };
  };
  alarmSettings: {
    criticalAlertDelay: number;
    warningAlertDelay: number;
    autoAcknowledgeTime: number;
    escalationTime: number;
    maxAlertsPerHour: number;
  };
  dataRetention: {
    realTimeData: number; // days
    historicalData: number; // days
    auditLogs: number; // days
    reportData: number; // days
    backupRetention: number; // days
  };
  backup: {
    autoBackupEnabled: boolean;
    backupInterval: number; // hours
    backupLocation: string;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
  };
}

export interface UserPreferences {
  dashboard: {
    defaultPage: string;
    refreshInterval: number;
    chartAnimations: boolean;
    compactMode: boolean;
    showWelcomeMessage: boolean;
  };
  notifications: {
    email: {
      enabled: boolean;
      criticalAlerts: boolean;
      dailyReports: boolean;
      weeklyReports: boolean;
      maintenanceAlerts: boolean;
    };
    inApp: {
      enabled: boolean;
      sound: boolean;
      desktop: boolean;
      criticalOnly: boolean;
    };
    sms: {
      enabled: boolean;
      number: string;
      criticalOnly: boolean;
    };
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    colorScheme: string;
    fontSize: 'small' | 'medium' | 'large';
    density: 'compact' | 'comfortable' | 'spacious';
    animations: boolean;
  };
  localization: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    numberFormat: string;
    currency: string;
  };
}

export interface SecuritySettings {
  authentication: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expirationDays: number;
      historyCount: number;
    };
    sessionSettings: {
      timeoutMinutes: number;
      maxConcurrentSessions: number;
      rememberMeEnabled: boolean;
      rememberMeDays: number;
    };
    mfaSettings: {
      enabled: boolean;
      required: boolean;
      methods: string[];
      backupCodes: boolean;
    };
  };
  accessControl: {
    roleBasedAccess: boolean;
    ipWhitelist: string[];
    geolocationRestrictions: boolean;
    allowedCountries: string[];
    deviceRegistration: boolean;
  };
  encryption: {
    dataAtRest: boolean;
    dataInTransit: boolean;
    algorithm: string;
    keyRotationDays: number;
  };
  audit: {
    logAllActions: boolean;
    logFailedAttempts: boolean;
    logDataAccess: boolean;
    logConfigChanges: boolean;
    retentionDays: number;
  };
}

export interface IntegrationSettings {
  apis: {
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
    enableCaching: boolean;
    cacheTimeout: number;
  };
  externalSystems: {
    scada: {
      enabled: boolean;
      endpoint: string;
      protocol: string;
      pollInterval: number;
      timeout: number;
    };
    ems: {
      enabled: boolean;
      endpoint: string;
      apiKey: string;
      syncInterval: number;
    };
    weather: {
      enabled: boolean;
      provider: string;
      apiKey: string;
      updateInterval: number;
    };
    market: {
      enabled: boolean;
      provider: string;
      apiKey: string;
      updateInterval: number;
    };
  };
  database: {
    connectionPool: number;
    queryTimeout: number;
    backupEnabled: boolean;
    replicationEnabled: boolean;
  };
  messaging: {
    email: {
      provider: string;
      smtpHost: string;
      smtpPort: number;
      username: string;
      encryption: string;
    };
    sms: {
      provider: string;
      apiKey: string;
      fromNumber: string;
    };
    slack: {
      enabled: boolean;
      webhookUrl: string;
      channel: string;
    };
  };
}

export interface ThemeSettings {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    neutral: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      base: number;
      scale: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  layout: {
    sidebarWidth: number;
    headerHeight: number;
    borderRadius: number;
    spacing: number;
  };
  branding: {
    logo: string;
    favicon: string;
    companyName: string;
    tagline: string;
  };
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  database: number;
  uptime: number;
  lastBackup: number;
  version: string;
  license: {
    type: string;
    expiresAt: number;
    features: string[];
  };
}

export interface SettingsState {
  systemSettings: SystemSettings;
  userPreferences: UserPreferences;
  securitySettings: SecuritySettings;
  integrationSettings: IntegrationSettings;
  themeSettings: ThemeSettings;
  systemHealth: SystemHealth;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: number;
  
  // Actions
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  updateIntegrationSettings: (settings: Partial<IntegrationSettings>) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  saveSettings: () => Promise<void>;
  resetToDefaults: (category: string) => void;
  exportSettings: () => void;
  importSettings: (file: File) => Promise<void>;
  testConnection: (service: string) => Promise<boolean>;
  refreshSystemHealth: () => void;
}