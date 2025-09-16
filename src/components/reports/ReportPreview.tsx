import React, { useState } from 'react';
import { Eye, Download, Printer as Print, Share, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';

export const ReportPreview: React.FC = () => {
  const { selectedTemplate, templates, generateReport, isGenerating, generationProgress } = useReportsStore();
  const [zoom, setZoom] = useState(100);
  const [previewFormat, setPreviewFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleGenerateReport = async (format: string) => {
    if (selectedTemplate) {
      await generateReport(selectedTemplate, format);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 25));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 25));
  const handleResetZoom = () => setZoom(100);

  // Mock data for preview
  const mockChartData = [
    { time: '00:00', generation: 1100, consumption: 950, efficiency: 94.2 },
    { time: '06:00', generation: 1150, consumption: 1000, efficiency: 93.8 },
    { time: '12:00', generation: 1300, consumption: 1200, efficiency: 92.1 },
    { time: '18:00', generation: 1250, consumption: 1150, efficiency: 93.5 },
    { time: '24:00', generation: 1100, consumption: 980, efficiency: 94.0 },
  ];

  const mockTableData = [
    { metric: 'Grid Efficiency', value: 94.2, target: 95.0, status: 'Good' },
    { metric: 'System Load', value: 87.3, target: 85.0, status: 'High' },
    { metric: 'Active Nodes', value: 156, target: 160, status: 'Good' },
    { metric: 'Power Generation', value: 1247, target: 1200, status: 'Excellent' },
  ];

  if (!selectedTemplateData) {
    return (
      <Card>
        <div className="text-center py-12">
          <Eye size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Template Selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Select a report template to preview its layout and content.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Preview: {selectedTemplateData.name}
              </span>
            </div>
            <div className="flex space-x-1">
              {['pdf', 'excel', 'csv'].map((format) => (
                <Button
                  key={format}
                  variant={previewFormat === format ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewFormat(format as any)}
                  className="uppercase"
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                icon={ZoomOut}
                disabled={zoom <= 50}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                icon={ZoomIn}
                disabled={zoom >= 200}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetZoom}
                icon={RotateCcw}
              />
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <Button
              variant="outline"
              size="sm"
              icon={Print}
            >
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Share}
            >
              Share
            </Button>
            <div className="relative group">
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                loading={isGenerating}
              >
                Generate
              </Button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleGenerateReport('pdf')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Generate PDF
                  </button>
                  <button
                    onClick={() => handleGenerateReport('excel')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Generate Excel
                  </button>
                  <button
                    onClick={() => handleGenerateReport('csv')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Generate CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Generating report...</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {generationProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Report Preview */}
      <Card>
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg overflow-auto"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          {/* Report Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedTemplateData.layout.header.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6 space-y-6">
            {/* Executive Summary */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Executive Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">94.2%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Grid Efficiency</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1,247 MW</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Power Generation</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">156/160</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Nodes</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">87.3%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">System Load</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            {selectedTemplateData.charts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Performance Analysis
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Power Generation vs Consumption
                    </h3>
                    <LineChartComponent
                      data={mockChartData}
                      lines={[
                        { dataKey: 'generation', stroke: '#3b82f6', name: 'Generation (MW)' },
                        { dataKey: 'consumption', stroke: '#10b981', name: 'Consumption (MW)' },
                      ]}
                      xAxisKey="time"
                      height={200}
                    />
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Efficiency Trend
                    </h3>
                    <LineChartComponent
                      data={mockChartData}
                      lines={[{ dataKey: 'efficiency', stroke: '#8b5cf6', name: 'Efficiency (%)' }]}
                      xAxisKey="time"
                      height={200}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tables Section */}
            {selectedTemplateData.tables.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Performance Metrics
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Metric</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Current Value</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Target</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTableData.map((row, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{row.metric}</td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                            {typeof row.value === 'number' ? row.value.toFixed(1) : row.value}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                            {typeof row.target === 'number' ? row.target.toFixed(1) : row.target}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              row.status === 'Excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              row.status === 'Good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              row.status === 'High' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Insights & Recommendations
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Performance Highlights
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Grid efficiency maintained above 94% throughout the reporting period</li>
                    <li>• Peak load successfully managed with 12% capacity margin</li>
                    <li>• Renewable energy integration achieved 42.8% of total generation</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Optimization Opportunities
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Load balancing optimization could improve efficiency by 2.3%</li>
                    <li>• Demand response program implementation recommended for peak shaving</li>
                    <li>• Renewable energy storage optimization during off-peak hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Report Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTemplateData.layout.footer.content}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};