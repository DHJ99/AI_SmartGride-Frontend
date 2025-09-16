export interface GridNode {
  id: string;
  name: string;
  type: 'powerplant' | 'substation' | 'distribution' | 'consumer';
  position: {
    x: number;
    y: number;
  };
  status: 'online' | 'offline' | 'maintenance' | 'warning' | 'critical';
  capacity: number;
  currentLoad: number;
  voltage: number;
  properties: {
    powerOutput?: number;
    efficiency?: number;
    fuelType?: string;
    consumers?: number;
    lastMaintenance?: string;
    nextMaintenance?: string;
  };
}

export interface GridConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'high' | 'medium' | 'low';
  status: 'active' | 'inactive' | 'overloaded' | 'fault';
  capacity: number;
  currentFlow: number;
  length: number;
  powerLoss: number;
}

export interface TopologyState {
  nodes: GridNode[];
  connections: GridConnection[];
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  zoom: number;
  isSimulating: boolean;
  
  // Actions
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedConnection: (connectionId: string | null) => void;
  updateNodeStatus: (nodeId: string, status: GridNode['status']) => void;
  updateConnectionStatus: (connectionId: string, status: GridConnection['status']) => void;
  setViewBox: (viewBox: TopologyState['viewBox']) => void;
  setZoom: (zoom: number) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  generateMockData: () => void;
}