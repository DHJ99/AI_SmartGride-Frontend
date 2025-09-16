import React from 'react';
import { BarChart3, TrendingUp, Minus, Plus } from 'lucide-react';
import { useSimulationStore } from '../../stores/simulationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';

export const ComparisonView: React.FC = () => {
  const { 
    scenarios, 
    comparisonScenarios, 
    addToComparison, 
    removeFromComparison, 
    clearComparison 
  } = useSimulationStore();

  const completedScenarios = scenarios.filter(s => s.status === 'completed' && s.results);
  const comparisonData = comparisonScenarios
    .map(id => completedScenarios.find(s => s.id === id))
    .filter(Boolean);

  const handleToggleComparison = (scenarioId: string) => {
    if (comparisonScenarios.includes(scenarioId)) {
      removeFromComparison(scenarioId);
    } else {
      addToComparison(scenarioId);
    }
  };

  const metricsComparison = comparisonData.map(scenario => ({
    name: scenario!.name,
    efficiency: scenario!.results!.metrics.averageEfficiency,
    reliability: scenario!.results!.metrics.reliabilityScore,
    peakLoad: scenario!.results!.metrics.peakLoad,
    cost: Math.abs(scenario!.results!.metrics.costImpact),
  }));

  const timelineComparison = comparisonData.length > 0 
    ? comparisonData[0]!.results!.timeSeriesData.filter((_, i) => i % 8 === 0).map((point, index) => {
        const result: any = { time: point.time };
        comparisonData.forEach((scenario, scenarioIndex) => {
          const dataPoint = scenario!.results!.timeSeriesData[index * 8];
          if (dataPoint) {
            result[`scenario_${scenarioIndex}`] = dataPoint.efficiency;
          }
        });
        return result;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-blue-600" />
              <span>Scenario Comparison ({comparisonScenarios.length})</span>
            </CardTitle>
            {comparisonScenarios.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearComparison}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedScenarios.map((scenario) => {
            const isSelected = comparisonScenarios.includes(scenario.id);
            
            return (
              <div
                key={scenario.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleToggleComparison(scenario.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {scenario.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {scenario.description}
                    </p>
                  </div>
                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                    icon={isSelected ? Minus : Plus}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComparison(scenario.id);
                    }}
                  >
                    {isSelected ? 'Remove' : 'Add'}
                  </Button>
                </div>

                {scenario.results && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-sm font-bold text-green-600">
                        {scenario.results.metrics.averageEfficiency.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-sm font-bold text-blue-600">
                        {scenario.results.metrics.reliabilityScore.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Reliability</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Comparison Charts */}
      {comparisonData.length > 1 && (
        <div className="space-y-6">
          {/* Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Efficiency Comparison
                </h4>
                <BarChartComponent
                  data={metricsComparison}
                  bars={[{ dataKey: 'efficiency', fill: '#10b981', name: 'Efficiency (%)' }]}
                  xAxisKey="name"
                  height={200}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Reliability Comparison
                </h4>
                <BarChartComponent
                  data={metricsComparison}
                  bars={[{ dataKey: 'reliability', fill: '#3b82f6', name: 'Reliability (%)' }]}
                  xAxisKey="name"
                  height={200}
                />
              </div>
            </div>
          </Card>

          {/* Timeline Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Timeline Comparison</CardTitle>
            </CardHeader>
            <LineChartComponent
              data={timelineComparison}
              lines={comparisonData.map((scenario, index) => ({
                dataKey: `scenario_${index}`,
                stroke: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][index % 4],
                name: scenario!.name,
              }))}
              xAxisKey="time"
              height={300}
            />
          </Card>

          {/* Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3">Scenario</th>
                    <th className="text-right py-3">Avg Efficiency</th>
                    <th className="text-right py-3">Peak Load</th>
                    <th className="text-right py-3">Reliability</th>
                    <th className="text-right py-3">Cost Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((scenario, index) => (
                    <tr key={scenario!.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {scenario!.name}
                      </td>
                      <td className="py-3 text-right text-green-600">
                        {scenario!.results!.metrics.averageEfficiency.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right text-blue-600">
                        {scenario!.results!.metrics.peakLoad.toFixed(0)} MW
                      </td>
                      <td className="py-3 text-right text-purple-600">
                        {scenario!.results!.metrics.reliabilityScore.toFixed(1)}%
                      </td>
                      <td className={`py-3 text-right ${
                        scenario!.results!.metrics.costImpact > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {scenario!.results!.metrics.costImpact > 0 ? '+' : ''}
                        ${scenario!.results!.metrics.costImpact.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {comparisonData.length <= 1 && (
        <Card>
          <div className="text-center py-8">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select Multiple Scenarios
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add 2 or more completed scenarios to compare their performance.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};