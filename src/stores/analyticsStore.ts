import { create } from 'zustand';
import { AnalyticsState, AnalyticsMetric, HistoricalDataPoint, PredictiveData, HeatmapData, CorrelationData, ReportConfig } from '../types/analytics';
import { subDays, subHours, format, startOfDay, addHours } from 'date-fns';

// Mock data generators
const generateMetrics = (): AnalyticsMetric[] => [
  {
    id: 'efficiency',
    name: 'Grid Efficiency',
    value: 94.2,
    unit: '%',
    change: 2.1,
    changeType: 'increase',
    target: 95,
    status: 'good',
  },
  {
    id: 'cost',
    name: 'Operating Cost',
    value: 1.2,
    unit: '$/MWh',
    change: -5.3,
    changeType: 'decrease',
    target: 1.0,
    status: 'good',
  },
  {
    id: 'reliability',
    name: 'System Reliability',
    value: 99.7,
    unit: '%',
    change: 0.2,
    changeType: 'increase',
    target: 99.9,
    status: 'warning',
  },
  {
    id: 'emissions',
    name: 'CO2 Emissions',
    value: 0.45,
    unit: 'kg/MWh',
    change: -8.1,
    changeType: 'decrease',
    target: 0.4,
    status: 'good',
  },
  {
    id: 'peak_load',
    name: 'Peak Load Utilization',
    value: 87.3,
    unit: '%',
    change: 3.2,
    changeType: 'increase',
    target: 85,
    status: 'warning',
  },
  {
    id: 'renewable',
    name: 'Renewable Share',
    value: 42.8,
    unit: '%',
    change: 12.5,
    changeType: 'increase',
    target: 50,
    status: 'good',
  },
];

const generateHistoricalData = (days: number = 30): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    const baseEfficiency = 92 + Math.random() * 6;
    const baseGeneration = 1200 + Math.random() * 200;
    const baseConsumption = baseGeneration * (0.85 + Math.random() * 0.1);
    
    data.push({
      timestamp: date.getTime(),
      date: format(date, 'MMM dd'),
      efficiency: baseEfficiency,
      generation: baseGeneration,
      consumption: baseConsumption,
      load: (baseConsumption / baseGeneration) * 100,
      cost: 1.0 + Math.random() * 0.5,
      emissions: 0.4 + Math.random() * 0.2,
    });
  }
  
  return data;
};

const generatePredictiveData = (hours: number = 48): PredictiveData[] => {
  const data: PredictiveData[] = [];
  const now = new Date();
  
  for (let i = 1; i <= hours; i++) {
    const date = addHours(now, i);
    const baseValue = 1200 + Math.sin(i * 0.1) * 100 + Math.random() * 50;
    const confidence = 0.8 + Math.random() * 0.15;
    const variance = baseValue * (1 - confidence) * 0.5;
    
    data.push({
      timestamp: date.getTime(),
      date: format(date, 'MMM dd HH:mm'),
      predicted: baseValue,
      confidence: confidence * 100,
      lower: baseValue - variance,
      upper: baseValue + variance,
    });
  }
  
  return data;
};

const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isWeekend = day >= 5;
      const isPeakHour = hour >= 8 && hour <= 20;
      let baseValue = 60;
      
      if (isPeakHour && !isWeekend) {
        baseValue = 85 + Math.random() * 15;
      } else if (isPeakHour && isWeekend) {
        baseValue = 70 + Math.random() * 15;
      } else {
        baseValue = 40 + Math.random() * 20;
      }
      
      data.push({
        hour,
        day: days[day],
        value: baseValue,
        label: `${days[day]} ${hour}:00 - ${baseValue.toFixed(1)}%`,
      });
    }
  }
  
  return data;
};

const generateCorrelationData = (): CorrelationData[] => {
  const data: CorrelationData[] = [];
  
  for (let i = 0; i < 100; i++) {
    const efficiency = 88 + Math.random() * 12;
    const cost = 1.5 - (efficiency - 88) * 0.05 + Math.random() * 0.3;
    
    data.push({
      x: efficiency,
      y: cost,
      label: `Efficiency: ${efficiency.toFixed(1)}%, Cost: $${cost.toFixed(2)}/MWh`,
      category: efficiency > 94 ? 'High' : efficiency > 90 ? 'Medium' : 'Low',
    });
  }
  
  return data;
};

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  metrics: generateMetrics(),
  historicalData: generateHistoricalData(),
  predictiveData: generatePredictiveData(),
  heatmapData: generateHeatmapData(),
  correlationData: generateCorrelationData(),
  filters: {
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    granularity: 'daily',
    metrics: ['efficiency', 'generation', 'consumption'],
    gridSections: ['all'],
  },
  isLoading: false,
  lastUpdate: Date.now(),

  updateMetrics: (metrics) => set({ metrics, lastUpdate: Date.now() }),
  
  setHistoricalData: (data) => set({ historicalData: data, lastUpdate: Date.now() }),
  
  setPredictiveData: (data) => set({ predictiveData: data, lastUpdate: Date.now() }),
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      lastUpdate: Date.now(),
    })),
  
  generateReport: async (config: ReportConfig) => {
    set({ isLoading: true });
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would generate and download the report
    console.log('Generating report:', config);
    
    set({ isLoading: false });
  },
  
  refreshData: () => {
    set({ isLoading: true });
    
    setTimeout(() => {
      set({
        metrics: generateMetrics(),
        historicalData: generateHistoricalData(),
        predictiveData: generatePredictiveData(),
        heatmapData: generateHeatmapData(),
        correlationData: generateCorrelationData(),
        isLoading: false,
        lastUpdate: Date.now(),
      });
    }, 1000);
  },
}));