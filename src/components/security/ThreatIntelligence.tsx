import React, { useState } from 'react';
import { Shield, AlertTriangle, Bug, Wifi, Lock, Eye, CheckCircle, Clock } from 'lucide-react';
import { useSecurityStore } from '../../stores/securityStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

export const ThreatIntelligence: React.FC = () => {
  const { threats, updateThreatStatus } = useSecurityStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'investigating' | 'mitigated' | 'resolved'>('all');

  const filteredThreats = threats.filter(threat => 
    filter === 'all' || threat.status === filter
  );

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware':
        return Bug;
      case 'phishing':
        return Shield;
      case 'ddos':
        return Wifi;
      case 'intrusion':
        return Lock;
      case 'vulnerability':
        return AlertTriangle;
      default:
        return Eye;
    }
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
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'investigating':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'mitigated':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const threatCounts = {
    total: threats.length,
    active: threats.filter(t => t.status === 'active').length,
    investigating: threats.filter(t => t.status === 'investigating').length,
    mitigated: threats.filter(t => t.status === 'mitigated').length,
    resolved: threats.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Threat Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {threatCounts.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Threats</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {threatCounts.active}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {threatCounts.investigating}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Investigating</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {threatCounts.mitigated}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mitigated</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {threatCounts.resolved}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Threat Intelligence Feed ({filteredThreats.length})
            </span>
          </div>
          <div className="flex space-x-1">
            {['all', 'active', 'investigating', 'mitigated', 'resolved'].map((status) => (
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

      {/* Threats List */}
      <div className="space-y-4">
        {filteredThreats.map((threat) => {
          const ThreatIcon = getThreatIcon(threat.type);
          
          return (
            <Card key={threat.id} className="hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <ThreatIcon size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {threat.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(threat.status)}`}>
                        {threat.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {threat.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Source: {threat.source}</span>
                      <span>Type: {threat.type.replace('_', ' ')}</span>
                      <span>{format(threat.timestamp, 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected Systems */}
              {threat.affectedSystems.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Affected Systems:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {threat.affectedSystems.map((system, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                      >
                        {system}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {threat.recommendedActions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recommended Actions:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {threat.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {threat.status === 'active' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateThreatStatus(threat.id, 'investigating')}
                    icon={Clock}
                  >
                    Start Investigation
                  </Button>
                )}
                {threat.status === 'investigating' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateThreatStatus(threat.id, 'mitigated')}
                      icon={Shield}
                    >
                      Mark Mitigated
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateThreatStatus(threat.id, 'resolved')}
                      icon={CheckCircle}
                    >
                      Resolve
                    </Button>
                  </>
                )}
                {threat.status === 'mitigated' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateThreatStatus(threat.id, 'resolved')}
                    icon={CheckCircle}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredThreats.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Threats Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? 'No security threats detected at this time.'
                : `No ${filter} threats found.`
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};