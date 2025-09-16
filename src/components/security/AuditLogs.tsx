import React, { useState } from 'react';
import { FileText, User, Calendar, Filter, Download, Search } from 'lucide-react';
import { useSecurityStore } from '../../stores/securityStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { format } from 'date-fns';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useSecurityStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'failure' | 'blocked'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResult = resultFilter === 'all' || log.result === resultFilter;
    const matchesRisk = riskFilter === 'all' || log.riskLevel === riskFilter;
    
    return matchesSearch && matchesResult && matchesRisk;
  });

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'failure':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'blocked':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Result', 'Risk Level', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        log.username,
        log.action,
        log.resource,
        log.result,
        log.riskLevel,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const logCounts = {
    total: auditLogs.length,
    success: auditLogs.filter(l => l.result === 'success').length,
    failure: auditLogs.filter(l => l.result === 'failure').length,
    blocked: auditLogs.filter(l => l.result === 'blocked').length,
    highRisk: auditLogs.filter(l => l.riskLevel === 'high').length,
  };

  return (
    <div className="space-y-6">
      {/* Audit Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {logCounts.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {logCounts.success}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {logCounts.failure}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {logCounts.blocked}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Blocked</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {logCounts.highRisk}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">High Risk</div>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText size={20} className="text-blue-600" />
              <span>Audit Logs ({filteredLogs.length})</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              icon={Download}
            >
              Export CSV
            </Button>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Results</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setResultFilter('all');
                setRiskFilter('all');
              }}
              icon={Filter}
            >
              Clear Filters
            </Button>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Timestamp</th>
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-left py-3 px-2">Action</th>
                  <th className="text-left py-3 px-2">Resource</th>
                  <th className="text-left py-3 px-2">Result</th>
                  <th className="text-left py-3 px-2">Risk</th>
                  <th className="text-left py-3 px-2">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                      {format(log.timestamp, 'MMM dd, HH:mm:ss')}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {log.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">
                      {log.action.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                      {log.resource}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getResultColor(log.result)}`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getRiskColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400 font-mono text-xs">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Audit Logs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No logs match your current filter criteria.
              </p>
            </div>
          )}

          {filteredLogs.length > 50 && (
            <div className="text-center py-4 text-sm text-gray-600 dark:text-gray-400">
              Showing first 50 of {filteredLogs.length} results. Use filters to narrow down results.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};