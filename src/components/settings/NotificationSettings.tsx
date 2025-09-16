import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Phone, Save, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const NotificationSettings: React.FC = () => {
  const { 
    userPreferences, 
    updateUserPreferences, 
    saveSettings, 
    resetToDefaults, 
    isSaving 
  } = useSettingsStore();
  
  const [localSettings, setLocalSettings] = useState(userPreferences.notifications);
  const [hasChanges, setHasChanges] = useState(false);
  const [testNotification, setTestNotification] = useState<string | null>(null);

  const handleNotificationChange = (category: string, field: string, value: any) => {
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

  const handleSave = async () => {
    updateUserPreferences({ notifications: localSettings });
    await saveSettings();
    setHasChanges(false);
  };

  const handleReset = () => {
    resetToDefaults('user');
    setLocalSettings(userPreferences.notifications);
    setHasChanges(false);
  };

  const handleTestNotification = async (type: string) => {
    setTestNotification(type);
    
    // Simulate sending test notification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTestNotification(null);
    
    // Show success message (in a real app, this would show actual result)
    alert(`Test ${type} notification sent successfully!`);
  };

  const notificationChannels = [
    {
      id: 'email',
      name: 'Email Notifications',
      icon: Mail,
      description: 'Receive notifications via email',
      settings: localSettings.email,
    },
    {
      id: 'inApp',
      name: 'In-App Notifications',
      icon: Bell,
      description: 'Browser and desktop notifications',
      settings: localSettings.inApp,
    },
    {
      id: 'sms',
      name: 'SMS Notifications',
      icon: Phone,
      description: 'Text message notifications',
      settings: localSettings.sms,
    },
  ];

  const notificationTypes = [
    { key: 'criticalAlerts', label: 'Critical Alerts', description: 'High-priority system alerts' },
    { key: 'dailyReports', label: 'Daily Reports', description: 'Daily performance summaries' },
    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly analysis reports' },
    { key: 'maintenanceAlerts', label: 'Maintenance Alerts', description: 'Equipment maintenance notifications' },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {notificationChannels.map((channel) => {
          const Icon = channel.icon;
          const isEnabled = channel.settings.enabled;
          
          return (
            <Card key={channel.id} className={`${isEnabled ? 'border-green-200 dark:border-green-800' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Icon size={20} className={isEnabled ? 'text-green-600' : 'text-gray-400'} />
                    <span>{channel.name}</span>
                  </CardTitle>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => handleNotificationChange(channel.id, 'enabled', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {channel.description}
                </p>
              </CardHeader>

              <div className="px-6 pb-6 space-y-3">
                {/* Channel-specific settings */}
                {channel.id === 'email' && (
                  <div className="space-y-2">
                    {notificationTypes.map((type) => (
                      <label key={type.key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                        <input
                          type="checkbox"
                          checked={(channel.settings as any)[type.key]}
                          onChange={(e) => handleNotificationChange(channel.id, type.key, e.target.checked)}
                          disabled={!isEnabled}
                          className="ml-2"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {channel.id === 'inApp' && (
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sound Alerts</span>
                      <input
                        type="checkbox"
                        checked={channel.settings.sound}
                        onChange={(e) => handleNotificationChange(channel.id, 'sound', e.target.checked)}
                        disabled={!isEnabled}
                        className="ml-2"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Desktop Notifications</span>
                      <input
                        type="checkbox"
                        checked={channel.settings.desktop}
                        onChange={(e) => handleNotificationChange(channel.id, 'desktop', e.target.checked)}
                        disabled={!isEnabled}
                        className="ml-2"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Critical Only</span>
                      <input
                        type="checkbox"
                        checked={channel.settings.criticalOnly}
                        onChange={(e) => handleNotificationChange(channel.id, 'criticalOnly', e.target.checked)}
                        disabled={!isEnabled}
                        className="ml-2"
                      />
                    </label>
                  </div>
                )}

                {channel.id === 'sms' && (
                  <div className="space-y-3">
                    <Input
                      label="Phone Number"
                      value={channel.settings.number}
                      onChange={(e) => handleNotificationChange(channel.id, 'number', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      disabled={!isEnabled}
                    />
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Critical Alerts Only</span>
                      <input
                        type="checkbox"
                        checked={channel.settings.criticalOnly}
                        onChange={(e) => handleNotificationChange(channel.id, 'criticalOnly', e.target.checked)}
                        disabled={!isEnabled}
                        className="ml-2"
                      />
                    </label>
                  </div>
                )}

                {/* Test Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestNotification(channel.id)}
                  loading={testNotification === channel.id}
                  disabled={!isEnabled}
                  className="w-full mt-3"
                >
                  Send Test Notification
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell size={20} className="text-yellow-600" />
            <span>Notification Rules & Escalation</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Critical Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Immediate notification for system failures
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Email: Instant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>SMS: Instant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>In-App: Instant</span>
                </div>
              </div>
            </div>

            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Warning Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Important notifications requiring attention
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Email: 5 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>In-App: Instant</span>
                </div>
              </div>
            </div>

            <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Info Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                General information and updates
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Email: Batched</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>In-App: Instant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Quiet Hours Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Start Time"
                type="time"
                defaultValue="22:00"
              />
              <Input
                label="End Time"
                type="time"
                defaultValue="06:00"
              />
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable Quiet Hours</span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              During quiet hours, only critical alerts will be sent. Other notifications will be batched.
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
              Save Notification Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};