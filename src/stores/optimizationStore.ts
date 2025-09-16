import { create } from 'zustand';
import { OptimizationState, OptimizationAlgorithm, OptimizationScenario, OptimizationResult, Recommendation, MLModel } from '../types/optimization';

// Mock data generators
const generateMockAlgorithms = (): OptimizationAlgorithm[] => [
  {
    id: 'genetic-1',
    name: 'Genetic Algorithm',
    type: 'genetic',
    description: 'Evolutionary optimization for complex grid scenarios',
    parameters: [
      { id: 'population', name: 'Population Size', type: 'number', value: 100, min: 50, max: 500, step: 10, description: 'Number of individuals in population' },
      { id: 'generations', name: 'Generations', type: 'number', value: 200, min: 100, max: 1000, step: 50, description: 'Number of evolution cycles' },
      { id: 'mutation', name: 'Mutation Rate', type: 'number', value: 0.1, min: 0.01, max: 0.5, step: 0.01, description: 'Probability of mutation' },
      { id: 'crossover', name: 'Crossover Rate', type: 'number', value: 0.8, min: 0.1, max: 1.0, step: 0.1, description: 'Probability of crossover' },
    ],
    performance: { accuracy: 94.2, speed: 78, reliability: 92 },
    status: 'active',
  },
  {
    id: 'pso-1',
    name: 'Particle Swarm Optimization',
    type: 'pso',
    description: 'Swarm intelligence for load balancing optimization',
    parameters: [
      { id: 'particles', name: 'Particle Count', type: 'number', value: 50, min: 20, max: 200, step: 10, description: 'Number of particles in swarm' },
      { id: 'iterations', name: 'Iterations', type: 'number', value: 300, min: 100, max: 1000, step: 50, description: 'Maximum iterations' },
      { id: 'inertia', name: 'Inertia Weight', type: 'number', value: 0.7, min: 0.1, max: 1.0, step: 0.1, description: 'Particle inertia factor' },
      { id: 'cognitive', name: 'Cognitive Factor', type: 'number', value: 2.0, min: 0.5, max: 4.0, step: 0.1, description: 'Personal best influence' },
    ],
    performance: { accuracy: 91.8, speed: 85, reliability: 89 },
    status: 'active',
  },
  {
    id: 'neural-1',
    name: 'Neural Network Optimizer',
    type: 'neural',
    description: 'Deep learning approach for predictive optimization',
    parameters: [
      { id: 'layers', name: 'Hidden Layers', type: 'number', value: 3, min: 1, max: 10, step: 1, description: 'Number of hidden layers' },
      { id: 'neurons', name: 'Neurons per Layer', type: 'number', value: 128, min: 32, max: 512, step: 32, description: 'Neurons in each layer' },
      { id: 'learning_rate', name: 'Learning Rate', type: 'number', value: 0.001, min: 0.0001, max: 0.1, step: 0.0001, description: 'Training learning rate' },
      { id: 'epochs', name: 'Training Epochs', type: 'number', value: 100, min: 50, max: 500, step: 10, description: 'Training iterations' },
    ],
    performance: { accuracy: 96.5, speed: 65, reliability: 94 },
    status: 'training',
  },
];

const generateMockScenarios = (): OptimizationScenario[] => [
  {
    id: 'scenario-1',
    name: 'Peak Load Optimization',
    description: 'Optimize grid performance during peak demand hours',
    parameters: {
      timeRange: '14:00-18:00',
      targetReduction: 15,
      prioritizeRenewable: true,
      maxCostIncrease: 5,
    },
    status: 'completed',
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 86000000,
  },
  {
    id: 'scenario-2',
    name: 'Renewable Integration',
    description: 'Maximize renewable energy utilization',
    parameters: {
      renewableTarget: 60,
      storageOptimization: true,
      demandResponse: true,
      gridStability: 'high',
    },
    status: 'completed',
    createdAt: Date.now() - 172800000,
    completedAt: Date.now() - 172000000,
  },
  {
    id: 'scenario-3',
    name: 'Cost Minimization',
    description: 'Reduce operational costs while maintaining reliability',
    parameters: {
      costTarget: 20,
      reliabilityThreshold: 99.5,
      maintenanceOptimization: true,
      fuelOptimization: true,
    },
    status: 'pending',
    createdAt: Date.now() - 3600000,
  },
];

const generateMockResults = (): OptimizationResult[] => [
  {
    id: 'result-1',
    scenarioId: 'scenario-1',
    algorithm: 'genetic-1',
    metrics: {
      efficiencyGain: 12.3,
      costSavings: 18500,
      loadReduction: 15.2,
      renewableIncrease: 8.7,
      emissionReduction: 22.1,
    },
    recommendations: [],
    charts: {
      beforeAfter: [
        { name: 'Before', value: 87.2 },
        { name: 'After', value: 94.8 },
      ],
      timeline: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}:00`,
        value: 80 + Math.sin(i * 0.3) * 15 + Math.random() * 5,
      })),
      distribution: [
        { name: 'Zone A', value: 25.3 },
        { name: 'Zone B', value: 32.1 },
        { name: 'Zone C', value: 28.7 },
        { name: 'Zone D', value: 13.9 },
      ],
    },
    executionTime: 245,
    confidence: 94.2,
  },
  {
    id: 'result-2',
    scenarioId: 'scenario-2',
    algorithm: 'neural-1',
    metrics: {
      efficiencyGain: 8.9,
      costSavings: 12300,
      loadReduction: 6.4,
      renewableIncrease: 24.8,
      emissionReduction: 31.5,
    },
    recommendations: [],
    charts: {
      beforeAfter: [
        { name: 'Before', value: 42.1 },
        { name: 'After', value: 66.9 },
      ],
      timeline: Array.from({ length: 24 }, (_, i) => ({
        name: `${i}:00`,
        value: 40 + Math.sin(i * 0.2) * 20 + Math.random() * 8,
      })),
      distribution: [
        { name: 'Solar', value: 45.2 },
        { name: 'Wind', value: 32.8 },
        { name: 'Hydro', value: 15.3 },
        { name: 'Other', value: 6.7 },
      ],
    },
    executionTime: 189,
    confidence: 91.7,
  },
];

const generateMockRecommendations = (): Recommendation[] => [
  {
    id: 'rec-1',
    title: 'Implement Dynamic Load Balancing',
    description: 'Deploy automated load balancing across zones B and C during peak hours to improve overall efficiency by 8.2%',
    priority: 'high',
    category: 'load_balancing',
    impact: { efficiency: 8.2, cost: -12.5, reliability: 3.1 },
    implementation: {
      effort: 'medium',
      timeframe: '2-3 weeks',
      requirements: ['Software update', 'Operator training', 'Testing phase'],
    },
    roi: 245000,
    status: 'pending',
  },
  {
    id: 'rec-2',
    title: 'Optimize Renewable Energy Storage',
    description: 'Adjust battery storage charging/discharging cycles to maximize renewable energy utilization during off-peak hours',
    priority: 'high',
    category: 'renewable',
    impact: { efficiency: 6.7, cost: -8.9, reliability: 1.2 },
    implementation: {
      effort: 'low',
      timeframe: '1 week',
      requirements: ['Configuration update', 'Monitoring setup'],
    },
    roi: 156000,
    status: 'approved',
  },
  {
    id: 'rec-3',
    title: 'Predictive Maintenance Scheduling',
    description: 'Implement AI-driven maintenance scheduling to reduce unplanned outages by 35% and extend equipment life',
    priority: 'medium',
    category: 'maintenance',
    impact: { efficiency: 4.1, cost: -15.3, reliability: 12.8 },
    implementation: {
      effort: 'high',
      timeframe: '6-8 weeks',
      requirements: ['ML model deployment', 'Sensor integration', 'Staff training'],
    },
    roi: 380000,
    status: 'pending',
  },
];

const generateMockModels = (): MLModel[] => [
  {
    id: 'model-1',
    name: 'Load Forecasting Model',
    type: 'forecasting',
    version: '2.1.3',
    status: 'deployed',
    accuracy: 94.7,
    lastTrained: Date.now() - 604800000,
    trainingData: {
      samples: 125000,
      features: 42,
      timeRange: {
        start: new Date(Date.now() - 31536000000),
        end: new Date(Date.now() - 604800000),
      },
    },
    performance: {
      precision: 0.947,
      recall: 0.923,
      f1Score: 0.935,
      mse: 0.023,
    },
    deploymentInfo: {
      deployedAt: Date.now() - 518400000,
      endpoint: '/api/ml/load-forecast',
      requestCount: 45230,
      avgResponseTime: 125,
    },
  },
  {
    id: 'model-2',
    name: 'Anomaly Detection Model',
    type: 'anomaly_detection',
    version: '1.8.2',
    status: 'deployed',
    accuracy: 91.3,
    lastTrained: Date.now() - 1209600000,
    trainingData: {
      samples: 89000,
      features: 28,
      timeRange: {
        start: new Date(Date.now() - 15768000000),
        end: new Date(Date.now() - 1209600000),
      },
    },
    performance: {
      precision: 0.913,
      recall: 0.887,
      f1Score: 0.900,
    },
    deploymentInfo: {
      deployedAt: Date.now() - 1036800000,
      endpoint: '/api/ml/anomaly-detection',
      requestCount: 23450,
      avgResponseTime: 89,
    },
  },
  {
    id: 'model-3',
    name: 'Optimization Engine v3',
    type: 'optimization',
    version: '3.0.1',
    status: 'training',
    accuracy: 96.8,
    lastTrained: Date.now() - 86400000,
    trainingData: {
      samples: 156000,
      features: 67,
      timeRange: {
        start: new Date(Date.now() - 63072000000),
        end: new Date(Date.now() - 86400000),
      },
    },
    performance: {
      precision: 0.968,
      recall: 0.952,
      f1Score: 0.960,
      mse: 0.012,
    },
  },
];

export const useOptimizationStore = create<OptimizationState>((set, get) => {
  let optimizationInterval: NodeJS.Timeout | null = null;

  return {
    algorithms: generateMockAlgorithms(),
    scenarios: generateMockScenarios(),
    results: generateMockResults(),
    recommendations: generateMockRecommendations(),
    models: generateMockModels(),
    activeOptimization: null,
    isOptimizing: false,
    optimizationProgress: 0,

    startOptimization: (scenarioId: string, algorithmId: string) => {
      if (optimizationInterval) {
        clearInterval(optimizationInterval);
      }

      set({
        activeOptimization: scenarioId,
        isOptimizing: true,
        optimizationProgress: 0,
      });

      // Update scenario status
      set((state) => ({
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === scenarioId
            ? { ...scenario, status: 'running' }
            : scenario
        ),
      }));

      // Simulate optimization progress
      optimizationInterval = setInterval(() => {
        const currentProgress = get().optimizationProgress;
        
        if (currentProgress >= 100) {
          // Complete optimization
          clearInterval(optimizationInterval!);
          optimizationInterval = null;

          const mockResult: OptimizationResult = {
            id: `result-${Date.now()}`,
            scenarioId,
            algorithm: algorithmId,
            metrics: {
              efficiencyGain: 5 + Math.random() * 15,
              costSavings: 5000 + Math.random() * 20000,
              loadReduction: 3 + Math.random() * 12,
              renewableIncrease: 2 + Math.random() * 20,
              emissionReduction: 8 + Math.random() * 25,
            },
            recommendations: [],
            charts: {
              beforeAfter: [
                { name: 'Before', value: 80 + Math.random() * 10 },
                { name: 'After', value: 90 + Math.random() * 8 },
              ],
              timeline: Array.from({ length: 24 }, (_, i) => ({
                name: `${i}:00`,
                value: 70 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
              })),
              distribution: [
                { name: 'Zone A', value: 20 + Math.random() * 15 },
                { name: 'Zone B', value: 25 + Math.random() * 15 },
                { name: 'Zone C', value: 20 + Math.random() * 15 },
                { name: 'Zone D', value: 10 + Math.random() * 10 },
              ],
            },
            executionTime: 120 + Math.random() * 200,
            confidence: 85 + Math.random() * 12,
          };

          set((state) => ({
            activeOptimization: null,
            isOptimizing: false,
            optimizationProgress: 0,
            results: [mockResult, ...state.results],
            scenarios: state.scenarios.map((scenario) =>
              scenario.id === scenarioId
                ? { ...scenario, status: 'completed', completedAt: Date.now() }
                : scenario
            ),
          }));
        } else {
          set({ optimizationProgress: Math.min(100, currentProgress + 2 + Math.random() * 3) });
        }
      }, 200);
    },

    stopOptimization: () => {
      if (optimizationInterval) {
        clearInterval(optimizationInterval);
        optimizationInterval = null;
      }

      const activeScenarioId = get().activeOptimization;
      
      set((state) => ({
        activeOptimization: null,
        isOptimizing: false,
        optimizationProgress: 0,
        scenarios: activeScenarioId
          ? state.scenarios.map((scenario) =>
              scenario.id === activeScenarioId
                ? { ...scenario, status: 'pending' }
                : scenario
            )
          : state.scenarios,
      }));
    },

    createScenario: (scenarioData) => {
      const newScenario: OptimizationScenario = {
        ...scenarioData,
        id: `scenario-${Date.now()}`,
        status: 'pending',
        createdAt: Date.now(),
      };

      set((state) => ({
        scenarios: [newScenario, ...state.scenarios],
      }));
    },

    updateScenario: (scenarioId, updates) => {
      set((state) => ({
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === scenarioId ? { ...scenario, ...updates } : scenario
        ),
      }));
    },

    deleteScenario: (scenarioId) => {
      set((state) => ({
        scenarios: state.scenarios.filter((scenario) => scenario.id !== scenarioId),
        results: state.results.filter((result) => result.scenarioId !== scenarioId),
      }));
    },

    approveRecommendation: (recommendationId) => {
      set((state) => ({
        recommendations: state.recommendations.map((rec) =>
          rec.id === recommendationId ? { ...rec, status: 'approved' } : rec
        ),
      }));
    },

    rejectRecommendation: (recommendationId) => {
      set((state) => ({
        recommendations: state.recommendations.map((rec) =>
          rec.id === recommendationId ? { ...rec, status: 'rejected' } : rec
        ),
      }));
    },

    implementRecommendation: (recommendationId) => {
      set((state) => ({
        recommendations: state.recommendations.map((rec) =>
          rec.id === recommendationId ? { ...rec, status: 'implemented' } : rec
        ),
      }));
    },

    updateAlgorithmParameters: (algorithmId, parameters) => {
      set((state) => ({
        algorithms: state.algorithms.map((algorithm) =>
          algorithm.id === algorithmId
            ? {
                ...algorithm,
                parameters: algorithm.parameters.map((param) =>
                  parameters[param.id] !== undefined
                    ? { ...param, value: parameters[param.id] }
                    : param
                ),
              }
            : algorithm
        ),
      }));
    },

    deployModel: (modelId) => {
      set((state) => ({
        models: state.models.map((model) =>
          model.id === modelId
            ? {
                ...model,
                status: 'deployed',
                deploymentInfo: {
                  deployedAt: Date.now(),
                  endpoint: `/api/ml/${model.name.toLowerCase().replace(/\s+/g, '-')}`,
                  requestCount: 0,
                  avgResponseTime: 100 + Math.random() * 50,
                },
              }
            : model
        ),
      }));
    },

    archiveModel: (modelId) => {
      set((state) => ({
        models: state.models.map((model) =>
          model.id === modelId ? { ...model, status: 'archived' } : model
        ),
      }));
    },

    retrainModel: (modelId) => {
      set((state) => ({
        models: state.models.map((model) =>
          model.id === modelId
            ? {
                ...model,
                status: 'training',
                lastTrained: Date.now(),
              }
            : model
        ),
      }));

      // Simulate training completion
      setTimeout(() => {
        set((state) => ({
          models: state.models.map((model) =>
            model.id === modelId
              ? {
                  ...model,
                  status: 'testing',
                  accuracy: Math.min(99, model.accuracy + Math.random() * 2),
                }
              : model
          ),
        }));
      }, 5000);
    },
  };
});