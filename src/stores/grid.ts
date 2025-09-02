import { create } from 'zustand'
import { apiClient, type GridNode, type GridConnection, type GridMetrics, type GridAlert } from '@/services/apiClient'
import { websocketClient, type GridUpdate, type AlertUpdate } from '@/services/websocketClient'

export interface GridNode {
  id: string
  name: string
  type: 'generator' | 'load' | 'substation' | 'transformer'
  x: number
  y: number
  status: 'online' | 'offline' | 'maintenance' | 'warning'
  capacity: number
  currentLoad: number
  voltage: number
  frequency: number
  temperature?: number
  efficiency?: number
  lastMaintenance?: Date
  nextMaintenance?: Date
}

export interface GridConnection {
  id: string
  from: string
  to: string
  capacity: number
  currentFlow: number
  voltage: number
  status: 'active' | 'inactive' | 'overload' | 'maintenance'
  impedance: number
  losses: number
}

export interface GridMetrics {
  totalGeneration: number
  totalLoad: number
  efficiency: number
  frequency: number
  voltage: number
  powerFactor: number
  losses: number
  reliability: number
  co2Emissions: number
  operatingCost: number
  peakDemand: number
  demandResponse: number
}

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  timestamp: Date
  nodeId?: string
  acknowledged: boolean
  resolved: boolean
}

interface GridState {
  nodes: GridNode[]
  connections: GridConnection[]
  metrics: GridMetrics
  alerts: Alert[]
  selectedNode: string | null
  isLoading: boolean
  lastUpdate: Date | null
  error: string | null
  
  // Actions
  setNodes: (nodes: GridNode[]) => void
  setConnections: (connections: GridConnection[]) => void
  updateMetrics: (metrics: Partial<GridMetrics>) => void
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void
  acknowledgeAlert: (alertId: string) => void
  resolveAlert: (alertId: string) => void
  selectNode: (nodeId: string | null) => void
  updateNode: (nodeId: string, updates: Partial<GridNode>) => void
  updateConnection: (connectionId: string, updates: Partial<GridConnection>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  refresh: () => Promise<void>
  initializeRealTimeUpdates: () => void
  cleanupRealTimeUpdates: () => void
}

export const useGridStore = create<GridState>((set, get) => ({
  nodes: [],
  connections: [],
  metrics: {
    totalGeneration: 0,
    totalLoad: 0,
    efficiency: 0,
    frequency: 0,
    voltage: 0,
    powerFactor: 0,
    losses: 0,
    reliability: 0,
    co2Emissions: 0,
    operatingCost: 0,
    peakDemand: 0,
    demandResponse: 0
  },
  alerts: [],
  selectedNode: null,
  isLoading: false,
  lastUpdate: null,
  error: null,

  setNodes: (nodes) => set({ nodes }),
  setConnections: (connections) => set({ connections }),
  
  updateMetrics: (metrics) => set((state) => ({
    metrics: { ...state.metrics, ...metrics }
  })),

  addAlert: (alert) => set((state) => ({
    alerts: [
      {
        ...alert,
        id: Date.now().toString(),
        timestamp: new Date(),
        acknowledged: false,
        resolved: false
      },
      ...state.alerts
    ]
  })),

  acknowledgeAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, acknowledged: true }
        : alert
    )
  })),

  resolveAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, resolved: true }
        : alert
    )
  })),

  selectNode: (nodeId) => set({ selectedNode: nodeId }),

  updateNode: (nodeId, updates) => set((state) => ({
    nodes: state.nodes.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    )
  })),

  updateConnection: (connectionId, updates) => set((state) => ({
    connections: state.connections.map(connection =>
      connection.id === connectionId ? { ...connection, ...updates } : connection
    )
  })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  refresh: async () => {
    const { setLoading, setError, setNodes, setConnections, updateMetrics } = get();
    
    try {
      setLoading(true);
      setError(null);

      // Fetch all grid data in parallel
      const [nodes, connections, metrics, alerts] = await Promise.all([
        apiClient.getGridNodes(),
        apiClient.getGridConnections(),
        apiClient.getGridMetrics(),
        apiClient.getGridAlerts()
      ]);

      setNodes(nodes);
      setConnections(connections);
      updateMetrics(metrics);
      
      // Convert API alerts to store format
      const storeAlerts: Alert[] = alerts.map((alert: GridAlert) => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      }));
      
      set({ alerts: storeAlerts, lastUpdate: new Date() });
    } catch (error) {
      console.error('Failed to refresh grid data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load grid data');
    } finally {
      setLoading(false);
    }
  },

  initializeRealTimeUpdates: () => {
    const { updateMetrics, addAlert } = get();

    // Subscribe to grid metrics updates
    websocketClient.subscribeToGridUpdates((update: GridUpdate) => {
      updateMetrics(update.metrics);
    });

    // Subscribe to new alerts
    websocketClient.subscribeToAlerts((alertUpdate: AlertUpdate) => {
      addAlert({
        type: alertUpdate.type,
        title: alertUpdate.title,
        message: alertUpdate.message,
        nodeId: alertUpdate.nodeId
      });
    });

    // Subscribe to connection status changes
    websocketClient.onConnectionChange((connected) => {
      if (connected) {
        console.log('WebSocket connected - real-time updates active');
      } else {
        console.log('WebSocket disconnected - real-time updates paused');
      }
    });
  },

  cleanupRealTimeUpdates: () => {
    // WebSocket client handles cleanup automatically
    console.log('Real-time updates cleaned up');
  }
}))