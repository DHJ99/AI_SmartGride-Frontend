import React, { useEffect, useState } from 'react';
import { Activity, Zap, AlertTriangle, TrendingUp, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChartComponent, BarChartComponent } from '../components/ui/Chart';
import { useGridStore } from '../stores/gridStore';

interface MonitoringData {
  realTimeMetrics: {
    voltage: number;
    frequency: number;
    powerFactor: number;
    temperature: number;
    timestamp: number;
  }[];
  alarmHistory: {
    id: string;
    type: 'voltage' | 'frequency' | 'temperature' | 'load';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: number;
    acknowledged: boolean;
  }[];
  systemHealth: {
    overall: number;
    components: {
      name: string;
      status: 'healthy' | 'warning' | 'critical';
      uptime: number;
      lastCheck: number;
    }[];
  };
}

export const GridMonitoring: React.FC = () => {
  const { connectionStatus, startSimulation, stopSimulation } = useGridStore();
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    realTimeMetrics: [],
    alarmHistory: [],
    systemHealth: {
      overall: 94.2,
      components: [
        { name: 'Primary Generator', status: 'healthy', uptime: 99.8, lastCheck: Date.now() - 300000 },
        { name: 'Transmission Lines', status: 'healthy', uptime: 99.9, lastCheck: Date.now() - 180000 },
        { name: 'Distribution Network', status: 'warning', uptime: 98.5, lastCheck: Date.now() - 120000 },
        { name: 'Control Systems', status: 'healthy', uptime: 99.7, lastCheck: Date.now() - 60000 },
      ],
    },
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      startSimulation();
    }
  }, [connectionStatus, startSimulation]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Generate new real-time data
      const newMetric = {
        voltage: 345 + (Math.random() - 0.5) * 10,
        frequency: 60 + (Math.random() - 0.5) * 0.2,
        powerFactor: 0.95 + (Math.random() - 0.5) * 0.1,
        temperature: 25 + Math.random() * 15,
        timestamp: Date.now(),
      };

      setMonitoringData(prev => ({
        ...prev,
        realTimeMetrics: [...prev.realTimeMetrics.slice(-29), newMetric],
      }));

      // Occasionally generate alarms
      if (Math.random() > 0.95) {
        const alarmTypes = ['voltage', 'frequency', 'temperature', 'load'] as const;
        const severities = ['critical', 'warning', 'info'] as const;
        const messages = {
          voltage: 'Voltage fluctuation detected in Zone C',
          frequency: 'Frequency deviation outside normal range',
          temperature: 'High temperature reading on Transformer T-204',
          load: 'Load imbalance detected between phases',
        };

        const type = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];

        const newAlarm = {
          id: `alarm-${Date.now()}`,
          type,
          severity,
          message: messages[type],
          timestamp: Date.now(),
          acknowledged: false,
        };

        setMonitoringData(prev => ({
          ...prev,
          alarmHistory: [newAlarm, ...prev.alarmHistory.slice(0, 19)],
        }));
      }
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const acknowledgeAlarm = (alarmId: string) => {
    setMonitoringData(prev => ({
      ...prev,
      alarmHistory: prev.alarmHistory.map(alarm =>
        alarm.id === alarmId ? { ...alarm, acknowledged: true } : alarm
      ),
    }));
  };

  const getAlarmColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const currentMetrics = monitoringData.realTimeMetrics[monitoringData.realTimeMetrics.length - 1];
  const unacknowledgedAlarms = monitoringData.alarmHistory.filter(alarm => !alarm.acknowledged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Activity size={32} className="text-white" />
                <h1 className="text-3xl font-bold">Real-Time Grid Monitoring</h1>
              </div>
              <p className="text-green-100 text-lg">
                Live monitoring of grid parameters, system health, and operational status.
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                {connectionStatus === 'connected' ? (
                  <Wifi size={20} className="text-green-300" />
                ) : (
                  <WifiOff size={20} className="text-red-300" />
                )}
                <span className="font-medium capitalize">{connectionStatus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  icon={autoRefresh ? RefreshCw : RefreshCw}
                  className="bg-white/20 hover:bg-white/30 border-white/30"
                >
                  {autoRefresh ? 'Auto' : 'Manual'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {currentMetrics?.voltage.toFixed(1) || '0.0'} kV
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">System Voltage</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: 345 kV
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {currentMetrics?.frequency.toFixed(2) || '0.00'} Hz
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Frequency</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: 60.00 Hz
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {currentMetrics?.powerFactor.toFixed(3) || '0.000'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Power Factor</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: 0.950
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {currentMetrics?.temperature.toFixed(1) || '0.0'}°C
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
            <div className="text-xs text-gray-500 mt-1">
              Normal: 20-35°C
            </div>
          </div>
        </Card>
      </div>

      {/* Real-Time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap size={20} className="text-blue-600" />
              <span>Voltage & Frequency Monitoring</span>
            </CardTitle>
          </CardHeader>
          <LineChartComponent
            data={monitoringData.realTimeMetrics.map(m => ({
              time: new Date(m.timestamp).toLocaleTimeString(),
              voltage: m.voltage,
              frequency: m.frequency * 5.75, // Scale for visibility
            }))}
            lines={[
              { dataKey: 'voltage', stroke: '#3b82f6', name: 'Voltage (kV)' },
              { dataKey: 'frequency', stroke: '#10b981', name: 'Frequency (Hz x5.75)' },
            ]}
            xAxisKey="time"
            height={250}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-purple-600" />
              <span>Power Factor & Temperature</span>
            </CardTitle>
          </CardHeader>
          <LineChartComponent
            data={monitoringData.realTimeMetrics.map(m => ({
              time: new Date(m.timestamp).toLocaleTimeString(),
              powerFactor: m.powerFactor * 100, // Convert to percentage
              temperature: m.temperature,
            }))}
            lines={[
              { dataKey: 'powerFactor', stroke: '#8b5cf6', name: 'Power Factor (%)' },
              { dataKey: 'temperature', stroke: '#f59e0b', name: 'Temperature (°C)' },
            ]}
            xAxisKey="time"
            height={250}
          />
        </Card>
      </div>

      {/* System Health and Alarms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity size={20} className="text-green-600" />
              <span>System Health Status</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {monitoringData.systemHealth.overall.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall System Health</div>
            </div>
            
            {monitoringData.systemHealth.components.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    component.status === 'healthy' ? 'bg-green-500' :
                    component.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {component.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {component.uptime.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    Checked {formatTime(component.lastCheck)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle size={20} className="text-red-600" />
                <span>Active Alarms</span>
                {unacknowledgedAlarms.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unacknowledgedAlarms.length}
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="mr-2"
                  />
                  Auto Refresh
                </label>
              </div>
            </div>
          </CardHeader>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {monitoringData.alarmHistory.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Active Alarms
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  System is operating normally.
                </p>
              </div>
            ) : (
              monitoringData.alarmHistory.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alarm.severity === 'critical' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                    alarm.severity === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  } ${alarm.acknowledged ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getAlarmColor(alarm.severity)}`}>
                          {alarm.severity}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {alarm.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white mb-1">
                        {alarm.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(alarm.timestamp)}
                      </p>
                    </div>
                    {!alarm.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlarm(alarm.id)}
                        className="ml-2"
                      >
                        Ack
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Monitoring Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Configuration</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refresh Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={1}>1 second</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setMonitoringData(prev => ({ ...prev, alarmHistory: [] }))}
              className="w-full"
            >
              Clear Alarm History
            </Button>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              icon={RefreshCw}
              className="w-full"
            >
              Reset Monitoring
            </Button>
          </div>
          <div className="flex items-end">
            <Button
              variant={connectionStatus === 'connected' ? 'secondary' : 'primary'}
              onClick={connectionStatus === 'connected' ? stopSimulation : startSimulation}
              className="w-full"
            >
              {connectionStatus === 'connected' ? 'Stop' : 'Start'} Monitoring
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};