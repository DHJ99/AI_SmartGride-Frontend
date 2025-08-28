import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Zap, 
  TrendingUp, 
  Settings, 
  Brain, 
  Play, 
  FileText,
  Network,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'operator', 'analyst', 'viewer'] },
  { name: 'Grid Topology', href: '/grid-topology', icon: Network, roles: ['admin', 'operator', 'analyst', 'viewer'] },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, roles: ['admin', 'operator', 'analyst', 'viewer'] },
  { name: 'Optimization', href: '/optimization', icon: Zap, roles: ['admin', 'operator'] },
  { name: 'AI & ML', href: '/ai-ml', icon: Brain, roles: ['admin', 'analyst'] },
  { name: 'AI Agents', href: '/ai-agents', icon: Bot, roles: ['admin', 'analyst'] },
  { name: 'Simulation', href: '/simulation', icon: Play, roles: ['admin', 'operator'] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: ['admin', 'operator', 'analyst', 'viewer'] },
  { name: 'Security', href: '/security', icon: Shield, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'operator', 'analyst', 'viewer'] },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, hasRole } = useAuth()

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  )

  return (
    <div className={cn(
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-8 h-8"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative",
                isActive
                  ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )
            }
          >
            <item.icon className={cn("flex-shrink-0 w-5 h-5", collapsed ? "" : "mr-3")} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span>{item.name}</span>
                {item.name === 'Security' && user?.role === 'admin' && (
                  <Badge variant="outline" className="text-xs">
                    Admin
                  </Badge>
                )}
                {(item.name === 'Optimization' || item.name === 'Simulation') && hasRole('operator') && (
                  <Badge variant="outline" className="text-xs">
                    Op+
                  </Badge>
                )}
                {(item.name === 'AI & ML' || item.name === 'AI Agents') && hasRole('analyst') && (
                  <Badge variant="outline" className="text-xs">
                    Analyst+
                  </Badge>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status Indicator */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse-glow"></div>
            <div className="text-sm">
              <p className="text-gray-600 dark:text-gray-400">System Status</p>
              <p className="font-semibold text-secondary-600 dark:text-secondary-400">Operational</p>
            </div>
          </div>
          
          {user && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  Logged in as {user.role}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}