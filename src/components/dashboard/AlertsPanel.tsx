import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BadgeAlert as Alert, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react'
import { useGridStore } from '@/stores/grid'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export function AlertsPanel() {
  const { alerts, acknowledgeAlert, resolveAlert } = useGridStore()
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-accent-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      default: return <Alert className="w-4 h-4 text-gray-500" />
    }
  }

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'error'
      case 'error': return 'error'
      case 'warning': return 'warning'
      case 'info': return 'secondary'
      default: return 'outline'
    }
  }

  const activeAlerts = alerts.filter(alert => !alert.resolved)
  const recentAlerts = activeAlerts.slice(0, 5)

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Alert className="w-5 h-5" />
            <span>Recent Alerts</span>
          </span>
          <Badge variant={activeAlerts.length > 0 ? 'error' : 'success'}>
            {activeAlerts.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-secondary-500 mb-2" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
            <p className="text-xs text-muted-foreground">System is running smoothly</p>
          </div>
        ) : (
          recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                alert.acknowledged 
                  ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700" 
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              )}
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getAlertIcon(alert.type)}
                    <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {alert.title}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                    <div className="flex items-center space-x-1">
                      {!alert.acknowledged && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Acknowledge
                        </Button>
                      )}
                      {alert.acknowledged && !alert.resolved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {activeAlerts.length > 5 && (
          <Button variant="outline" className="w-full" size="sm">
            View All Alerts ({activeAlerts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}