import React, { useState, useEffect } from 'react';
import { Database, Upload, Download, Trash2, RefreshCw, HardDrive, Cloud, Archive, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LineChartComponent, BarChartComponent } from '../components/ui/Chart';
import { format } from 'date-fns';

interface DataSource {
  id: string;
  name: string;
  type: 'real_time' | 'historical' | 'analytics' | 'logs' | 'reports';
  size: number;
  records: number;
  lastUpdated: number;
  status: 'active' | 'syncing' | 'error' | 'archived';
  retentionDays: number;
  compressionRatio: number;
}

interface DataBackup {
  id: string;
  name: string;
  size: number;
  timestamp: number;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'running' | 'failed';
  location: 'local' | 'cloud' | 'offsite';
}

interface DataQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
}

export const DataManagement: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'source-1',
      name: 'Real-Time Grid Metrics',
      type: 'real_time',
      size: 2.4,
      records: 1250000,
      lastUpdated: Date.now() - 30000,
      status: 'active',
      retentionDays: 7,
      compressionRatio: 0.65,
    },
    {
      id: 'source-2',
      name: 'Historical Performance Data',
      type: 'historical',
      size: 15.8,
      records: 8900000,
      lastUpdated: Date.now() - 3600000,
      status: 'active',
      retentionDays: 365,
      compressionRatio: 0.45,
    },
    {
      id: 'source-3',
      name: 'Analytics & Reports',
      type: 'analytics',
      size: 5.2,
      records: 450000,
      lastUpdated: Date.now() - 7200000,
      status: 'syncing',
      retentionDays: 1095,
      compressionRatio: 0.55,
    },
    {
      id: 'source-4',
      name: 'System Audit Logs',
      type: 'logs',
      size: 8.7,
      records: 2300000,
      lastUpdated: Date.now() - 1800000,
      status: 'active',
      retentionDays: 2555,
      compressionRatio: 0.75,
    },
  ]);

  const [backups, setBackups] = useState<DataBackup[]>([
    {
      id: 'backup-1',
      name: 'Daily Full Backup',
      size: 45.2,
      timestamp: Date.now() - 86400000,
      type: 'full',
      status: 'completed',
      location: 'cloud',
    },
    {
      id: 'backup-2',
      name: 'Incremental Backup',
      size: 3.8,
      timestamp: Date.now() - 3600000,
      type: 'incremental',
      status: 'completed',
      location: 'local',
    },
    {
      id: 'backup-3',
      name: 'Weekly Archive',
      size: 125.6,
      timestamp: Date.now() - 604800000,
      type: 'full',
      status: 'completed',
      location: 'offsite',
    },
  ]);

  const [dataQuality, setDataQuality] = useState<DataQuality>({
    completeness: 98.7,
    accuracy: 99.2,
    consistency: 97.8,
    timeliness: 99.5,
    validity: 98.9,
  });

  const [storageUsage, setStorageUsage] = useState({
    total: 500,
    used: 285,
    available: 215,
    growth: 12.5,
  });

  useEffect(() => {
    // Update data sources periodically
    const interval = setInterval(() => {
      setDataSources(prev => prev.map(source => ({
        ...source,
        size: source.size + (Math.random() * 0.1),
        records: source.records + Math.floor(Math.random() * 1000),
        lastUpdated: source.status === 'active' ? Date.now() : source.lastUpdated,
      })));

      // Update data quality metrics
      setDataQuality(prev => ({
        completeness: Math.max(95, Math.min(100, prev.completeness + (Math.random() - 0.5) * 0.5)),
        accuracy: Math.max(95, Math.min(100, prev.accuracy + (Math.random() - 0.5) * 0.3)),
        consistency: Math.max(95, Math.min(100, prev.consistency + (Math.random() - 0.5) * 0.4)),
        timeliness: Math.max(95, Math.min(100, prev.timeliness + (Math.random() - 0.5) * 0.2)),
        validity: Math.max(95, Math.min(100, prev.validity + (Math.random() - 0.5) * 0.3)),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'syncing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'archived':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'real_time':
        return RefreshCw;
      case 'historical':
        return Archive;
      case 'analytics':
        return BarChart3;
      case 'logs':
        return Database;
      default:
        return Database;
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'cloud':
        return Cloud;
      case 'local':
        return HardDrive;
      case 'offsite':
        return Archive;
      default:
        return Database;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes * 1024 * 1024) / Math.log(k));
    return parseFloat((bytes * 1024 * 1024 / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

  const totalDataSize = dataSources.reduce((sum, source) => sum + source.size, 0);
  const totalRecords = dataSources.reduce((sum, source) => sum + source.records, 0);
  const averageQuality = Object.values(dataQuality).reduce((sum, val) => sum + val, 0) / Object.values(dataQuality).length;

  const qualityData = Object.entries(dataQuality).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
  }));

  const storageData = [
    { name: 'Used', value: storageUsage.used, color: '#3b82f6' },
    { name: 'Available', value: storageUsage.available, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Database size={32} className="text-white" />
                <h1 className="text-3xl font-bold">Data Management Center</h1>
              </div>
              <p className="text-indigo-100 text-lg">
                Comprehensive data lifecycle management, quality monitoring, and backup orchestration.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">{formatBytes(totalDataSize)}</div>
              <div className="text-indigo-200">Total Data</div>
              <div className="text-sm text-indigo-300 mt-1">
                {totalRecords.toLocaleString()} records
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {dataSources.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Data Sources</div>
            <div className="text-xs text-gray-500 mt-1">
              {dataSources.filter(s => s.status === 'active').length} active
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {averageQuality.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Data Quality</div>
            <div className="text-xs text-gray-500 mt-1">
              Average score
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {backups.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Backups</div>
            <div className="text-xs text-gray-500 mt-1">
              Last 24h
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {((storageUsage.used / storageUsage.total) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatBytes(storageUsage.available)} available
            </div>
          </div>
        </Card>
      </div>

      {/* Data Sources Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Database size={20} className="text-blue-600" />
              <span>Data Sources</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={Upload}
              >
                Import Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
              >
                Sync All
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Data Source</th>
                <th className="text-right py-3 px-2">Size</th>
                <th className="text-right py-3 px-2">Records</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Last Updated</th>
                <th className="text-center py-3 px-2">Retention</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataSources.map((source) => {
                const TypeIcon = getTypeIcon(source.type);
                
                return (
                  <tr key={source.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <TypeIcon size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {source.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {source.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatBytes(source.size)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                      {source.records.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                      {formatTime(source.lastUpdated)}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                      {source.retentionDays} days
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex space-x-1 justify-center">
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
                          icon={RefreshCw}
                          disabled={source.status === 'syncing'}
                        >
                          Sync
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Data Quality and Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-green-600" />
              <span>Data Quality Metrics</span>
            </CardTitle>
          </CardHeader>
          <BarChartComponent
            data={qualityData}
            bars={[{ dataKey: 'value', fill: '#10b981', name: 'Quality Score (%)' }]}
            xAxisKey="name"
            height={250}
          />
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {averageQuality.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Data Quality Score</div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive size={20} className="text-purple-600" />
              <span>Storage Utilization</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {((storageUsage.used / storageUsage.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Storage Utilization</div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatBytes(storageUsage.total)}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {formatBytes(storageUsage.used)}
                </div>
                <div className="text-xs text-gray-500">Used</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {formatBytes(storageUsage.available)}
                </div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Growth rate: +{storageUsage.growth.toFixed(1)}% per month
            </div>
          </div>
        </Card>
      </div>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Archive size={20} className="text-orange-600" />
              <span>Backup Management</span>
            </CardTitle>
            <Button
              variant="primary"
              size="sm"
              icon={Upload}
            >
              Create Backup
            </Button>
          </div>
        </CardHeader>

        <div className="space-y-3">
          {backups.map((backup) => {
            const LocationIcon = getLocationIcon(backup.location);
            
            return (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <LocationIcon size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {backup.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatBytes(backup.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{backup.type}</span>
                      <span>•</span>
                      <span className="capitalize">{backup.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize mb-1 ${
                    backup.status === 'completed' ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' :
                    backup.status === 'running' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400' :
                    'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {backup.status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(backup.timestamp, 'MMM dd, HH:mm')}
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Data Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Data Operations & Maintenance</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <Database size={32} className="mx-auto text-blue-600 mb-3" />
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Data Archival
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Archive old data to optimize storage and performance
            </p>
            <Button variant="outline" size="sm">
              Start Archival
            </Button>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <RefreshCw size={32} className="mx-auto text-green-600 mb-3" />
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Data Cleanup
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Remove duplicate and invalid records
            </p>
            <Button variant="outline" size="sm">
              Run Cleanup
            </Button>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <Upload size={32} className="mx-auto text-purple-600 mb-3" />
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
              Data Migration
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              Migrate data between storage systems
            </p>
            <Button variant="outline" size="sm">
              Start Migration
            </Button>
          </div>
          
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <Download size={32} className="mx-auto text-orange-600 mb-3" />
            <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
              Data Export
            </h4>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              Export data for external analysis
            </p>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};