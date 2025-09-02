// Smart Grid Platform API Client
// Comprehensive client for all backend endpoints

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Base API client with common configuration
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `API request failed: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Grid Data APIs
  async getGridNodes() {
    return this.request('/api/grid/nodes');
  }

  async getGridConnections() {
    return this.request('/api/grid/connections');
  }

  async getGridTopology() {
    return this.request('/api/grid/topology');
  }

  async getGridMetrics() {
    return this.request('/api/grid/metrics');
  }

  async getGridAlerts() {
    return this.request('/api/grid/alerts');
  }

  // AI Agents APIs
  async optimizeGrid(nodeId?: string) {
    return this.request('/api/agents/optimize', {
      method: 'POST',
      body: JSON.stringify({ nodeId: nodeId || null })
    });
  }

  async chatWithAgent(message: string) {
    return this.request('/api/agents/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async runMaintenance(nodeId?: string) {
    return this.request('/api/agents/maintenance', {
      method: 'POST',
      body: JSON.stringify({ nodeId: nodeId || null })
    });
  }

  // Analytics APIs
  async getPerformanceAnalytics(timeRange: string = '24h', metric?: string) {
    const params = new URLSearchParams({ timeRange });
    if (metric) params.append('metric', metric);
    return this.request(`/api/analytics/performance?${params}`);
  }

  async getTrendAnalytics(timeRange: string = '7d') {
    const params = new URLSearchParams({ timeRange });
    return this.request(`/api/analytics/trends?${params}`);
  }

  async getForecastAnalytics(hours: number = 24) {
    const params = new URLSearchParams({ hours: hours.toString() });
    return this.request(`/api/analytics/forecast?${params}`);
  }

  async getAnomalyAnalytics(timeRange: string = '24h') {
    const params = new URLSearchParams({ timeRange });
    return this.request(`/api/analytics/anomalies?${params}`);
  }

  // ML/AI Models APIs
  async getMLModels() {
    return this.request('/api/ml/models');
  }

  async trainModel(modelId: string, parameters: any) {
    return this.request('/api/ml/train', {
      method: 'POST',
      body: JSON.stringify({ modelId, parameters })
    });
  }

  async makePrediction(modelId: string, inputData: any) {
    return this.request('/api/ml/predict', {
      method: 'POST',
      body: JSON.stringify({ modelId, inputData })
    });
  }

  async getModelPerformance(modelId: string) {
    return this.request(`/api/ml/performance?modelId=${modelId}`);
  }

  // Simulation APIs
  async runSimulation(parameters: any) {
    return this.request('/api/simulation/run', {
      method: 'POST',
      body: JSON.stringify(parameters)
    });
  }

  async getSimulationScenarios() {
    return this.request('/api/simulation/scenarios');
  }

  async getSimulationResults(resultId: string) {
    return this.request(`/api/simulation/results/${resultId}`);
  }

  async compareSimulations(scenarioIds: string[]) {
    return this.request('/api/simulation/compare', {
      method: 'POST',
      body: JSON.stringify({ scenarioIds })
    });
  }

  // Reports APIs
  async generateReport(type: string, format: string, parameters?: any) {
    return this.request('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, format, parameters })
    });
  }

  async getReportsList() {
    return this.request('/api/reports/list');
  }

  async getReportDetails(reportId: string) {
    return this.request(`/api/reports/${reportId}`);
  }

  async downloadReport(reportId: string) {
    const url = `${this.baseUrl}/api/reports/export/${reportId}`;
    const response = await fetch(url, { credentials: 'include' });
    
    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.status}`);
    }
    
    return response.blob();
  }

  // Security APIs
  async getSecurityEvents(limit: number = 50, offset: number = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    return this.request(`/api/security/events?${params}`);
  }

  async getSecurityThreats() {
    return this.request('/api/security/threats');
  }

  async getSecurityCompliance() {
    return this.request('/api/security/compliance');
  }

  async logSecurityEvent(eventType: string, details: any) {
    return this.request('/api/security/log', {
      method: 'POST',
      body: JSON.stringify({ eventType, details })
    });
  }

  async getSecurityDashboard() {
    return this.request('/api/security/dashboard');
  }

  // Search APIs
  async searchSimilarNodes(nodeId: string) {
    return this.request(`/api/search/similar-nodes/${nodeId}`);
  }

  async searchDocuments(query: string, limit: number = 10) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    return this.request(`/api/search/documents?${params}`);
  }

  async searchConversations(query: string, limit: number = 10) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    return this.request(`/api/search/conversations?${params}`);
  }

  // Health Check
  async getHealthStatus() {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for API responses
export interface GridNode {
  id: string;
  name: string;
  type: 'generator' | 'load' | 'substation' | 'transformer';
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  capacity: number;
  currentLoad: number;
  voltage: number;
  frequency: number;
  temperature?: number;
  efficiency?: number;
  x: number;
  y: number;
}

export interface GridConnection {
  id: string;
  from: string;
  to: string;
  capacity: number;
  currentFlow: number;
  voltage: number;
  status: 'active' | 'inactive' | 'overload' | 'maintenance';
  impedance: number;
  losses: number;
}

export interface GridMetrics {
  totalGeneration: number;
  totalLoad: number;
  efficiency: number;
  frequency: number;
  voltage: number;
  powerFactor: number;
  losses: number;
  reliability: number;
  co2Emissions: number;
  operatingCost: number;
  peakDemand: number;
  demandResponse: number;
}

export interface GridAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  nodeId?: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface AgentResponse {
  success: boolean;
  data: {
    response?: string;
    workflowType?: string;
    steps?: Array<{
      step: number;
      action: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
    }>;
    results?: any;
  };
  message?: string;
}

export interface MLModel {
  id: string;
  name: string;
  type: string;
  status: 'training' | 'deployed' | 'idle' | 'error';
  accuracy: number;
  lastTrained: string;
  predictions: number;
  version: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: any;
  results?: any;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  format: string;
  status: 'generated' | 'generating' | 'scheduled' | 'failed';
  createdAt: string;
  size: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  user: string;
  timestamp: string;
  ip: string;
  details: any;
}

