import React, { useState } from 'react'
import { Bell, Search, Settings, User, Moon, Sun, Monitor, Shield, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useThemeStore } from '@/stores/theme'
import { useAuth } from '@/contexts/AuthContext'
import { useGridStore } from '@/stores/grid'
import { useNavigate } from 'react-router-dom'
import { NotificationPanel } from '@/components/layout/NotificationPanel'
import { logSecurityEvent } from '@/utils/securityLogger'

export function Header() {
  const { theme, setTheme } = useThemeStore()
  const { user, logout } = useAuth()
  const { alerts } = useGridStore()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const unreadAlerts = alerts.filter(alert => !alert.acknowledged).length

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const handleLogout = () => {
    logSecurityEvent('user_logout', { userId: user?.id });
    logout();
    setShowUserMenu(false);
  }

  const getSecurityStatus = () => {
    // Mock security status calculation
    const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length;
    if (criticalAlerts > 0) return { status: 'critical', color: 'bg-red-500' };
    if (unreadAlerts > 5) return { status: 'warning', color: 'bg-accent-500' };
    return { status: 'secure', color: 'bg-secondary-500' };
  }

  const securityStatus = getSecurityStatus();
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <>
      <header className="h-16 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              SmartGrid Optimizer
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search nodes, alerts, or metrics..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Security Status */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${securityStatus.color}`}></div>
              <span className="text-xs font-medium capitalize">{securityStatus.status}</span>
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadAlerts > 99 ? '99+' : unreadAlerts}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={cycleTheme}>
              <ThemeIcon className="w-5 h-5" />
            </Button>

            {/* Security Dashboard (Admin Only) */}
            {user?.role === 'admin' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/security')}
                title="Security Dashboard"
              >
                <Shield className="w-5 h-5" />
              </Button>
            )}

            {/* Settings */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* User Profile */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 px-3"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xs">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:block">{user?.name}</span>
              </Button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}