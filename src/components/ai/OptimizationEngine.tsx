import React, { useState } from 'react';
import { Play, Square, Settings, Zap, TrendingUp, Target } from 'lucide-react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';

export const OptimizationEngine: React.FC = () => {
  const {
    algorithms,
    scenarios,
    results,
    activeOptimization,
    isOptimizing,
    optimizationProgress,
    startOptimization,
    stopOptimization,
    updateAlgorithmParameters,
  } = useOptimizationStore();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]?.id || '');
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]?.id || '');

  const selectedAlgorithmData = algorithms.find(a => a.id === selectedAlgorithm);
  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);
  const latestResult = results[0];

  const handleParameterChange = (paramId: string, value: any) => {
    if (selectedAlgorithmData) {
      updateAlgorithmParameters(selectedAlgorithm, { [paramId]: value });
    }
  };

  const handleStartOptimization = () => {
    if (selectedScenario && selectedAlgorithm) {
      startOptimization(selectedScenario, selectedAlgorithm);
    }
  };

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings size={20} className="text-blue-600" />
              <span>Optimization Configuration</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-4">
            {/* Algorithm Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isOptimizing}
              >
                {algorithms.map((algorithm) => (
                  <option key={algorithm.id} value={algorithm.id}>
                    {algorithm.name} - {algorithm.performance.accuracy.toFixed(1)}% accuracy
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Optimization Scenario
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isOptimizing}
              >
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Algorithm Parameters */}
            {selectedAlgorithmData && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Algorithm Parameters
                </h4>
                <div className="space-y-3">
                  {selectedAlgorithmData.parameters.map((param) => (
                    <div key={param.id}>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {param.name}
                      </label>
                      {param.type === 'number' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={param.value}
                            onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                            className="flex-1"
                            disabled={isOptimizing}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                            {param.value}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                onClick={handleStartOptimization}
                disabled={isOptimizing || !selectedScenario || !selectedAlgorithm}
                icon={Play}
                className="flex-1"
              >
                Start Optimization
              </Button>
              <Button
                variant="secondary"
                onClick={stopOptimization}
                disabled={!isOptimizing}
                icon={Square}
              >
                Stop
              </Button>
            </div>
          </div>
        </Card>

        {/* Optimization Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap size={20} className="text-green-600" />
              <span>Optimization Status</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-4">
            {isOptimizing ? (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {optimizationProgress.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${optimizationProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Running {selectedAlgorithmData?.name} on {selectedScenarioData?.name}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <Target size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Ready to Optimize
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a scenario and algorithm to begin optimization
                  </p>
                </div>
              </>
            )}

            {/* Algorithm Performance */}
            {selectedAlgorithmData && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Algorithm Performance
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {selectedAlgorithmData.performance.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedAlgorithmData.performance.speed}
                    </div>
                    <div className="text-xs text-gray-500">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {selectedAlgorithmData.performance.reliability}%
                    </div>
                    <div className="text-xs text-gray-500">Reliability</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Latest Results */}
      {latestResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-purple-600" />
              <span>Latest Optimization Results</span>
            </CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Performance Improvements
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    +{latestResult.metrics.efficiencyGain.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Efficiency</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    ${latestResult.metrics.costSavings.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Cost Savings</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    -{latestResult.metrics.loadReduction.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Load Reduction</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    +{latestResult.metrics.renewableIncrease.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Renewable</div>
                </div>
              </div>
            </div>

            {/* Before/After Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Before vs After Comparison
              </h4>
              <BarChartComponent
                data={latestResult.charts.beforeAfter}
                bars={[{ dataKey: 'value', fill: '#3b82f6', name: 'Efficiency %' }]}
                xAxisKey="name"
                height={200}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};