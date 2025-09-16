import React, { useState } from 'react';
import { Plus, Copy, Trash2, Edit, Save } from 'lucide-react';
import { useSimulationStore } from '../../stores/simulationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { SimulationScenario } from '../../types/simulation';

export const ScenarioBuilder: React.FC = () => {
  const { scenarios, createScenario, updateScenario, deleteScenario } = useSimulationStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<string | null>(null);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    type: 'load_variation' as const,
    duration: 24,
    parameters: {},
  });

  const scenarioTypes = [
    { value: 'load_variation', label: 'Load Variation', description: 'Simulate demand changes and peak events' },
    { value: 'equipment_failure', label: 'Equipment Failure', description: 'Test system response to component failures' },
    { value: 'weather_impact', label: 'Weather Impact', description: 'Model weather effects on grid performance' },
    { value: 'demand_response', label: 'Demand Response', description: 'Test demand response program effectiveness' },
    { value: 'renewable_integration', label: 'Renewable Integration', description: 'Optimize renewable energy integration' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'running':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ready':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleCreateScenario = () => {
    createScenario(newScenario);
    setNewScenario({
      name: '',
      description: '',
      type: 'load_variation',
      duration: 24,
      parameters: {},
    });
    setShowCreateModal(false);
  };

  const handleDuplicateScenario = (scenario: SimulationScenario) => {
    createScenario({
      name: `${scenario.name} (Copy)`,
      description: scenario.description,
      type: scenario.type,
      duration: scenario.duration,
      parameters: scenario.parameters,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Edit size={20} className="text-blue-600" />
              <span>Scenario Management</span>
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
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {scenario.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {scenario.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(scenario.status)}`}>
                      {scenario.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {scenario.duration}h duration
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario Type */}
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 capitalize">
                  {scenario.type.replace('_', ' ')}
                </span>
              </div>

              {/* Results Summary */}
              {scenario.results && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-sm font-bold text-green-600">
                      {scenario.results.metrics.averageEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Avg Efficiency</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-sm font-bold text-blue-600">
                      {scenario.results.metrics.reliabilityScore.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Reliability</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateScenario(scenario)}
                  icon={Copy}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingScenario(scenario.id)}
                  icon={Edit}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteScenario(scenario.id)}
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Scenario Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Simulation Scenario"
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
              placeholder="Describe the simulation scenario"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scenario Type
            </label>
            <select
              value={newScenario.type}
              onChange={(e) => setNewScenario({ ...newScenario, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {scenarioTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {scenarioTypes.find(t => t.value === newScenario.type)?.description}
            </p>
          </div>

          <Input
            label="Duration (hours)"
            type="number"
            value={newScenario.duration}
            onChange={(e) => setNewScenario({ ...newScenario, duration: parseInt(e.target.value) || 24 })}
            min={1}
            max={168}
          />

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