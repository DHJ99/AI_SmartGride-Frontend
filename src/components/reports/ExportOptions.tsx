import React, { useState } from 'react';
import { Download, FileText, Table, BarChart3, Presentation, Mail, Cloud, HardDrive } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

export const ExportOptions: React.FC = () => {
  const { generatedReports, generateReport, selectedTemplate, isGenerating, generationProgress } = useReportsStore();
  const [exportSettings, setExportSettings] = useState({
    format: 'pdf' as const,
    includeCharts: true,
    includeRawData: false,
    compressFiles: false,
    passwordProtect: false,
    deliveryMethod: 'download' as const,
  });

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      icon: FileText,
      description: 'Professional PDF with charts and formatting',
      features: ['Charts', 'Tables', 'Formatting', 'Print-ready'],
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      icon: Table,
      description: 'Spreadsheet with data and charts',
      features: ['Raw Data', 'Pivot Tables', 'Charts', 'Formulas'],
    },
    {
      id: 'csv',
      name: 'CSV Data',
      icon: BarChart3,
      description: 'Raw data for analysis',
      features: ['Raw Data', 'Lightweight', 'Universal'],
    },
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      icon: Presentation,
      description: 'Presentation slides with key insights',
      features: ['Slides', 'Charts', 'Executive Summary'],
    },
  ];

  const deliveryMethods = [
    {
      id: 'download',
      name: 'Direct Download',
      icon: Download,
      description: 'Download immediately to your device',
    },
    {
      id: 'email',
      name: 'Email Delivery',
      icon: Mail,
      description: 'Send report via email',
    },
    {
      id: 'cloud',
      name: 'Cloud Storage',
      icon: Cloud,
      description: 'Save to cloud storage',
    },
    {
      id: 'local',
      name: 'Local Storage',
      icon: HardDrive,
      description: 'Save to local file system',
    },
  ];

  const handleExport = async () => {
    if (selectedTemplate) {
      await generateReport(selectedTemplate, exportSettings.format, exportSettings);
    }
  };

  const handleDownload = (report: any) => {
    // In a real app, this would trigger the actual download
    console.log('Downloading report:', report.downloadUrl);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'generating':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'expired':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return FileText;
      case 'excel':
        return Table;
      case 'csv':
        return BarChart3;
      case 'powerpoint':
        return Presentation;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download size={20} className="text-blue-600" />
              <span>Export Configuration</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Export Format
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  const isSelected = exportSettings.format === format.id;
                  
                  return (
                    <div
                      key={format.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setExportSettings({ ...exportSettings, format: format.id as any })}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon size={20} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {format.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {format.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {format.features.map((feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Export Options
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeCharts}
                    onChange={(e) => setExportSettings({ ...exportSettings, includeCharts: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include Charts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.includeRawData}
                    onChange={(e) => setExportSettings({ ...exportSettings, includeRawData: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include Raw Data</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.compressFiles}
                    onChange={(e) => setExportSettings({ ...exportSettings, compressFiles: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Compress Files</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.passwordProtect}
                    onChange={(e) => setExportSettings({ ...exportSettings, passwordProtect: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Password Protection</span>
                </label>
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Delivery Method
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {deliveryMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = exportSettings.deliveryMethod === method.id;
                  
                  return (
                    <div
                      key={method.id}
                      className={`p-2 border rounded cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setExportSettings({ ...exportSettings, deliveryMethod: method.id as any })}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon size={16} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export Button */}
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleExport}
                disabled={!selectedTemplate || isGenerating}
                loading={isGenerating}
                icon={Download}
                className="w-full"
              >
                {isGenerating ? `Generating... ${generationProgress.toFixed(0)}%` : 'Generate Report'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText size={20} className="text-green-600" />
              <span>Recent Reports</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-3">
            {generatedReports.slice(0, 10).map((report) => {
              const FormatIcon = getFormatIcon(report.format);
              
              return (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <FormatIcon size={18} className="text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {report.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>{format(report.generatedAt, 'MMM dd, HH:mm')}</span>
                        <span>•</span>
                        <span>{report.size.toFixed(1)} MB</span>
                        <span>•</span>
                        <span className="uppercase">{report.format}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    {report.status === 'ready' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report)}
                        icon={Download}
                      >
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {generatedReports.length === 0 && (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Reports Generated
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate your first report to see it here.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};