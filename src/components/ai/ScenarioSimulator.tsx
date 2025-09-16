import React, { useState } from 'react';
import { Play, Plus, Trash2, Copy, BarChart3 } from 'lucide-react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';
import { format } from 'date-fns';

export const ScenarioSimulator: React.FC = () => {
  const {
    scenarios,
    results,
    algorithms,
    createScenario,
    deleteScenario,
    startOptimization,
  } = useOptimizationStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    parameters: {
      timeRange: '14:00-18:00',
      targetReduction: 15,
      prioritizeRenewable: true,
      maxCostIncrease: 5,
    },
  });

  const handleCreateScenario = () => {
    createScenario(newScenario);
    setNewScenario({
      name: '',
      description: '',
      parameters: {
        timeRange: '14:00-18:00',
        targetReduction: 15,
        prioritizeRenewable: true,
        maxCostIncrease: 5,
      },
    });
    setShowCreateModal(false);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const getScenarioResult = (scenarioId: string) => {
    return results.find(r => r.scenarioId === scenarioId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'running':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const comparisonData = selectedScenarios.map(scenarioId => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    const result = getScenarioResult(scenarioId);
    return {
      name: scenario?.name || 'Unknown',
      efficiency: result?.metrics.efficiencyGain || 0,
      cost: result?.metrics.costSavings || 0,
      renewable: result?.metrics.renewableIncrease || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Scenario Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-blue-600" />
              <span>Optimization Scenarios</span>
            </CardTitle>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={Plus}
            >
              Create Scenario
            </Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const result = getScenarioResult(scenario.id);
            const isSelected = selectedScenarios.includes(scenario.id);
            
            return (
              <div
                key={scenario.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleScenarioSelect(scenario.id)}
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
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(scenario.status)}`}>
                    {scenario.status}
                  </div>
                </div>

                {result && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-sm font-bold text-green-600">
                        +{result.metrics.efficiencyGain.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-sm font-bold text-blue-600">
                        ${result.metrics.costSavings.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Savings</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created {format(scenario.createdAt, 'MMM dd')}</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        startOptimization(scenario.id, algorithms[0]?.id);
                      }}
                      icon={Play}
                      disabled={scenario.status === 'running'}
                    >
                      Run
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScenario(scenario.id);
                      }}
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Scenario Comparison */}
      {selectedScenarios.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Scenario Comparison</CardTitle>
          </CardHeader>

          <div className="space-y-6">
            {/* Efficiency Comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Efficiency Gains Comparison
              </h4>
              <BarChartComponent
                data={comparisonData}
                bars={[{ dataKey: 'efficiency', fill: '#10b981', name: 'Efficiency Gain (%)' }]}
                xAxisKey="name"
                height={200}
              />
            </div>

            {/* Cost Savings Comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cost Savings Comparison
              </h4>
              <BarChartComponent
                data={comparisonData}
                bars={[{ dataKey: 'cost', fill: '#3b82f6', name: 'Cost Savings ($)' }]}
                xAxisKey="name"
                height={200}
              />
            </div>

            {/* Summary Table */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Comparison Summary
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2">Scenario</th>
                      <th className="text-right py-2">Efficiency Gain</th>
                      <th className="text-right py-2">Cost Savings</th>
                      <th className="text-right py-2">Renewable Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((data, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 font-medium text-gray-900 dark:text-white">
                          {data.name}
                        </td>
                        <td className="py-2 text-right text-green-600">
                          +{data.efficiency.toFixed(1)}%
                        </td>
                        <td className="py-2 text-right text-blue-600">
                          ${data.cost.toLocaleString()}
                        </td>
                        <td className="py-2 text-right text-purple-600">
                          +{data.renewable.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Create Scenario Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Scenario"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Scenario Name"
            value={newScenario.name}
            onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
            placeholder="Enter scenario name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newScenario.description}
              onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
              placeholder="Describe the optimization scenario"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Time Range"
              value={newScenario.parameters.timeRange}
              onChange={(e) => setNewScenario({
                ...newScenario,
                parameters: { ...newScenario.parameters, timeRange: e.target.value }
              })}
              placeholder="e.g., 14:00-18:00"
            />

            <Input
              label="Target Reduction (%)"
              type="number"
              value={newScenario.parameters.targetReduction}
              onChange={(e) => setNewScenario({
                ...newScenario,
                parameters: { ...newScenario.parameters, targetReduction: parseInt(e.target.value) }
              })}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newScenario.parameters.prioritizeRenewable}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: { ...newScenario.parameters, prioritizeRenewable: e.target.checked }
                })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Prioritize Renewable Energy
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateScenario}
              disabled={!newScenario.name || !newScenario.description}
            >
              Create Scenario
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};