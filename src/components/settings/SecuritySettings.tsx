import React, { useState } from 'react';
import { Lock, Shield, Key, Eye, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SecuritySettings: React.FC = () => {
  const { 
    securitySettings, 
    updateSecuritySettings, 
    saveSettings, 
    resetToDefaults, 
    isSaving 
  } = useSettingsStore();
  
  const [localSettings, setLocalSettings] = useState(securitySettings);
  const [hasChanges, setHasChanges] = useState(false);

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

  const handleArrayChange = (category: string, field: string, value: string) => {
    const array = value.split('\n').filter(item => item.trim());
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category as keyof typeof localSettings],
        [field]: array,
      },
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    updateSecuritySettings(localSettings);
    await saveSettings();
    setHasChanges(false);
  };

  const handleReset = () => {
    resetToDefaults('security');
    setLocalSettings(securitySettings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock size={20} className="text-red-600" />
            <span>Password Policy</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Minimum Length"
            type="number"
            value={localSettings.authentication.passwordPolicy.minLength}
            onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
            min={6}
            max={32}
          />
          <Input
            label="Expiration (days)"
            type="number"
            value={localSettings.authentication.passwordPolicy.expirationDays}
            onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'expirationDays', parseInt(e.target.value))}
            min={30}
            max={365}
          />
          <Input
            label="Password History Count"
            type="number"
            value={localSettings.authentication.passwordPolicy.historyCount}
            onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'historyCount', parseInt(e.target.value))}
            min={1}
            max={24}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.authentication.passwordPolicy.requireUppercase}
              onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'requireUppercase', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Require Uppercase</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.authentication.passwordPolicy.requireLowercase}
              onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'requireLowercase', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Require Lowercase</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.authentication.passwordPolicy.requireNumbers}
              onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'requireNumbers', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Require Numbers</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.authentication.passwordPolicy.requireSpecialChars}
              onChange={(e) => handleSettingChange('authentication', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Require Special Characters</span>
          </label>
        </div>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key size={20} className="text-blue-600" />
            <span>Session Management</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Session Timeout (minutes)"
            type="number"
            value={localSettings.authentication.sessionSettings.timeoutMinutes}
            onChange={(e) => handleSettingChange('authentication', 'sessionSettings', 'timeoutMinutes', parseInt(e.target.value))}
            min={5}
            max={480}
          />
          <Input
            label="Max Concurrent Sessions"
            type="number"
            value={localSettings.authentication.sessionSettings.maxConcurrentSessions}
            onChange={(e) => handleSettingChange('authentication', 'sessionSettings', 'maxConcurrentSessions', parseInt(e.target.value))}
            min={1}
            max={10}
          />
          <Input
            label="Remember Me Duration (days)"
            type="number"
            value={localSettings.authentication.sessionSettings.rememberMeDays}
            onChange={(e) => handleSettingChange('authentication', 'sessionSettings', 'rememberMeDays', parseInt(e.target.value))}
            min={1}
            max={90}
            disabled={!localSettings.authentication.sessionSettings.rememberMeEnabled}
          />
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.authentication.sessionSettings.rememberMeEnabled}
                onChange={(e) => handleSettingChange('authentication', 'sessionSettings', 'rememberMeEnabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Remember Me</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Multi-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield size={20} className="text-green-600" />
            <span>Multi-Factor Authentication</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.authentication.mfaSettings.enabled}
                onChange={(e) => handleSettingChange('authentication', 'mfaSettings', 'enabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable MFA</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.authentication.mfaSettings.required}
                onChange={(e) => handleSettingChange('authentication', 'mfaSettings', 'required', e.target.checked)}
                className="mr-2"
                disabled={!localSettings.authentication.mfaSettings.enabled}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Require MFA</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.authentication.mfaSettings.backupCodes}
                onChange={(e) => handleSettingChange('authentication', 'mfaSettings', 'backupCodes', e.target.checked)}
                className="mr-2"
                disabled={!localSettings.authentication.mfaSettings.enabled}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Backup Codes</span>
            </label>
          </div>

          {localSettings.authentication.mfaSettings.enabled && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available MFA Methods
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['totp', 'sms', 'email', 'hardware'].map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localSettings.authentication.mfaSettings.methods.includes(method)}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...localSettings.authentication.mfaSettings.methods, method]
                          : localSettings.authentication.mfaSettings.methods.filter(m => m !== method);
                        handleSettingChange('authentication', 'mfaSettings', 'methods', methods);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {method === 'totp' ? 'Authenticator App' : method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye size={20} className="text-purple-600" />
            <span>Access Control</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.accessControl.roleBasedAccess}
                onChange={(e) => handleSettingChange('accessControl', '', 'roleBasedAccess', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Role-Based Access Control</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.accessControl.geolocationRestrictions}
                onChange={(e) => handleSettingChange('accessControl', '', 'geolocationRestrictions', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Geolocation Restrictions</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.accessControl.deviceRegistration}
                onChange={(e) => handleSettingChange('accessControl', '', 'deviceRegistration', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Device Registration</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IP Whitelist (one per line)
              </label>
              <textarea
                value={localSettings.accessControl.ipWhitelist.join('\n')}
                onChange={(e) => handleArrayChange('accessControl', 'ipWhitelist', e.target.value)}
                placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={4}
              />
            </div>

            {localSettings.accessControl.geolocationRestrictions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allowed Countries (one per line)
                </label>
                <textarea
                  value={localSettings.accessControl.allowedCountries.join('\n')}
                  onChange={(e) => handleArrayChange('accessControl', 'allowedCountries', e.target.value)}
                  placeholder="US&#10;CA&#10;GB"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Encryption Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key size={20} className="text-indigo-600" />
            <span>Encryption Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.encryption.dataAtRest}
                onChange={(e) => handleSettingChange('encryption', '', 'dataAtRest', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Encrypt Data at Rest</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.encryption.dataInTransit}
                onChange={(e) => handleSettingChange('encryption', '', 'dataInTransit', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Encrypt Data in Transit</span>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Encryption Algorithm
              </label>
              <select
                value={localSettings.encryption.algorithm}
                onChange={(e) => handleSettingChange('encryption', '', 'algorithm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="AES-256">AES-256</option>
                <option value="AES-192">AES-192</option>
                <option value="AES-128">AES-128</option>
              </select>
            </div>
            <Input
              label="Key Rotation (days)"
              type="number"
              value={localSettings.encryption.keyRotationDays}
              onChange={(e) => handleSettingChange('encryption', '', 'keyRotationDays', parseInt(e.target.value))}
              min={30}
              max={365}
            />
          </div>
        </div>
      </Card>

      {/* Audit Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle size={20} className="text-orange-600" />
            <span>Audit & Logging Configuration</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.audit.logAllActions}
                onChange={(e) => handleSettingChange('audit', '', 'logAllActions', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Log All User Actions</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.audit.logFailedAttempts}
                onChange={(e) => handleSettingChange('audit', '', 'logFailedAttempts', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Log Failed Login Attempts</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.audit.logDataAccess}
                onChange={(e) => handleSettingChange('audit', '', 'logDataAccess', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Log Data Access</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localSettings.audit.logConfigChanges}
                onChange={(e) => handleSettingChange('audit', '', 'logConfigChanges', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Log Configuration Changes</span>
            </label>
          </div>

          <div>
            <Input
              label="Audit Log Retention (days)"
              type="number"
              value={localSettings.audit.retentionDays}
              onChange={(e) => handleSettingChange('audit', '', 'retentionDays', parseInt(e.target.value))}
              min={90}
              max={3650}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 7 years (2555 days) for compliance
            </p>
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
              Save Security Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};