import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Pause, RotateCcw, Settings, Zap, Brain, Cpu, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { formatNumber } from '@/lib/utils'

interface OptimizationResult {
  algorithm: string
  objective: number
  constraints: number
  executionTime: number
  iterations: number
  convergence: number
  improvement: number
}

const optimizationResults: OptimizationResult[] = [
  {
    algorithm: 'Classical Linear',
    objective: 24500,
    constraints: 12,
    executionTime: 2.3,
    iterations: 45,
    convergence: 98.5,
    improvement: 12.3
  },
  {
    algorithm: 'Quantum QAOA',
    objective: 23800,
    constraints: 12,
    executionTime: 8.7,
    iterations: 100,
    convergence: 96.2,
    improvement: 15.1
  },
  {
    algorithm: 'Hybrid Classical-Quantum',
    objective: 23200,
    constraints: 12,
    executionTime: 5.4,
    iterations: 75,
    convergence: 99.1,
    improvement: 18.7
  }
]

const convergenceData = Array.from({ length: 100 }, (_, i) => ({
  iteration: i + 1,
  classical: 24500 - (i * 200) + Math.random() * 100,
  quantum: 23800 - (i * 180) + Math.random() * 120,
  hybrid: 23200 - (i * 160) + Math.random() * 80
}))

const parameterData = [
  { parameter: 'Load Balance', current: 85, optimized: 95, max: 100 },
  { parameter: 'Efficiency', current: 89, optimized: 94, max: 100 },
  { parameter: 'Cost Reduction', current: 12, optimized: 18, max: 25 },
  { parameter: 'Reliability', current: 97, optimized: 99, max: 100 },
  { parameter: 'Emissions', current: 45, optimized: 8, max: 30 },
]

const scenarioComparison = [
  { scenario: 'Current State', cost: 25000, efficiency: 89, emissions: 450, reliability: 97 },
  { scenario: 'Classical Opt.', cost: 22000, efficiency: 92, emissions: 420, reliability: 98 },
  { scenario: 'Quantum Opt.', cost: 21200, efficiency: 94, emissions: 380, reliability: 99 },
  { scenario: 'Hybrid Opt.', cost: 20300, efficiency: 95, emissions: 360, reliability: 99.5 },
]

export default function Optimization() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('hybrid')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [parameters, setParameters] = useState({
    loadWeight: 0.3,
    costWeight: 0.4,
    emissionWeight: 0.2,
    reliabilityWeight: 0.1
  })

  const handleStartOptimization = () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsOptimizing(false)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 500)
  }

  const handleStopOptimization = () => {
    setIsOptimizing(false)
    setOptimizationProgress(0)
  }

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'classical': return <Cpu className="w-4 h-4" />
      case 'quantum': return <Brain className="w-4 h-4" />
      case 'hybrid': return <Zap className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grid Optimization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quantum and classical optimization for smart grid management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isOptimizing ? (
            <Button onClick={handleStartOptimization} className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Start Optimization</span>
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleStopOptimization} className="flex items-center space-x-2">
              <Pause className="w-4 h-4" />
              <span>Stop</span>
            </Button>
          )}
          <Button variant="outline" className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Algorithm Selection and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm">Algorithm Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classical">Classical Linear Programming</SelectItem>
                <SelectItem value="quantum">Quantum QAOA</SelectItem>
                <SelectItem value="hybrid">Hybrid Classical-Quantum</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Complexity:</span>
                <Badge variant={selectedAlgorithm === 'quantum' ? 'warning' : 'secondary'}>
                  {selectedAlgorithm === 'classical' ? 'Low' : 
                   selectedAlgorithm === 'quantum' ? 'High' : 'Medium'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Expected Time:</span>
                <span className="font-medium">
                  {selectedAlgorithm === 'classical' ? '2-5 min' : 
                   selectedAlgorithm === 'quantum' ? '8-15 min' : '5-10 min'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Quantum Advantage:</span>
                <span className="font-medium">
                  {selectedAlgorithm === 'classical' ? 'None' : 
                   selectedAlgorithm === 'quantum' ? 'High' : 'Medium'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm">Optimization Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress:</span>
                <span className="font-medium">{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
            </div>
            
            {isOptimizing && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Iteration:</span>
                  <span className="font-medium">{Math.round(optimizationProgress * 0.75)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Objective:</span>
                  <span className="font-medium">
                    ${formatNumber(25000 - (optimizationProgress * 50))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Convergence:</span>
                  <span className="font-medium">{formatNumber(optimizationProgress * 0.95, 1)}%</span>
                </div>
              </div>
            )}
            
            {!isOptimizing && optimizationProgress === 100 && (
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                <div className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Optimization Complete!
                </div>
                <div className="text-xs text-secondary-600 dark:text-secondary-400">
                  18.7% improvement achieved
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-sm">Objective Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <Label>Load Balance</Label>
                  <span>{Math.round(parameters.loadWeight * 100)}%</span>
                </div>
                <Slider
                  value={[parameters.loadWeight * 100]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, loadWeight: value / 100 }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <Label>Cost Minimization</Label>
                  <span>{Math.round(parameters.costWeight * 100)}%</span>
                </div>
                <Slider
                  value={[parameters.costWeight * 100]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, costWeight: value / 100 }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <Label>Emission Reduction</Label>
                  <span>{Math.round(parameters.emissionWeight * 100)}%</span>
                </div>
                <Slider
                  value={[parameters.emissionWeight * 100]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, emissionWeight: value / 100 }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <Label>Reliability</Label>
                  <span>{Math.round(parameters.reliabilityWeight * 100)}%</span>
                </div>
                <Slider
                  value={[parameters.reliabilityWeight * 100]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, reliabilityWeight: value / 100 }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results and Analysis */}
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="convergence">Convergence</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {optimizationResults.map((result, index) => (
              <Card key={index} variant="glass" className={result.algorithm.includes('Hybrid') ? 'ring-2 ring-primary-500' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      {getAlgorithmIcon(result.algorithm.toLowerCase().split(' ')[0])}
                      <span>{result.algorithm}</span>
                    </span>
                    {result.algorithm.includes('Hybrid') && (
                      <Badge variant="success">Best</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Objective Value:</span>
                    <span className="font-medium">${formatNumber(result.objective)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Execution Time:</span>
                    <span className="font-medium">{result.executionTime}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Iterations:</span>
                    <span className="font-medium">{result.iterations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Convergence:</span>
                    <span className="font-medium">{result.convergence}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Improvement:</span>
                    <span className="font-medium text-secondary-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {result.improvement}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="convergence" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Algorithm Convergence Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={convergenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="iteration" stroke="rgba(156, 163, 175, 0.5)" />
                    <YAxis stroke="rgba(156, 163, 175, 0.5)" tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${formatNumber(value)}`,
                        name === 'classical' ? 'Classical' : 
                        name === 'quantum' ? 'Quantum QAOA' : 'Hybrid'
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(156, 163, 175, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                    <Line type="monotone" dataKey="classical" stroke="#6B7280" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="quantum" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="hybrid" stroke="#2563EB" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="scenario" stroke="rgba(156, 163, 175, 0.5)" />
                    <YAxis stroke="rgba(156, 163, 175, 0.5)" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'cost' ? `$${formatNumber(value)}` :
                        name === 'emissions' ? `${value} kg/h` :
                        `${value}%`,
                        name === 'cost' ? 'Operating Cost' :
                        name === 'efficiency' ? 'Efficiency' :
                        name === 'emissions' ? 'CO₂ Emissions' : 'Reliability'
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(156, 163, 175, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                    <Bar dataKey="cost" fill="#EF4444" name="cost" />
                    <Bar dataKey="efficiency" fill="#10B981" name="efficiency" />
                    <Bar dataKey="reliability" fill="#2563EB" name="reliability" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Parameter Optimization Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {parameterData.map((param, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{param.parameter}</span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">
                          Current: {param.current}{param.parameter === 'Emissions' ? ' kg/h' : '%'}
                        </span>
                        <span className="font-medium text-secondary-600">
                          Optimized: {param.optimized}{param.parameter === 'Emissions' ? ' kg/h' : '%'}
                        </span>
                        {param.current < param.optimized && param.parameter !== 'Emissions' ? (
                          <TrendingUp className="w-4 h-4 text-secondary-500" />
                        ) : param.current > param.optimized ? (
                          <TrendingDown className="w-4 h-4 text-secondary-500" />
                        ) : null}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gray-400 h-3 rounded-full"
                          style={{ width: `${(param.current / param.max) * 100}%` }}
                        />
                        <div 
                          className="bg-secondary-500 h-3 rounded-full absolute top-0"
                          style={{ width: `${(param.optimized / param.max) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0{param.parameter === 'Emissions' ? ' kg/h' : '%'}</span>
                      <span>{param.max}{param.parameter === 'Emissions' ? ' kg/h' : '%'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}