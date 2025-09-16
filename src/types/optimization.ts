export interface OptimizationAlgorithm {
  id: string;
  name: string;
  type: 'genetic' | 'pso' | 'neural' | 'gradient' | 'hybrid';
  description: string;
  parameters: OptimizationParameter[];
  performance: {
    accuracy: number;
    speed: number;
    reliability: number;
  };
  status: 'active' | 'training' | 'idle' | 'error';
}

export interface OptimizationParameter {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'select';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
}

export interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  results?: OptimizationResult;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
}

export interface OptimizationResult {
  id: string;
  scenarioId: string;
  algorithm: string;
  metrics: {
    efficiencyGain: number;
    costSavings: number;
    loadReduction: number;
    renewableIncrease: number;
    emissionReduction: number;
  };
  recommendations: Recommendation[];
  charts: {
    beforeAfter: ChartData[];
    timeline: ChartData[];
    distribution: ChartData[];
  };
  executionTime: number;
  confidence: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'load_balancing' | 'renewable' | 'maintenance' | 'cost' | 'efficiency';
  impact: {
    efficiency: number;
    cost: number;
    reliability: number;
  };
  implementation: {
    effort: 'low' | 'medium' | 'high';
    timeframe: string;
    requirements: string[];
  };
  roi: number;
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

export interface MLModel {
  id: string;
  name: string;
  type: 'forecasting' | 'optimization' | 'anomaly_detection' | 'classification';
  version: string;
  status: 'training' | 'deployed' | 'testing' | 'archived';
  accuracy: number;
  lastTrained: number;
  trainingData: {
    samples: number;
    features: number;
    timeRange: {
      start: Date;
      end: Date;
    };
  };
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    mse?: number;
  };
  deploymentInfo?: {
    deployedAt: number;
    endpoint: string;
    requestCount: number;
    avgResponseTime: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  category?: string;
  timestamp?: number;
}

export interface OptimizationState {
  algorithms: OptimizationAlgorithm[];
  scenarios: OptimizationScenario[];
  results: OptimizationResult[];
  recommendations: Recommendation[];
  models: MLModel[];
  activeOptimization: string | null;
  isOptimizing: boolean;
  optimizationProgress: number;
  
  // Actions
  startOptimization: (scenarioId: string, algorithmId: string) => void;
  stopOptimization: () => void;
  createScenario: (scenario: Omit<OptimizationScenario, 'id' | 'createdAt' | 'status'>) => void;
  updateScenario: (scenarioId: string, updates: Partial<OptimizationScenario>) => void;
  deleteScenario: (scenarioId: string) => void;
  approveRecommendation: (recommendationId: string) => void;
  rejectRecommendation: (recommendationId: string) => void;
  implementRecommendation: (recommendationId: string) => void;
  updateAlgorithmParameters: (algorithmId: string, parameters: Record<string, any>) => void;
  deployModel: (modelId: string) => void;
  archiveModel: (modelId: string) => void;
  retrainModel: (modelId: string) => void;
}