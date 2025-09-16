import React, { useState } from 'react';
import { User, Monitor, Globe, Bell, Save, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const UserPreferences: React.FC = () => {
  const { 
    userPreferences, 
    updateUserPreferences, 
    saveSettings, 
    resetToDefaults, 
    isSaving 
  } = useSettingsStore();
  
  const [localPreferences, setLocalPreferences] = useState(userPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (category: string, field: string, value: any) => {
    const newPreferences = {
      ...localPreferences,
      [category]: {
        ...localPreferences[category as keyof typeof localPreferences],
        [field]: value,
      },
    };
    setLocalPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleNestedPreferenceChange = (category: string, subcategory: string, field: string, value: any) => {
    const newPreferences = {
      ...localPreferences,
      [category]: {
        ...localPreferences[category as keyof typeof localPreferences],
        [subcategory]: {
          ...(localPreferences[category as keyof typeof localPreferences] as any)[subcategory],
          [field]: value,
        },
      },
    };
    setLocalPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleSave = async () => {
    updateUserPreferences(localPreferences);
    await saveSettings();
    setHasChanges(false);
  };

  const handleReset = () => {
    resetToDefaults('user');
    setLocalPreferences(userPreferences);
    setHasChanges(false);
  };

  const pages = [
    { value: '/dashboard', label: 'Dashboard' },
    { value: '/monitoring', label: 'Grid Monitoring' },
    { value: '/topology', label: 'Grid Topology' },
    { value: '/analytics', label: 'Analytics' },
    { value: '/optimization', label: 'AI Optimization' },
  ];

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor size={20} className="text-blue-600" />
            <span>Dashboard Preferences</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Page
            </label>
            <select
              value={localPreferences.dashboard.defaultPage}
              onChange={(e) => handlePreferenceChange('dashboard', 'defaultPage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {pages.map((page) => (
                <option key={page.value} value={page.value}>
                  {page.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Refresh Interval (seconds)"
            type="number"
            value={localPreferences.dashboard.refreshInterval}
            onChange={(e) => handlePreferenceChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
            min={5}
            max={300}
          />

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.dashboard.chartAnimations}
                onChange={(e) => handlePreferenceChange('dashboard', 'chartAnimations', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Chart Animations</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.dashboard.compactMode}
                onChange={(e) => handlePreferenceChange('dashboard', 'compactMode', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Compact Mode</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.dashboard.showWelcomeMessage}
                onChange={(e) => handlePreferenceChange('dashboard', 'showWelcomeMessage', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Welcome Message</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor size={20} className="text-green-600" />
            <span>Display & Appearance</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={localPreferences.display.theme}
              onChange={(e) => handlePreferenceChange('display', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <select
              value={localPreferences.display.fontSize}
              onChange={(e) => handlePreferenceChange('display', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Density
            </label>
            <select
              value={localPreferences.display.density}
              onChange={(e) => handlePreferenceChange('display', 'density', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localPreferences.display.animations}
                onChange={(e) => handlePreferenceChange('display', 'animations', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Animations</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe size={20} className="text-purple-600" />
            <span>Localization & Regional Settings</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={localPreferences.localization.language}
              onChange={(e) => handlePreferenceChange('localization', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={localPreferences.localization.timezone}
              onChange={(e) => handlePreferenceChange('localization', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date Format"
            value={localPreferences.localization.dateFormat}
            onChange={(e) => handlePreferenceChange('localization', 'dateFormat', e.target.value)}
            placeholder="MM/dd/yyyy"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Format
            </label>
            <select
              value={localPreferences.localization.timeFormat}
              onChange={(e) => handlePreferenceChange('localization', 'timeFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell size={20} className="text-yellow-600" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Email Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.email.enabled}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'email', 'enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable Email Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.email.criticalAlerts}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'email', 'criticalAlerts', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.email.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Critical Alerts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.email.dailyReports}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'email', 'dailyReports', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.email.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Daily Reports</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.email.weeklyReports}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'email', 'weeklyReports', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.email.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Weekly Reports</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.email.maintenanceAlerts}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'email', 'maintenanceAlerts', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.email.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance Alerts</span>
              </label>
            </div>
          </div>

          {/* In-App Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              In-App Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.inApp.enabled}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'inApp', 'enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable In-App Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.inApp.sound}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'inApp', 'sound', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.inApp.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sound Alerts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.inApp.desktop}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'inApp', 'desktop', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.inApp.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Desktop Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.inApp.criticalOnly}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'inApp', 'criticalOnly', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.inApp.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Critical Alerts Only</span>
              </label>
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              SMS Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.sms.enabled}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'sms', 'enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable SMS Notifications</span>
              </label>
              <Input
                label="Phone Number"
                value={localPreferences.notifications.sms.number}
                onChange={(e) => handleNestedPreferenceChange('notifications', 'sms', 'number', e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={!localPreferences.notifications.sms.enabled}
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localPreferences.notifications.sms.criticalOnly}
                  onChange={(e) => handleNestedPreferenceChange('notifications', 'sms', 'criticalOnly', e.target.checked)}
                  className="mr-2"
                  disabled={!localPreferences.notifications.sms.enabled}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Critical Alerts Only</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Localization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe size={20} className="text-indigo-600" />
            <span>Localization & Regional Settings</span>
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={localPreferences.localization.language}
              onChange={(e) => handlePreferenceChange('localization', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={localPreferences.localization.timezone}
              onChange={(e) => handlePreferenceChange('localization', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date Format"
            value={localPreferences.localization.dateFormat}
            onChange={(e) => handlePreferenceChange('localization', 'dateFormat', e.target.value)}
            placeholder="MM/dd/yyyy"
          />

          <Input
            label="Currency"
            value={localPreferences.localization.currency}
            onChange={(e) => handlePreferenceChange('localization', 'currency', e.target.value)}
            placeholder="USD"
          />
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
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};