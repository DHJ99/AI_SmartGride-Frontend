import React, { useState } from 'react';
import { Play, Pause, Square, Settings, Zap, Clock, TrendingUp } from 'lucide-react';
import { useSimulationStore } from '../../stores/simulationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent } from '../ui/Chart';

export const SimulationEngine: React.FC = () => {
  const {
    scenarios,
    activeSimulation,
    simulationProgress,
    simulationSpeed,
    isRunning,
    isPaused,
    currentTime,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    setSimulationSpeed,
  } = useSimulationStore();

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]?.id || '');

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);
  const activeScenarioData = activeSimulation ? scenarios.find(s => s.id === activeSimulation) : null;

  const handleStartSimulation = () => {
    if (selectedScenario) {
      startSimulation(selectedScenario);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeSimulation();
    } else {
      pauseSimulation();
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' },
    { value: 50, label: '50x' },
    { value: 100, label: '100x' },
  ];

  // Mock real-time data for active simulation
  const realtimeData = activeScenarioData?.results?.timeSeriesData?.slice(-20) || [];

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings size={20} className="text-blue-600" />
              <span>Simulation Configuration</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-4">
            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Scenario
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isRunning}
              >
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name} ({scenario.duration}h)
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario Details */}
            {selectedScenarioData && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedScenarioData.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {selectedScenarioData.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                      {selectedScenarioData.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {selectedScenarioData.duration} hours
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Speed Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Simulation Speed
              </label>
              <div className="flex space-x-2">
                {speedOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={simulationSpeed === option.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSimulationSpeed(option.value)}
                    disabled={!isRunning && !isPaused}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-3 pt-4">
              {!isRunning && !isPaused && (
                <Button
                  variant="primary"
                  onClick={handleStartSimulation}
                  disabled={!selectedScenario}
                  icon={Play}
                  className="flex-1"
                >
                  Start Simulation
                </Button>
              )}
              
              {(isRunning || isPaused) && (
                <>
                  <Button
                    variant="secondary"
                    onClick={handlePauseResume}
                    icon={isPaused ? Play : Pause}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopSimulation}
                    icon={Square}
                  >
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Simulation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap size={20} className="text-green-600" />
              <span>Simulation Status</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-4">
            {isRunning || isPaused ? (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {simulationProgress.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isPaused ? 'Paused' : 'Running'} - {activeScenarioData?.name}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-xs text-gray-500">Simulation Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {simulationSpeed}x
                    </div>
                    <div className="text-xs text-gray-500">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {activeScenarioData?.duration || 0}h
                    </div>
                    <div className="text-xs text-gray-500">Total Duration</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a scenario and click start to begin simulation
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Real-time Results */}
      {(isRunning || isPaused) && realtimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-purple-600" />
              <span>Real-time Simulation Data</span>
            </CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efficiency Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Grid Efficiency
              </h4>
              <LineChartComponent
                data={realtimeData}
                lines={[{ dataKey: 'efficiency', stroke: '#10b981', name: 'Efficiency (%)' }]}
                xAxisKey="time"
                height={200}
              />
            </div>

            {/* Load Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                System Load
              </h4>
              <LineChartComponent
                data={realtimeData}
                lines={[
                  { dataKey: 'load', stroke: '#3b82f6', name: 'Load (MW)' },
                  { dataKey: 'generation', stroke: '#8b5cf6', name: 'Generation (MW)' },
                ]}
                xAxisKey="time"
                height={200}
              />
            </div>
          </div>

          {/* Current Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {realtimeData[realtimeData.length - 1]?.efficiency.toFixed(1) || 0}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current Efficiency</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {realtimeData[realtimeData.length - 1]?.load.toFixed(0) || 0} MW
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current Load</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {realtimeData[realtimeData.length - 1]?.voltage.toFixed(1) || 0} kV
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Voltage</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-lg font-bold text-orange-600">
                {realtimeData[realtimeData.length - 1]?.frequency.toFixed(2) || 0} Hz
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Frequency</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};