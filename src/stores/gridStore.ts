import { create } from 'zustand';
import { GridState, GridMetrics, PowerData, LoadDistribution, GridNode, Alert } from '../types/grid';

// Mock data generators
const generateRandomMetrics = (): GridMetrics => ({
  totalPowerGeneration: 1200 + Math.random() * 100,
  gridEfficiency: 92 + Math.random() * 6,
  activeNodes: 156 + Math.floor(Math.random() * 5) - 2,
  totalNodes: 160,
  systemLoad: 80 + Math.random() * 15,
  timestamp: Date.now(),
});

const generatePowerData = (): PowerData => {
  const now = new Date();
  const generation = 1200 + Math.random() * 100;
  const consumption = generation * (0.85 + Math.random() * 0.1);
  
  return {
    time: now.toLocaleTimeString(),
    generation,
    consumption,
    efficiency: (consumption / generation) * 100,
  };
};

const generateLoadDistribution = (): LoadDistribution[] => [
  {
    zone: 'Zone A',
    load: 280 + Math.random() * 40,
    capacity: 350,
    status: Math.random() > 0.8 ? 'high' : 'normal',
  },
  {
    zone: 'Zone B',
    load: 220 + Math.random() * 30,
    capacity: 300,
    status: 'normal',
  },
  {
    zone: 'Zone C',
    load: 190 + Math.random() * 25,
    capacity: 250,
    status: Math.random() > 0.9 ? 'warning' : 'normal',
  },
  {
    zone: 'Zone D',
    load: 160 + Math.random() * 20,
    capacity: 200,
    status: 'normal',
  },
];

const generateNodes = (): GridNode[] => {
  const nodes: GridNode[] = [];
  const statuses: GridNode['status'][] = ['online', 'online', 'online', 'online', 'warning', 'maintenance'];
  
  for (let i = 1; i <= 8; i++) {
    nodes.push({
      id: `node-${i}`,
      name: `Grid Node ${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      load: 60 + Math.random() * 30,
      capacity: 100,
      location: {
        x: (i % 4) * 25 + 10,
        y: Math.floor((i - 1) / 4) * 40 + 20,
      },
    });
  }
  
  return nodes;
};

const generateRandomAlert = (): Omit<Alert, 'id' | 'timestamp'> => {
  const alerts = [
    {
      type: 'warning' as const,
      title: 'High Load Detected',
      message: 'Zone C experiencing higher than normal load levels',
      source: 'Load Monitor',
      acknowledged: false,
    },
    {
      type: 'info' as const,
      title: 'Maintenance Scheduled',
      message: 'Routine maintenance scheduled for Grid Node 7 at 02:00',
      source: 'Maintenance System',
      acknowledged: false,
    },
    {
      type: 'critical' as const,
      title: 'Node Offline',
      message: 'Grid Node 3 has gone offline unexpectedly',
      source: 'Node Monitor',
      acknowledged: false,
    },
    {
      type: 'warning' as const,
      title: 'Efficiency Drop',
      message: 'Grid efficiency has dropped below 90% threshold',
      source: 'Efficiency Monitor',
      acknowledged: false,
    },
  ];
  
  return alerts[Math.floor(Math.random() * alerts.length)];
};

export const useGridStore = create<GridState>((set, get) => {
  let simulationInterval: NodeJS.Timeout | null = null;
  let alertInterval: NodeJS.Timeout | null = null;

  return {
    metrics: generateRandomMetrics(),
    powerHistory: [],
    loadDistribution: generateLoadDistribution(),
    nodes: generateNodes(),
    alerts: [],
    connectionStatus: 'disconnected',
    isLoading: false,
    lastUpdate: Date.now(),

    updateMetrics: (newMetrics) =>
      set((state) => ({
        metrics: { ...state.metrics, ...newMetrics, timestamp: Date.now() },
        lastUpdate: Date.now(),
      })),

    addPowerData: (data) =>
      set((state) => ({
        powerHistory: [...state.powerHistory.slice(-29), data], // Keep last 30 points
      })),

    updateLoadDistribution: (loads) =>
      set({ loadDistribution: loads }),

    updateNodes: (nodes) =>
      set({ nodes }),

    addAlert: (alert) =>
      set((state) => ({
        alerts: [
          {
            ...alert,
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          },
          ...state.alerts.slice(0, 19), // Keep last 20 alerts
        ],
      })),

    acknowledgeAlert: (alertId) =>
      set((state) => ({
        alerts: state.alerts.map((alert) =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ),
      })),

    setConnectionStatus: (status) =>
      set({ connectionStatus: status }),

    startSimulation: () => {
      const state = get();
      
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      if (alertInterval) {
        clearInterval(alertInterval);
      }

      // Set connected status
      set({ connectionStatus: 'connected' });

      // Initialize with some historical data
      const initialHistory: PowerData[] = [];
      for (let i = 29; i >= 0; i--) {
        const time = new Date(Date.now() - i * 2000);
        initialHistory.push({
          time: time.toLocaleTimeString(),
          generation: 1200 + Math.random() * 100,
          consumption: 1000 + Math.random() * 150,
          efficiency: 92 + Math.random() * 6,
        });
      }
      set({ powerHistory: initialHistory });

      // Main simulation loop - updates every 2 seconds
      simulationInterval = setInterval(() => {
        const currentState = get();
        
        // Update metrics
        currentState.updateMetrics(generateRandomMetrics());
        
        // Add new power data
        currentState.addPowerData(generatePowerData());
        
        // Update load distribution
        currentState.updateLoadDistribution(generateLoadDistribution());
        
        // Update nodes occasionally
        if (Math.random() > 0.8) {
          currentState.updateNodes(generateNodes());
        }
      }, 2000);

      // Alert generation - random alerts every 10-30 seconds
      const scheduleNextAlert = () => {
        const delay = 10000 + Math.random() * 20000; // 10-30 seconds
        alertInterval = setTimeout(() => {
          if (Math.random() > 0.3) { // 70% chance to generate alert
            get().addAlert(generateRandomAlert());
          }
          scheduleNextAlert();
        }, delay);
      };
      
      scheduleNextAlert();
    },

    stopSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      if (alertInterval) {
        clearTimeout(alertInterval);
        alertInterval = null;
      }
      set({ connectionStatus: 'disconnected' });
    },
  };
});