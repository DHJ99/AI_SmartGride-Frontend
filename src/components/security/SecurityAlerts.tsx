import React, { useState } from 'react';
import { AlertTriangle, Shield, User, Database, Lock, CheckCircle, Clock, UserX } from 'lucide-react';
import { useSecurityStore } from '../../stores/securityStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';

export const SecurityAlerts: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useSecurityStore();
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.status === filter
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'authentication':
        return User;
      case 'access_control':
        return Lock;
      case 'data_breach':
        return Database;
      case 'system_compromise':
        return Shield;
      case 'policy_violation':
        return UserX;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'investigating':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'false_positive':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, 'security_team');
  };

  const handleResolve = (alertId: string) => {
    const resolution = resolutionText[alertId] || 'Alert resolved by security team';
    resolveAlert(alertId, resolution);
    setResolutionText(prev => ({ ...prev, [alertId]: '' }));
  };

  const alertCounts = {
    total: alerts.length,
    open: alerts.filter(a => a.status === 'open').length,
    investigating: alerts.filter(a => a.status === 'investigating').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Alert Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {alertCounts.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</div>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {alertCounts.open}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Open</div>
        </Card>
        <Card className="text-center border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {alertCounts.investigating}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Investigating</div>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {alertCounts.resolved}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={20} className="text-red-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Security Alerts ({filteredAlerts.length})
            </span>
          </div>
          <div className="flex space-x-1">
            {['all', 'open', 'investigating', 'resolved'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(status as any)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          const severityClasses = getSeverityColor(alert.severity);
          
          return (
            <Card key={alert.id} className={`hover:shadow-lg transition-all duration-200 border-l-4 ${severityClasses}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${severityClasses}`}>
                    <AlertIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {alert.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Source: {alert.source}</span>
                      <span>Type: {alert.type.replace('_', ' ')}</span>
                      <span>{format(alert.timestamp, 'MMM dd, HH:mm')}</span>
                      {alert.assignedTo && (
                        <span>Assigned to: {alert.assignedTo}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected Assets */}
              {alert.affectedAssets.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Affected Assets:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {alert.affectedAssets.map((asset, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {alert.status === 'resolved' && alert.resolution && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
                    Resolution:
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {alert.resolution}
                  </p>
                  {alert.resolvedAt && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Resolved on {format(alert.resolvedAt, 'MMM dd, yyyy HH:mm')}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {alert.status === 'open' && (
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAcknowledge(alert.id)}
                    icon={Clock}
                  >
                    Acknowledge & Investigate
                  </Button>
                </div>
              )}

              {alert.status === 'investigating' && (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter resolution details..."
                    value={resolutionText[alert.id] || ''}
                    onChange={(e) => setResolutionText(prev => ({
                      ...prev,
                      [alert.id]: e.target.value
                    }))}
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      icon={CheckCircle}
                      disabled={!resolutionText[alert.id]?.trim()}
                    >
                      Resolve Alert
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Security Alerts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? 'No security alerts at this time. System is secure.'
                : `No ${filter} alerts found.`
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};