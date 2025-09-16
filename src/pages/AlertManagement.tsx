import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, Filter, Search, Download, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { format } from 'date-fns';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'system' | 'security' | 'maintenance' | 'performance' | 'compliance';
  source: string;
  timestamp: number;
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: number;
  escalationLevel: number;
  affectedSystems: string[];
  priority: number;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  escalationTime: number;
  notificationChannels: string[];
}

export const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 'rule-1',
      name: 'High System Load',
      condition: 'system_load > threshold',
      threshold: 90,
      severity: 'high',
      enabled: true,
      escalationTime: 15,
      notificationChannels: ['email', 'sms', 'slack'],
    },
    {
      id: 'rule-2',
      name: 'Voltage Deviation',
      condition: 'voltage_deviation > threshold',
      threshold: 5,
      severity: 'critical',
      enabled: true,
      escalationTime: 5,
      notificationChannels: ['email', 'sms', 'phone'],
    },
    {
      id: 'rule-3',
      name: 'Equipment Temperature',
      condition: 'temperature > threshold',
      threshold: 80,
      severity: 'medium',
      enabled: true,
      escalationTime: 30,
      notificationChannels: ['email', 'slack'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'system' | 'security' | 'maintenance' | 'performance'>('all');

  useEffect(() => {
    // Generate initial alerts
    const initialAlerts: Alert[] = [
      {
        id: 'alert-1',
        title: 'High System Load Detected',
        description: 'System load has exceeded 90% threshold in Zone C',
        severity: 'high',
        category: 'system',
        source: 'Load Monitor',
        timestamp: Date.now() - 300000,
        status: 'active',
        escalationLevel: 1,
        affectedSystems: ['Zone C Distribution', 'Transformer T-204'],
        priority: 8,
      },
      {
        id: 'alert-2',
        title: 'Equipment Temperature Warning',
        description: 'Generator G-102 operating temperature above normal range',
        severity: 'medium',
        category: 'maintenance',
        source: 'Temperature Monitor',
        timestamp: Date.now() - 900000,
        status: 'acknowledged',
        assignedTo: 'maintenance_team',
        escalationLevel: 0,
        affectedSystems: ['Generator G-102'],
        priority: 5,
      },
      {
        id: 'alert-3',
        title: 'Security Access Violation',
        description: 'Unauthorized access attempt detected on control system',
        severity: 'critical',
        category: 'security',
        source: 'Security Monitor',
        timestamp: Date.now() - 1800000,
        status: 'resolved',
        assignedTo: 'security_team',
        resolution: 'Access blocked, user account suspended, investigation completed',
        resolvedAt: Date.now() - 600000,
        escalationLevel: 2,
        affectedSystems: ['Control System', 'Authentication Service'],
        priority: 10,
      },
    ];

    setAlerts(initialAlerts);

    // Generate new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const alertTypes = [
          {
            title: 'Frequency Deviation Alert',
            description: 'Grid frequency deviation detected outside normal operating range',
            severity: 'medium' as const,
            category: 'system' as const,
            source: 'Frequency Monitor',
          },
          {
            title: 'Maintenance Due Notification',
            description: 'Scheduled maintenance window approaching for critical equipment',
            severity: 'low' as const,
            category: 'maintenance' as const,
            source: 'Maintenance Scheduler',
          },
          {
            title: 'Performance Degradation',
            description: 'Efficiency drop detected in renewable energy systems',
            severity: 'medium' as const,
            category: 'performance' as const,
            source: 'Performance Monitor',
          },
        ];

        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          ...alertType,
          timestamp: Date.now(),
          status: 'active',
          escalationLevel: 0,
          affectedSystems: ['System Component'],
          priority: Math.floor(Math.random() * 10) + 1,
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', assignedTo: 'current_user' }
        : alert
    ));
  };

  const resolveAlert = (alertId: string, resolution: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'resolved', 
            resolution,
            resolvedAt: Date.now(),
          }
        : alert
    ));
  };

  const suppressAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId 
        ? { ...alert, status: 'suppressed' }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'acknowledged':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'suppressed':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
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

  const alertCounts = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle size={32} className="text-white" />
                <h1 className="text-3xl font-bold">Alert Management Center</h1>
              </div>
              <p className="text-red-100 text-lg">
                Centralized alert management, notification routing, and incident response coordination.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1">{alertCounts.active}</div>
              <div className="text-red-200">Active Alerts</div>
              <div className="text-sm text-red-300 mt-1">
                {alertCounts.critical} critical, {alertCounts.high} high priority
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {alertCounts.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</div>
        </Card>
        <Card className="text-center border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {alertCounts.active}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </Card>
        <Card className="text-center border-l-4 border-l-red-600">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {alertCounts.critical}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Critical</div>
        </Card>
        <Card className="text-center border-l-4 border-l-orange-500">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {alertCounts.high}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
        </Card>
        <Card className="text-center border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {alertCounts.acknowledged}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Acknowledged</div>
        </Card>
        <Card className="text-center border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {alertCounts.resolved}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell size={20} className="text-blue-600" />
              <span>Alert Dashboard ({filteredAlerts.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={Download}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Settings}
              >
                Configure Rules
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="maintenance">Maintenance</option>
            <option value="performance">Performance</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSeverityFilter('all');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            icon={Filter}
          >
            Clear Filters
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Source: {alert.source}</span>
                    <span>Category: {alert.category}</span>
                    <span>{formatTime(alert.timestamp)}</span>
                    {alert.assignedTo && <span>Assigned: {alert.assignedTo}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    P{alert.priority}
                  </div>
                  <div className="text-xs text-gray-500">Priority</div>
                </div>
              </div>

              {/* Affected Systems */}
              {alert.affectedSystems.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Affected Systems:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {alert.affectedSystems.map((system, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {alert.status === 'resolved' && alert.resolution && (
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
                    Resolution:
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {alert.resolution}
                  </p>
                  {alert.resolvedAt && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Resolved {formatTime(alert.resolvedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {alert.status === 'active' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                      icon={Clock}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => suppressAlert(alert.id)}
                    >
                      Suppress
                    </Button>
                  </>
                )}
                {alert.status === 'acknowledged' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => resolveAlert(alert.id, 'Issue resolved by operations team')}
                    icon={CheckCircle}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Alerts Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No alerts match your current filter criteria.'
                : 'All systems are operating normally.'
              }
            </p>
          </div>
        )}
      </Card>

      {/* Alert Rules Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings size={20} className="text-purple-600" />
            <span>Alert Rules & Thresholds</span>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Rule Name</th>
                <th className="text-left py-3 px-2">Condition</th>
                <th className="text-right py-3 px-2">Threshold</th>
                <th className="text-center py-3 px-2">Severity</th>
                <th className="text-center py-3 px-2">Escalation</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alertRules.map((rule) => (
                <tr key={rule.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    {rule.name}
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400 font-mono text-xs">
                    {rule.condition}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                    {rule.threshold}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(rule.severity)}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                    {rule.escalationTime}m
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule.enabled 
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex space-x-1 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAlertRules(prev => prev.map(r =>
                            r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                          ));
                        }}
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};