export interface SecurityMetrics {
  securityScore: number;
  activeThreats: number;
  complianceScore: number;
  vulnerabilityCount: number;
  authSuccessRate: number;
  failedLogins: number;
  activePolicies: number;
  lastSecurityScan: number;
}

export interface ThreatIntelligence {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'vulnerability';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: number;
  status: 'active' | 'mitigated' | 'investigating' | 'resolved';
  affectedSystems: string[];
  recommendedActions: string[];
}

export interface ComplianceFramework {
  id: string;
  name: string;
  type: 'NERC_CIP' | 'ISO_27001' | 'NIST' | 'GDPR';
  overallScore: number;
  requirements: ComplianceRequirement[];
  lastAssessment: number;
  nextAssessment: number;
}

export interface ComplianceRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_assessed';
  score: number;
  evidence: string[];
  gaps: string[];
  remediation: string[];
  dueDate?: number;
}

export interface SecurityAlert {
  id: string;
  type: 'authentication' | 'access_control' | 'data_breach' | 'system_compromise' | 'policy_violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: number;
  source: string;
  affectedAssets: string[];
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: number;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  userId: string;
  username: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: 'login' | 'logout' | 'access_denied' | 'privilege_escalation' | 'data_access' | 'configuration_change';
  severity: 'info' | 'warning' | 'critical';
  user: string;
  description: string;
  metadata: Record<string, any>;
}

export interface SecurityState {
  metrics: SecurityMetrics;
  threats: ThreatIntelligence[];
  complianceFrameworks: ComplianceFramework[];
  alerts: SecurityAlert[];
  auditLogs: AuditLog[];
  securityEvents: SecurityEvent[];
  isLoading: boolean;
  lastUpdate: number;
  
  // Actions
  updateMetrics: (metrics: Partial<SecurityMetrics>) => void;
  addThreat: (threat: Omit<ThreatIntelligence, 'id' | 'timestamp'>) => void;
  updateThreatStatus: (threatId: string, status: ThreatIntelligence['status']) => void;
  acknowledgeAlert: (alertId: string, assignedTo?: string) => void;
  resolveAlert: (alertId: string, resolution: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  refreshSecurityData: () => void;
  generateComplianceReport: (frameworkId: string) => Promise<void>;
}