export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  target?: number;
  status: 'good' | 'warning' | 'critical';
}

export interface HistoricalDataPoint {
  timestamp: number;
  date: string;
  efficiency: number;
  generation: number;
  consumption: number;
  load: number;
  cost: number;
  emissions: number;
}

export interface PredictiveData {
  timestamp: number;
  date: string;
  predicted: number;
  confidence: number;
  lower: number;
  upper: number;
}

export interface HeatmapData {
  hour: number;
  day: string;
  value: number;
  label: string;
}

export interface CorrelationData {
  x: number;
  y: number;
  label: string;
  category: string;
}

export interface ReportConfig {
  title: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  chartTypes: string[];
  format: 'pdf' | 'excel' | 'csv';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
  metrics: string[];
  gridSections: string[];
}

export interface AnalyticsState {
  metrics: AnalyticsMetric[];
  historicalData: HistoricalDataPoint[];
  predictiveData: PredictiveData[];
  heatmapData: HeatmapData[];
  correlationData: CorrelationData[];
  filters: AnalyticsFilters;
  isLoading: boolean;
  lastUpdate: number;
  
  // Actions
  updateMetrics: (metrics: AnalyticsMetric[]) => void;
  setHistoricalData: (data: HistoricalDataPoint[]) => void;
  setPredictiveData: (data: PredictiveData[]) => void;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  generateReport: (config: ReportConfig) => Promise<void>;
  refreshData: () => void;
}