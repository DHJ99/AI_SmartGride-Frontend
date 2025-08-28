import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, TrendingUp, TrendingDown, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MetricsCard } from '@/components/dashboard/MetricsCard'
import { generateHistoricalData, generateForecastData } from '@/data/mockData'
import { formatNumber } from '@/lib/utils'

const historicalData = generateHistoricalData(30)
const forecastData = generateForecastData(24)

const anomalyData = [
  { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), type: 'voltage_spike', severity: 'high', value: 425000, threshold: 410000 },
  { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'frequency_drop', severity: 'medium', value: 49.7, threshold: 49.8 },
  { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'load_anomaly', severity: 'low', value: 1200, threshold: 1000 },
  { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), type: 'efficiency_drop', severity: 'medium', value: 82, threshold: 85 },
]

const regionData = [
  { name: 'North', load: 320, capacity: 400, efficiency: 92 },
  { name: 'South', load: 280, capacity: 350, efficiency: 89 },
  { name: 'East', load: 450, capacity: 500, efficiency: 95 },
  { name: 'West', load: 380, capacity: 420, efficiency: 88 },
  { name: 'Central', load: 520, capacity: 600, efficiency: 91 },
]

const performanceData = [
  { name: 'Reliability', value: 99.7, target: 99.5 },
  { name: 'Efficiency', value: 89.5, target: 90.0 },
  { name: 'Load Factor', value: 78.2, target: 80.0 },
  { name: 'Power Quality', value: 96.8, target: 95.0 },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMetric, setSelectedMetric] = useState('load')

  const currentMetrics = {
    totalLoad: 1950,
    peakDemand: 2100,
    efficiency: 89.5,
    gridHealth: 94.2,
    reliability: 99.7,
    powerFactor: 0.95
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring, forecasting, and performance analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricsCard
          title="Current Load"
          value={currentMetrics.totalLoad}
          unit="MW"
          change={2.3}
          changeType="increase"
          icon={<Activity className="w-5 h-5 text-primary-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Peak Demand"
          value={currentMetrics.peakDemand}
          unit="MW"
          change={-1.5}
          changeType="decrease"
          icon={<TrendingUp className="w-5 h-5 text-secondary-600" />}
          variant="glass"
        />
        <MetricsCard
          title="System Efficiency"
          value={currentMetrics.efficiency}
          unit="%"
          change={0.8}
          changeType="increase"
          status={currentMetrics.efficiency > 90 ? 'good' : 'warning'}
          icon={<Zap className="w-5 h-5 text-accent-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Grid Health"
          value={currentMetrics.gridHealth}
          unit="%"
          change={1.2}
          changeType="increase"
          status="good"
          icon={<CheckCircle className="w-5 h-5 text-secondary-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Reliability"
          value={currentMetrics.reliability}
          unit="%"
          change={0.1}
          changeType="increase"
          status="good"
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Power Factor"
          value={currentMetrics.powerFactor}
          unit=""
          change={0.02}
          changeType="increase"
          status="good"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          variant="glass"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Trends */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Historical Trends (30 Days)</span>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load">Load</SelectItem>
                  <SelectItem value="generation">Generation</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                  <SelectItem value="losses">Losses</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    stroke="rgba(156, 163, 175, 0.5)"
                  />
                  <YAxis 
                    stroke="rgba(156, 163, 175, 0.5)"
                    tickFormatter={(value) => selectedMetric === 'efficiency' ? `${value}%` : `${value} MW`}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [
                      selectedMetric === 'efficiency' ? `${value.toFixed(1)}%` : `${value.toFixed(1)} MW`,
                      selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(156, 163, 175, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric === 'load' ? 'totalLoad' : 
                             selectedMetric === 'generation' ? 'totalGeneration' :
                             selectedMetric === 'efficiency' ? 'efficiency' : 'losses'}
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Demand Forecast */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>24-Hour Demand Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit' })}
                    stroke="rgba(156, 163, 175, 0.5)"
                  />
                  <YAxis 
                    stroke="rgba(156, 163, 175, 0.5)"
                    tickFormatter={(value) => `${value} MW`}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)} MW`,
                      name === 'predicted' ? 'Predicted' : 
                      name === 'upper' ? 'Upper Bound' : 
                      name === 'lower' ? 'Lower Bound' : 'Actual'
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(156, 163, 175, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="upper"
                    stroke="#F59E0B"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="lower"
                    stroke="#F59E0B"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Analysis and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Load Distribution */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Regional Load Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis dataKey="name" stroke="rgba(156, 163, 175, 0.5)" />
                  <YAxis stroke="rgba(156, 163, 175, 0.5)" tickFormatter={(value) => `${value} MW`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} MW`,
                      name === 'load' ? 'Current Load' : 'Capacity'
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(156, 163, 175, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  <Bar dataKey="capacity" fill="#E5E7EB" name="capacity" />
                  <Bar dataKey="load" fill="#2563EB" name="load" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
              {regionData.map((region) => (
                <div key={region.name} className="text-center">
                  <div className="font-medium">{region.name}</div>
                  <div className="text-muted-foreground">
                    {Math.round((region.load / region.capacity) * 100)}% util
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Performance vs Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{formatNumber(metric.value, 1)}%</span>
                      {metric.value >= metric.target ? (
                        <TrendingUp className="w-4 h-4 text-secondary-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.value >= metric.target ? 'bg-secondary-500' : 'bg-accent-500'
                      }`}
                      style={{ width: `${Math.min(100, (metric.value / 100) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {formatNumber(metric.target, 1)}%</span>
                    <span>
                      {metric.value >= metric.target ? '+' : ''}
                      {formatNumber(metric.value - metric.target, 1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Detection */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-accent-500" />
            <span>Anomaly Detection</span>
            <Badge variant="warning">{anomalyData.length} Detected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalyData.map((anomaly, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    anomaly.severity === 'high' ? 'bg-red-500' :
                    anomaly.severity === 'medium' ? 'bg-accent-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <div className="font-medium capitalize">
                      {anomaly.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {anomaly.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {anomaly.type.includes('efficiency') ? `${anomaly.value}%` : 
                     anomaly.type.includes('frequency') ? `${anomaly.value} Hz` :
                     anomaly.type.includes('voltage') ? `${(anomaly.value / 1000).toFixed(1)} kV` :
                     `${anomaly.value} MW`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Threshold: {anomaly.type.includes('efficiency') ? `${anomaly.threshold}%` : 
                              anomaly.type.includes('frequency') ? `${anomaly.threshold} Hz` :
                              anomaly.type.includes('voltage') ? `${(anomaly.threshold / 1000).toFixed(1)} kV` :
                              `${anomaly.threshold} MW`}
                  </div>
                </div>
                <Badge 
                  variant={anomaly.severity === 'high' ? 'destructive' : 
                          anomaly.severity === 'medium' ? 'warning' : 'secondary'}
                  className="capitalize"
                >
                  {anomaly.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}