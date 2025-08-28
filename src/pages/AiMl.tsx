import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, AlertTriangle, Play, Pause, RefreshCw, Download, Upload, Settings } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '@/lib/utils'

interface MLModel {
  id: string
  name: string
  type: string
  status: 'training' | 'deployed' | 'idle' | 'error'
  accuracy: number
  lastTrained: Date
  predictions: number
  version: string
}

const mlModels: MLModel[] = [
  {
    id: 'lstm-demand',
    name: 'LSTM Demand Forecasting',
    type: 'Time Series',
    status: 'deployed',
    accuracy: 94.2,
    lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    predictions: 15420,
    version: 'v2.1'
  },
  {
    id: 'anomaly-detection',
    name: 'Anomaly Detection',
    type: 'Isolation Forest',
    status: 'deployed',
    accuracy: 91.8,
    lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    predictions: 8930,
    version: 'v1.3'
  },
  {
    id: 'load-prediction',
    name: 'Load Prediction',
    type: 'Random Forest',
    status: 'training',
    accuracy: 89.5,
    lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    predictions: 12340,
    version: 'v1.8'
  },
  {
    id: 'fault-detection',
    name: 'Fault Detection',
    type: 'CNN',
    status: 'idle',
    accuracy: 87.3,
    lastTrained: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    predictions: 5670,
    version: 'v1.0'
  }
]

const predictionData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  actual: 800 + Math.sin(i * 0.5) * 200 + Math.random() * 50,
  predicted: 800 + Math.sin(i * 0.5) * 200 + Math.random() * 30,
  confidence: 0.85 + Math.random() * 0.1
}))

const featureImportance = [
  { feature: 'Historical Load', importance: 0.35 },
  { feature: 'Temperature', importance: 0.22 },
  { feature: 'Day of Week', importance: 0.18 },
  { feature: 'Hour of Day', importance: 0.15 },
  { feature: 'Weather', importance: 0.10 }
]

const trainingMetrics = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  trainLoss: 0.8 - (i * 0.015) + Math.random() * 0.05,
  valLoss: 0.85 - (i * 0.012) + Math.random() * 0.06,
  accuracy: 70 + (i * 0.5) + Math.random() * 2
}))

const anomalyScores = Array.from({ length: 100 }, (_, i) => ({
  timestamp: new Date(Date.now() - (100 - i) * 60 * 60 * 1000),
  score: Math.random() * 0.3 + (i > 80 ? Math.random() * 0.7 : 0),
  threshold: 0.5
}))

export default function AiMl() {
  const [selectedModel, setSelectedModel] = useState<string>('lstm-demand')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'success'
      case 'training': return 'warning'
      case 'error': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <Play className="w-4 h-4" />
      case 'training': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <Pause className="w-4 h-4" />
    }
  }

  const selectedModelData = mlModels.find(m => m.id === selectedModel)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI & Machine Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent models for grid prediction, optimization, and anomaly detection
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import Model</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Train New Model</span>
          </Button>
        </div>
      </div>

      {/* Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mlModels.map((model) => (
          <Card 
            key={model.id} 
            variant="glass" 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedModel === model.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{model.name}</span>
                <Badge variant={getStatusColor(model.status)}>
                  {getStatusIcon(model.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{model.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-medium">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Predictions:</span>
                <span className="font-medium">{formatNumber(model.predictions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">{model.version}</span>
              </div>
              {model.status === 'training' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Training Progress:</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-1" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Details */}
      {selectedModelData && (
        <Tabs defaultValue="predictions" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retrain
              </Button>
            </div>
          </div>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>24-Hour Predictions vs Actual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={predictionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                          <XAxis dataKey="hour" stroke="rgba(156, 163, 175, 0.5)" />
                          <YAxis stroke="rgba(156, 163, 175, 0.5)" tickFormatter={(value) => `${value} MW`} />
                          <Tooltip 
                            formatter={(value: number, name: string) => [
                              `${formatNumber(value, 1)} MW`,
                              name === 'actual' ? 'Actual Load' : 'Predicted Load'
                            ]}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(156, 163, 175, 0.2)',
                              borderRadius: '8px',
                              backdropFilter: 'blur(8px)',
                            }}
                          />
                          <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="predicted" stroke="#2563EB" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-sm">Model Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-medium">{selectedModelData.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>MAE:</span>
                      <span className="font-medium">12.3 MW</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>RMSE:</span>
                      <span className="font-medium">18.7 MW</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>R² Score:</span>
                      <span className="font-medium">0.942</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Predictions:</span>
                      <span className="font-medium">{formatNumber(selectedModelData.predictions)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Response Time:</span>
                      <span className="font-medium">23ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Updated:</span>
                      <span className="font-medium">
                        {selectedModelData.lastTrained.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Detailed Metrics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Training Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trainingMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                        <XAxis dataKey="epoch" stroke="rgba(156, 163, 175, 0.5)" />
                        <YAxis stroke="rgba(156, 163, 175, 0.5)" />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            formatNumber(value, 3),
                            name === 'trainLoss' ? 'Training Loss' : 
                            name === 'valLoss' ? 'Validation Loss' : 'Accuracy'
                          ]}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(156, 163, 175, 0.2)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(8px)',
                          }}
                        />
                        <Line type="monotone" dataKey="trainLoss" stroke="#EF4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="valLoss" stroke="#F59E0B" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Training Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Algorithm:</span>
                      <span className="font-medium">{selectedModelData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training Data:</span>
                      <span className="font-medium">30 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Validation Split:</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch Size:</span>
                      <span className="font-medium">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Learning Rate:</span>
                      <span className="font-medium">0.001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Epochs:</span>
                      <span className="font-medium">100</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Epoch:</span>
                        <span className="font-medium">67/100</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Pause Training
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full">
                      Stop Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Feature Importance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportance} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                        <XAxis type="number" stroke="rgba(156, 163, 175, 0.5)" />
                        <YAxis dataKey="feature" type="category" stroke="rgba(156, 163, 175, 0.5)" width={100} />
                        <Tooltip 
                          formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(156, 163, 175, 0.2)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(8px)',
                          }}
                        />
                        <Bar dataKey="importance" fill="#2563EB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Feature Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featureImportance.map((feature, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{feature.feature}</span>
                          <span className="text-sm text-muted-foreground">
                            {(feature.importance * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${feature.importance * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t mt-6">
                    <h4 className="font-medium mb-3">Data Quality Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completeness:</span>
                        <span className="font-medium">98.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Consistency:</span>
                        <span className="font-medium">96.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="font-medium">94.8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Anomaly Detection Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={anomalyScores}>
                      <defs>
                        <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit' })}
                        stroke="rgba(156, 163, 175, 0.5)"
                      />
                      <YAxis stroke="rgba(156, 163, 175, 0.5)" />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: number, name: string) => [
                          formatNumber(value, 3),
                          name === 'score' ? 'Anomaly Score' : 'Threshold'
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(156, 163, 175, 0.2)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fill="url(#colorAnomaly)"
                      />
                      <Line
                        type="monotone"
                        dataKey="threshold"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}