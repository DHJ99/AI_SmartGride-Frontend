import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, Filter, Layers, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { useGridStore } from '@/stores/grid'

interface ViewState {
  zoom: number
  panX: number
  panY: number
}

interface LayerVisibility {
  generators: boolean
  loads: boolean
  substations: boolean
  transformers: boolean
  connections: boolean
  labels: boolean
}

interface GridNode {
  id: string
  name: string
  type: string
  status: string
  x: number
  y: number
  capacity: number
  currentLoad: number
  voltage: number
  frequency: number
  temperature?: number
  efficiency?: number
}

interface GridConnection {
  id: string
  from: string
  to: string
  capacity: number
  currentFlow: number
  status: string
}

export default function GridTopology() {
  const { nodes, connections, selectedNode, selectNode } = useGridStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const [viewState, setViewState] = useState<ViewState>({ zoom: 1, panX: 0, panY: 0 })
  const [layers, setLayers] = useState<LayerVisibility>({
    generators: true,
    loads: true,
    substations: true,
    transformers: true,
    connections: true,
    labels: true
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNodeType, setSelectedNodeType] = useState<string>('all')
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false)

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedNodeType === 'all' || node.type === selectedNodeType
    return matchesSearch && matchesType
  })

  const getNodeColor = (node: GridNode) => {
    switch (node.status) {
      case 'online': return '#10B981'
      case 'warning': return '#F59E0B'
      case 'offline': return '#EF4444'
      case 'maintenance': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'generator': return '#10B981'
      case 'load': return '#3B82F6'
      case 'substation': return '#F59E0B'
      case 'transformer': return '#8B5CF6'
      default: return '#6B7280'
    }
  }

  const renderNode = (node: GridNode) => {
    if (!layers[node.type as keyof LayerVisibility]) return null
    
    const color = getNodeColor(node)
    const typeColor = getNodeTypeColor(node.type)
    const isSelected = selectedNode === node.id
    const size = isSelected ? 16 : 12
    const x = node.x * viewState.zoom + viewState.panX
    const y = node.y * viewState.zoom + viewState.panY
    
    const handleClick = () => {
      selectNode(selectedNode === node.id ? null : node.id)
    }

    let shape
    switch (node.type) {
      case 'generator': {
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180)
          return `${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`
        }).join(' ')
        shape = (
          <polygon
            points={hexPoints}
            fill={color}
            stroke={isSelected ? '#2563EB' : typeColor}
            strokeWidth={isSelected ? 3 : 2}
            className="cursor-pointer transition-all hover:brightness-110"
            onClick={handleClick}
          />
        )
        break
      }
      
      case 'substation':
        shape = (
          <rect
            x={x - size}
            y={y - size}
            width={size * 2}
            height={size * 2}
            fill={color}
            stroke={isSelected ? '#2563EB' : typeColor}
            strokeWidth={isSelected ? 3 : 2}
            className="cursor-pointer transition-all hover:brightness-110"
            onClick={handleClick}
          />
        )
        break
      
      case 'transformer': {
        const diamondPoints = `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`
        shape = (
          <polygon
            points={diamondPoints}
            fill={color}
            stroke={isSelected ? '#2563EB' : typeColor}
            strokeWidth={isSelected ? 3 : 2}
            className="cursor-pointer transition-all hover:brightness-110"
            onClick={handleClick}
          />
        )
        break
      }
      
      default: // load
        shape = (
          <circle
            cx={x}
            cy={y}
            r={size}
            fill={color}
            stroke={isSelected ? '#2563EB' : typeColor}
            strokeWidth={isSelected ? 3 : 2}
            className="cursor-pointer transition-all hover:brightness-110"
            onClick={handleClick}
          />
        )
    }

    return (
      <g key={node.id}>
        {shape}
        {node.status === 'online' && (
          <circle 
            cx={x} 
            cy={y} 
            r={size + 4} 
            fill="none" 
            stroke={color} 
            strokeWidth={1} 
            opacity={0.3} 
            className="animate-pulse-glow" 
          />
        )}
        {layers.labels && (
          <text
            x={x}
            y={y + size + 15}
            textAnchor="middle"
            className="text-xs fill-current text-gray-600 dark:text-gray-400 pointer-events-none"
            style={{ fontSize: '10px' }}
          >
            {node.name.split(' ')[0]}
          </text>
        )}
      </g>
    )
  }

  const renderConnection = (connection: GridConnection) => {
    if (!layers.connections) return null
    
    const fromNode = nodes.find(n => n.id === connection.from)
    const toNode = nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null

    const utilization = connection.currentFlow / connection.capacity
    const color = utilization > 0.9 ? '#EF4444' : utilization > 0.7 ? '#F59E0B' : '#10B981'
    const width = Math.max(1, utilization * 6)
    const isActive = connection.status === 'active'

    const x1 = fromNode.x * viewState.zoom + viewState.panX
    const y1 = fromNode.y * viewState.zoom + viewState.panY
    const x2 = toNode.x * viewState.zoom + viewState.panX
    const y2 = toNode.y * viewState.zoom + viewState.panY

    return (
      <g key={connection.id}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={width}
          opacity={isActive ? 0.8 : 0.3}
          className={isActive ? 'grid-flow' : ''}
        />
        {isActive && connection.currentFlow > 0 && (
          <circle r="3" fill={color} opacity={0.8}>
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M${x1},${y1} L${x2},${y2}`}
            />
          </circle>
        )}
      </g>
    )
  }

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(3, prev.zoom + delta))
    }))
  }

  const resetView = () => {
    setViewState({ zoom: 1, panX: 0, panY: 0 })
  }

  const toggleLayer = (layer: keyof LayerVisibility) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grid Topology
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive network visualization and node management
          </p>
        </div>
        <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Node</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Node</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="node-name">Node Name</Label>
                <Input id="node-name" placeholder="Enter node name" />
              </div>
              <div>
                <Label htmlFor="node-type">Node Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generator">Generator</SelectItem>
                    <SelectItem value="load">Load</SelectItem>
                    <SelectItem value="substation">Substation</SelectItem>
                    <SelectItem value="transformer">Transformer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity (MW)</Label>
                  <Input id="capacity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="voltage">Voltage (kV)</Label>
                  <Input id="voltage" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddNodeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddNodeOpen(false)}>
                  Add Node
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search and Filter */}
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="generator">Generators</SelectItem>
                <SelectItem value="load">Loads</SelectItem>
                <SelectItem value="substation">Substations</SelectItem>
                <SelectItem value="transformer">Transformers</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* View Controls */}
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">View Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom(0.2)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom(-0.2)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Zoom: {Math.round(viewState.zoom * 100)}%
            </div>
          </CardContent>
        </Card>

        {/* Layer Controls */}
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Layers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(layers).map(([layer, visible]) => (
              <div key={layer} className="flex items-center justify-between">
                <span className="text-xs capitalize">{layer}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayer(layer as keyof LayerVisibility)}
                  className="h-6 w-6 p-0"
                >
                  {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Network Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Total Nodes:</span>
              <span className="font-medium">{filteredNodes.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Connections:</span>
              <span className="font-medium">{connections.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Online:</span>
              <span className="font-medium text-secondary-600">
                {filteredNodes.filter(n => n.status === 'online').length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Offline:</span>
              <span className="font-medium text-red-600">
                {filteredNodes.filter(n => n.status === 'offline').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Canvas */}
        <div className="lg:col-span-3">
          <Card variant="glass" className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Network Topology</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">
                    {nodes.filter(n => n.status === 'online').length} Online
                  </Badge>
                  <Badge variant="warning">
                    {nodes.filter(n => n.status === 'warning').length} Warning
                  </Badge>
                  <Badge variant="error">
                    {nodes.filter(n => n.status === 'offline').length} Offline
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="w-full h-full cursor-move"
                >
                  {/* Grid background */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(156, 163, 175, 0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Connections */}
                  {connections.map(renderConnection)}
                  
                  {/* Nodes */}
                  {filteredNodes.map(renderNode)}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Details */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="h-[600px]">
            <CardHeader>
              <CardTitle className="text-sm">
                {selectedNodeData ? 'Node Details' : 'Select a Node'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNodeData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{selectedNodeData.name}</h3>
                    <Badge variant={selectedNodeData.status === 'online' ? 'success' : 'warning'}>
                      {selectedNodeData.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize font-medium">{selectedNodeData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{selectedNodeData.capacity} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Load:</span>
                      <span className="font-medium">{selectedNodeData.currentLoad} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Utilization:</span>
                      <span className="font-medium">
                        {Math.round((selectedNodeData.currentLoad / selectedNodeData.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Voltage:</span>
                      <span className="font-medium">{(selectedNodeData.voltage / 1000).toFixed(1)} kV</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{selectedNodeData.frequency} Hz</span>
                    </div>
                    {selectedNodeData.efficiency && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Efficiency:</span>
                        <span className="font-medium">{selectedNodeData.efficiency}%</span>
                      </div>
                    )}
                    {selectedNodeData.temperature && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temperature:</span>
                        <span className="font-medium">{selectedNodeData.temperature}°C</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit Node
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      View History
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full">
                      Remove Node
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click on any node to view its details
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use the controls above to filter and search nodes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-secondary-500 rounded-full"></div>
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent-500 rounded-full"></div>
              <span className="text-sm">Warning</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span className="text-sm">Offline</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-3">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="#10B981" stroke="#059669" strokeWidth="2"/>
              </svg>
              <span className="text-sm">Generator</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#2563EB" strokeWidth="2"/>
              </svg>
              <span className="text-sm">Load</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
              </svg>
              <span className="text-sm">Substation</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <polygon points="12,2 22,12 12,22 2,12" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="2"/>
              </svg>
              <span className="text-sm">Transformer</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}