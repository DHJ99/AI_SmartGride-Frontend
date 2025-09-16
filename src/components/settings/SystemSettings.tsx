import React, { useState } from 'react';
import { Server, Database, Shield, Clock, Save, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SystemSettings: React.FC = () => {
  const { 
    systemSettings, 
    updateSystemSettings, 
    saveSettings, 
    resetToDefaults, 
    isSaving,
    systemHealth 
  } = useSettingsStore();
  
  const [localSettings, setLocalSettings] = useState(systemSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category: string, field: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category as keyof typeof localSettings],
        [field]: value,
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleNestedSettingChange = (category: string, subcategory: string, field: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category as keyof typeof localSettings],
        [subcategory]: {
          ...(localSettings[category as keyof typeof localSettings] as any)[subcategory],
          [field]: value,
        },
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    updateSystemSettings(localSettings);
    await saveSettings();
    setHasChanges(false);
  };

  const handleReset = () => {
    resetToDefaults('system');
    setLocalSettings(systemSettings);
    setHasChanges(false);
  };

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (value: number) => {
    if (value >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (value >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server size={20} className="text-blue-600" />
            <span>System Health & Status</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`text-center p-3 rounded-lg ${getHealthBgColor(systemHealth.cpu)}`}>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.cpu)} mb-1`}>
              {systemHealth.cpu.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${getHealthBgColor(systemHealth.memory)}`}>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.memory)} mb-1`}>
              {systemHealth.memory.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Memory</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${getHealthBgColor(systemHealth.disk)}`}>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.disk)} mb-1`}>
              {systemHealth.disk.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Disk Usage</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${getHealthBgColor(systemHealth.network)}`}>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.network)} mb-1`}>
              {systemHealth.network.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Network</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${getHealthBgColor(systemHealth.database)}`}>
            <div className={`text-2xl font-bold ${getHealthColor(systemHealth.database)} mb-1`}>
              {systemHealth.database.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Database</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 mb-1">
              {Math.floor((Date.now() - systemHealth.uptime) / (24 * 60 * 60 * 1000))} days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 mb-1">
              v{systemHealth.version}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Version</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 mb-1">
              {systemHealth.license.type}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">License Type</div>
          </div>
        </div>
      </Card>

      {/* Grid Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield size={20} className="text-green-600" />
            <span>Grid Parameters & Thresholds</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voltage Thresholds */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Voltage Thresholds (kV)
            </h4>
            <div className="space-y-3">
              <Input
                label="High Voltage Threshold"
                type="number"
                value={localSettings.gridParameters.voltageThresholds.high}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'voltageThresholds', 'high', parseFloat(e.target.value))}
              />
              <Input
                label="Low Voltage Threshold"
                type="number"
                value={localSettings.gridParameters.voltageThresholds.low}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'voltageThresholds', 'low', parseFloat(e.target.value))}
              />
              <Input
                label="Critical Voltage Threshold"
                type="number"
                value={localSettings.gridParameters.voltageThresholds.critical}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'voltageThresholds', 'critical', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Frequency Limits */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Frequency Limits (Hz)
            </h4>
            <div className="space-y-3">
              <Input
                label="Nominal Frequency"
                type="number"
                step="0.1"
                value={localSettings.gridParameters.frequencyLimits.nominal}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'frequencyLimits', 'nominal', parseFloat(e.target.value))}
              />
              <Input
                label="Tolerance"
                type="number"
                step="0.1"
                value={localSettings.gridParameters.frequencyLimits.tolerance}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'frequencyLimits', 'tolerance', parseFloat(e.target.value))}
              />
              <Input
                label="Emergency Limit"
                type="number"
                step="0.1"
                value={localSettings.gridParameters.frequencyLimits.emergency}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'frequencyLimits', 'emergency', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Load Thresholds */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Load Thresholds (%)
            </h4>
            <div className="space-y-3">
              <Input
                label="Normal Load Threshold"
                type="number"
                value={localSettings.gridParameters.loadThresholds.normal}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'loadThresholds', 'normal', parseInt(e.target.value))}
              />
              <Input
                label="High Load Threshold"
                type="number"
                value={localSettings.gridParameters.loadThresholds.high}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'loadThresholds', 'high', parseInt(e.target.value))}
              />
              <Input
                label="Critical Load Threshold"
                type="number"
                value={localSettings.gridParameters.loadThresholds.critical}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'loadThresholds', 'critical', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Efficiency Targets */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Efficiency Targets (%)
            </h4>
            <div className="space-y-3">
              <Input
                label="Minimum Efficiency"
                type="number"
                value={localSettings.gridParameters.efficiencyTargets.minimum}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'efficiencyTargets', 'minimum', parseInt(e.target.value))}
              />
              <Input
                label="Target Efficiency"
                type="number"
                value={localSettings.gridParameters.efficiencyTargets.target}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'efficiencyTargets', 'target', parseInt(e.target.value))}
              />
              <Input
                label="Excellent Efficiency"
                type="number"
                value={localSettings.gridParameters.efficiencyTargets.excellent}
                onChange={(e) => handleNestedSettingChange('gridParameters', 'efficiencyTargets', 'excellent', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Alarm Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock size={20} className="text-orange-600" />
            <span>Alarm & Alert Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Critical Alert Delay (seconds)"
            type="number"
            value={localSettings.alarmSettings.criticalAlertDelay}
            onChange={(e) => handleNestedSettingChange('alarmSettings', '', 'criticalAlertDelay', parseInt(e.target.value))}
          />
          <Input
            label="Warning Alert Delay (seconds)"
            type="number"
            value={localSettings.alarmSettings.warningAlertDelay}
            onChange={(e) => handleNestedSettingChange('alarmSettings', '', 'warningAlertDelay', parseInt(e.target.value))}
          />
          <Input
            label="Auto Acknowledge Time (minutes)"
            type="number"
            value={localSettings.alarmSettings.autoAcknowledgeTime}
            onChange={(e) => handleNestedSettingChange('alarmSettings', '', 'autoAcknowledgeTime', parseInt(e.target.value))}
          />
          <Input
            label="Escalation Time (minutes)"
            type="number"
            value={localSettings.alarmSettings.escalationTime}
            onChange={(e) => handleNestedSettingChange('alarmSettings', '', 'escalationTime', parseInt(e.target.value))}
          />
          <Input
            label="Max Alerts Per Hour"
            type="number"
            value={localSettings.alarmSettings.maxAlertsPerHour}
            onChange={(e) => handleNestedSettingChange('alarmSettings', '', 'maxAlertsPerHour', parseInt(e.target.value))}
          />
        </div>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database size={20} className="text-purple-600" />
            <span>Data Retention Policies</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Real-time Data (days)"
            type="number"
            value={localSettings.dataRetention.realTimeData}
            onChange={(e) => handleNestedSettingChange('dataRetention', '', 'realTimeData', parseInt(e.target.value))}
          />
          <Input
            label="Historical Data (days)"
            type="number"
            value={localSettings.dataRetention.historicalData}
            onChange={(e) => handleNestedSettingChange('dataRetention', '', 'historicalData', parseInt(e.target.value))}
          />
          <Input
            label="Audit Logs (days)"
            type="number"
            value={localSettings.dataRetention.auditLogs}
            onChange={(e) => handleNestedSettingChange('dataRetention', '', 'auditLogs', parseInt(e.target.value))}
          />
          <Input
            label="Report Data (days)"
            type="number"
            value={localSettings.dataRetention.reportData}
            onChange={(e) => handleNestedSettingChange('dataRetention', '', 'reportData', parseInt(e.target.value))}
          />
          <Input
            label="Backup Retention (days)"
            type="number"
            value={localSettings.dataRetention.backupRetention}
            onChange={(e) => handleNestedSettingChange('dataRetention', '', 'backupRetention', parseInt(e.target.value))}
          />
        </div>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database size={20} className="text-indigo-600" />
            <span>Backup & Recovery Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Backup Interval (hours)"
              type="number"
              value={localSettings.backup.backupInterval}
              onChange={(e) => handleNestedSettingChange('backup', '', 'backupInterval', parseInt(e.target.value))}
            />
            <Input
              label="Backup Location"
              value={localSettings.backup.backupLocation}
              onChange={(e) => handleNestedSettingChange('backup', '', 'backupLocation', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.backup.autoBackupEnabled}
                onChange={(e) => handleNestedSettingChange('backup', '', 'autoBackupEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto Backup</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.backup.compressionEnabled}
                onChange={(e) => handleNestedSettingChange('backup', '', 'compressionEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Compression</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.backup.encryptionEnabled}
                onChange={(e) => handleNestedSettingChange('backup', '', 'encryptionEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Encryption</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Save Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleReset}
              icon={RotateCcw}
              disabled={!hasChanges}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSaving}
              icon={Save}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};