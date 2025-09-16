import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Eye } from 'lucide-react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';
import { format } from 'date-fns';

export const OptimizationResults: React.FC = () => {
  const { results, scenarios, algorithms } = useOptimizationStore();
  const [selectedResult, setSelectedResult] = useState(results[0]?.id || '');

  const selectedResultData = results.find(r => r.id === selectedResult);
  const selectedScenario = selectedResultData ? scenarios.find(s => s.id === selectedResultData.scenarioId) : null;
  const selectedAlgorithm = selectedResultData ? algorithms.find(a => a.id === selectedResultData.algorithm) : null;

  const handleExportResults = (format: 'pdf' | 'excel' | 'csv') => {
    // In a real app, this would trigger the export
    console.log(`Exporting results as ${format}`);
  };

  if (results.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Results Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Run an optimization scenario to see results here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-purple-600" />
              <span>Optimization Results</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={selectedResult}
                onChange={(e) => setSelectedResult(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {results.map((result) => {
                  const scenario = scenarios.find(s => s.id === result.scenarioId);
                  return (
                    <option key={result.id} value={result.id}>
                      {scenario?.name || 'Unknown Scenario'} - {format(result.executionTime * 1000, 'MMM dd')}
                    </option>
                  );
                })}
              </select>
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                >
                  Export
                </Button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleExportResults('pdf')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleExportResults('excel')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export Excel
                    </button>
                    <button
                      onClick={() => handleExportResults('csv')}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {selectedResultData && (
          <div className="space-y-6">
            {/* Result Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  +{selectedResultData.metrics.efficiencyGain.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Efficiency Gain</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ${selectedResultData.metrics.costSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cost Savings</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  -{selectedResultData.metrics.loadReduction.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Load Reduction</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  -{selectedResultData.metrics.emissionReduction.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Emissions</div>
              </div>
            </div>

            {/* Execution Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Scenario</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedScenario?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Algorithm</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedAlgorithm?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Execution Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedResultData.executionTime.toFixed(0)}s
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Detailed Charts */}
      {selectedResultData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Before/After Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Before vs After Comparison</CardTitle>
            </CardHeader>
            <BarChartComponent
              data={selectedResultData.charts.beforeAfter}
              bars={[{ dataKey: 'value', fill: '#3b82f6', name: 'Performance Score' }]}
              xAxisKey="name"
              height={250}
            />
          </Card>

          {/* Timeline Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Timeline</CardTitle>
            </CardHeader>
            <LineChartComponent
              data={selectedResultData.charts.timeline}
              lines={[{ dataKey: 'value', stroke: '#10b981', name: 'Performance' }]}
              xAxisKey="name"
              height={250}
            />
          </Card>

          {/* Distribution Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Load Distribution</CardTitle>
            </CardHeader>
            <BarChartComponent
              data={selectedResultData.charts.distribution}
              bars={[{ dataKey: 'value', fill: '#8b5cf6', name: 'Load (%)' }]}
              xAxisKey="name"
              height={250}
            />
          </Card>

          {/* Confidence & Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Result Quality</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Level</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedResultData.confidence.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedResultData.confidence}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {selectedResultData.executionTime.toFixed(0)}s
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Execution Time</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {selectedResultData.confidence.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Insights
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Optimization achieved {selectedResultData.metrics.efficiencyGain.toFixed(1)}% efficiency improvement</li>
                  <li>• Cost savings of ${selectedResultData.metrics.costSavings.toLocaleString()} projected annually</li>
                  <li>• Load reduction of {selectedResultData.metrics.loadReduction.toFixed(1)}% during peak hours</li>
                  <li>• Renewable energy integration increased by {selectedResultData.metrics.renewableIncrease.toFixed(1)}%</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};