import { GridNode, GridConnection, GridMetrics, Alert } from '@/stores/grid'
import { getRandomBetween } from '@/lib/utils'

// Mock grid nodes
export const mockNodes: GridNode[] = [
  // Generators
  {
    id: 'gen-1',
    name: 'Coal Plant Alpha',
    type: 'generator',
    x: 100,
    y: 150,
    status: 'online',
    capacity: 800,
    currentLoad: 720,
    voltage: 13800,
    frequency: 50,
    temperature: 85,
    efficiency: 85,
    lastMaintenance: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-07-15'),
  },
  {
    id: 'gen-2',
    name: 'Wind Farm Beta',
    type: 'generator',
    x: 200,
    y: 100,
    status: 'online',
    capacity: 300,
    currentLoad: 240,
    voltage: 13800,
    frequency: 50,
    temperature: 25,
    efficiency: 95,
    lastMaintenance: new Date('2024-02-01'),
    nextMaintenance: new Date('2024-08-01'),
  },
  {
    id: 'gen-3',
    name: 'Solar Array Gamma',
    type: 'generator',
    x: 300,
    y: 200,
    status: 'online',
    capacity: 150,
    currentLoad: 120,
    voltage: 13800,
    frequency: 50,
    temperature: 45,
    efficiency: 92,
    lastMaintenance: new Date('2024-01-20'),
    nextMaintenance: new Date('2024-07-20'),
  },
  {
    id: 'gen-4',
    name: 'Hydro Plant Delta',
    type: 'generator',
    x: 400,
    y: 120,
    status: 'maintenance',
    capacity: 500,
    currentLoad: 0,
    voltage: 13800,
    frequency: 50,
    temperature: 20,
    efficiency: 90,
    lastMaintenance: new Date('2024-03-01'),
    nextMaintenance: new Date('2024-09-01'),
  },
  
  // Substations
  {
    id: 'sub-1',
    name: 'Central Substation',
    type: 'substation',
    x: 250,
    y: 300,
    status: 'online',
    capacity: 1000,
    currentLoad: 850,
    voltage: 400000,
    frequency: 50,
  },
  {
    id: 'sub-2',
    name: 'North Substation',
    type: 'substation',
    x: 150,
    y: 250,
    status: 'online',
    capacity: 600,
    currentLoad: 480,
    voltage: 400000,
    frequency: 50,
  },
  {
    id: 'sub-3',
    name: 'East Substation',
    type: 'substation',
    x: 350,
    y: 280,
    status: 'warning',
    capacity: 500,
    currentLoad: 475,
    voltage: 395000,
    frequency: 49.8,
  },
  
  // Transformers
  {
    id: 'trans-1',
    name: 'HV Transformer 1',
    type: 'transformer',
    x: 200,
    y: 350,
    status: 'online',
    capacity: 300,
    currentLoad: 250,
    voltage: 132000,
    frequency: 50,
    efficiency: 98,
  },
  {
    id: 'trans-2',
    name: 'HV Transformer 2',
    type: 'transformer',
    x: 300,
    y: 380,
    status: 'online',
    capacity: 400,
    currentLoad: 320,
    voltage: 132000,
    frequency: 50,
    efficiency: 97,
  },
  
  // Loads
  {
    id: 'load-1',
    name: 'Industrial District',
    type: 'load',
    x: 100,
    y: 400,
    status: 'online',
    capacity: 400,
    currentLoad: 380,
    voltage: 11000,
    frequency: 50,
  },
  {
    id: 'load-2',
    name: 'Residential Area A',
    type: 'load',
    x: 200,
    y: 450,
    status: 'online',
    capacity: 200,
    currentLoad: 150,
    voltage: 11000,
    frequency: 50,
  },
  {
    id: 'load-3',
    name: 'Commercial Center',
    type: 'load',
    x: 300,
    y: 420,
    status: 'online',
    capacity: 250,
    currentLoad: 220,
    voltage: 11000,
    frequency: 50,
  },
  {
    id: 'load-4',
    name: 'Residential Area B',
    type: 'load',
    x: 400,
    y: 380,
    status: 'online',
    capacity: 180,
    currentLoad: 140,
    voltage: 11000,
    frequency: 50,
  },
]

// Mock grid connections
export const mockConnections: GridConnection[] = [
  // Generator to substation connections
  {
    id: 'conn-1',
    from: 'gen-1',
    to: 'sub-2',
    capacity: 800,
    currentFlow: 720,
    voltage: 400000,
    status: 'active',
    impedance: 0.05,
    losses: 12,
  },
  {
    id: 'conn-2',
    from: 'gen-2',
    to: 'sub-1',
    capacity: 300,
    currentFlow: 240,
    voltage: 400000,
    status: 'active',
    impedance: 0.06,
    losses: 5,
  },
  {
    id: 'conn-3',
    from: 'gen-3',
    to: 'sub-3',
    capacity: 150,
    currentFlow: 120,
    voltage: 400000,
    status: 'active',
    impedance: 0.04,
    losses: 2,
  },
  {
    id: 'conn-4',
    from: 'gen-4',
    to: 'sub-1',
    capacity: 500,
    currentFlow: 0,
    voltage: 400000,
    status: 'inactive',
    impedance: 0.05,
    losses: 0,
  },
  
  // Substation interconnections
  {
    id: 'conn-5',
    from: 'sub-1',
    to: 'sub-2',
    capacity: 600,
    currentFlow: 200,
    voltage: 400000,
    status: 'active',
    impedance: 0.03,
    losses: 3,
  },
  {
    id: 'conn-6',
    from: 'sub-1',
    to: 'sub-3',
    capacity: 500,
    currentFlow: 180,
    voltage: 400000,
    status: 'active',
    impedance: 0.04,
    losses: 4,
  },
  {
    id: 'conn-7',
    from: 'sub-2',
    to: 'sub-3',
    capacity: 400,
    currentFlow: 150,
    voltage: 400000,
    status: 'active',
    impedance: 0.05,
    losses: 3,
  },
  
  // Substation to transformer connections
  {
    id: 'conn-8',
    from: 'sub-1',
    to: 'trans-1',
    capacity: 300,
    currentFlow: 250,
    voltage: 132000,
    status: 'active',
    impedance: 0.02,
    losses: 2,
  },
  {
    id: 'conn-9',
    from: 'sub-3',
    to: 'trans-2',
    capacity: 400,
    currentFlow: 320,
    voltage: 132000,
    status: 'active',
    impedance: 0.03,
    losses: 3,
  },
  
  // Transformer to load connections
  {
    id: 'conn-10',
    from: 'trans-1',
    to: 'load-1',
    capacity: 400,
    currentFlow: 380,
    voltage: 11000,
    status: 'active',
    impedance: 0.01,
    losses: 8,
  },
  {
    id: 'conn-11',
    from: 'trans-1',
    to: 'load-2',
    capacity: 200,
    currentFlow: 150,
    voltage: 11000,
    status: 'active',
    impedance: 0.02,
    losses: 3,
  },
  {
    id: 'conn-12',
    from: 'trans-2',
    to: 'load-3',
    capacity: 250,
    currentFlow: 220,
    voltage: 11000,
    status: 'active',
    impedance: 0.01,
    losses: 4,
  },
  {
    id: 'conn-13',
    from: 'trans-2',
    to: 'load-4',
    capacity: 180,
    currentFlow: 140,
    voltage: 11000,
    status: 'active',
    impedance: 0.02,
    losses: 3,
  },
]

// Mock metrics
export const mockMetrics: GridMetrics = {
  totalGeneration: 1080,
  totalLoad: 890,
  efficiency: 89.5,
  frequency: 50.0,
  voltage: 400000,
  powerFactor: 0.95,
  losses: 52,
  reliability: 99.7,
  co2Emissions: 450,
  operatingCost: 25000,
  peakDemand: 950,
  demandResponse: 15,
}

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'High Load on East Substation',
    message: 'East Substation is operating at 95% capacity. Consider load balancing.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    nodeId: 'sub-3',
    acknowledged: false,
    resolved: false,
  },
  {
    id: 'alert-2',
    type: 'info',
    title: 'Scheduled Maintenance Completed',
    message: 'Wind Farm Beta maintenance has been completed successfully.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    nodeId: 'gen-2',
    acknowledged: true,
    resolved: true,
  },
  {
    id: 'alert-3',
    type: 'critical',
    title: 'Generator Offline',
    message: 'Hydro Plant Delta is currently offline for maintenance.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    nodeId: 'gen-4',
    acknowledged: true,
    resolved: false,
  },
  {
    id: 'alert-4',
    type: 'error',
    title: 'Voltage Anomaly Detected',
    message: 'Voltage reading below normal range at East Substation.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    nodeId: 'sub-3',
    acknowledged: false,
    resolved: false,
  },
]

// Generate historical data for charts
export function generateHistoricalData(days: number = 30) {
  const data = []
  const now = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const baseLoad = 800 + Math.sin((i / 7) * 2 * Math.PI) * 100 // Weekly pattern
    const randomVariation = getRandomBetween(-50, 50)
    
    data.push({
      timestamp: date,
      totalGeneration: baseLoad + randomVariation + 100,
      totalLoad: baseLoad + randomVariation,
      efficiency: getRandomBetween(85, 95),
      frequency: getRandomBetween(49.8, 50.2),
      voltage: getRandomBetween(395000, 405000),
      losses: getRandomBetween(30, 70),
      reliability: getRandomBetween(99.0, 99.9),
      co2Emissions: getRandomBetween(400, 500),
      operatingCost: getRandomBetween(20000, 30000),
    })
  }
  
  return data
}

// Generate real-time data simulation
export function generateRealtimeUpdate() {
  const variation = 0.1 // 10% variation
  
  return {
    totalGeneration: mockMetrics.totalGeneration * (1 + getRandomBetween(-variation, variation)),
    totalLoad: mockMetrics.totalLoad * (1 + getRandomBetween(-variation, variation)),
    efficiency: mockMetrics.efficiency * (1 + getRandomBetween(-variation/2, variation/2)),
    frequency: 50 + getRandomBetween(-0.2, 0.2),
    voltage: 400000 + getRandomBetween(-5000, 5000),
    powerFactor: 0.95 + getRandomBetween(-0.05, 0.05),
    losses: mockMetrics.losses * (1 + getRandomBetween(-variation, variation)),
    reliability: Math.min(99.9, mockMetrics.reliability + getRandomBetween(-0.1, 0.1)),
    co2Emissions: mockMetrics.co2Emissions * (1 + getRandomBetween(-variation, variation)),
    operatingCost: mockMetrics.operatingCost * (1 + getRandomBetween(-variation, variation)),
  }
}

// ML prediction data
export function generateForecastData(hours: number = 24) {
  const data = []
  const now = new Date()
  
  for (let i = 0; i <= hours; i++) {
    const date = new Date(now.getTime() + i * 60 * 60 * 1000)
    const hourOfDay = date.getHours()
    
    // Simulate daily load pattern
    let baseLoad = 600
    if (hourOfDay >= 6 && hourOfDay <= 9) baseLoad = 800 // Morning peak
    else if (hourOfDay >= 17 && hourOfDay <= 21) baseLoad = 900 // Evening peak
    else if (hourOfDay >= 22 || hourOfDay <= 5) baseLoad = 500 // Night valley
    
    const predicted = baseLoad + getRandomBetween(-50, 50)
    const confidence = getRandomBetween(0.85, 0.95)
    
    data.push({
      timestamp: date,
      predicted,
      actual: i === 0 ? predicted + getRandomBetween(-20, 20) : null,
      confidence,
      upper: predicted * (1 + (1 - confidence)),
      lower: predicted * (1 - (1 - confidence)),
    })
  }
  
  return data
}