import React from 'react';
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { Card } from '../ui/Card';

export const PerformanceMetrics: React.FC = () => {
  const { metrics } = useAnalyticsStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return Award;
      case 'warning':
        return AlertTriangle;
      case 'critical':
        return AlertTriangle;
      default:
        return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return TrendingUp;
      case 'decrease':
        return TrendingDown;
      default:
        return Target;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const StatusIcon = getStatusIcon(metric.status);
        const ChangeIcon = getChangeIcon(metric.changeType);
        const progressPercentage = metric.target ? (metric.value / metric.target) * 100 : 100;

        return (
          <Card key={metric.id} className="hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {metric.name}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.unit}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${getStatusColor(metric.status)}`}>
                <StatusIcon size={20} />
              </div>
            </div>

            {/* Change Indicator */}
            <div className="flex items-center space-x-2 mb-3">
              <ChangeIcon size={16} className={getChangeColor(metric.changeType)} />
              <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
            </div>

            {/* Progress Bar (if target exists) */}
            {metric.target && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Progress to Target</span>
                  <span>{metric.target}{metric.unit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progressPercentage >= 100
                        ? 'bg-green-500'
                        : progressPercentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {progressPercentage.toFixed(1)}% of target achieved
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};