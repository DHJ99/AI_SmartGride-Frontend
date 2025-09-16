import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Eye, AlertTriangle } from 'lucide-react';
import { useSimulationStore } from '../../stores/simulationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';
import { format } from 'date-fns';

export const SimulationResults: React.FC = () => {
  const { scenarios } = useSimulationStore();
  const [selectedScenario, setSelectedScenario] = useState('');

  const completedScenarios = scenarios.filter(s => s.status === 'completed' && s.results);
  const selectedScenarioData = completedScenarios.find(s => s.id === selectedScenario);

  const handleExportResults = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting results as ${format}`);
  };

  if (completedScenarios.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Simulation Results
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Run a simulation scenario to see results here.
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
              <span>Simulation Results</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="">Select a scenario</option>
                {completedScenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name} - {format(scenario.lastRun || 0, 'MMM dd')}
                  </option>
                ))}
              </select>
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  disabled={!selectedScenario}
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

        {!selectedScenario && (
          <div className="text-center py-8">
            <Eye size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a Scenario
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a completed simulation to view detailed results.
            </p>
          </div>
        )}

        {selectedScenarioData?.results && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {selectedScenarioData.results.metrics.averageEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Efficiency</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {selectedScenarioData.results.metrics.peakLoad.toFixed(0)} MW
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Peak Load</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {selectedScenarioData.results.metrics.reliabilityScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reliability</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {(selectedScenarioData.results.executionTime / 60).toFixed(1)}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Timeline</CardTitle>
                </CardHeader>
                <LineChartComponent
                  data={selectedScenarioData.results.timeSeriesData.filter((_, i) => i % 4 === 0)} // Sample every hour
                  lines={[{ dataKey: 'efficiency', stroke: '#10b981', name: 'Efficiency (%)' }]}
                  xAxisKey="time"
                  height={250}
                />
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Load vs Generation</CardTitle>
                </CardHeader>
                <LineChartComponent
                  data={selectedScenarioData.results.timeSeriesData.filter((_, i) => i % 4 === 0)}
                  lines={[
                    { dataKey: 'load', stroke: '#3b82f6', name: 'Load (MW)' },
                    { dataKey: 'generation', stroke: '#8b5cf6', name: 'Generation (MW)' },
                  ]}
                  xAxisKey="time"
                  height={250}
                />
              </Card>
            </div>

            {/* Events Timeline */}
            {selectedScenarioData.results.events.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle size={20} className="text-yellow-600" />
                    <span>Simulation Events</span>
                  </CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {selectedScenarioData.results.events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'high' ? 'bg-orange-500' :
                        event.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {event.description}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {format(event.timestamp, 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {event.impact}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {event.affectedComponents.map((component, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                            >
                              {component}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Summary and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {selectedScenarioData.results.summary.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {selectedScenarioData.results.summary.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};