import React, { useEffect, useState } from 'react'
import { MetricsCard } from '@/components/dashboard/MetricsCard'
import { GridVisualization } from '@/components/dashboard/GridVisualization'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { useGridStore } from '@/stores/grid'
import AgentControlPanel from '@/components/AgentControlPanel'
import ConversationalAgent from '@/components/ConversationalAgent'
import { WorkflowProgress } from '@/components/WorkflowProgress'
import { TrendingUp, TrendingDown, Zap, Activity, Gauge, DollarSign, AlertTriangle, Leaf } from 'lucide-react'

interface Workflow {
  workflowType: string
  steps: Array<{ step: number; action: string; status: string }>
  results?: any
  status: string
  progress?: number
  currentStep?: string
}

export default function Dashboard() {
  const { 
    nodes, 
    connections, 
    metrics, 
    alerts, 
    isLoading, 
    error,
    refresh, 
    initializeRealTimeUpdates, 
    cleanupRealTimeUpdates 
  } = useGridStore()
  
  const [activeWorkflows, setActiveWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    // Load initial data
    refresh()
    
    // Initialize real-time updates
    initializeRealTimeUpdates()

    // Cleanup on unmount
    return () => {
      cleanupRealTimeUpdates()
    }
  }, [refresh, initializeRealTimeUpdates, cleanupRealTimeUpdates])

  const handleWorkflowStart = (workflow: Workflow) => {
    setActiveWorkflows(prev => [...prev, workflow])
  }

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-secondary-600'
      case 'running': return 'text-accent-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getWorkflowTypeIcon = (type: string) => {
    switch (type) {
      case 'grid_optimization': return <Zap className="w-4 h-4" />
      case 'predictive_maintenance': return <Activity className="w-4 h-4" />
      case 'pattern_analysis': return <TrendingUp className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={refresh}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Smart Grid Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring and control of your power grid
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-secondary-600 dark:text-secondary-400">Live</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Generation"
          value={metrics.totalGeneration}
          unit="MW"
          change={2.5}
          changeType="increase"
          progress={Math.round((metrics.totalGeneration / 2500) * 100)}
          status="good"
          icon={<Zap className="w-4 h-4" />}
        />
        <MetricsCard
          title="Total Load"
          value={metrics.totalLoad}
          unit="MW"
          change={-1.2}
          changeType="decrease"
          progress={Math.round((metrics.totalLoad / 2200) * 100)}
          status="good"
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricsCard
          title="Efficiency"
          value={metrics.efficiency}
          unit="%"
          change={0.8}
          changeType="increase"
          status="good"
          icon={<Gauge className="w-4 h-4" />}
        />
        <MetricsCard
          title="Operating Cost"
          value={metrics.operatingCost}
          unit="$/hr"
          change={-5.2}
          changeType="decrease"
          status="good"
          icon={<DollarSign className="w-4 h-4" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Frequency"
          value={metrics.frequency}
          unit="Hz"
          status="good"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricsCard
          title="Voltage"
          value={metrics.voltage / 1000}
          unit="kV"
          status="good"
          icon={<Zap className="w-4 h-4" />}
        />
        <MetricsCard
          title="CO₂ Emissions"
          value={metrics.co2Emissions}
          unit="kg/hr"
          change={-3.1}
          changeType="decrease"
          status="good"
          icon={<Leaf className="w-4 h-4" />}
        />
        <MetricsCard
          title="Reliability"
          value={metrics.reliability}
          unit="%"
          status="good"
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grid Visualization */}
        <div className="lg:col-span-2">
          <GridVisualization />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Alerts Panel */}
          <AlertsPanel />

          {/* Agent Control Panel */}
          <AgentControlPanel 
            onWorkflowStart={handleWorkflowStart}
            selectedNodeId={null}
          />

          {/* Conversational Agent */}
          <ConversationalAgent onWorkflowStart={handleWorkflowStart} />
        </div>
      </div>

      {/* Performance Chart */}
      <PerformanceChart />

      {/* Active Workflows */}
      {activeWorkflows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Active Workflows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeWorkflows.map((workflow, index) => (
              <WorkflowProgress key={index} workflow={workflow} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
