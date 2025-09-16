import React from 'react';
import { X, Zap, Activity, AlertTriangle, Wrench, Settings } from 'lucide-react';
import { GridNode } from '../../types/topology';
import { useTopologyStore } from '../../stores/topologyStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface NodeDetailsProps {
  node: GridNode;
  onClose: () => void;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({ node, onClose }) => {
  const { updateNodeStatus } = useTopologyStore();

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'powerplant':
        return Zap;
      case 'substation':
        return Settings;
      case 'distribution':
        return Activity;
      case 'consumer':
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'offline':
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'powerplant':
        return 'Power Plant';
      case 'substation':
        return 'Substation';
      case 'distribution':
        return 'Distribution Point';
      case 'consumer':
        return 'Consumer Endpoint';
      default:
        return 'Unknown';
    }
  };

  const loadPercentage = (node.currentLoad / node.capacity) * 100;
  const Icon = getNodeIcon(node.type);

  return (
    <div className="absolute top-4 right-4 w-80 z-20 lg:right-4">
      <Card className="shadow-xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Icon size={20} className="text-blue-600" />
              <span className="truncate">{node.name}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={X}
              aria-label="Close details"
            />
          </div>
        </CardHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {getTypeLabel(node.type)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(node.status)}`}>
                {node.status}
              </span>
            </div>
          </div>

          {/* Load Information */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Load</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {node.currentLoad.toFixed(1)} / {node.capacity.toFixed(1)} MW
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  loadPercentage > 90
                    ? 'bg-red-500'
                    : loadPercentage > 75
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, loadPercentage)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {loadPercentage.toFixed(1)}% capacity
            </p>
          </div>

          {/* Voltage */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Voltage Level</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {node.voltage} kV
            </p>
          </div>

          {/* Properties */}
          {node.properties && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white border-t pt-3">
                Additional Information
              </h4>
              
              {node.properties.powerOutput && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Power Output</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.properties.powerOutput.toFixed(1)} MW
                  </span>
                </div>
              )}
              
              {node.properties.efficiency && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.properties.efficiency.toFixed(1)}%
                  </span>
                </div>
              )}
              
              {node.properties.fuelType && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fuel Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.properties.fuelType}
                  </span>
                </div>
              )}
              
              {node.properties.consumers && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Consumers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.properties.consumers.toLocaleString()}
                  </span>
                </div>
              )}
              
              {node.properties.lastMaintenance && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Maintenance</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.properties.lastMaintenance}
                  </span>
                </div>
              )}
              
              {node.properties.nextMaintenance && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next Maintenance</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {node.properties.nextMaintenance}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateNodeStatus(node.id, 'maintenance')}
                icon={Wrench}
                disabled={node.status === 'maintenance'}
              >
                Maintenance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateNodeStatus(node.id, 'online')}
                icon={Zap}
                disabled={node.status === 'online'}
              >
                Activate
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};