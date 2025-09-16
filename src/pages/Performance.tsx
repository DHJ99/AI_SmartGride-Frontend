import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, BarChart3, Clock, Zap, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChartComponent, BarChartComponent, AreaChartComponent } from '../components/ui/Chart';
import { format, subDays, subHours } from 'date-fns';

interface PerformanceKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface BenchmarkData {
  category: string;
  current: number;
  industry: number;
  best: number;
}

interface PerformanceTrend {
  timestamp: number;
  date: string;
  efficiency: number;
  availability: number;
  reliability: number;
  cost: number;
}

export const Performance: React.FC = () => {
  const [kpis, setKpis] = useState<PerformanceKPI[]>([
    {
      id: 'efficiency',
      name: 'Overall Efficiency',
      value: 94.2,
      target: 95.0,
      unit: '%',
      trend: 'up',
      change: 2.1,
      status: 'good',
    },
    {
      id: 'availability',
      name: 'System Availability',
      value: 99.7,
      target: 99.9,
      unit: '%',
      trend: 'stable',
      change: 0.1,
      status: 'good',
    },
    {
      id: 'reliability',
      name: 'Grid Reliability',
      value: 99.8,
      target: 99.9,
      unit: '%',
      trend: 'up',
      change: 0.3,
      status: 'excellent',
    },
    {
      id: 'mtbf',
      name: 'Mean Time Between Failures',
      value: 2340,
      target: 2500,
      unit: 'hours',
      trend: 'up',
      change: 8.5,
      status: 'good',
    },
    {
      id: 'mttr',
      name: 'Mean Time To Repair',
      value: 2.3,
      target: 2.0,
      unit: 'hours',
      trend: 'down',
      change: -12.5,
      status: 'warning',
    },
    {
      id: 'cost_efficiency',
      name: 'Cost Efficiency',
      value: 1.15,
      target: 1.0,
      unit: '$/MWh',
      trend: 'down',
      change: -8.2,
      status: 'good',
    },
  ]);

  const [performanceTrends, setPerformanceTrends] = useState<PerformanceTrend[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([
    { category: 'Efficiency', current: 94.2, industry: 91.5, best: 96.8 },
    { category: 'Availability', current: 99.7, industry: 98.9, best: 99.9 },
    { category: 'Reliability', current: 99.8, industry: 99.2, best: 99.9 },
    { category: 'Cost per MWh', current: 1.15, industry: 1.35, best: 0.95 },
  ]);

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    // Generate historical performance data
    const generateTrends = () => {
      const data: PerformanceTrend[] = [];
      const now = new Date();
      const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const points = timeRange === '24h' ? 24 : days;
      
      for (let i = points; i >= 0; i--) {
        const date = timeRange === '24h' ? subHours(now, i) : subDays(now, i);
        
        data.push({
          timestamp: date.getTime(),
          date: timeRange === '24h' ? format(date, 'HH:mm') : format(date, 'MMM dd'),
          efficiency: 92 + Math.random() * 6 + Math.sin(i * 0.1) * 2,
          availability: 99 + Math.random() * 1,
          reliability: 99.2 + Math.random() * 0.8,
          cost: 1.0 + Math.random() * 0.4,
        });
      }
      
      setPerformanceTrends(data);
    };

    generateTrends();
  }, [timeRange]);

  useEffect(() => {
    // Update KPIs periodically
    const interval = setInterval(() => {
      setKpis(prev => prev.map(kpi => ({
        ...kpi,
        value: Math.max(0, kpi.value + (Math.random() - 0.5) * 0.5),
        change: (Math.random() - 0.5) * 10,
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'good':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingUp;
      default:
        return Target;
    }
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up' && change > 0) return 'text-green-600';
    if (trend === 'down' && change < 0) return 'text-green-600';
    if (trend === 'up' && change < 0) return 'text-red-600';
    if (trend === 'down' && change > 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const overallScore = kpis.reduce((sum, kpi) => {
    const score = (kpi.value / kpi.target) * 100;
    return sum + Math.min(100, score);
  }, 0) / kpis.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp size={32} className="text-white" />
                <h1 className="text-3xl font-bold">Performance Analytics</h1>
              </div>
              <p className="text-blue-100 text-lg">
                Comprehensive performance monitoring, KPI tracking, and benchmarking analysis.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{overallScore.toFixed(1)}</div>
              <div className="text-blue-200">Overall Score</div>
              <div className="text-sm text-blue-300 mt-1">
                Performance Index
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Performance Analysis</span>
          </div>
          <div className="flex space-x-1">
            {[
              { value: '24h', label: 'Last 24 Hours' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const TrendIcon = getTrendIcon(kpi.trend);
          const progressPercentage = Math.min(100, (kpi.value / kpi.target) * 100);
          
          return (
            <Card key={kpi.id} className="hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {kpi.name}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {kpi.unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendIcon size={14} className={getTrendColor(kpi.trend, kpi.change)} />
                    <span className={`text-sm font-medium ${getTrendColor(kpi.trend, kpi.change)}`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">vs target</span>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${getKPIStatusColor(kpi.status)}`}>
                  <Award size={20} />
                </div>
              </div>

              {/* Progress to Target */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Progress to Target</span>
                  <span>{kpi.target}{kpi.unit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progressPercentage >= 100
                        ? 'bg-green-500'
                        : progressPercentage >= 90
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
            </Card>
          );
        })}
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 size={20} className="text-purple-600" />
            <span>Performance Trends - {timeRange.toUpperCase()}</span>
          </CardTitle>
        </CardHeader>
        <LineChartComponent
          data={performanceTrends}
          lines={[
            { dataKey: 'efficiency', stroke: '#10b981', name: 'Efficiency (%)' },
            { dataKey: 'availability', stroke: '#3b82f6', name: 'Availability (%)' },
            { dataKey: 'reliability', stroke: '#8b5cf6', name: 'Reliability (%)' },
          ]}
          xAxisKey="date"
          height={300}
        />
      </Card>

      {/* Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target size={20} className="text-orange-600" />
            <span>Industry Benchmarking</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {benchmarkData.map((benchmark, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {benchmark.category}
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current vs Industry vs Best-in-Class
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {benchmark.current.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Current</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {benchmark.industry.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Industry Avg</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {benchmark.best.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Best-in-Class</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>vs Industry</span>
                  <span className={benchmark.current > benchmark.industry ? 'text-green-600' : 'text-red-600'}>
                    {benchmark.current > benchmark.industry ? '+' : ''}
                    {((benchmark.current - benchmark.industry) / benchmark.industry * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>vs Best-in-Class</span>
                  <span className={benchmark.current > benchmark.best ? 'text-green-600' : 'text-red-600'}>
                    {benchmark.current > benchmark.best ? '+' : ''}
                    {((benchmark.current - benchmark.best) / benchmark.best * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Efficiency Trend</CardTitle>
          </CardHeader>
          <AreaChartComponent
            data={performanceTrends}
            dataKey="cost"
            stroke="#f59e0b"
            fill="rgba(245, 158, 11, 0.1)"
            xAxisKey="date"
            height={250}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
          </CardHeader>
          <BarChartComponent
            data={benchmarkData}
            bars={[
              { dataKey: 'current', fill: '#3b82f6', name: 'Current' },
              { dataKey: 'industry', fill: '#f59e0b', name: 'Industry' },
              { dataKey: 'best', fill: '#10b981', name: 'Best-in-Class' },
            ]}
            xAxisKey="category"
            height={250}
          />
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity size={20} className="text-green-600" />
            <span>Performance Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Efficiency Excellence
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Grid efficiency is performing above industry average by 2.7%. Continue current optimization strategies.
            </p>
            <div className="text-xs text-green-600 dark:text-green-400">
              Status: Exceeding targets
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              Repair Time Optimization
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              Mean time to repair is 15% above target. Consider implementing predictive maintenance protocols.
            </p>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              Action required: Process improvement
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Reliability Leadership
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              System reliability is approaching best-in-class levels. Focus on maintaining current standards.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Status: Industry leading
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary Report</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Key Achievements
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Achieved 94.2% overall efficiency, exceeding industry benchmark</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Maintained 99.8% grid reliability with zero major outages</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Reduced operational costs by 8.2% through optimization</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Increased renewable energy integration to 42.8%</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Improvement Opportunities
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Reduce mean time to repair by implementing predictive maintenance</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Optimize load balancing to achieve 95% efficiency target</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Enhance demand response programs for peak load management</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Increase renewable share to 50% through storage optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};