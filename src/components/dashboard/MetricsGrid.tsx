import React from 'react';
import { Zap, Gauge, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGridStore } from '../../stores/gridStore';
import { Card } from '../ui/Card';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  status?: 'good' | 'warning' | 'critical';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color,
  status = 'good',
}) => {
  const getChangeIcon = () => {
    if (!change) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10';
      case 'critical':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const ChangeIcon = getChangeIcon();

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {unit && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {unit}
              </span>
            )}
          </div>
          {change !== undefined && (
            <div className="flex items-center space-x-1 mt-1">
              <ChangeIcon size={14} className={getChangeColor()} />
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last hour
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon size={24} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </Card>
  );
};

export const MetricsGrid: React.FC = () => {
  const { metrics, connectionStatus } = useGridStore();

  const getNodeStatus = () => {
    const percentage = (metrics.activeNodes / metrics.totalNodes) * 100;
    if (percentage >= 95) return 'good';
    if (percentage >= 90) return 'warning';
    return 'critical';
  };

  const getEfficiencyStatus = () => {
    if (metrics.gridEfficiency >= 92) return 'good';
    if (metrics.gridEfficiency >= 88) return 'warning';
    return 'critical';
  };

  const getLoadStatus = () => {
    if (metrics.systemLoad <= 85) return 'good';
    if (metrics.systemLoad <= 95) return 'warning';
    return 'critical';
  };

  // Calculate mock changes (in a real app, this would come from historical data)
  const mockChanges = {
    power: (Math.random() - 0.5) * 10,
    efficiency: (Math.random() - 0.5) * 4,
    nodes: (Math.random() - 0.5) * 2,
    load: (Math.random() - 0.5) * 8,
  };

  if (connectionStatus === 'disconnected') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <MetricCard
        title="Total Power Generation"
        value={metrics.totalPowerGeneration.toFixed(0)}
        unit="MW"
        change={mockChanges.power}
        icon={Zap}
        color="blue"
      />
      
      <MetricCard
        title="Grid Efficiency"
        value={metrics.gridEfficiency.toFixed(1)}
        unit="%"
        change={mockChanges.efficiency}
        icon={Gauge}
        color="green"
        status={getEfficiencyStatus()}
      />
      
      <MetricCard
        title="Active Nodes"
        value={`${metrics.activeNodes}/${metrics.totalNodes}`}
        change={mockChanges.nodes}
        icon={Activity}
        color="purple"
        status={getNodeStatus()}
      />
      
      <MetricCard
        title="System Load"
        value={metrics.systemLoad.toFixed(1)}
        unit="%"
        change={mockChanges.load}
        icon={TrendingUp}
        color="orange"
        status={getLoadStatus()}
      />
    </div>
  );
};