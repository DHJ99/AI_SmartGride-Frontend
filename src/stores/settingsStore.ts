import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SettingsState, SystemSettings, UserPreferences, SecuritySettings, IntegrationSettings, ThemeSettings, SystemHealth } from '../types/settings';

// Default settings
const defaultSystemSettings: SystemSettings = {
  gridParameters: {
    voltageThresholds: {
      high: 380,
      low: 320,
      critical: 300,
    },
    frequencyLimits: {
      nominal: 60.0,
      tolerance: 0.5,
      emergency: 1.0,
    },
    loadThresholds: {
      normal: 80,
      high: 90,
      critical: 95,
    },
    efficiencyTargets: {
      minimum: 85,
      target: 92,
      excellent: 95,
    },
  },
  alarmSettings: {
    criticalAlertDelay: 0,
    warningAlertDelay: 5,
    autoAcknowledgeTime: 30,
    escalationTime: 15,
    maxAlertsPerHour: 50,
  },
  dataRetention: {
    realTimeData: 7,
    historicalData: 365,
    auditLogs: 2555, // 7 years
    reportData: 1095, // 3 years
    backupRetention: 90,
  },
  backup: {
    autoBackupEnabled: true,
    backupInterval: 24,
    backupLocation: '/backups',
    compressionEnabled: true,
    encryptionEnabled: true,
  },
};

const defaultUserPreferences: UserPreferences = {
  dashboard: {
    defaultPage: '/dashboard',
    refreshInterval: 30,
    chartAnimations: true,
    compactMode: false,
    showWelcomeMessage: true,
  },
  notifications: {
    email: {
      enabled: true,
      criticalAlerts: true,
      dailyReports: true,
      weeklyReports: true,
      maintenanceAlerts: true,
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: true,
      criticalOnly: false,
    },
    sms: {
      enabled: false,
      number: '',
      criticalOnly: true,
    },
  },
  display: {
    theme: 'auto',
    colorScheme: 'default',
    fontSize: 'medium',
    density: 'comfortable',
    animations: true,
  },
  localization: {
    language: 'en-US',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '24h',
    numberFormat: 'en-US',
    currency: 'USD',
  },
};

const defaultSecuritySettings: SecuritySettings = {
  authentication: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
      historyCount: 5,
    },
    sessionSettings: {
      timeoutMinutes: 30,
      maxConcurrentSessions: 3,
      rememberMeEnabled: true,
      rememberMeDays: 30,
    },
    mfaSettings: {
      enabled: false,
      required: false,
      methods: ['totp', 'sms'],
      backupCodes: true,
    },
  },
  accessControl: {
    roleBasedAccess: true,
    ipWhitelist: [],
    geolocationRestrictions: false,
    allowedCountries: [],
    deviceRegistration: false,
  },
  encryption: {
    dataAtRest: true,
    dataInTransit: true,
    algorithm: 'AES-256',
    keyRotationDays: 90,
  },
  audit: {
    logAllActions: true,
    logFailedAttempts: true,
    logDataAccess: true,
    logConfigChanges: true,
    retentionDays: 2555,
  },
};

const defaultIntegrationSettings: IntegrationSettings = {
  apis: {
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3,
    enableCaching: true,
    cacheTimeout: 300,
  },
  externalSystems: {
    scada: {
      enabled: true,
      endpoint: 'tcp://scada.local:502',
      protocol: 'Modbus TCP',
      pollInterval: 1000,
      timeout: 5000,
    },
    ems: {
      enabled: true,
      endpoint: 'https://ems.api.local',
      apiKey: '',
      syncInterval: 60,
    },
    weather: {
      enabled: true,
      provider: 'OpenWeatherMap',
      apiKey: '',
      updateInterval: 300,
    },
    market: {
      enabled: false,
      provider: 'ISO Market API',
      apiKey: '',
      updateInterval: 900,
    },
  },
  database: {
    connectionPool: 20,
    queryTimeout: 30,
    backupEnabled: true,
    replicationEnabled: false,
  },
  messaging: {
    email: {
      provider: 'SMTP',
      smtpHost: 'smtp.company.com',
      smtpPort: 587,
      username: '',
      encryption: 'TLS',
    },
    sms: {
      provider: 'Twilio',
      apiKey: '',
      fromNumber: '',
    },
    slack: {
      enabled: false,
      webhookUrl: '',
      channel: '#grid-alerts',
    },
  },
};

const defaultThemeSettings: ThemeSettings = {
  colorScheme: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#6b7280',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      base: 14,
      scale: 1.125,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  layout: {
    sidebarWidth: 256,
    headerHeight: 64,
    borderRadius: 8,
    spacing: 8,
  },
  branding: {
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    companyName: 'Smart Grid Platform',
    tagline: 'Intelligent Grid Management',
  },
};

const generateSystemHealth = (): SystemHealth => ({
  cpu: 45 + Math.random() * 20,
  memory: 60 + Math.random() * 15,
  disk: 35 + Math.random() * 10,
  network: 95 + Math.random() * 4,
  database: 88 + Math.random() * 8,
  uptime: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days
  lastBackup: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
  version: '2.1.0',
  license: {
    type: 'Enterprise',
    expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
    features: ['Advanced Analytics', 'AI Optimization', 'Security Suite', 'Compliance Tools'],
  },
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      systemSettings: defaultSystemSettings,
      userPreferences: defaultUserPreferences,
      securitySettings: defaultSecuritySettings,
      integrationSettings: defaultIntegrationSettings,
      themeSettings: defaultThemeSettings,
      systemHealth: generateSystemHealth(),
      isLoading: false,
      isSaving: false,
      lastSaved: Date.now(),

      updateSystemSettings: (settings) =>
        set((state) => ({
          systemSettings: { ...state.systemSettings, ...settings },
        })),

      updateUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),

      updateSecuritySettings: (settings) =>
        set((state) => ({
          securitySettings: { ...state.securitySettings, ...settings },
        })),

      updateIntegrationSettings: (settings) =>
        set((state) => ({
          integrationSettings: { ...state.integrationSettings, ...settings },
        })),

      updateThemeSettings: (settings) =>
        set((state) => ({
          themeSettings: { ...state.themeSettings, ...settings },
        })),

      saveSettings: async () => {
        set({ isSaving: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ 
          isSaving: false, 
          lastSaved: Date.now() 
        });
      },

      resetToDefaults: (category) => {
        switch (category) {
          case 'system':
            set({ systemSettings: defaultSystemSettings });
            break;
          case 'user':
            set({ userPreferences: defaultUserPreferences });
            break;
          case 'security':
            set({ securitySettings: defaultSecuritySettings });
            break;
          case 'integration':
            set({ integrationSettings: defaultIntegrationSettings });
            break;
          case 'theme':
            set({ themeSettings: defaultThemeSettings });
            break;
        }
      },

      exportSettings: () => {
        const { systemSettings, userPreferences, securitySettings, integrationSettings, themeSettings } = get();
        const exportData = {
          systemSettings,
          userPreferences,
          securitySettings,
          integrationSettings,
          themeSettings,
          exportedAt: Date.now(),
          version: '2.1.0',
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smart-grid-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      },

      importSettings: async (file) => {
        set({ isLoading: true });
        
        try {
          const text = await file.text();
          const importData = JSON.parse(text);
          
          // Validate and apply settings
          if (importData.systemSettings) set({ systemSettings: importData.systemSettings });
          if (importData.userPreferences) set({ userPreferences: importData.userPreferences });
          if (importData.securitySettings) set({ securitySettings: importData.securitySettings });
          if (importData.integrationSettings) set({ integrationSettings: importData.integrationSettings });
          if (importData.themeSettings) set({ themeSettings: importData.themeSettings });
          
          set({ lastSaved: Date.now() });
        } catch (error) {
          console.error('Failed to import settings:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      testConnection: async (service) => {
        // Simulate connection test
        await new Promise(resolve => setTimeout(resolve, 2000));
        return Math.random() > 0.2; // 80% success rate
      },

      refreshSystemHealth: () => {
        set({ systemHealth: generateSystemHealth() });
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        systemSettings: state.systemSettings,
        userPreferences: state.userPreferences,
        securitySettings: state.securitySettings,
        integrationSettings: state.integrationSettings,
        themeSettings: state.themeSettings,
      }),
    }
  )
);