import { create } from 'zustand';
import { SecurityState, SecurityMetrics, ThreatIntelligence, ComplianceFramework, SecurityAlert, AuditLog, SecurityEvent } from '../types/security';

// Mock data generators
const generateSecurityMetrics = (): SecurityMetrics => ({
  securityScore: 94.2,
  activeThreats: 3,
  complianceScore: 96.8,
  vulnerabilityCount: 5,
  authSuccessRate: 99.8,
  failedLogins: 12,
  activePolicies: 247,
  lastSecurityScan: Date.now() - 3600000, // 1 hour ago
});

const generateThreats = (): ThreatIntelligence[] => [
  {
    id: 'threat-1',
    type: 'vulnerability',
    severity: 'medium',
    title: 'Outdated SSL Certificate Detected',
    description: 'SSL certificate for external API endpoint expires in 7 days',
    source: 'Vulnerability Scanner',
    timestamp: Date.now() - 1800000,
    status: 'active',
    affectedSystems: ['API Gateway', 'External Communications'],
    recommendedActions: ['Renew SSL certificate', 'Update certificate store', 'Test connectivity'],
  },
  {
    id: 'threat-2',
    type: 'intrusion',
    severity: 'high',
    title: 'Suspicious Login Pattern Detected',
    description: 'Multiple failed login attempts from unusual geographic location',
    source: 'SIEM System',
    timestamp: Date.now() - 900000,
    status: 'investigating',
    affectedSystems: ['Authentication Service', 'User Management'],
    recommendedActions: ['Block suspicious IP', 'Enable MFA', 'Review access logs'],
  },
  {
    id: 'threat-3',
    type: 'malware',
    severity: 'low',
    title: 'Potentially Unwanted Program Detected',
    description: 'Non-critical system utility flagged by antivirus',
    source: 'Endpoint Protection',
    timestamp: Date.now() - 7200000,
    status: 'mitigated',
    affectedSystems: ['Workstation-WS-042'],
    recommendedActions: ['Quarantine file', 'Update whitelist', 'User training'],
  },
];

const generateComplianceFrameworks = (): ComplianceFramework[] => [
  {
    id: 'nerc-cip',
    name: 'NERC CIP Standards',
    type: 'NERC_CIP',
    overallScore: 94.5,
    lastAssessment: Date.now() - 2592000000, // 30 days ago
    nextAssessment: Date.now() + 7776000000, // 90 days from now
    requirements: [
      {
        id: 'cip-002',
        code: 'CIP-002-5.1',
        title: 'Cyber Security — BES Cyber System Categorization',
        description: 'Categorization of BES Cyber Systems and their associated BES Cyber Assets',
        status: 'compliant',
        score: 98,
        evidence: ['Asset inventory', 'Categorization matrix', 'Risk assessment'],
        gaps: [],
        remediation: [],
      },
      {
        id: 'cip-003',
        code: 'CIP-003-8',
        title: 'Cyber Security — Security Management Controls',
        description: 'Security management controls for protection of BES Cyber Systems',
        status: 'compliant',
        score: 95,
        evidence: ['Security policies', 'Management approval', 'Training records'],
        gaps: ['Policy review overdue'],
        remediation: ['Schedule policy review'],
        dueDate: Date.now() + 1209600000, // 14 days
      },
      {
        id: 'cip-005',
        code: 'CIP-005-6',
        title: 'Cyber Security — Electronic Security Perimeter(s)',
        description: 'Management of electronic access to BES Cyber Systems',
        status: 'partial',
        score: 87,
        evidence: ['Firewall configurations', 'Network diagrams'],
        gaps: ['Missing network monitoring', 'Incomplete access logs'],
        remediation: ['Deploy network monitoring tools', 'Enhance logging'],
        dueDate: Date.now() + 2419200000, // 28 days
      },
    ],
  },
  {
    id: 'iso-27001',
    name: 'ISO 27001:2013',
    type: 'ISO_27001',
    overallScore: 91.2,
    lastAssessment: Date.now() - 1296000000, // 15 days ago
    nextAssessment: Date.now() + 15552000000, // 180 days from now
    requirements: [
      {
        id: 'iso-a5',
        code: 'A.5',
        title: 'Information Security Policies',
        description: 'Management direction and support for information security',
        status: 'compliant',
        score: 96,
        evidence: ['Security policy document', 'Management approval'],
        gaps: [],
        remediation: [],
      },
      {
        id: 'iso-a9',
        code: 'A.9',
        title: 'Access Control',
        description: 'Limit access to information and information processing facilities',
        status: 'compliant',
        score: 93,
        evidence: ['Access control matrix', 'User provisioning process'],
        gaps: ['Quarterly access review pending'],
        remediation: ['Complete access review'],
        dueDate: Date.now() + 604800000, // 7 days
      },
    ],
  },
];

const generateSecurityAlerts = (): SecurityAlert[] => [
  {
    id: 'alert-1',
    type: 'authentication',
    severity: 'high',
    title: 'Multiple Failed Login Attempts',
    description: 'User account "operator_smith" has 15 failed login attempts in the last hour',
    timestamp: Date.now() - 300000,
    source: 'Authentication Service',
    affectedAssets: ['User Management System', 'Authentication Database'],
    status: 'open',
  },
  {
    id: 'alert-2',
    type: 'access_control',
    severity: 'medium',
    title: 'Privilege Escalation Attempt',
    description: 'User attempted to access admin functions without proper authorization',
    timestamp: Date.now() - 1800000,
    source: 'Access Control Monitor',
    affectedAssets: ['Admin Panel', 'User Management'],
    status: 'investigating',
    assignedTo: 'security_team',
  },
  {
    id: 'alert-3',
    type: 'system_compromise',
    severity: 'critical',
    title: 'Unusual Network Traffic Detected',
    description: 'Abnormal data transfer patterns detected on critical network segment',
    timestamp: Date.now() - 600000,
    source: 'Network Monitoring',
    affectedAssets: ['Core Network', 'SCADA Systems'],
    status: 'open',
  },
];

const generateAuditLogs = (): AuditLog[] => {
  const actions = ['login', 'logout', 'view_dashboard', 'modify_settings', 'export_data', 'create_user', 'delete_user'];
  const users = ['admin', 'operator_jones', 'analyst_brown', 'manager_davis'];
  const results = ['success', 'failure', 'blocked'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `audit-${i + 1}`,
    timestamp: Date.now() - (i * 300000), // Every 5 minutes
    userId: `user-${Math.floor(Math.random() * 4) + 1}`,
    username: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: 'Smart Grid Platform',
    details: { module: 'dashboard', ip: '192.168.1.' + (100 + i) },
    ipAddress: '192.168.1.' + (100 + Math.floor(Math.random() * 50)),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    result: results[Math.floor(Math.random() * results.length)] as any,
    riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
  }));
};

export const useSecurityStore = create<SecurityState>((set, get) => ({
  metrics: generateSecurityMetrics(),
  threats: generateThreats(),
  complianceFrameworks: generateComplianceFrameworks(),
  alerts: generateSecurityAlerts(),
  auditLogs: generateAuditLogs(),
  securityEvents: [],
  isLoading: false,
  lastUpdate: Date.now(),

  updateMetrics: (newMetrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...newMetrics },
      lastUpdate: Date.now(),
    })),

  addThreat: (threatData) =>
    set((state) => ({
      threats: [
        {
          ...threatData,
          id: `threat-${Date.now()}`,
          timestamp: Date.now(),
        },
        ...state.threats,
      ],
    })),

  updateThreatStatus: (threatId, status) =>
    set((state) => ({
      threats: state.threats.map((threat) =>
        threat.id === threatId ? { ...threat, status } : threat
      ),
    })),

  acknowledgeAlert: (alertId, assignedTo) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: 'investigating', assignedTo }
          : alert
      ),
    })),

  resolveAlert: (alertId, resolution) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'resolved',
              resolution,
              resolvedAt: Date.now(),
            }
          : alert
      ),
    })),

  addAuditLog: (logData) =>
    set((state) => ({
      auditLogs: [
        {
          ...logData,
          id: `audit-${Date.now()}`,
          timestamp: Date.now(),
        },
        ...state.auditLogs.slice(0, 99), // Keep last 100 logs
      ],
    })),

  refreshSecurityData: () => {
    set({ isLoading: true });
    
    setTimeout(() => {
      set({
        metrics: generateSecurityMetrics(),
        threats: generateThreats(),
        alerts: generateSecurityAlerts(),
        isLoading: false,
        lastUpdate: Date.now(),
      });
    }, 1000);
  },

  generateComplianceReport: async (frameworkId) => {
    set({ isLoading: true });
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Generating compliance report for framework: ${frameworkId}`);
    
    set({ isLoading: false });
  },
}));