import { create } from 'zustand';
import { SimulationState, SimulationScenario, SimulationResult, SimulationMetrics, TimeSeriesPoint, SimulationEvent, StressTest, StressTestResult } from '../types/simulation';

// Mock data generators
const generateMockScenarios = (): SimulationScenario[] => [
  {
    id: 'scenario-1',
    name: 'Summer Peak Load Event',
    description: 'Simulate extreme summer heat wave with 40% increased cooling demand',
    type: 'load_variation',
    parameters: {
      loadVariation: {
        baseLoad: 1200,
        peakMultiplier: 1.4,
        variabilityFactor: 0.15,
        timeOfPeak: 14, // 2 PM
      },
    },
    duration: 24, // 24 hours
    status: 'ready',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'scenario-2',
    name: 'Generator Outage Recovery',
    description: 'Major generator failure during peak hours with cascading effects',
    type: 'equipment_failure',
    parameters: {
      equipmentFailure: {
        failedComponents: ['Generator G-102', 'Transformer T-204'],
        failureTime: 8, // 8 hours into simulation
        recoveryTime: 4, // 4 hours to recover
        cascadingEffect: true,
      },
    },
    duration: 16,
    status: 'completed',
    createdAt: Date.now() - 172800000,
    lastRun: Date.now() - 86400000,
  },
  {
    id: 'scenario-3',
    name: 'Renewable Integration Test',
    description: 'High renewable penetration with storage optimization',
    type: 'renewable_integration',
    parameters: {
      renewableIntegration: {
        solarCapacity: 800,
        windCapacity: 600,
        storageCapacity: 400,
        variabilityFactor: 0.3,
      },
    },
    duration: 48,
    status: 'draft',
    createdAt: Date.now() - 3600000,
  },
];

const generateTimeSeriesData = (scenario: SimulationScenario): TimeSeriesPoint[] => {
  const data: TimeSeriesPoint[] = [];
  const points = scenario.duration * 4; // 15-minute intervals
  
  for (let i = 0; i < points; i++) {
    const timestamp = Date.now() + (i * 15 * 60 * 1000);
    const hour = (i / 4) % 24;
    
    let baseEfficiency = 92 + Math.sin(hour * 0.3) * 3;
    let baseLoad = 1000 + Math.sin(hour * 0.2) * 200;
    let baseGeneration = baseLoad * 1.1;
    
    // Apply scenario-specific modifications
    if (scenario.type === 'load_variation' && scenario.parameters.loadVariation) {
      const params = scenario.parameters.loadVariation;
      if (hour >= params.timeOfPeak - 2 && hour <= params.timeOfPeak + 2) {
        baseLoad *= params.peakMultiplier;
        baseEfficiency -= 5; // Efficiency drops during peak
      }
    }
    
    if (scenario.type === 'equipment_failure' && scenario.parameters.equipmentFailure) {
      const params = scenario.parameters.equipmentFailure;
      const failureStart = params.failureTime * 4;
      const failureEnd = failureStart + (params.recoveryTime * 4);
      
      if (i >= failureStart && i < failureEnd) {
        baseGeneration *= 0.7; // 30% generation loss
        baseEfficiency -= 15;
      }
    }
    
    data.push({
      timestamp,
      time: new Date(timestamp).toLocaleTimeString(),
      efficiency: Math.max(0, baseEfficiency + (Math.random() - 0.5) * 2),
      load: Math.max(0, baseLoad + (Math.random() - 0.5) * 50),
      generation: Math.max(0, baseGeneration + (Math.random() - 0.5) * 30),
      consumption: Math.max(0, baseLoad + (Math.random() - 0.5) * 20),
      voltage: 345 + (Math.random() - 0.5) * 10,
      frequency: 60 + (Math.random() - 0.5) * 0.2,
      temperature: scenario.type === 'weather_impact' ? 35 + Math.random() * 10 : undefined,
      renewableOutput: scenario.type === 'renewable_integration' ? 200 + Math.random() * 400 : undefined,
    });
  }
  
  return data;
};

const generateSimulationEvents = (scenario: SimulationScenario): SimulationEvent[] => {
  const events: SimulationEvent[] = [];
  
  if (scenario.type === 'equipment_failure' && scenario.parameters.equipmentFailure) {
    const params = scenario.parameters.equipmentFailure;
    
    events.push({
      id: 'event-1',
      timestamp: Date.now() + (params.failureTime * 60 * 60 * 1000),
      type: 'failure',
      severity: 'critical',
      description: `Equipment failure: ${params.failedComponents.join(', ')}`,
      affectedComponents: params.failedComponents,
      impact: 'Significant reduction in generation capacity',
    });
    
    events.push({
      id: 'event-2',
      timestamp: Date.now() + ((params.failureTime + params.recoveryTime) * 60 * 60 * 1000),
      type: 'recovery',
      severity: 'medium',
      description: 'Equipment restored to normal operation',
      affectedComponents: params.failedComponents,
      impact: 'Generation capacity restored',
    });
  }
  
  return events;
};

const generateMockStressTests = (): StressTest[] => [
  {
    id: 'stress-1',
    name: 'Peak Load Stress Test',
    type: 'peak_load',
    intensity: 'high',
    parameters: {
      maxLoad: 1500,
      rampRate: 50, // MW per minute
      sustainDuration: 120, // minutes
    },
    status: 'completed',
    results: {
      maxStressHandled: 1420,
      breakingPoint: 1450,
      recoveryTime: 15,
      systemResilience: 87.3,
      criticalComponents: ['Transformer T-204', 'Generator G-102'],
      recommendations: [
        'Upgrade transformer capacity in Zone C',
        'Implement demand response program',
        'Add backup generation capacity',
      ],
    },
  },
  {
    id: 'stress-2',
    name: 'Cascading Failure Test',
    type: 'cascading_failure',
    intensity: 'extreme',
    parameters: {
      initialFailure: 'Generator G-101',
      propagationDelay: 5, // minutes
      isolationTime: 10, // minutes
    },
    status: 'pending',
  },
];

export const useSimulationStore = create<SimulationState>((set, get) => {
  let simulationInterval: NodeJS.Timeout | null = null;

  return {
    scenarios: generateMockScenarios(),
    activeSimulation: null,
    simulationProgress: 0,
    simulationSpeed: 1,
    isRunning: false,
    isPaused: false,
    currentTime: 0,
    stressTests: generateMockStressTests(),
    comparisonScenarios: [],

    createScenario: (scenarioData) => {
      const newScenario: SimulationScenario = {
        ...scenarioData,
        id: `scenario-${Date.now()}`,
        status: 'draft',
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
        comparisonScenarios: state.comparisonScenarios.filter(id => id !== scenarioId),
      }));
    },

    startSimulation: (scenarioId) => {
      const scenario = get().scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      if (simulationInterval) {
        clearInterval(simulationInterval);
      }

      set({
        activeSimulation: scenarioId,
        isRunning: true,
        isPaused: false,
        simulationProgress: 0,
        currentTime: 0,
      });

      // Update scenario status
      get().updateScenario(scenarioId, { status: 'running' });

      // Simulation loop
      simulationInterval = setInterval(() => {
        const state = get();
        const newProgress = Math.min(100, state.simulationProgress + (state.simulationSpeed * 0.5));
        
        set({
          simulationProgress: newProgress,
          currentTime: state.currentTime + (state.simulationSpeed * 0.5),
        });

        if (newProgress >= 100) {
          // Complete simulation
          clearInterval(simulationInterval!);
          simulationInterval = null;

          const timeSeriesData = generateTimeSeriesData(scenario);
          const events = generateSimulationEvents(scenario);
          
          const mockResult: SimulationResult = {
            id: `result-${Date.now()}`,
            scenarioId,
            startTime: Date.now() - (scenario.duration * 60 * 1000),
            endTime: Date.now(),
            executionTime: scenario.duration * 60,
            metrics: {
              averageEfficiency: 89.5 + Math.random() * 8,
              peakLoad: 1200 + Math.random() * 300,
              minimumLoad: 800 + Math.random() * 100,
              totalGeneration: 28000 + Math.random() * 5000,
              totalConsumption: 26500 + Math.random() * 4000,
              systemStability: 85 + Math.random() * 12,
              costImpact: (Math.random() - 0.5) * 20000,
              emissionsImpact: (Math.random() - 0.5) * 1000,
              reliabilityScore: 92 + Math.random() * 6,
            },
            timeSeriesData,
            events,
            summary: {
              overallPerformance: Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'fair' : 'excellent',
              keyInsights: [
                'Peak load handled successfully with 12% margin',
                'Renewable integration achieved 45% of total generation',
                'System stability maintained throughout simulation',
              ],
              recommendations: [
                'Consider upgrading transformer capacity in Zone C',
                'Implement demand response program for peak shaving',
                'Optimize renewable energy storage scheduling',
              ],
              riskFactors: [
                'High dependency on single generation source',
                'Limited backup capacity during peak hours',
              ],
              optimizationOpportunities: [
                'Load balancing optimization could improve efficiency by 3.2%',
                'Renewable integration timing optimization',
              ],
            },
          };

          get().updateScenario(scenarioId, { 
            status: 'completed', 
            lastRun: Date.now(),
            results: mockResult,
          });

          set({
            activeSimulation: null,
            isRunning: false,
            simulationProgress: 0,
            currentTime: 0,
          });
        }
      }, 100); // Update every 100ms
    },

    pauseSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      set({ isPaused: true, isRunning: false });
    },

    resumeSimulation: () => {
      const { activeSimulation } = get();
      if (activeSimulation) {
        get().startSimulation(activeSimulation);
      }
    },

    stopSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }

      const { activeSimulation } = get();
      if (activeSimulation) {
        get().updateScenario(activeSimulation, { status: 'ready' });
      }

      set({
        activeSimulation: null,
        isRunning: false,
        isPaused: false,
        simulationProgress: 0,
        currentTime: 0,
      });
    },

    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

    runStressTest: (testId) => {
      set((state) => ({
        stressTests: state.stressTests.map((test) =>
          test.id === testId ? { ...test, status: 'running' } : test
        ),
      }));

      // Simulate stress test execution
      setTimeout(() => {
        const mockResult: StressTestResult = {
          maxStressHandled: 1200 + Math.random() * 300,
          breakingPoint: 1400 + Math.random() * 200,
          recoveryTime: 10 + Math.random() * 20,
          systemResilience: 80 + Math.random() * 15,
          criticalComponents: ['Transformer T-204', 'Generator G-102'],
          recommendations: [
            'Upgrade critical transformer capacity',
            'Implement automatic load shedding',
            'Add redundant generation sources',
          ],
        };

        set((state) => ({
          stressTests: state.stressTests.map((test) =>
            test.id === testId 
              ? { ...test, status: 'completed', results: mockResult }
              : test
          ),
        }));
      }, 3000);
    },

    addToComparison: (scenarioId) => {
      set((state) => ({
        comparisonScenarios: state.comparisonScenarios.includes(scenarioId)
          ? state.comparisonScenarios
          : [...state.comparisonScenarios, scenarioId],
      }));
    },

    removeFromComparison: (scenarioId) => {
      set((state) => ({
        comparisonScenarios: state.comparisonScenarios.filter(id => id !== scenarioId),
      }));
    },

    clearComparison: () => set({ comparisonScenarios: [] }),

    generateMockData: () => {
      set({ scenarios: generateMockScenarios() });
    },
  };
});