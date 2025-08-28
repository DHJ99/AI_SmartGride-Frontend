import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

interface MetricsCardProps {
  title: string
  value: number
  unit: string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  progress?: number
  status?: 'good' | 'warning' | 'critical'
  icon?: React.ReactNode
  variant?: 'default' | 'glass'
  className?: string
}

export function MetricsCard({
  title,
  value,
  unit,
  change,
  changeType,
  progress,
  status = 'good',
  icon,
  variant = 'default',
  className
}: MetricsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-secondary-600 dark:text-secondary-400'
      case 'warning': return 'text-accent-600 dark:text-accent-400'
      case 'critical': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getProgressVariant = () => {
    switch (status) {
      case 'good': return 'success'
      case 'warning': return 'warning'
      case 'critical': return 'error'
      default: return 'default'
    }
  }

  const getTrendIcon = () => {
    if (!change) return null
    
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-secondary-500" />
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Card variant={variant} className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("p-2 rounded-lg", {
            'bg-secondary-100 dark:bg-secondary-900/30': status === 'good',
            'bg-accent-100 dark:bg-accent-900/30': status === 'warning',
            'bg-red-100 dark:bg-red-900/30': status === 'critical',
          })}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn("text-2xl font-bold", getStatusColor())}>
            {formatNumber(value)}
          </div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1 mt-1">
            {getTrendIcon()}
            <span className={cn("text-xs", {
              'text-secondary-600': changeType === 'increase',
              'text-red-600': changeType === 'decrease',
              'text-gray-600': changeType === 'neutral',
            })}>
              {change > 0 ? '+' : ''}{formatNumber(change, 1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last hour</span>
          </div>
        )}

        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Utilization</span>
              <span>{formatNumber(progress)}%</span>
            </div>
            <Progress value={progress} variant={getProgressVariant()} className="h-2" />
          </div>
        )}

        {status === 'warning' && (
          <Badge variant="warning" className="mt-2 text-xs">
            Attention Required
          </Badge>
        )}
        
        {status === 'critical' && (
          <Badge variant="error" className="mt-2 text-xs">
            Critical Alert
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}