import React, { useState } from 'react';
import { FileText, Download, Calendar, Settings, Send } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { ReportConfig } from '../../types/analytics';

export const ReportGenerator: React.FC = () => {
  const { generateReport, isLoading } = useAnalyticsStore();
  const [showModal, setShowModal] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: 'Grid Performance Report',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    metrics: ['efficiency', 'generation', 'consumption'],
    chartTypes: ['trends', 'heatmap'],
    format: 'pdf',
  });

  const reportTemplates = [
    {
      id: 'daily',
      name: 'Daily Operations Report',
      description: 'Comprehensive daily performance summary',
      metrics: ['efficiency', 'generation', 'consumption', 'load'],
      charts: ['trends', 'status'],
    },
    {
      id: 'weekly',
      name: 'Weekly Analysis Report',
      description: 'Weekly trends and performance analysis',
      metrics: ['efficiency', 'cost', 'emissions', 'reliability'],
      charts: ['trends', 'heatmap', 'correlation'],
    },
    {
      id: 'monthly',
      name: 'Monthly Executive Summary',
      description: 'High-level monthly performance overview',
      metrics: ['efficiency', 'cost', 'renewable', 'reliability'],
      charts: ['trends', 'correlation'],
    },
    {
      id: 'maintenance',
      name: 'Maintenance Planning Report',
      description: 'Predictive maintenance and asset health',
      metrics: ['reliability', 'maintenance_cost'],
      charts: ['predictive', 'status'],
    },
  ];

  const handleTemplateSelect = (template: typeof reportTemplates[0]) => {
    setReportConfig({
      ...reportConfig,
      title: template.name,
      metrics: template.metrics,
      chartTypes: template.charts,
    });
  };

  const handleGenerateReport = async () => {
    await generateReport(reportConfig);
    setShowModal(false);
  };

  const scheduledReports = [
    {
      id: '1',
      title: 'Daily Operations Report',
      frequency: 'Daily at 6:00 AM',
      recipients: ['operations@grid.com', 'manager@grid.com'],
      lastSent: '2024-01-15 06:00',
      status: 'Active',
    },
    {
      id: '2',
      title: 'Weekly Performance Summary',
      frequency: 'Weekly on Monday at 8:00 AM',
      recipients: ['executives@grid.com'],
      lastSent: '2024-01-15 08:00',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText size={20} className="text-blue-600" />
              <span>Quick Report Generation</span>
            </CardTitle>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              icon={Download}
            >
              Generate Custom Report
            </Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors"
              onClick={() => handleTemplateSelect(template)}
            >
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {template.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {template.metrics.length} metrics
                </span>
                <Button variant="outline" size="sm">
                  Generate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar size={20} className="text-green-600" />
            <span>Scheduled Reports</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {report.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {report.frequency}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recipients: {report.recipients.join(', ')}
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  report.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {report.status}
                </div>
                <div className="text-xs text-gray-500">
                  Last sent: {report.lastSent}
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" icon={Settings}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" icon={Send}>
                    Send Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Custom Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Generate Custom Report"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Report Title"
            value={reportConfig.title}
            onChange={(e) => setReportConfig({ ...reportConfig, title: e.target.value })}
            placeholder="Enter report title"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={reportConfig.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setReportConfig({
                ...reportConfig,
                dateRange: {
                  ...reportConfig.dateRange,
                  start: new Date(e.target.value),
                },
              })}
            />
            <Input
              label="End Date"
              type="date"
              value={reportConfig.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setReportConfig({
                ...reportConfig,
                dateRange: {
                  ...reportConfig.dateRange,
                  end: new Date(e.target.value),
                },
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Include Metrics
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['efficiency', 'generation', 'consumption', 'load', 'cost', 'emissions'].map((metric) => (
                <label key={metric} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.metrics.includes(metric)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReportConfig({
                          ...reportConfig,
                          metrics: [...reportConfig.metrics, metric],
                        });
                      } else {
                        setReportConfig({
                          ...reportConfig,
                          metrics: reportConfig.metrics.filter(m => m !== metric),
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {metric}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              {['pdf', 'excel', 'csv'].map((format) => (
                <label key={format} className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={reportConfig.format === format}
                    onChange={(e) => setReportConfig({
                      ...reportConfig,
                      format: e.target.value as any,
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 uppercase">
                    {format}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              loading={isLoading}
              icon={Download}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};