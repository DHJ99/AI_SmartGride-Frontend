// WebSocket client for real-time updates
// Handles workflow progress, grid updates, and live data

import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export interface WorkflowUpdate {
  jobId: string;
  progress: number;
  currentStep: string;
  status: 'running' | 'completed' | 'failed';
  results?: any;
}

export interface GridUpdate {
  timestamp: string;
  metrics: {
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
  };
}

export interface AlertUpdate {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  nodeId?: string;
  timestamp: string;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  // Event listeners
  private workflowListeners: Map<string, (update: WorkflowUpdate) => void> = new Map();
  private gridUpdateListeners: ((update: GridUpdate) => void)[] = [];
  private alertListeners: ((alert: AlertUpdate) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(WS_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
    });

    // Workflow events
    this.socket.on('workflow:update', (data: WorkflowUpdate) => {
      console.log('Workflow update received:', data);
      this.notifyWorkflowListeners(data);
    });

    this.socket.on('workflow:completed', (data: WorkflowUpdate) => {
      console.log('Workflow completed:', data);
      this.notifyWorkflowListeners(data);
    });

    this.socket.on('workflow:failed', (data: WorkflowUpdate) => {
      console.error('Workflow failed:', data);
      this.notifyWorkflowListeners(data);
    });

    // Grid events
    this.socket.on('grid:metrics_update', (data: GridUpdate) => {
      console.log('Grid metrics update:', data);
      this.notifyGridUpdateListeners(data);
    });

    this.socket.on('grid:node_update', (data: any) => {
      console.log('Grid node update:', data);
      // Handle individual node updates
    });

    // Alert events
    this.socket.on('alert:new', (data: AlertUpdate) => {
      console.log('New alert:', data);
      this.notifyAlertListeners(data);
    });

    this.socket.on('alert:acknowledged', (data: { id: string }) => {
      console.log('Alert acknowledged:', data.id);
      // Handle alert acknowledgment
    });

    // General events
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  // Connection management
  connect() {
    if (this.socket && !this.isConnected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Workflow subscription
  subscribeToWorkflow(jobId: string, callback: (update: WorkflowUpdate) => void) {
    this.workflowListeners.set(jobId, callback);
    
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe:workflow', { jobId });
    }
  }

  unsubscribeFromWorkflow(jobId: string) {
    this.workflowListeners.delete(jobId);
    
    if (this.socket && this.isConnected) {
      this.socket.emit('unsubscribe:workflow', { jobId });
    }
  }

  // Grid subscription
  subscribeToGridUpdates(callback: (update: GridUpdate) => void) {
    this.gridUpdateListeners.push(callback);
    
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe:grid');
    }
  }

  unsubscribeFromGridUpdates(callback: (update: GridUpdate) => void) {
    const index = this.gridUpdateListeners.indexOf(callback);
    if (index > -1) {
      this.gridUpdateListeners.splice(index, 1);
    }
  }

  // Alert subscription
  subscribeToAlerts(callback: (alert: AlertUpdate) => void) {
    this.alertListeners.push(callback);
    
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe:alerts');
    }
  }

  unsubscribeFromAlerts(callback: (alert: AlertUpdate) => void) {
    const index = this.alertListeners.indexOf(callback);
    if (index > -1) {
      this.alertListeners.splice(index, 1);
    }
  }

  // Connection status subscription
  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionListeners.push(callback);
  }

  // Emit events
  acknowledgeAlert(alertId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('alert:acknowledge', { alertId });
    }
  }

  resolveAlert(alertId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('alert:resolve', { alertId });
    }
  }

  // Private notification methods
  private notifyWorkflowListeners(update: WorkflowUpdate) {
    const listener = this.workflowListeners.get(update.jobId);
    if (listener) {
      listener(update);
    }
  }

  private notifyGridUpdateListeners(update: GridUpdate) {
    this.gridUpdateListeners.forEach(listener => {
      try {
        listener(update);
      } catch (error) {
        console.error('Error in grid update listener:', error);
      }
    });
  }

  private notifyAlertListeners(alert: AlertUpdate) {
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Error in alert listener:', error);
      }
    });
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  // Cleanup
  destroy() {
    this.disconnect();
    this.workflowListeners.clear();
    this.gridUpdateListeners.length = 0;
    this.alertListeners.length = 0;
    this.connectionListeners.length = 0;
  }
}

// Export singleton instance
export const websocketClient = new WebSocketClient();

// Auto-connect when module is imported
websocketClient.connect();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    websocketClient.destroy();
  });
}

