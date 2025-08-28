import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, RotateCcw, Save, Upload, Copy } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '@/lib/utils'

interface Scenario {
  id: string
  name: string
  description: string
  parameters: {
    loadIncrease: number
    renewableShare: number
    storageCapacity: number
    demandResponse: number
  }
  results?: {
    cost: number
    emissions: number
    reliability: number
    efficiency: number
  }
}

const scenarios: Scenario[] = [
  {
    id: 'baseline',
    name: 'Current Baseline',
    description: 'Current grid configuration and parameters',
    parameters: {
      loadIncrease: 0,
      renewableShare: 25,
      storageCapacity: 100,
      demandResponse: 10
    },
    results: {
      cost: 25000,
      emissions: 450,
      reliability: 97.2,
      efficiency: 89.5
    }
  },
  {
    id: 'high-renewable',
    name: 'High Renewable',
    description: 'Increased renewable energy integration',
    parameters: {
      loadIncrease: 5,
      renewableShare: 60,
      storageCapacity: 300,
      demandResponse: 25
    },
    results: {
      cost: 22000,
      emissions: 280,
      reliability: 98.1,
      efficiency: 92.3
    }
  },
  {
    id: 'peak-demand',
    name: 'Peak Demand Scenario',
    description: 'High load growth with current infrastructure',
    parameters: {
      loadIncrease: 25,
      renewableShare: 25,
      storageCapacity: 100,
      demandResponse: 10
    },
    results: {
      cost: 32000,
      emissions: 580,
      reliability: 94.8,
      efficiency: 85.2
    }
  }
]

const timelineData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  baseline: 800 + Math.sin(i * 0.5) * 200,
  highRenewable: 800 + Math.sin(i * 0.5) * 150 + Math.random() * 50,
  peakDemand: 1000 + Math.sin(i * 0.5) * 250
}))

const comparisonData = [
  { metric: 'Operating Cost', baseline: 25000, highRenewable: 22000, peakDemand: 32000, unit: '$/h' },
  { metric: 'CO₂ Emissions', baseline: 450, highRenewable: 280, peakDemand: 580, unit: 'kg/h' },
  { metric: 'Reliability', baseline: 97.2, highRenewable: 98.1, peakDemand: 94.8, unit: '%' },
  { metric: 'Efficiency', baseline: 89.5, highRenewable: 92.3, peakDemand: 85.2, unit: '%' }
]

export default function Simulation() {
  const [selectedScenario, setSelectedScenario] = useState<string>('baseline')
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [customScenario, setCustomScenario] = useState<Scenario>({
    id: 'custom',
    name: 'Custom Scenario',
    description: 'User-defined simulation parameters',
    parameters: {
      loadIncrease: 10,
      renewableShare: 40,
      storageCapacity: 200,
      demandResponse: 15
    }
  })

  const handleStartSimulation = () => {
    setIsSimulating(true)
    setSimulationProgress(0)
    
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSimulating(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  const handleStopSimulation = () => {
    setIsSimulating(false)
    setSimulationProgress(0)
  }

  const handleParameterChange = (parameter: keyof Scenario['parameters'], value: number) => {
    setCustomScenario(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parameter]: value
      }
    }))
  }

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario) || customScenario

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grid Simulation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scenario modeling and what-if analysis for grid planning
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Scenario</span>
          </Button>
          {!isSimulating ? (
            <Button onClick={handleStartSimulation} className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Run Simulation</span>
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleStopSimulation} className="flex items-center space-x-2">
              <Pause className="w-4 h-4" />
              <span>Stop</span>
            </Button>
          )}
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            variant="glass" 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedScenario === scenario.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{scenario.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{scenario.description}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Load Growth:</span>
                  <span className="font-medium">+{scenario.parameters.loadIncrease}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Renewables:</span>
                  <span className="font-medium">{scenario.parameters.renewableShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="font-medium">{scenario.parameters.storageCapacity} MWh</span>
                </div>
              </div>
              {scenario.results && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span>Cost:</span>
                    <span className="font-medium">${formatNumber(scenario.results.cost)}/h</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simulation Interface */}
      <Tabs defaultValue="parameters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parameter Controls */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Simulation Parameters</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Scenario Name</Label>
                  <Input 
                    value={selectedScenarioData.name} 
                    onChange={(e) => setCustomScenario(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Load Growth</Label>
                      <span className="text-sm font-medium">+{selectedScenarioData.parameters.loadIncrease}%</span>
                    </div>
                    <Slider
                      value={[selectedScenarioData.parameters.loadIncrease]}
                      onValueChange={([value]) => handleParameterChange('loadIncrease', value)}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Renewable Share</Label>
                      <span className="text-sm font-medium">{selectedScenarioData.parameters.renewableShare}%</span>
                    </div>
                    <Slider
                      value={[selectedScenarioData.parameters.renewableShare]}
                      onValueChange={([value]) => handleParameterChange('renewableShare', value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Storage Capacity</Label>
                      <span className="text-sm font-medium">{selectedScenarioData.parameters.storageCapacity} MWh</span>
                    </div>
                    <Slider
                      value={[selectedScenarioData.parameters.storageCapacity]}
                      onValueChange={([value]) => handleParameterChange('storageCapacity', value)}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Demand Response</Label>
                      <span className="text-sm font-medium">{selectedScenarioData.parameters.demandResponse}%</span>
                    </div>
                    <Slider
                      value={[selectedScenarioData.parameters.demandResponse]}
                      onValueChange={([value]) => handleParameterChange('demandResponse', value)}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Status */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Simulation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSimulating ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium">{Math.round(simulationProgress)}%</span>
                    </div>
                    <Progress value={simulationProgress} className="h-3" />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Step:</span>
                        <span className="font-medium">
                          {simulationProgress < 25 ? 'Initializing' :
                           simulationProgress < 50 ? 'Load Flow Analysis' :
                           simulationProgress < 75 ? 'Optimization' : 'Results Generation'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Elapsed Time:</span>
                        <span className="font-medium">{Math.round(simulationProgress * 0.3)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Remaining:</span>
                        <span className="font-medium">{Math.round((100 - simulationProgress) * 0.3)}s</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ready to simulate
                      </p>
                      <p className="text-xs text-m uted-foreground">
                        Adjust parameters and click "Run Simulation"
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Simulation Type:</span>
                        <span className="font-medium">Monte Carlo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Horizon:</span>
                        <span className="font-medium">24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolution:</span>
                        <span className="font-medium">1 hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Iterations:</span>
                        <span className="font-medium">1000</span>
                      </div>
                    </div>
                  </div>
                )}

                {simulationProgress === 100 && !isSimulating && (
                  <div className="p-4 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                    <div className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Simulation Complete!
                    </div>
                    <div className="text-xs text-secondary-600 dark:text-secondary-400">
                      Results are available in the Results tab
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>24-Hour Timeline Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRenewable" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="hour" stroke="rgba(156, 163, 175, 0.5)" />
                    <YAxis stroke="rgba(156, 163, 175, 0.5)" tickFormatter={(value) => `${value} MW`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${formatNumber(value, 1)} MW`,
                        name === 'baseline' ? 'Baseline' :
                        name === 'highRenewable' ? 'High Renewable' : 'Peak Demand'
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(156, 163, 175, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                    <Area type="monotone" dataKey="baseline" stroke="#6B7280" strokeWidth={2} fill="url(#colorBaseline)" />
                    <Area type="monotone" dataKey="highRenewable" stroke="#10B981" strokeWidth={2} fill="url(#colorRenewable)" />
                    <Area type="monotone" dataKey="peakDemand" stroke="#EF4444" strokeWidth={2} fill="url(#colorPeak)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Operating Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-600">
                  ${formatNumber(selectedScenarioData.results?.cost || 0)}
                </div>
                <div className="text-xs text-muted-foreground">per hour</div>
                <div className="mt-2 text-xs">
                  <Badge variant="success">-12% vs baseline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">CO₂ Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-600">
                  {formatNumber(selectedScenarioData.results?.emissions || 0)}
                </div>
                <div className="text-xs text-muted-foreground">kg/hour</div>
                <div className="mt-2 text-xs">
                  <Badge variant="success">-38% vs baseline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-600">
                  {formatNumber(selectedScenarioData.results?.reliability || 0, 1)}%
                </div>
                <div className="text-xs text-muted-foreground">uptime</div>
                <div className="mt-2 text-xs">
                  <Badge variant="success">+0.9% vs baseline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(selectedScenarioData.results?.efficiency || 0, 1)}%
                </div>
                <div className="text-xs text-muted-foreground">system efficiency</div>
                <div className="mt-2 text-xs">
                  <Badge variant="success">+2.8% vs baseline</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="metric" stroke="rgba(156, 163, 175, 0.5)" />
                    <YAxis stroke="rgba(156, 163, 175, 0.5)" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${formatNumber(value, 1)}`,
                        name === 'baseline' ? 'Baseline' :
                        name === 'highRenewable' ? 'High Renewable' : 'Peak Demand'
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(156, 163, 175, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                    <Bar dataKey="baseline" fill="#6B7280" name="baseline" />
                    <Bar dataKey="highRenewable" fill="#10B981" name="highRenewable" />
                    <Bar dataKey="peakDemand" fill="#EF4444" name="peakDemand" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}