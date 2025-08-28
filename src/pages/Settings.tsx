import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Bell, Shield, Database, Palette, Globe, Key, Download, Upload, RefreshCw } from 'lucide-react'
import { useThemeStore } from '@/stores/theme'
import { useAuth } from '@/contexts/AuthContext'
import { TwoFactorAuth } from '@/components/security/TwoFactorAuth'
import { apiKeys } from '@/data/securityMockData'
import { maskSensitiveData } from '@/utils/encryption'
import { logSecurityEvent } from '@/utils/securityLogger'

export default function Settings() {
  const { theme, setTheme } = useThemeStore()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    alerts: true,
    reports: true,
    maintenance: false
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    logSecurityEvent('notification_settings_changed', { setting: key, value })
  }

  const handleApiKeyRevoke = (keyId: string) => {
    logSecurityEvent('api_key_revoked', { keyId })
    // In real app, make API call to revoke key
  }

  const handleDataExport = () => {
    logSecurityEvent('data_export_requested', { userId: user?.id })
    // In real app, trigger data export
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account, preferences, and system configuration
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API & Data</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue={user?.name?.split(' ')[0] || ''} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue={user?.name?.split(' ')[1] || ''} className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="operations">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user?.role || ''} className="mt-1" disabled />
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact your administrator to change your role
                  </p>
                </div>

                <Button className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Type:</span>
                  <Badge variant="success">Premium</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Member Since:</span>
                  <span className="text-sm font-medium">January 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Login:</span>
                  <span className="text-sm font-medium">Today, 9:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Session Timeout:</span>
                  <span className="text-sm font-medium">8 hours</span>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <h4 className="font-medium">Permissions</h4>
                  <div className="space-y-1 text-sm">
                    {user?.permissions?.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                        <span className="capitalize">{permission} access</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appearance */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Timezone</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Number Format</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">1,234.56 (US)</SelectItem>
                      <SelectItem value="eu">1.234,56 (EU)</SelectItem>
                      <SelectItem value="in">1,23,456.78 (IN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Preferences */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Dashboard Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Page</Label>
                  <Select defaultValue="dashboard">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="grid-topology">Grid Topology</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="optimization">Optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Refresh Interval</Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 second</SelectItem>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Display Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show animations</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-refresh charts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show grid background</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compact mode</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground">Browser push notifications</div>
                      </div>
                      <Switch 
                        checked={notifications.push} 
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-muted-foreground">Critical alerts via SMS</div>
                      </div>
                      <Switch 
                        checked={notifications.sms} 
                        onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">System Alerts</div>
                        <div className="text-sm text-muted-foreground">Critical system notifications</div>
                      </div>
                      <Switch 
                        checked={notifications.alerts} 
                        onCheckedChange={(checked) => handleNotificationChange('alerts', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Report Generation</div>
                        <div className="text-sm text-muted-foreground">When reports are ready</div>
                      </div>
                      <Switch 
                        checked={notifications.reports} 
                        onCheckedChange={(checked) => handleNotificationChange('reports', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Maintenance Updates</div>
                        <div className="text-sm text-muted-foreground">Scheduled maintenance notifications</div>
                      </div>
                      <Switch 
                        checked={notifications.maintenance} 
                        onCheckedChange={(checked) => handleNotificationChange('maintenance', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Input id="quiet-start" type="time" defaultValue="22:00" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Input id="quiet-end" type="time" defaultValue="06:00" className="mt-1" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Non-critical notifications will be suppressed during these hours
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password & Authentication */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Password & Authentication</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="mt-1" />
                </div>
                <Button className="w-full">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <TwoFactorAuth />
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>API Keys</span>
                  </div>
                  <Button size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Generate Key
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {maskSensitiveData(key.key, 8)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(key.created).toLocaleDateString()} • 
                        Last used: {new Date(key.lastUsed).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={key.status === 'active' ? 'success' : 'destructive'}>
                        {key.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApiKeyRevoke(key.id)}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleApiKeyRevoke(key.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download your account data and settings
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleDataExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Account Data
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Import Settings</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Import configuration from a backup file
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Data Retention</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Historical Data:</span>
                      <span className="font-medium">2 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Log Files:</span>
                      <span className="font-medium">90 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reports:</span>
                      <span className="font-medium">1 year</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Information */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Version:</span>
                    <span className="font-medium">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Build:</span>
                    <span className="font-medium">#1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <Badge variant="success">Production</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server Region:</span>
                    <span className="font-medium">US East</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span className="font-medium">March 1, 2024</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Check for Updates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Debug Mode</div>
                      <div className="text-sm text-muted-foreground">Enable detailed logging</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Performance Monitoring</div>
                      <div className="text-sm text-muted-foreground">Track system performance</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-backup</div>
                      <div className="text-sm text-muted-foreground">Automatic data backup</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Beta Features</div>
                      <div className="text-sm text-muted-foreground">Access experimental features</div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full">
                    Clear Cache
                  </Button>
                  <Button variant="outline" className="w-full">
                    Reset to Defaults
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Factory Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}