import React from 'react'
import { X, CheckCircle, AlertTriangle, Info, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGridStore } from '@/stores/grid'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { alerts, acknowledgeAlert, resolveAlert } = useGridStore()

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-accent-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-red-500'
      case 'error': return 'border-l-red-400'
      case 'warning': return 'border-l-accent-500'
      case 'info': return 'border-l-blue-500'
      default: return 'border-l-gray-400'
    }
  }

  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by priority first, then by timestamp
    const priorityOrder = { critical: 4, error: 3, warning: 2, info: 1 }
    const aPriority = priorityOrder[a.type as keyof typeof priorityOrder] || 0
    const bPriority = priorityOrder[b.type as keyof typeof priorityOrder] || 0
    
    if (aPriority !== bPriority) return bPriority - aPriority
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const unreadCount = alerts.filter(alert => !alert.acknowledged).length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-l shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800/50">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alerts.forEach(alert => !alert.acknowledged && acknowledgeAlert(alert.id))}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alerts.forEach(alert => !alert.resolved && resolveAlert(alert.id))}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {sortedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <CheckCircle className="w-12 h-12 text-secondary-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                All caught up!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No new notifications to show
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 border-l-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    getPriorityColor(alert.type),
                    !alert.acknowledged && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </p>
                        <Badge 
                          variant={alert.type === 'critical' || alert.type === 'error' ? 'destructive' : 
                                  alert.type === 'warning' ? 'warning' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </span>
                        <div className="flex space-x-1">
                          {!alert.acknowledged && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                              className="h-6 px-2 text-xs"
                            >
                              Mark Read
                            </Button>
                          )}
                          {!alert.resolved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                              className="h-6 px-2 text-xs"
                            >
                              Dismiss
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}