import { create } from 'zustand';
import { ReportsState, ReportTemplate, ScheduledReport, GeneratedReport, ReportMetrics } from '../types/reports';

// Mock data generators
const generateMockTemplates = (): ReportTemplate[] => [
  {
    id: 'template-1',
    name: 'Daily Operations Report',
    description: 'Comprehensive daily performance and operations summary',
    category: 'operational',
    type: 'summary',
    layout: {
      orientation: 'portrait',
      pageSize: 'A4',
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      header: {
        id: 'header-1',
        type: 'header',
        title: 'Daily Operations Report',
        position: { x: 0, y: 0, width: 100, height: 10 },
        styling: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: '#ffffff',
          border: false,
          alignment: 'center',
        },
      },
      footer: {
        id: 'footer-1',
        type: 'footer',
        content: 'Smart Grid Platform - Confidential',
        position: { x: 0, y: 90, width: 100, height: 5 },
        styling: {
          fontSize: 10,
          fontWeight: 'normal',
          color: '#666666',
          backgroundColor: '#ffffff',
          border: false,
          alignment: 'center',
        },
      },
      sections: [],
    },
    dataSource: ['grid_metrics', 'power_data', 'alerts'],
    filters: [],
    charts: [
      {
        id: 'chart-1',
        title: 'Power Generation vs Consumption',
        type: 'line',
        dataSource: 'power_data',
        xAxis: 'time',
        yAxis: ['generation', 'consumption'],
        filters: [],
        styling: {
          colors: ['#3b82f6', '#10b981'],
          showLegend: true,
          showGrid: true,
          showLabels: true,
          height: 300,
        },
      },
    ],
    tables: [],
    createdAt: Date.now() - 604800000,
    updatedAt: Date.now() - 86400000,
    createdBy: 'admin',
    isPublic: true,
    tags: ['daily', 'operations', 'performance'],
  },
  {
    id: 'template-2',
    name: 'Weekly Performance Analysis',
    description: 'Detailed weekly performance trends and analysis',
    category: 'operational',
    type: 'detailed',
    layout: {
      orientation: 'landscape',
      pageSize: 'A4',
      margins: { top: 15, right: 15, bottom: 15, left: 15 },
      header: {
        id: 'header-2',
        type: 'header',
        title: 'Weekly Performance Analysis',
        position: { x: 0, y: 0, width: 100, height: 8 },
        styling: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000000',
          backgroundColor: '#f8f9fa',
          border: true,
          alignment: 'left',
        },
      },
      footer: {
        id: 'footer-2',
        type: 'footer',
        content: 'Generated on {{date}} | Page {{page}}',
        position: { x: 0, y: 92, width: 100, height: 5 },
        styling: {
          fontSize: 9,
          fontWeight: 'normal',
          color: '#666666',
          backgroundColor: '#ffffff',
          border: false,
          alignment: 'right',
        },
      },
      sections: [],
    },
    dataSource: ['historical_data', 'efficiency_metrics'],
    filters: [],
    charts: [
      {
        id: 'chart-2',
        title: 'Efficiency Trends',
        type: 'area',
        dataSource: 'historical_data',
        xAxis: 'date',
        yAxis: ['efficiency'],
        filters: [],
        styling: {
          colors: ['#8b5cf6'],
          showLegend: false,
          showGrid: true,
          showLabels: true,
          height: 250,
        },
      },
    ],
    tables: [
      {
        id: 'table-1',
        title: 'Performance Summary',
        dataSource: 'efficiency_metrics',
        columns: [
          { id: 'col-1', name: 'Metric', dataKey: 'name', type: 'text', sortable: true, filterable: false },
          { id: 'col-2', name: 'Value', dataKey: 'value', type: 'number', sortable: true, filterable: false, format: '0.00' },
          { id: 'col-3', name: 'Target', dataKey: 'target', type: 'number', sortable: false, filterable: false, format: '0.00' },
          { id: 'col-4', name: 'Status', dataKey: 'status', type: 'text', sortable: true, filterable: true },
        ],
        filters: [],
        pagination: false,
        sorting: true,
      },
    ],
    createdAt: Date.now() - 1209600000,
    updatedAt: Date.now() - 172800000,
    createdBy: 'analyst',
    isPublic: true,
    tags: ['weekly', 'performance', 'trends'],
  },
  {
    id: 'template-3',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance status and audit findings',
    category: 'compliance',
    type: 'executive',
    layout: {
      orientation: 'portrait',
      pageSize: 'A4',
      margins: { top: 25, right: 20, bottom: 25, left: 20 },
      header: {
        id: 'header-3',
        type: 'header',
        title: 'Compliance Audit Report',
        position: { x: 0, y: 0, width: 100, height: 12 },
        styling: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1f2937',
          backgroundColor: '#f3f4f6',
          border: true,
          alignment: 'center',
        },
      },
      footer: {
        id: 'footer-3',
        type: 'footer',
        content: 'Confidential - Internal Use Only',
        position: { x: 0, y: 88, width: 100, height: 6 },
        styling: {
          fontSize: 10,
          fontWeight: 'bold',
          color: '#dc2626',
          backgroundColor: '#ffffff',
          border: false,
          alignment: 'center',
        },
      },
      sections: [],
    },
    dataSource: ['compliance_data', 'security_metrics'],
    filters: [],
    charts: [],
    tables: [],
    createdAt: Date.now() - 2592000000,
    updatedAt: Date.now() - 259200000,
    createdBy: 'compliance_officer',
    isPublic: false,
    tags: ['compliance', 'audit', 'regulatory'],
  },
];

const generateMockScheduledReports = (): ScheduledReport[] => [
  {
    id: 'schedule-1',
    templateId: 'template-1',
    name: 'Daily Operations Report',
    description: 'Automated daily operations summary',
    schedule: {
      frequency: 'daily',
      time: '06:00',
      timezone: 'UTC',
    },
    recipients: [
      {
        id: 'recipient-1',
        name: 'Operations Manager',
        email: 'ops.manager@smartgrid.com',
        role: 'manager',
        preferences: { format: 'pdf', summary: true, charts: true },
      },
      {
        id: 'recipient-2',
        name: 'Grid Operator',
        email: 'operator@smartgrid.com',
        role: 'operator',
        preferences: { format: 'excel', summary: false, charts: true },
      },
    ],
    format: 'pdf',
    status: 'active',
    lastRun: Date.now() - 86400000,
    nextRun: Date.now() + 3600000,
    deliveryMethod: 'email',
    settings: {
      includeCharts: true,
      includeRawData: false,
      compressFiles: false,
      passwordProtect: true,
    },
  },
  {
    id: 'schedule-2',
    templateId: 'template-2',
    name: 'Weekly Performance Review',
    description: 'Weekly performance analysis for management',
    schedule: {
      frequency: 'weekly',
      time: '08:00',
      dayOfWeek: 1, // Monday
      timezone: 'UTC',
    },
    recipients: [
      {
        id: 'recipient-3',
        name: 'Executive Team',
        email: 'executives@smartgrid.com',
        role: 'executive',
        preferences: { format: 'pdf', summary: true, charts: true },
      },
    ],
    format: 'pdf',
    status: 'active',
    lastRun: Date.now() - 604800000,
    nextRun: Date.now() + 86400000,
    deliveryMethod: 'email',
    settings: {
      includeCharts: true,
      includeRawData: true,
      compressFiles: true,
      passwordProtect: true,
    },
  },
];

const generateMockGeneratedReports = (): GeneratedReport[] => [
  {
    id: 'report-1',
    templateId: 'template-1',
    name: 'Daily Operations Report - Jan 15, 2024',
    generatedAt: Date.now() - 3600000,
    generatedBy: 'system',
    format: 'pdf',
    size: 2.4,
    downloadUrl: '/reports/daily-ops-2024-01-15.pdf',
    status: 'ready',
    expiresAt: Date.now() + 2592000000,
    metadata: {
      pageCount: 8,
      chartCount: 4,
      tableCount: 2,
      dataPoints: 1440,
    },
  },
  {
    id: 'report-2',
    templateId: 'template-2',
    name: 'Weekly Performance Analysis - Week 2, 2024',
    generatedAt: Date.now() - 86400000,
    generatedBy: 'analyst_brown',
    format: 'excel',
    size: 5.7,
    downloadUrl: '/reports/weekly-performance-week2-2024.xlsx',
    status: 'ready',
    expiresAt: Date.now() + 2592000000,
    metadata: {
      chartCount: 6,
      tableCount: 8,
      dataPoints: 10080,
    },
  },
  {
    id: 'report-3',
    templateId: 'template-3',
    name: 'Compliance Audit Report - Q4 2023',
    generatedAt: Date.now() - 172800000,
    generatedBy: 'compliance_officer',
    format: 'pdf',
    size: 12.3,
    downloadUrl: '/reports/compliance-audit-q4-2023.pdf',
    status: 'ready',
    expiresAt: Date.now() + 5184000000,
    metadata: {
      pageCount: 45,
      chartCount: 12,
      tableCount: 15,
      dataPoints: 25000,
    },
  },
];

const generateMockMetrics = (): ReportMetrics => ({
  totalReports: 247,
  reportsThisMonth: 34,
  scheduledReports: 12,
  averageGenerationTime: 45,
  popularTemplates: ['Daily Operations Report', 'Weekly Performance Analysis', 'Security Summary'],
  exportFormats: {
    pdf: 156,
    excel: 67,
    csv: 18,
    powerpoint: 6,
  },
});

export const useReportsStore = create<ReportsState>((set, get) => {
  let generationInterval: NodeJS.Timeout | null = null;

  return {
    templates: generateMockTemplates(),
    scheduledReports: generateMockScheduledReports(),
    generatedReports: generateMockGeneratedReports(),
    metrics: generateMockMetrics(),
    isGenerating: false,
    generationProgress: 0,
    selectedTemplate: null,
    previewData: null,

    createTemplate: (templateData) => {
      const newTemplate: ReportTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      set((state) => ({
        templates: [newTemplate, ...state.templates],
      }));
    },

    updateTemplate: (templateId, updates) => {
      set((state) => ({
        templates: state.templates.map((template) =>
          template.id === templateId
            ? { ...template, ...updates, updatedAt: Date.now() }
            : template
        ),
      }));
    },

    deleteTemplate: (templateId) => {
      set((state) => ({
        templates: state.templates.filter((template) => template.id !== templateId),
        scheduledReports: state.scheduledReports.filter((schedule) => schedule.templateId !== templateId),
        generatedReports: state.generatedReports.filter((report) => report.templateId !== templateId),
      }));
    },

    duplicateTemplate: (templateId) => {
      const template = get().templates.find(t => t.id === templateId);
      if (template) {
        get().createTemplate({
          ...template,
          name: `${template.name} (Copy)`,
          isPublic: false,
        });
      }
    },

    generateReport: async (templateId, format, options = {}) => {
      const template = get().templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');

      set({ isGenerating: true, generationProgress: 0 });

      // Simulate report generation progress
      generationInterval = setInterval(() => {
        const currentProgress = get().generationProgress;
        if (currentProgress >= 100) {
          clearInterval(generationInterval!);
          generationInterval = null;

          const newReport: GeneratedReport = {
            id: `report-${Date.now()}`,
            templateId,
            name: `${template.name} - ${new Date().toLocaleDateString()}`,
            generatedAt: Date.now(),
            generatedBy: 'current_user',
            format: format as any,
            size: 2 + Math.random() * 10,
            downloadUrl: `/reports/${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${format}`,
            status: 'ready',
            expiresAt: Date.now() + 2592000000, // 30 days
            metadata: {
              pageCount: format === 'pdf' ? 5 + Math.floor(Math.random() * 20) : undefined,
              chartCount: template.charts.length,
              tableCount: template.tables.length,
              dataPoints: 1000 + Math.floor(Math.random() * 10000),
            },
          };

          set((state) => ({
            generatedReports: [newReport, ...state.generatedReports],
            isGenerating: false,
            generationProgress: 0,
          }));

          return newReport.id;
        } else {
          set({ generationProgress: Math.min(100, currentProgress + 5 + Math.random() * 10) });
        }
      }, 200);

      return 'generating';
    },

    scheduleReport: (scheduleData) => {
      const newSchedule: ScheduledReport = {
        ...scheduleData,
        id: `schedule-${Date.now()}`,
        nextRun: Date.now() + 86400000, // Next day
      };

      set((state) => ({
        scheduledReports: [newSchedule, ...state.scheduledReports],
      }));
    },

    updateSchedule: (scheduleId, updates) => {
      set((state) => ({
        scheduledReports: state.scheduledReports.map((schedule) =>
          schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
        ),
      }));
    },

    deleteSchedule: (scheduleId) => {
      set((state) => ({
        scheduledReports: state.scheduledReports.filter((schedule) => schedule.id !== scheduleId),
      }));
    },

    setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),

    refreshMetrics: () => {
      set({ metrics: generateMockMetrics() });
    },
  };
});