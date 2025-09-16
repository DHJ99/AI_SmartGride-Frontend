export interface GridMetrics {
  totalPowerGeneration: number;
  gridEfficiency: number;
  activeNodes: number;
  totalNodes: number;
  systemLoad: number;
  timestamp: number;
}

export interface PowerData {
  time: string;
  generation: number;
  consumption: number;
  efficiency: number;
}

export interface LoadDistribution {
  zone: string;
  load: number;
  capacity: number;
  status: 'normal' | 'high' | 'critical';
}

export interface GridNode {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  load: number;
  capacity: number;
  location: {
    x: number;
    y: number;
  };
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'maintenance';
  title: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
  source: string;
}

export interface GridState {
  metrics: GridMetrics;
  powerHistory: PowerData[];
  loadDistribution: LoadDistribution[];
  nodes: GridNode[];
  alerts: Alert[];
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  isLoading: boolean;
  lastUpdate: number;
  
  // Actions
  updateMetrics: (metrics: Partial<GridMetrics>) => void;
  addPowerData: (data: PowerData) => void;
  updateLoadDistribution: (loads: LoadDistribution[]) => void;
  updateNodes: (nodes: GridNode[]) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}