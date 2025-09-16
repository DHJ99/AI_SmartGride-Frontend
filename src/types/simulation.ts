export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  type: 'load_variation' | 'equipment_failure' | 'weather_impact' | 'demand_response' | 'renewable_integration';
  parameters: SimulationParameters;
  duration: number; // in minutes
  status: 'draft' | 'ready' | 'running' | 'completed' | 'failed';
  createdAt: number;
  lastRun?: number;
  results?: SimulationResult;
}

export interface SimulationParameters {
  loadVariation?: {
    baseLoad: number;
    peakMultiplier: number;
    variabilityFactor: number;
    timeOfPeak: number;
  };
  equipmentFailure?: {
    failedComponents: string[];
    failureTime: number;
    recoveryTime: number;
    cascadingEffect: boolean;
  };
  weatherImpact?: {
    temperature: number;
    windSpeed: number;
    solarIrradiance: number;
    precipitation: number;
    duration: number;
  };
  demandResponse?: {
    participationRate: number;
    loadReduction: number;
    responseTime: number;
    incentiveLevel: number;
  };
  renewableIntegration?: {
    solarCapacity: number;
    windCapacity: number;
    storageCapacity: number;
    variabilityFactor: number;
  };
}

export interface SimulationResult {
  id: string;
  scenarioId: string;
  startTime: number;
  endTime: number;
  executionTime: number;
  metrics: SimulationMetrics;
  timeSeriesData: TimeSeriesPoint[];
  events: SimulationEvent[];
  summary: ResultSummary;
}

export interface SimulationMetrics {
  averageEfficiency: number;
  peakLoad: number;
  minimumLoad: number;
  totalGeneration: number;
  totalConsumption: number;
  systemStability: number;
  costImpact: number;
  emissionsImpact: number;
  reliabilityScore: number;
}

export interface TimeSeriesPoint {
  timestamp: number;
  time: string;
  efficiency: number;
  load: number;
  generation: number;
  consumption: number;
  voltage: number;
  frequency: number;
  temperature?: number;
  renewableOutput?: number;
}

export interface SimulationEvent {
  id: string;
  timestamp: number;
  type: 'failure' | 'recovery' | 'alert' | 'optimization' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedComponents: string[];
  impact: string;
}

export interface ResultSummary {
  overallPerformance: 'excellent' | 'good' | 'fair' | 'poor';
  keyInsights: string[];
  recommendations: string[];
  riskFactors: string[];
  optimizationOpportunities: string[];
}

export interface StressTest {
  id: string;
  name: string;
  type: 'peak_load' | 'cascading_failure' | 'recovery_time' | 'resilience';
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: StressTestResult;
}

export interface StressTestResult {
  maxStressHandled: number;
  breakingPoint?: number;
  recoveryTime: number;
  systemResilience: number;
  criticalComponents: string[];
  recommendations: string[];
}

export interface SimulationState {
  scenarios: SimulationScenario[];
  activeSimulation: string | null;
  simulationProgress: number;
  simulationSpeed: number;
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  stressTests: StressTest[];
  comparisonScenarios: string[];
  
  // Actions
  createScenario: (scenario: Omit<SimulationScenario, 'id' | 'createdAt' | 'status'>) => void;
  updateScenario: (scenarioId: string, updates: Partial<SimulationScenario>) => void;
  deleteScenario: (scenarioId: string) => void;
  startSimulation: (scenarioId: string) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  runStressTest: (testId: string) => void;
  addToComparison: (scenarioId: string) => void;
  removeFromComparison: (scenarioId: string) => void;
  clearComparison: () => void;
  generateMockData: () => void;
}