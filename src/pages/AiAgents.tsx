import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Zap, Brain, Cpu, Activity, TrendingUp, Settings } from 'lucide-react'
import ConversationalAgent from '@/components/ConversationalAgent'
import { WorkflowProgress } from '@/components/WorkflowProgress'
import AgentControlPanel from '@/components/AgentControlPanel'

interface AgentStats {
  totalInteractions: number
  successfulWorkflows: number
  averageResponseTime: number
  activeWorkflows: number
}

const agentStats: AgentStats = {
  totalInteractions: 1247,
  successfulWorkflows: 89,
  averageResponseTime: 2.3,
  activeWorkflows: 3
}

const recentWorkflows = [
  {
    id: 'wf-001',
    type: 'grid_optimization',
    status: 'completed',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: '15m 32s',
    improvement: 12.5
  },
  {
    id: 'wf-002',
    type: 'predictive_maintenance',
    status: 'running',
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    duration: '5m 12s',
    improvement: null
  },
  {
    id: 'wf-003',
    type: 'pattern_analysis',
    status: 'completed',
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    duration: '8m 45s',
    improvement: 8.2
  }
]

export default function AiAgents() {
  const [currentWorkflow, setCurrentWorkflow] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')

  const handleWorkflowStart = (workflow) => {
    setCurrentWorkflow(workflow)
  }

  const getWorkflowStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'running': return 'warning'
      case 'failed': return 'destructive'
      default: return 'secondary'
    }
  }

  const getWorkflowTypeIcon = (type) => {
    switch (type) {
      case 'grid_optimization': return <Zap className="w-4 h-4" />
      case 'predictive_maintenance': return <Cpu className="w-4 h-4" />
      case 'pattern_analysis': return <TrendingUp className="w-4 h-4" />
      default: return <Bot className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Agents
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent AI assistants for grid optimization, maintenance, and analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Agent Settings</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Train Agents</span>
          </Button>
        </div>
      </div>

      {/* Agent Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
                <p className="text-2xl font-bold">{agentStats.totalInteractions.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful Workflows</p>
                <p className="text-2xl font-bold">{agentStats.successfulWorkflows}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{agentStats.averageResponseTime}s</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">{agentStats.activeWorkflows}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Agent Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Conversational Agent</TabsTrigger>
          <TabsTrigger value="control">Control Panel</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ConversationalAgent onWorkflowStart={handleWorkflowStart} />
            </div>
            <div className="lg:col-span-1">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('control')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Grid Optimization
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('control')}
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    Predictive Maintenance
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('control')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Pattern Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="control" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgentControlPanel 
              onWorkflowStart={handleWorkflowStart} 
              selectedNodeId={selectedNodeId} 
            />
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-sm">Node Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Select a specific node to target agent actions, or leave empty for grid-wide operations.
                </p>
                <div className="space-y-2">
                  {['Generator-01', 'Substation-A', 'Transformer-B', 'Load-Center'].map((node) => (
                    <Button
                      key={node}
                      variant={selectedNodeId === node ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedNodeId(selectedNodeId === node ? null : node)}
                    >
                      {node}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Workflows */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-sm">Recent Workflows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentWorkflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getWorkflowTypeIcon(workflow.type)}
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {workflow.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {workflow.startedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getWorkflowStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                      {workflow.improvement && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{workflow.improvement}% improvement
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Current Workflow Progress */}
            <div>
              {currentWorkflow ? (
                <WorkflowProgress workflow={currentWorkflow} />
              ) : (
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-sm">No Active Workflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Start a new workflow using the conversational agent or control panel.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
