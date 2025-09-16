import React from 'react';
import { useGridStore } from '../../stores/gridStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { BarChartComponent } from '../ui/Chart';
import { Activity, MapPin, Wifi, WifiOff } from 'lucide-react';

export const GridStatus: React.FC = () => {
  const { loadDistribution, nodes, connectionStatus } = useGridStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLoadStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#10b981';
      case 'high':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (connectionStatus === 'disconnected') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity size={20} className="text-purple-600" />
              <span>Load Distribution</span>
            </CardTitle>
          </CardHeader>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin size={20} className="text-indigo-600" />
              <span>Grid Nodes Status</span>
            </CardTitle>
          </CardHeader>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const chartData = loadDistribution.map(zone => ({
    ...zone,
    utilization: ((zone.load / zone.capacity) * 100).toFixed(1),
  }));

  const onlineNodes = nodes.filter(node => node.status === 'online').length;
  const warningNodes = nodes.filter(node => node.status === 'warning').length;
  const maintenanceNodes = nodes.filter(node => node.status === 'maintenance').length;
  const offlineNodes = nodes.filter(node => node.status === 'offline').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Load Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity size={20} className="text-purple-600" />
            <span>Load Distribution by Zone</span>
          </CardTitle>
        </CardHeader>
        
        <BarChartComponent
          data={chartData}
          bars={[
            { 
              dataKey: 'load', 
              fill: '#8b5cf6', 
              name: 'Current Load (MW)' 
            },
          ]}
          xAxisKey="zone"
          height={250}
        />
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          {loadDistribution.map((zone) => (
            <div key={zone.zone} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm font-medium">{zone.zone}</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLoadStatusColor(zone.status) }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {((zone.load / zone.capacity) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Grid Nodes Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-indigo-600" />
              <span>Grid Nodes Status</span>
            </div>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <Wifi size={16} className="text-green-500" />
              ) : (
                <WifiOff size={16} className="text-red-500" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {connectionStatus}
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{onlineNodes}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Online</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{warningNodes}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Warning</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{maintenanceNodes}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Maintenance</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{offlineNodes}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Offline</p>
          </div>
        </div>

        {/* Node List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`}></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {node.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.load.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Load</p>
                </div>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full capitalize
                  ${node.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                  ${node.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : ''}
                  ${node.status === 'maintenance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                  ${node.status === 'offline' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ''}
                `}>
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};