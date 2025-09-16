export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'operational' | 'compliance' | 'financial' | 'technical';
  type: 'dashboard' | 'summary' | 'detailed' | 'executive';
  layout: ReportLayout;
  dataSource: string[];
  filters: ReportFilter[];
  charts: ReportChart[];
  tables: ReportTable[];
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export interface ReportLayout {
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'A3' | 'Letter' | 'Legal';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header: ReportSection;
  footer: ReportSection;
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  type: 'header' | 'footer' | 'content' | 'chart' | 'table' | 'text' | 'image';
  title?: string;
  content?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styling: {
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    color: string;
    backgroundColor: string;
    border: boolean;
    alignment: 'left' | 'center' | 'right';
  };
  dataBinding?: string;
}

export interface ReportChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  dataSource: string;
  xAxis: string;
  yAxis: string[];
  filters: ReportFilter[];
  styling: ChartStyling;
}

export interface ReportTable {
  id: string;
  title: string;
  dataSource: string;
  columns: TableColumn[];
  filters: ReportFilter[];
  pagination: boolean;
  sorting: boolean;
}

export interface TableColumn {
  id: string;
  name: string;
  dataKey: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'currency';
  width?: number;
  sortable: boolean;
  filterable: boolean;
  format?: string;
}

export interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: any;
  label: string;
}

export interface ChartStyling {
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
  showLabels: boolean;
  height: number;
}

export interface ScheduledReport {
  id: string;
  templateId: string;
  name: string;
  description: string;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone: string;
  };
  recipients: ReportRecipient[];
  format: 'pdf' | 'excel' | 'csv' | 'powerpoint';
  status: 'active' | 'paused' | 'error';
  lastRun?: number;
  nextRun: number;
  deliveryMethod: 'email' | 'download' | 'cloud_storage';
  settings: {
    includeCharts: boolean;
    includeRawData: boolean;
    compressFiles: boolean;
    passwordProtect: boolean;
  };
}

export interface ReportRecipient {
  id: string;
  name: string;
  email: string;
  role: string;
  preferences: {
    format: 'pdf' | 'excel' | 'csv';
    summary: boolean;
    charts: boolean;
  };
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  generatedAt: number;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv' | 'powerpoint';
  size: number;
  downloadUrl: string;
  status: 'generating' | 'ready' | 'expired' | 'error';
  expiresAt: number;
  metadata: {
    pageCount?: number;
    chartCount: number;
    tableCount: number;
    dataPoints: number;
  };
}

export interface ReportMetrics {
  totalReports: number;
  reportsThisMonth: number;
  scheduledReports: number;
  averageGenerationTime: number;
  popularTemplates: string[];
  exportFormats: Record<string, number>;
}

export interface ReportsState {
  templates: ReportTemplate[];
  scheduledReports: ScheduledReport[];
  generatedReports: GeneratedReport[];
  metrics: ReportMetrics;
  isGenerating: boolean;
  generationProgress: number;
  selectedTemplate: string | null;
  previewData: any;
  
  // Actions
  createTemplate: (template: Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (templateId: string, updates: Partial<ReportTemplate>) => void;
  deleteTemplate: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => void;
  generateReport: (templateId: string, format: string, options?: any) => Promise<string>;
  scheduleReport: (schedule: Omit<ScheduledReport, 'id' | 'nextRun'>) => void;
  updateSchedule: (scheduleId: string, updates: Partial<ScheduledReport>) => void;
  deleteSchedule: (scheduleId: string) => void;
  setSelectedTemplate: (templateId: string | null) => void;
  refreshMetrics: () => void;
}