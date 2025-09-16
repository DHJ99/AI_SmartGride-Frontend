import React, { useState } from 'react';
import { Zap, AlertTriangle, Play, Target, TrendingDown } from 'lucide-react';
import { useSimulationStore } from '../../stores/simulationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';

export const StressTestPanel: React.FC = () => {
  const { stressTests, runStressTest } = useSimulationStore();
  const [selectedTest, setSelectedTest] = useState(stressTests[0]?.id || '');

  const selectedTestData = stressTests.find(t => t.id === selectedTest);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'extreme':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'running':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const stressTestTypes = [
    {
      id: 'peak_load',
      name: 'Peak Load Stress Test',
      description: 'Test system capacity under extreme load conditions',
      icon: Zap,
      color: 'blue',
    },
    {
      id: 'cascading_failure',
      name: 'Cascading Failure Test',
      description: 'Simulate cascading equipment failures',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      id: 'recovery_time',
      name: 'Recovery Time Analysis',
      description: 'Measure system recovery capabilities',
      icon: TrendingDown,
      color: 'green',
    },
    {
      id: 'resilience',
      name: 'System Resilience Test',
      description: 'Comprehensive resilience assessment',
      icon: Target,
      color: 'purple',
    },
  ];

  const resilienceData = selectedTestData?.results ? [
    { name: 'Load Handling', value: selectedTestData.results.systemResilience },
    { name: 'Recovery Speed', value: Math.max(0, 100 - selectedTestData.results.recoveryTime * 2) },
    { name: 'Component Health', value: 85 + Math.random() * 10 },
    { name: 'Network Stability', value: 90 + Math.random() * 8 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Stress Test Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target size={20} className="text-red-600" />
            <span>Stress Testing Suite</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stressTestTypes.map((testType) => {
            const Icon = testType.icon;
            return (
              <div
                key={testType.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${testType.color}-100 dark:bg-${testType.color}-900/20 rounded-full mb-3`}>
                    <Icon size={24} className={`text-${testType.color}-600 dark:text-${testType.color}-400`} />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {testType.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {testType.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runStressTest(`stress-${testType.id}`)}
                    icon={Play}
                  >
                    Run Test
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Active Stress Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Stress Test Results</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {stressTests.map((test) => (
            <div
              key={test.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedTest === test.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTest(test.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {test.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getIntensityColor(test.intensity)}`}>
                      {test.intensity} Intensity
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                </div>
              </div>

              {test.results && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-sm font-bold text-green-600">
                      {test.results.maxStressHandled.toFixed(0)} MW
                    </div>
                    <div className="text-xs text-gray-500">Max Handled</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="text-sm font-bold text-red-600">
                      {test.results.breakingPoint?.toFixed(0) || 'N/A'} MW
                    </div>
                    <div className="text-xs text-gray-500">Breaking Point</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-sm font-bold text-blue-600">
                      {test.results.recoveryTime.toFixed(0)} min
                    </div>
                    <div className="text-xs text-gray-500">Recovery Time</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="text-sm font-bold text-purple-600">
                      {test.results.systemResilience.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Resilience</div>
                  </div>
                </div>
              )}

              {test.status === 'running' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Running stress test...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Results */}
      {selectedTestData?.results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Resilience Analysis</CardTitle>
            </CardHeader>
            <BarChartComponent
              data={resilienceData}
              bars={[{ dataKey: 'value', fill: '#8b5cf6', name: 'Score (%)' }]}
              xAxisKey="name"
              height={250}
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Critical Components</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {selectedTestData.results.criticalComponents.map((component, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <span className="font-medium text-red-900 dark:text-red-100">
                    {component}
                  </span>
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Critical
                  </span>
                </div>
              ))}
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommendations:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedTestData.results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};