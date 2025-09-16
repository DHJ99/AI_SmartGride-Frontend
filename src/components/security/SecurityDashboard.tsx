import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity, TrendingUp, Users, Lock, Eye } from 'lucide-react';
import { useSecurityStore } from '../../stores/securityStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { LineChartComponent, BarChartComponent } from '../ui/Chart';

export const SecurityDashboard: React.FC = () => {
  const { metrics, threats, alerts, complianceFrameworks } = useSecurityStore();

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 95) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 85) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const highAlerts = alerts.filter(a => a.severity === 'high').length;
  const activeThreats = threats.filter(t => t.status === 'active').length;

  const securityTrendData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    score: 90 + Math.random() * 8,
    incidents: Math.floor(Math.random() * 5),
  }));

  const complianceData = complianceFrameworks.map(framework => ({
    name: framework.name,
    score: framework.overallScore,
  }));

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${getScoreBgColor(metrics.securityScore)} border-l-4 border-l-blue-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Security Score
              </p>
              <div className="flex items-baseline space-x-2">
                <p className={`text-3xl font-bold ${getScoreColor(metrics.securityScore)}`}>
                  {metrics.securityScore.toFixed(1)}
                </p>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Shield size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Active Threats
              </p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-red-600">
                  {activeThreats}
                </p>
                <span className="text-sm text-gray-500">threats</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Compliance Score
              </p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-green-600">
                  {metrics.complianceScore.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Auth Success Rate
              </p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-purple-600">
                  {metrics.authSuccessRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Lock size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Security Trends and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-blue-600" />
              <span>Security Score Trend</span>
            </CardTitle>
          </CardHeader>
          <LineChartComponent
            data={securityTrendData}
            lines={[
              { dataKey: 'score', stroke: '#3b82f6', name: 'Security Score' },
            ]}
            xAxisKey="day"
            height={250}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity size={20} className="text-red-600" />
              <span>Security Incidents</span>
            </CardTitle>
          </CardHeader>
          <LineChartComponent
            data={securityTrendData}
            lines={[
              { dataKey: 'incidents', stroke: '#ef4444', name: 'Incidents' },
            ]}
            xAxisKey="day"
            height={250}
          />
        </Card>
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-600" />
            <span>Compliance Framework Status</span>
          </CardTitle>
        </CardHeader>
        <BarChartComponent
          data={complianceData}
          bars={[{ dataKey: 'score', fill: '#10b981', name: 'Compliance Score (%)' }]}
          xAxisKey="name"
          height={200}
        />
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{criticalAlerts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Critical Alerts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{highAlerts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{metrics.activePolicies}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Policies</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{metrics.failedLogins}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Failed Logins (24h)</div>
          </div>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye size={20} className="text-gray-600" />
            <span>Recent Security Events</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-500' :
                  alert.severity === 'high' ? 'bg-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{alert.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{alert.source}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  alert.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {alert.status.replace('_', ' ')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};