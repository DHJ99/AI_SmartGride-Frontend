import React from 'react';
import { useGridStore } from '../../stores/gridStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  Wrench, 
  Check,
  Clock,
  X
} from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { alerts, acknowledgeAlert, connectionStatus } = useGridStore();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'maintenance':
        return Wrench;
      case 'info':
      default:
        return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          text: 'text-red-900 dark:text-red-100',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          text: 'text-yellow-900 dark:text-yellow-100',
        };
      case 'maintenance':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-900 dark:text-blue-100',
        };
      case 'info':
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          text: 'text-gray-900 dark:text-gray-100',
        };
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  if (connectionStatus === 'disconnected') {
    return (
      <LoadingSkeleton variant="card" />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle size={20} className="text-yellow-600" />
            <span>Alert Center</span>
            {unacknowledgedAlerts.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            <span>Live Updates</span>
          </div>
        </div>
      </CardHeader>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Unacknowledged Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Active Alerts ({unacknowledgedAlerts.length})
            </h4>
            <div className="space-y-2">
              {unacknowledgedAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                const colors = getAlertColor(alert.type);
                
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Icon size={18} className={`mt-0.5 ${colors.icon}`} />
                        <div className="flex-1">
                          <h5 className={`font-medium ${colors.text} mb-1`}>
                            {alert.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Source: {alert.source}</span>
                            <span>{formatTime(alert.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        icon={Check}
                        className="ml-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acknowledged Alerts */}
        {acknowledgedAlerts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Acknowledged ({acknowledgedAlerts.length})
            </h4>
            <div className="space-y-2">
              {acknowledgedAlerts.slice(0, 5).map((alert) => {
                const Icon = getAlertIcon(alert.type);
                const colors = getAlertColor(alert.type);
                
                return (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 opacity-75"
                  >
                    <div className="flex items-start space-x-3">
                      <Icon size={16} className={`mt-0.5 ${colors.icon} opacity-60`} />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">
                          {alert.title}
                        </h5>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatTime(alert.timestamp)}</span>
                          <div className="flex items-center space-x-1">
                            <Check size={12} className="text-green-500" />
                            <span>Acknowledged</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Alerts */}
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Check size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              All Clear
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No active alerts. System is operating normally.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};