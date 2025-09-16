import { create } from 'zustand';
import { TopologyState, GridNode, GridConnection } from '../types/topology';

// Mock data generators
const generateMockNodes = (): GridNode[] => {
  const nodes: GridNode[] = [];
  
  // Power plants (4)
  const powerPlants = [
    { name: 'Nuclear Plant Alpha', x: 100, y: 150, capacity: 1200, fuelType: 'Nuclear' },
    { name: 'Solar Farm Beta', x: 800, y: 100, capacity: 800, fuelType: 'Solar' },
    { name: 'Wind Farm Gamma', x: 200, y: 400, capacity: 600, fuelType: 'Wind' },
    { name: 'Gas Plant Delta', x: 700, y: 450, capacity: 900, fuelType: 'Natural Gas' },
  ];
  
  powerPlants.forEach((plant, index) => {
    nodes.push({
      id: `pp-${index + 1}`,
      name: plant.name,
      type: 'powerplant',
      position: { x: plant.x, y: plant.y },
      status: Math.random() > 0.1 ? 'online' : 'maintenance',
      capacity: plant.capacity,
      currentLoad: plant.capacity * (0.6 + Math.random() * 0.3),
      voltage: 345,
      properties: {
        powerOutput: plant.capacity * (0.6 + Math.random() * 0.3),
        efficiency: 85 + Math.random() * 10,
        fuelType: plant.fuelType,
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15',
      },
    });
  });
  
  // Substations (12)
  const substationPositions = [
    { x: 250, y: 200 }, { x: 450, y: 180 }, { x: 650, y: 220 },
    { x: 150, y: 300 }, { x: 350, y: 280 }, { x: 550, y: 320 }, { x: 750, y: 300 },
    { x: 200, y: 500 }, { x: 400, y: 480 }, { x: 600, y: 520 }, { x: 300, y: 600 }, { x: 500, y: 580 },
  ];
  
  substationPositions.forEach((pos, index) => {
    const statuses: GridNode['status'][] = ['online', 'online', 'online', 'online', 'warning', 'maintenance'];
    nodes.push({
      id: `sub-${index + 1}`,
      name: `Substation ${String.fromCharCode(65 + index)}`,
      type: 'substation',
      position: pos,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      capacity: 200 + Math.random() * 100,
      currentLoad: 150 + Math.random() * 80,
      voltage: 138,
      properties: {
        consumers: 500 + Math.floor(Math.random() * 1000),
        lastMaintenance: '2024-02-10',
        nextMaintenance: '2024-08-10',
      },
    });
  });
  
  // Distribution points (20)
  for (let i = 0; i < 20; i++) {
    const statuses: GridNode['status'][] = ['online', 'online', 'online', 'warning', 'offline'];
    nodes.push({
      id: `dist-${i + 1}`,
      name: `Distribution ${i + 1}`,
      type: 'distribution',
      position: {
        x: 100 + Math.random() * 700,
        y: 150 + Math.random() * 500,
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      capacity: 50 + Math.random() * 50,
      currentLoad: 30 + Math.random() * 40,
      voltage: 34.5,
      properties: {
        consumers: 100 + Math.floor(Math.random() * 300),
      },
    });
  }
  
  // Consumer endpoints (25)
  for (let i = 0; i < 25; i++) {
    const statuses: GridNode['status'][] = ['online', 'online', 'online', 'online', 'offline'];
    nodes.push({
      id: `cons-${i + 1}`,
      name: `Consumer ${i + 1}`,
      type: 'consumer',
      position: {
        x: 80 + Math.random() * 740,
        y: 120 + Math.random() * 560,
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      capacity: 10 + Math.random() * 20,
      currentLoad: 8 + Math.random() * 15,
      voltage: 12.47,
      properties: {
        consumers: 50 + Math.floor(Math.random() * 200),
      },
    });
  }
  
  return nodes;
};

const generateMockConnections = (nodes: GridNode[]): GridConnection[] => {
  const connections: GridConnection[] = [];
  
  // Connect power plants to nearby substations
  const powerPlants = nodes.filter(n => n.type === 'powerplant');
  const substations = nodes.filter(n => n.type === 'substation');
  const distributions = nodes.filter(n => n.type === 'distribution');
  const consumers = nodes.filter(n => n.type === 'consumer');
  
  // Power plant to substation connections (high voltage)
  powerPlants.forEach(plant => {
    const nearbySubstations = substations
      .map(sub => ({
        ...sub,
        distance: Math.sqrt(
          Math.pow(plant.position.x - sub.position.x, 2) +
          Math.pow(plant.position.y - sub.position.y, 2)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    nearbySubstations.forEach((sub, index) => {
      const statuses: GridConnection['status'][] = ['active', 'active', 'active', 'overloaded'];
      connections.push({
        id: `conn-${plant.id}-${sub.id}`,
        fromNodeId: plant.id,
        toNodeId: sub.id,
        type: 'high',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        capacity: 500 + Math.random() * 300,
        currentFlow: 300 + Math.random() * 200,
        length: sub.distance / 10,
        powerLoss: (sub.distance / 1000) * 2,
      });
    });
  });
  
  // Substation to distribution connections (medium voltage)
  substations.forEach(substation => {
    const nearbyDistributions = distributions
      .map(dist => ({
        ...dist,
        distance: Math.sqrt(
          Math.pow(substation.position.x - dist.position.x, 2) +
          Math.pow(substation.position.y - dist.position.y, 2)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    
    nearbyDistributions.forEach(dist => {
      const statuses: GridConnection['status'][] = ['active', 'active', 'inactive', 'fault'];
      connections.push({
        id: `conn-${substation.id}-${dist.id}`,
        fromNodeId: substation.id,
        toNodeId: dist.id,
        type: 'medium',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        capacity: 100 + Math.random() * 100,
        currentFlow: 60 + Math.random() * 80,
        length: dist.distance / 10,
        powerLoss: (dist.distance / 1000) * 1.5,
      });
    });
  });
  
  // Distribution to consumer connections (low voltage)
  distributions.forEach(distribution => {
    const nearbyConsumers = consumers
      .map(cons => ({
        ...cons,
        distance: Math.sqrt(
          Math.pow(distribution.position.x - cons.position.x, 2) +
          Math.pow(distribution.position.y - cons.position.y, 2)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    nearbyConsumers.forEach(cons => {
      const statuses: GridConnection['status'][] = ['active', 'active', 'active', 'inactive'];
      connections.push({
        id: `conn-${distribution.id}-${cons.id}`,
        fromNodeId: distribution.id,
        toNodeId: cons.id,
        type: 'low',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        capacity: 20 + Math.random() * 30,
        currentFlow: 10 + Math.random() * 20,
        length: cons.distance / 10,
        powerLoss: (cons.distance / 1000) * 1,
      });
    });
  });
  
  return connections;
};

export const useTopologyStore = create<TopologyState>((set, get) => {
  let simulationInterval: NodeJS.Timeout | null = null;

  return {
    nodes: [],
    connections: [],
    selectedNodeId: null,
    selectedConnectionId: null,
    viewBox: { x: 0, y: 0, width: 900, height: 700 },
    zoom: 1,
    isSimulating: false,

    setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
    
    setSelectedConnection: (connectionId) => set({ selectedConnectionId: connectionId }),
    
    updateNodeStatus: (nodeId, status) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId ? { ...node, status } : node
        ),
      })),
    
    updateConnectionStatus: (connectionId, status) =>
      set((state) => ({
        connections: state.connections.map((conn) =>
          conn.id === connectionId ? { ...conn, status } : conn
        ),
      })),
    
    setViewBox: (viewBox) => set({ viewBox }),
    
    setZoom: (zoom) => set({ zoom }),
    
    startSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      
      set({ isSimulating: true });
      
      simulationInterval = setInterval(() => {
        const state = get();
        
        // Randomly update node statuses
        if (Math.random() > 0.95) {
          const randomNode = state.nodes[Math.floor(Math.random() * state.nodes.length)];
          const statuses: GridNode['status'][] = ['online', 'warning', 'maintenance'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          get().updateNodeStatus(randomNode.id, newStatus);
        }
        
        // Randomly update connection statuses
        if (Math.random() > 0.97) {
          const randomConnection = state.connections[Math.floor(Math.random() * state.connections.length)];
          const statuses: GridConnection['status'][] = ['active', 'overloaded', 'fault'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          get().updateConnectionStatus(randomConnection.id, newStatus);
        }
        
        // Update current loads
        set((state) => ({
          nodes: state.nodes.map((node) => ({
            ...node,
            currentLoad: Math.max(0, node.currentLoad + (Math.random() - 0.5) * 10),
            properties: {
              ...node.properties,
              powerOutput: node.properties.powerOutput 
                ? Math.max(0, node.properties.powerOutput + (Math.random() - 0.5) * 20)
                : undefined,
            },
          })),
          connections: state.connections.map((conn) => ({
            ...conn,
            currentFlow: Math.max(0, Math.min(conn.capacity, conn.currentFlow + (Math.random() - 0.5) * 20)),
          })),
        }));
      }, 3000);
    },
    
    stopSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      set({ isSimulating: false });
    },
    
    generateMockData: () => {
      const nodes = generateMockNodes();
      const connections = generateMockConnections(nodes);
      set({ nodes, connections });
    },
  };
});