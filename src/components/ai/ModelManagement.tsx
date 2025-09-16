import React, { useState } from 'react';
import { Brain, Play, Pause, Archive, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent } from '../ui/Chart';
import { format } from 'date-fns';

export const ModelManagement: React.FC = () => {
  const { models, deployModel, archiveModel, retrainModel } = useOptimizationStore();
  const [selectedModel, setSelectedModel] = useState(models[0]?.id || '');

  const selectedModelData = models.find(m => m.id === selectedModel);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return CheckCircle;
      case 'training':
        return RefreshCw;
      case 'testing':
        return Play;
      case 'archived':
        return Archive;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'training':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'testing':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const performanceData = selectedModelData ? [
    { name: 'Precision', value: selectedModelData.performance.precision * 100 },
    { name: 'Recall', value: selectedModelData.performance.recall * 100 },
    { name: 'F1 Score', value: selectedModelData.performance.f1Score * 100 },
    { name: 'Accuracy', value: selectedModelData.accuracy },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => {
          const StatusIcon = getStatusIcon(model.status);
          return (
            <Card
              key={model.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedModel === model.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {model.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {model.type.replace('_', ' ')}
                  </p>
                </div>
                <div className={`p-1 rounded-full ${getStatusColor(model.status)}`}>
                  <StatusIcon size={16} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {model.accuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Version</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    v{model.version}
                  </span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(model.status)}`}>
                  {model.status}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Model Details */}
      {selectedModelData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain size={20} className="text-purple-600" />
                <span>{selectedModelData.name}</span>
              </CardTitle>
            </CardHeader>

            <div className="space-y-4">
              {/* Model Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {selectedModelData.type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Version</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    v{selectedModelData.version}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Trained</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(selectedModelData.lastTrained, 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedModelData.accuracy.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Training Data */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Training Data
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedModelData.trainingData.samples.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Samples</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {selectedModelData.trainingData.features}
                    </div>
                    <div className="text-xs text-gray-500">Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.floor((selectedModelData.trainingData.timeRange.end.getTime() - selectedModelData.trainingData.timeRange.start.getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                </div>
              </div>

              {/* Deployment Info */}
              {selectedModelData.deploymentInfo && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Deployment Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Endpoint</span>
                      <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {selectedModelData.deploymentInfo.endpoint}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Requests</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedModelData.deploymentInfo.requestCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedModelData.deploymentInfo.avgResponseTime}ms
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4">
                <div className="flex space-x-2">
                  {selectedModelData.status !== 'deployed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => deployModel(selectedModelData.id)}
                      icon={Play}
                    >
                      Deploy
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => retrainModel(selectedModelData.id)}
                    icon={RefreshCw}
                    disabled={selectedModelData.status === 'training'}
                  >
                    Retrain
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archiveModel(selectedModelData.id)}
                    icon={Archive}
                    disabled={selectedModelData.status === 'archived'}
                  >
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>

            <div className="space-y-6">
              {/* Performance Chart */}
              <div>
                <LineChartComponent
                  data={performanceData}
                  lines={[{ dataKey: 'value', stroke: '#8b5cf6', name: 'Score (%)' }]}
                  xAxisKey="name"
                  height={200}
                />
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {(selectedModelData.performance.precision * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Precision</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {(selectedModelData.performance.recall * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Recall</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {(selectedModelData.performance.f1Score * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">F1 Score</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {selectedModelData.performance.mse ? selectedModelData.performance.mse.toFixed(3) : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">MSE</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};