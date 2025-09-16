import React from 'react';
import { Activity, BarChart3, Settings, AlertTriangle, Zap, Wrench } from 'lucide-react';
import { useAIAgentsStore } from '../../stores/aiAgentsStore';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle } from '../ui/Card';

export const QuickActions: React.FC = () => {
  const { activeAgentId, executeQuickAction } = useAIAgentsStore();

  const quickActions = [
    {
      id: 'system-status',
      label: 'System Status',
      icon: Activity,
      action: 'system_status',
      category: 'status' as const,
      description: 'Get current grid system status',
    },
    {
      id: 'performance-metrics',
      label: 'Performance Metrics',
      icon: BarChart3,
      action: 'performance_metrics',
      category: 'analysis' as const,
      description: 'View key performance indicators',
    },
    {
      id: 'efficiency-analysis',
      label: 'Efficiency Analysis',
      icon: Zap,
      action: 'efficiency_analysis',
      category: 'analysis' as const,
      description: 'Analyze grid efficiency trends',
    },
    {
      id: 'maintenance-alerts',
      label: 'Maintenance Alerts',
      icon: Wrench,
      action: 'maintenance_alerts',
      category: 'status' as const,
      description: 'Check maintenance notifications',
    },
    {
      id: 'security-overview',
      label: 'Security Overview',
      icon: AlertTriangle,
      action: 'security_overview',
      category: 'status' as const,
      description: 'Review security status',
    },
    {
      id: 'optimization-suggestions',
      label: 'Optimization Tips',
      icon: Settings,
      action: 'optimization_suggestions',
      category: 'control' as const,
      description: 'Get optimization recommendations',
    },
  ];

  const handleQuickAction = (action: any) => {
    if (!activeAgentId) return;
    executeQuickAction(action);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              onClick={() => handleQuickAction(action)}
              disabled={!activeAgentId}
              className="h-auto p-3 flex flex-col items-center space-y-2 text-center"
            >
              <Icon size={20} className="text-blue-600" />
              <div>
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      {!activeAgentId && (
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
          Select an AI assistant to use quick actions
        </div>
      )}
    </Card>
  );
};