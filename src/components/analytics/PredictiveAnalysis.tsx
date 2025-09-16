import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChartComponent } from '../ui/Chart';

export const PredictiveAnalysis: React.FC = () => {
  const { predictiveData } = useAnalyticsStore();
  const [selectedPrediction, setSelectedPrediction] = useState<'load' | 'maintenance' | 'optimization'>('load');

  const predictionTypes = [
    { id: 'load', label: 'Load Forecast', icon: TrendingUp },
    { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
    { id: 'optimization', label: 'Optimization', icon: Lightbulb },
  ];

  const renderLoadForecast = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-blue-600" />
            <span>48-Hour Load Forecast</span>
            <div className="flex-1"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Confidence: 87.3%
            </div>
          </CardTitle>
        </CardHeader>
        <LineChartComponent
          data={predictiveData}
          lines={[
            { dataKey: 'predicted', stroke: '#3b82f6', name: 'Predicted Load (MW)' },
            { dataKey: 'upper', stroke: '#93c5fd', name: 'Upper Bound' },
            { dataKey: 'lower', stroke: '#93c5fd', name: 'Lower Bound' },
          ]}
          xAxisKey="date"
          height={300}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">1,247 MW</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Peak Predicted Load</div>
            <div className="text-xs text-gray-500 mt-1">Tomorrow 2:00 PM</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">892 MW</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Minimum Load</div>
            <div className="text-xs text-gray-500 mt-1">Tonight 3:00 AM</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">87.3%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Forecast Accuracy</div>
            <div className="text-xs text-gray-500 mt-1">Based on historical data</div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMaintenancePredictions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle size={20} className="text-yellow-600" />
            <span>Predictive Maintenance Schedule</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {[
            {
              component: 'Transformer T-204',
              risk: 'High',
              timeframe: '7-14 days',
              confidence: 92,
              reason: 'Temperature anomaly detected',
            },
            {
              component: 'Generator G-102',
              risk: 'Medium',
              timeframe: '30-45 days',
              confidence: 78,
              reason: 'Vibration pattern change',
            },
            {
              component: 'Switch S-301',
              risk: 'Low',
              timeframe: '60-90 days',
              confidence: 65,
              reason: 'Normal wear progression',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.component}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.reason}</p>
              </div>
              <div className="text-right space-y-1">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.risk === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {item.risk} Risk
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.timeframe}</div>
                <div className="text-xs text-gray-500">{item.confidence}% confidence</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderOptimizationRecommendations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb size={20} className="text-green-600" />
            <span>AI-Powered Optimization Recommendations</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {[
            {
              title: 'Load Balancing Optimization',
              impact: 'High',
              savings: '$12,400/month',
              description: 'Redistribute load across zones B and C during peak hours to improve efficiency by 3.2%',
              implementation: 'Automated',
            },
            {
              title: 'Renewable Integration',
              impact: 'Medium',
              savings: '$8,200/month',
              description: 'Increase solar farm output during midday hours to reduce fossil fuel dependency',
              implementation: 'Manual',
            },
            {
              title: 'Demand Response Program',
              impact: 'Medium',
              savings: '$6,800/month',
              description: 'Implement smart pricing to shift 15% of non-critical loads to off-peak hours',
              implementation: 'Automated',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.impact === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {item.impact} Impact
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {item.savings}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Implementation: {item.implementation}</span>
                <Button variant="outline" size="sm">
                  Apply Recommendation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Prediction Type Selector */}
      <Card padding="sm">
        <div className="flex items-center space-x-2">
          <Brain size={20} className="text-purple-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Predictive Analytics</span>
          <div className="flex-1"></div>
          <div className="flex space-x-1">
            {predictionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedPrediction === type.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPrediction(type.id as any)}
                  icon={Icon}
                >
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Prediction Content */}
      {selectedPrediction === 'load' && renderLoadForecast()}
      {selectedPrediction === 'maintenance' && renderMaintenancePredictions()}
      {selectedPrediction === 'optimization' && renderOptimizationRecommendations()}
    </div>
  );
};