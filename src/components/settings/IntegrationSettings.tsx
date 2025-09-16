import React, { useState } from 'react';
import { Plug, Database, Mail, MessageSquare, Wifi, Save, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const IntegrationSettings: React.FC = () => {
  const { 
    integrationSettings, 
    updateIntegrationSettings, 
    saveSettings, 
    resetToDefaults, 
    testConnection,
    isSaving 
  } = useSettingsStore();
  
  const [localSettings, setLocalSettings] = useState(integrationSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingConnections, setTestingConnections] = useState<Record<string, boolean>>({});
  const [connectionResults, setConnectionResults] = useState<Record<string, boolean | null>>({});

  const handleSettingChange = (category: string, subcategory: string, field: string, value: any) => {
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

  const handleDirectChange = (category: string, field: string, value: any) => {
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

  const handleTestConnection = async (service: string) => {
    setTestingConnections(prev => ({ ...prev, [service]: true }));
    
    try {
      const result = await testConnection(service);
      setConnectionResults(prev => ({ ...prev, [service]: result }));
    } catch (error) {
      setConnectionResults(prev => ({ ...prev, [service]: false }));
    } finally {
      setTestingConnections(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleSave = async () => {
    updateIntegrationSettings(localSettings);
    await saveSettings();
    setHasChanges(false);
  };

  const handleReset = () => {
    resetToDefaults('integration');
    setLocalSettings(integrationSettings);
    setHasChanges(false);
  };

  const getConnectionIcon = (service: string) => {
    const result = connectionResults[service];
    if (result === null) return null;
    return result ? CheckCircle : XCircle;
  };

  const getConnectionColor = (service: string) => {
    const result = connectionResults[service];
    if (result === null) return '';
    return result ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug size={20} className="text-blue-600" />
            <span>API Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Rate Limit (requests/minute)"
            type="number"
            value={localSettings.apis.rateLimit}
            onChange={(e) => handleDirectChange('apis', 'rateLimit', parseInt(e.target.value))}
            min={100}
            max={10000}
          />
          <Input
            label="Timeout (seconds)"
            type="number"
            value={localSettings.apis.timeout}
            onChange={(e) => handleDirectChange('apis', 'timeout', parseInt(e.target.value))}
            min={5}
            max={300}
          />
          <Input
            label="Retry Attempts"
            type="number"
            value={localSettings.apis.retryAttempts}
            onChange={(e) => handleDirectChange('apis', 'retryAttempts', parseInt(e.target.value))}
            min={1}
            max={10}
          />
          <Input
            label="Cache Timeout (seconds)"
            type="number"
            value={localSettings.apis.cacheTimeout}
            onChange={(e) => handleDirectChange('apis', 'cacheTimeout', parseInt(e.target.value))}
            min={60}
            max={3600}
            disabled={!localSettings.apis.enableCaching}
          />
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.apis.enableCaching}
                onChange={(e) => handleDirectChange('apis', 'enableCaching', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Caching</span>
            </label>
          </div>
        </div>
      </Card>

      {/* External Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi size={20} className="text-green-600" />
            <span>External System Integrations</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-6">
          {/* SCADA Integration */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SCADA System Integration
              </h4>
              <div className="flex items-center space-x-2">
                {getConnectionIcon('scada') && (
                  <div className={`${getConnectionColor('scada')}`}>
                    {React.createElement(getConnectionIcon('scada')!, { size: 16 })}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('scada')}
                  loading={testingConnections.scada}
                  disabled={!localSettings.externalSystems.scada.enabled}
                >
                  Test Connection
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.externalSystems.scada.enabled}
                    onChange={(e) => handleSettingChange('externalSystems', 'scada', 'enabled', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable SCADA Integration</span>
                </label>
              </div>
              <Input
                label="Endpoint"
                value={localSettings.externalSystems.scada.endpoint}
                onChange={(e) => handleSettingChange('externalSystems', 'scada', 'endpoint', e.target.value)}
                disabled={!localSettings.externalSystems.scada.enabled}
              />
              <Input
                label="Protocol"
                value={localSettings.externalSystems.scada.protocol}
                onChange={(e) => handleSettingChange('externalSystems', 'scada', 'protocol', e.target.value)}
                disabled={!localSettings.externalSystems.scada.enabled}
              />
              <Input
                label="Poll Interval (ms)"
                type="number"
                value={localSettings.externalSystems.scada.pollInterval}
                onChange={(e) => handleSettingChange('externalSystems', 'scada', 'pollInterval', parseInt(e.target.value))}
                disabled={!localSettings.externalSystems.scada.enabled}
              />
              <Input
                label="Timeout (ms)"
                type="number"
                value={localSettings.externalSystems.scada.timeout}
                onChange={(e) => handleSettingChange('externalSystems', 'scada', 'timeout', parseInt(e.target.value))}
                disabled={!localSettings.externalSystems.scada.enabled}
              />
            </div>
          </div>

          {/* EMS Integration */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Energy Management System (EMS)
              </h4>
              <div className="flex items-center space-x-2">
                {getConnectionIcon('ems') && (
                  <div className={`${getConnectionColor('ems')}`}>
                    {React.createElement(getConnectionIcon('ems')!, { size: 16 })}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('ems')}
                  loading={testingConnections.ems}
                  disabled={!localSettings.externalSystems.ems.enabled}
                >
                  Test Connection
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.externalSystems.ems.enabled}
                    onChange={(e) => handleSettingChange('externalSystems', 'ems', 'enabled', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable EMS Integration</span>
                </label>
              </div>
              <Input
                label="API Endpoint"
                value={localSettings.externalSystems.ems.endpoint}
                onChange={(e) => handleSettingChange('externalSystems', 'ems', 'endpoint', e.target.value)}
                disabled={!localSettings.externalSystems.ems.enabled}
              />
              <Input
                label="API Key"
                type="password"
                value={localSettings.externalSystems.ems.apiKey}
                onChange={(e) => handleSettingChange('externalSystems', 'ems', 'apiKey', e.target.value)}
                disabled={!localSettings.externalSystems.ems.enabled}
              />
              <Input
                label="Sync Interval (seconds)"
                type="number"
                value={localSettings.externalSystems.ems.syncInterval}
                onChange={(e) => handleSettingChange('externalSystems', 'ems', 'syncInterval', parseInt(e.target.value))}
                disabled={!localSettings.externalSystems.ems.enabled}
              />
            </div>
          </div>

          {/* Weather Service */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Weather Service Integration
              </h4>
              <div className="flex items-center space-x-2">
                {getConnectionIcon('weather') && (
                  <div className={`${getConnectionColor('weather')}`}>
                    {React.createElement(getConnectionIcon('weather')!, { size: 16 })}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('weather')}
                  loading={testingConnections.weather}
                  disabled={!localSettings.externalSystems.weather.enabled}
                >
                  Test Connection
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.externalSystems.weather.enabled}
                    onChange={(e) => handleSettingChange('externalSystems', 'weather', 'enabled', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Weather Integration</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider
                </label>
                <select
                  value={localSettings.externalSystems.weather.provider}
                  onChange={(e) => handleSettingChange('externalSystems', 'weather', 'provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  disabled={!localSettings.externalSystems.weather.enabled}
                >
                  <option value="OpenWeatherMap">OpenWeatherMap</option>
                  <option value="WeatherAPI">WeatherAPI</option>
                  <option value="AccuWeather">AccuWeather</option>
                </select>
              </div>
              <Input
                label="API Key"
                type="password"
                value={localSettings.externalSystems.weather.apiKey}
                onChange={(e) => handleSettingChange('externalSystems', 'weather', 'apiKey', e.target.value)}
                disabled={!localSettings.externalSystems.weather.enabled}
              />
              <Input
                label="Update Interval (seconds)"
                type="number"
                value={localSettings.externalSystems.weather.updateInterval}
                onChange={(e) => handleSettingChange('externalSystems', 'weather', 'updateInterval', parseInt(e.target.value))}
                disabled={!localSettings.externalSystems.weather.enabled}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database size={20} className="text-purple-600" />
            <span>Database Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Connection Pool Size"
            type="number"
            value={localSettings.database.connectionPool}
            onChange={(e) => handleDirectChange('database', 'connectionPool', parseInt(e.target.value))}
            min={5}
            max={100}
          />
          <Input
            label="Query Timeout (seconds)"
            type="number"
            value={localSettings.database.queryTimeout}
            onChange={(e) => handleDirectChange('database', 'queryTimeout', parseInt(e.target.value))}
            min={5}
            max={300}
          />
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.database.backupEnabled}
                onChange={(e) => handleDirectChange('database', 'backupEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Backups</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.database.replicationEnabled}
                onChange={(e) => handleDirectChange('database', 'replicationEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Replication</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Messaging Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail size={20} className="text-orange-600" />
            <span>Messaging & Communication</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-6">
          {/* Email Configuration */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Email Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="SMTP Host"
                value={localSettings.messaging.email.smtpHost}
                onChange={(e) => handleSettingChange('messaging', 'email', 'smtpHost', e.target.value)}
              />
              <Input
                label="SMTP Port"
                type="number"
                value={localSettings.messaging.email.smtpPort}
                onChange={(e) => handleSettingChange('messaging', 'email', 'smtpPort', parseInt(e.target.value))}
              />
              <Input
                label="Username"
                value={localSettings.messaging.email.username}
                onChange={(e) => handleSettingChange('messaging', 'email', 'username', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Encryption
                </label>
                <select
                  value={localSettings.messaging.email.encryption}
                  onChange={(e) => handleSettingChange('messaging', 'email', 'encryption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* SMS Configuration */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              SMS Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider
                </label>
                <select
                  value={localSettings.messaging.sms.provider}
                  onChange={(e) => handleSettingChange('messaging', 'sms', 'provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Twilio">Twilio</option>
                  <option value="AWS SNS">AWS SNS</option>
                  <option value="Nexmo">Nexmo</option>
                </select>
              </div>
              <Input
                label="API Key"
                type="password"
                value={localSettings.messaging.sms.apiKey}
                onChange={(e) => handleSettingChange('messaging', 'sms', 'apiKey', e.target.value)}
              />
              <Input
                label="From Number"
                value={localSettings.messaging.sms.fromNumber}
                onChange={(e) => handleSettingChange('messaging', 'sms', 'fromNumber', e.target.value)}
                placeholder="+1234567890"
              />
            </div>
          </div>

          {/* Slack Integration */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Slack Integration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localSettings.messaging.slack.enabled}
                    onChange={(e) => handleSettingChange('messaging', 'slack', 'enabled', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Slack Integration</span>
                </label>
              </div>
              <Input
                label="Webhook URL"
                value={localSettings.messaging.slack.webhookUrl}
                onChange={(e) => handleSettingChange('messaging', 'slack', 'webhookUrl', e.target.value)}
                disabled={!localSettings.messaging.slack.enabled}
              />
              <Input
                label="Channel"
                value={localSettings.messaging.slack.channel}
                onChange={(e) => handleSettingChange('messaging', 'slack', 'channel', e.target.value)}
                disabled={!localSettings.messaging.slack.enabled}
                placeholder="#grid-alerts"
              />
            </div>
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
              Save Integration Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};