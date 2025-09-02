// Environment configuration for Smart Grid Platform

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    wsUrl: import.meta.env.VITE_WS_URL || 'http://localhost:3001',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Authentication
  auth: {
    useMock: import.meta.env.VITE_USE_MOCK_AUTH === 'true',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
    maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
  },

  // Real-time Updates
  realtime: {
    enabled: import.meta.env.VITE_REALTIME_ENABLED !== 'false',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
  },

  // Development
  development: {
    debug: import.meta.env.DEV,
    mockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  },

  // Feature Flags
  features: {
    aiAgents: true,
    realtimeUpdates: true,
    search: true,
    analytics: true,
    simulation: true,
    reports: true,
    security: true,
  },
};

// Environment validation
export function validateEnvironment() {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Using default values. For production, set all required environment variables.');
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

// API endpoint helpers
export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  grid: {
    nodes: '/api/grid/nodes',
    connections: '/api/grid/connections',
    topology: '/api/grid/topology',
    metrics: '/api/grid/metrics',
    alerts: '/api/grid/alerts',
  },
  agents: {
    optimize: '/api/agents/optimize',
    chat: '/api/agents/chat',
    maintenance: '/api/agents/maintenance',
  },
  analytics: {
    performance: '/api/analytics/performance',
    trends: '/api/analytics/trends',
    forecast: '/api/analytics/forecast',
    anomalies: '/api/analytics/anomalies',
  },
  ml: {
    models: '/api/ml/models',
    train: '/api/ml/train',
    predict: '/api/ml/predict',
    performance: '/api/ml/performance',
  },
  simulation: {
    run: '/api/simulation/run',
    scenarios: '/api/simulation/scenarios',
    results: '/api/simulation/results',
    compare: '/api/simulation/compare',
  },
  reports: {
    generate: '/api/reports/generate',
    list: '/api/reports/list',
    details: '/api/reports',
    export: '/api/reports/export',
  },
  security: {
    events: '/api/security/events',
    threats: '/api/security/threats',
    compliance: '/api/security/compliance',
    log: '/api/security/log',
    dashboard: '/api/security/dashboard',
  },
  search: {
    similarNodes: '/api/search/similar-nodes',
    documents: '/api/search/documents',
    conversations: '/api/search/conversations',
  },
  system: {
    health: '/health',
  },
};

// WebSocket events
export const wsEvents = {
  // Workflow events
  workflow: {
    update: 'workflow:update',
    completed: 'workflow:completed',
    failed: 'workflow:failed',
    subscribe: 'subscribe:workflow',
    unsubscribe: 'unsubscribe:workflow',
  },
  // Grid events
  grid: {
    metricsUpdate: 'grid:metrics_update',
    nodeUpdate: 'grid:node_update',
    subscribe: 'subscribe:grid',
    unsubscribe: 'unsubscribe:grid',
  },
  // Alert events
  alert: {
    new: 'alert:new',
    acknowledged: 'alert:acknowledged',
    resolved: 'alert:resolved',
    subscribe: 'subscribe:alerts',
    unsubscribe: 'unsubscribe:alerts',
  },
  // Connection events
  connection: {
    connect: 'connect',
    disconnect: 'disconnect',
    error: 'connect_error',
  },
};

export default config;

