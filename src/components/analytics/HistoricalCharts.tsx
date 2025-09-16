import React, { useState } from 'react';
import { Calendar, BarChart3, Activity, Zap } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent, AreaChartComponent, BarChartComponent } from '../ui/Chart';

export const HistoricalCharts: React.FC = () => {
  const { historicalData, heatmapData, correlationData } = useAnalyticsStore();
  const [activeChart, setActiveChart] = useState<'trends' | 'heatmap' | 'correlation'>('trends');

  const chartButtons = [
    { id: 'trends', label: 'Trends', icon: Activity },
    { id: 'heatmap', label: 'Load Pattern', icon: BarChart3 },
    { id: 'correlation', label: 'Correlation', icon: Zap },
  ];

  const renderTrendsChart = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity size={20} className="text-blue-600" />
            <span>Efficiency & Generation Trends</span>
          </CardTitle>
        </CardHeader>
        <LineChartComponent
          data={historicalData}
          lines={[
            { dataKey: 'efficiency', stroke: '#10b981', name: 'Efficiency (%)' },
            { dataKey: 'generation', stroke: '#3b82f6', name: 'Generation (MW)' },
          ]}
          xAxisKey="date"
          height={300}
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap size={20} className="text-purple-600" />
            <span>Consumption & Load Analysis</span>
          </CardTitle>
        </CardHeader>
        <AreaChartComponent
          data={historicalData}
          dataKey="consumption"
          stroke="#8b5cf6"
          fill="rgba(139, 92, 246, 0.1)"
          xAxisKey="date"
          height={300}
        />
      </Card>
    </div>
  );

  const renderHeatmapChart = () => {
    const heatmapChartData = heatmapData.reduce((acc, item) => {
      const existing = acc.find(d => d.day === item.day);
      if (existing) {
        existing[`hour_${item.hour}`] = item.value;
      } else {
        acc.push({
          day: item.day,
          [`hour_${item.hour}`]: item.value,
        });
      }
      return acc;
    }, [] as any[]);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 size={20} className="text-orange-600" />
            <span>Weekly Load Pattern Heatmap</span>
          </CardTitle>
        </CardHeader>
        <div className="p-6">
          <div className="grid grid-cols-25 gap-1 mb-4">
            {/* Hour labels */}
            <div className="col-span-1"></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-xs text-center text-gray-600 dark:text-gray-400">
                {i}
              </div>
            ))}
            
            {/* Heatmap grid */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <React.Fragment key={day}>
                <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  {day}
                </div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                  const intensity = dataPoint ? dataPoint.value / 100 : 0;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="aspect-square rounded-sm cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                      }}
                      title={dataPoint?.label}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Low Load</span>
            <div className="flex space-x-1">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity) => (
                <div
                  key={intensity}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
                />
              ))}
            </div>
            <span>High Load</span>
          </div>
        </div>
      </Card>
    );
  };

  const renderCorrelationChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap size={20} className="text-green-600" />
          <span>Efficiency vs Cost Correlation</span>
        </CardTitle>
      </CardHeader>
      <div className="p-6">
        <div className="w-full h-80 relative">
          <svg width="100%" height="100%" viewBox="0 0 400 300">
            {/* Axes */}
            <line x1="50" y1="250" x2="350" y2="250" stroke="currentColor" className="text-gray-300" />
            <line x1="50" y1="50" x2="50" y2="250" stroke="currentColor" className="text-gray-300" />
            
            {/* Data points */}
            {correlationData.map((point, index) => (
              <circle
                key={index}
                cx={50 + ((point.x - 88) / 12) * 300}
                cy={250 - ((point.y - 0.5) / 1.5) * 200}
                r="3"
                className={
                  point.category === 'High' ? 'fill-green-500' :
                  point.category === 'Medium' ? 'fill-yellow-500' :
                  'fill-red-500'
                }
                opacity="0.7"
              >
                <title>{point.label}</title>
              </circle>
            ))}
            
            {/* Labels */}
            <text x="200" y="280" textAnchor="middle" className="text-xs fill-gray-600 dark:fill-gray-400">
              Grid Efficiency (%)
            </text>
            <text x="25" y="150" textAnchor="middle" className="text-xs fill-gray-600 dark:fill-gray-400" transform="rotate(-90 25 150)">
              Operating Cost ($/MWh)
            </text>
          </svg>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">High Efficiency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium Efficiency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Low Efficiency</span>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <Card padding="sm">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Historical Analysis</span>
          <div className="flex-1"></div>
          <div className="flex space-x-1">
            {chartButtons.map((button) => {
              const Icon = button.icon;
              return (
                <Button
                  key={button.id}
                  variant={activeChart === button.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveChart(button.id as any)}
                  icon={Icon}
                >
                  {button.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Chart Content */}
      {activeChart === 'trends' && renderTrendsChart()}
      {activeChart === 'heatmap' && renderHeatmapChart()}
      {activeChart === 'correlation' && renderCorrelationChart()}
    </div>
  );
};