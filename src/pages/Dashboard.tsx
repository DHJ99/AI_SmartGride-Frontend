import React, { useEffect, useState } from 'react'
import { Zap, Activity, TrendingUp, Gauge, Leaf, DollarSign } from 'lucide-react'
import { MetricsCard } from '@/components/dashboard/MetricsCard'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { GridVisualization } from '@/components/dashboard/GridVisualization'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import ConversationalAgent from '@/components/ConversationalAgent'
import { WorkflowProgress } from '@/components/WorkflowProgress'
import AgentControlPanel from '@/components/AgentControlPanel'
import { useGridStore } from '@/stores/grid'
import { mockNodes, mockConnections, mockMetrics, mockAlerts, generateRealtimeUpdate } from '@/data/mockData'

export default function Dashboard() {
  const { 
    metrics, 
    setNodes, 
    setConnections, 
    updateMetrics, 
    addAlert 
  } = useGridStore()

  const [currentWorkflow, setCurrentWorkflow] = useState(null)

  useEffect(() => {
    // Initialize with mock data
    setNodes(mockNodes)
    setConnections(mockConnections)
    updateMetrics(mockMetrics)
    
    // Add mock alerts
    mockAlerts.forEach(alert => {
      addAlert({
        type: alert.type,
        title: alert.title,
        message: alert.message,
        nodeId: alert.nodeId,
        acknowledged: alert.acknowledged,
        resolved: alert.resolved,
      })
    })

    // Simulate real-time updates
    const interval = setInterval(() => {
      const realtimeData = generateRealtimeUpdate()
      updateMetrics(realtimeData)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [setNodes, setConnections, updateMetrics, addAlert])

  const handleWorkflowStart = (workflow) => {
    setCurrentWorkflow(workflow)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Smart Grid Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time monitoring and control of your electrical grid infrastructure
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricsCard
          title="Total Generation"
          value={metrics.totalGeneration}
          unit="MW"
          change={2.5}
          changeType="increase"
          icon={<Zap className="w-5 h-5 text-primary-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Total Load"
          value={metrics.totalLoad}
          unit="MW"
          change={-1.2}
          changeType="decrease"
          progress={(metrics.totalLoad / metrics.totalGeneration) * 100}
          icon={<Activity className="w-5 h-5 text-secondary-600" />}
          variant="glass"
        />
        <MetricsCard
          title="System Efficiency"
          value={metrics.efficiency}
          unit="%"
          change={0.8}
          changeType="increase"
          status={metrics.efficiency > 90 ? 'good' : metrics.efficiency > 80 ? 'warning' : 'critical'}
          icon={<TrendingUp className="w-5 h-5 text-accent-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Grid Frequency"
          value={metrics.frequency}
          unit="Hz"
          change={0.0}
          changeType="neutral"
          status={Math.abs(metrics.frequency - 50) < 0.1 ? 'good' : 'warning'}
          icon={<Gauge className="w-5 h-5 text-blue-600" />}
          variant="glass"
        />
        <MetricsCard
          title="CO₂ Emissions"
          value={metrics.co2Emissions}
          unit="kg/h"
          change={-3.2}
          changeType="decrease"
          icon={<Leaf className="w-5 h-5 text-green-600" />}
          variant="glass"
        />
        <MetricsCard
          title="Operating Cost"
          value={metrics.operatingCost / 1000}
          unit="k$/h"
          change={1.5}
          changeType="increase"
          icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
          variant="glass"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grid Visualization */}
        <div className="lg:col-span-2">
          <GridVisualization />
        </div>
        
        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 gap-6">
        <PerformanceChart />
      </div>

      {/* AI Agents Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Agents
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Intelligent assistance for grid optimization and analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversational Agent */}
          <div className="lg:col-span-2">
            <ConversationalAgent onWorkflowStart={handleWorkflowStart} />
          </div>

          {/* Agent Control Panel */}
          <div className="lg:col-span-1">
            <AgentControlPanel 
              onWorkflowStart={handleWorkflowStart} 
              selectedNodeId={null} 
            />
          </div>
        </div>

        {/* Workflow Progress */}
        {currentWorkflow && (
          <div className="grid grid-cols-1 gap-6">
            <WorkflowProgress workflow={currentWorkflow} />
          </div>
        )}
      </div>
    </div>
  )
}