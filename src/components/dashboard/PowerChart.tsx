import React from 'react';
import { useGridStore } from '../../stores/gridStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { LineChartComponent } from '../ui/Chart';
import { ChartSkeleton } from '../ui/LoadingSkeleton';
import { Zap, TrendingUp } from 'lucide-react';

export const PowerChart: React.FC = () => {
  const { powerHistory, connectionStatus } = useGridStore();

  if (connectionStatus === 'disconnected') {
    return (
      <ChartSkeleton />
    );
  }

  const chartData = powerHistory.map(item => ({
    ...item,
    generation: Number(item.generation.toFixed(1)),
    consumption: Number(item.consumption.toFixed(1)),
  }));

  const currentGeneration = powerHistory[powerHistory.length - 1]?.generation || 0;
  const currentConsumption = powerHistory[powerHistory.length - 1]?.consumption || 0;
  const surplus = currentGeneration - currentConsumption;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap size={20} className="text-blue-600" />
            <span>Power Generation & Consumption</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Consumption</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Generation</p>
            <p className="text-lg font-bold text-blue-600">{currentGeneration.toFixed(1)} MW</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Consumption</p>
            <p className="text-lg font-bold text-green-600">{currentConsumption.toFixed(1)} MW</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Surplus/Deficit</p>
            <p className={`text-lg font-bold ${surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {surplus >= 0 ? '+' : ''}{surplus.toFixed(1)} MW
            </p>
          </div>
        </div>
      </CardHeader>
      
      <LineChartComponent
        data={chartData}
        lines={[
          { dataKey: 'generation', stroke: '#3b82f6', name: 'Generation' },
          { dataKey: 'consumption', stroke: '#10b981', name: 'Consumption' },
        ]}
        xAxisKey="time"
        height={300}
      />
    </Card>
  );
};