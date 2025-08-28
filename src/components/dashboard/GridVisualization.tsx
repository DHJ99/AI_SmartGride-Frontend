import React, { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGridStore } from '@/stores/grid'

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

export function GridVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { nodes, connections, selectedNode, selectNode } = useGridStore()

  const getNodeColor = (node: GridNode) => {
    switch (node.status) {
      case 'online': return '#10B981' // Secondary green
      case 'warning': return '#F59E0B' // Accent amber
      case 'offline': return '#EF4444' // Red
      case 'maintenance': return '#6B7280' // Gray
      default: return '#6B7280'
    }
  }

  const getNodeShape = (type: string) => {
    switch (type) {
      case 'generator': return 'hexagon'
      case 'load': return 'circle'
      case 'substation': return 'square'
      case 'transformer': return 'diamond'
      default: return 'circle'
    }
  }

  const getConnectionColor = (connection: GridConnection) => {
    const utilization = connection.currentFlow / connection.capacity
    if (utilization > 0.9) return '#EF4444' // Red for high utilization
    if (utilization > 0.7) return '#F59E0B' // Amber for medium utilization
    return '#10B981' // Green for normal utilization
  }

  const getConnectionWidth = (connection: GridConnection) => {
    const utilization = connection.currentFlow / connection.capacity
    return Math.max(1, utilization * 8) // Scale from 1 to 8px
  }

  const renderNode = (node: GridNode, x: number, y: number) => {
    const shape = getNodeShape(node.type)
    const color = getNodeColor(node)
    const isSelected = selectedNode === node.id
    const size = isSelected ? 16 : 12
    
    const handleClick = () => {
      selectNode(selectedNode === node.id ? null : node.id)
    }

    switch (shape) {
      case 'hexagon': {
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180)
          return `${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`
        }).join(' ')
        
        return (
          <g key={node.id}>
            <polygon
              points={hexPoints}
              fill={color}
              stroke={isSelected ? '#2563EB' : 'white'}
              strokeWidth={isSelected ? 3 : 2}
              className="cursor-pointer transition-all hover:brightness-110"
              onClick={handleClick}
            />
            {node.status === 'online' && (
              <circle cx={x} cy={y} r={size + 4} fill="none" stroke={color} strokeWidth={1} opacity={0.3} className="animate-pulse-glow" />
            )}
          </g>
        )
      }
      
      case 'square':
        return (
          <g key={node.id}>
            <rect
              x={x - size}
              y={y - size}
              width={size * 2}
              height={size * 2}
              fill={color}
              stroke={isSelected ? '#2563EB' : 'white'}
              strokeWidth={isSelected ? 3 : 2}
              className="cursor-pointer transition-all hover:brightness-110"
              onClick={handleClick}
            />
            {node.status === 'online' && (
              <rect
                x={x - size - 4}
                y={y - size - 4}
                width={(size + 4) * 2}
                height={(size + 4) * 2}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.3}
                className="animate-pulse-glow"
              />
            )}
          </g>
        )
      
      case 'diamond': {
        const diamondPoints = `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`
        
        return (
          <g key={node.id}>
            <polygon
              points={diamondPoints}
              fill={color}
              stroke={isSelected ? '#2563EB' : 'white'}
              strokeWidth={isSelected ? 3 : 2}
              className="cursor-pointer transition-all hover:brightness-110"
              onClick={handleClick}
            />
            {node.status === 'online' && (
              <polygon
                points={`${x},${y - size - 4} ${x + size + 4},${y} ${x},${y + size + 4} ${x - size - 4},${y}`}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.3}
                className="animate-pulse-glow"
              />
            )}
          </g>
        )
      }
      
      default: // circle
        return (
          <g key={node.id}>
            <circle
              cx={x}
              cy={y}
              r={size}
              fill={color}
              stroke={isSelected ? '#2563EB' : 'white'}
              strokeWidth={isSelected ? 3 : 2}
              className="cursor-pointer transition-all hover:brightness-110"
              onClick={handleClick}
            />
            {node.status === 'online' && (
              <circle cx={x} cy={y} r={size + 4} fill="none" stroke={color} strokeWidth={1} opacity={0.3} className="animate-pulse-glow" />
            )}
          </g>
        )
    }
  }

  const renderConnection = (connection: GridConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from)
    const toNode = nodes.find(n => n.id === connection.to)
    
    if (!fromNode || !toNode) return null

    const color = getConnectionColor(connection)
    const width = getConnectionWidth(connection)
    const isActive = connection.status === 'active'

    return (
      <g key={connection.id}>
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={color}
          strokeWidth={width}
          opacity={isActive ? 0.8 : 0.3}
          className={isActive ? 'grid-flow' : ''}
        />
        {/* Energy flow animation */}
        {isActive && connection.currentFlow > 0 && (
          <circle r="3" fill={color} opacity={0.8}>
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
            />
          </circle>
        )}
      </g>
    )
  }

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Grid Topology</span>
          <div className="flex items-center space-x-2">
            <Badge variant="success">{nodes.filter(n => n.status === 'online').length} Online</Badge>
            <Badge variant="warning">{nodes.filter(n => n.status === 'warning').length} Warning</Badge>
            <Badge variant="error">{nodes.filter(n => n.status === 'offline').length} Offline</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex space-x-4 h-80">
          {/* SVG Visualization */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg relative overflow-hidden">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 500 500"
              className="w-full h-full"
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
              {nodes.map(node => renderNode(node, node.x, node.y))}
              
              {/* Labels */}
              {nodes.map(node => (
                <text
                  key={`label-${node.id}`}
                  x={node.x}
                  y={node.y + 25}
                  textAnchor="middle"
                  className="text-xs fill-current text-gray-600 dark:text-gray-400"
                  style={{ fontSize: '10px' }}
                >
                  {node.name.split(' ')[0]}
                </text>
              ))}
            </svg>
          </div>
          
          {/* Node Details */}
          {selectedNodeData && (
            <div className="w-64 bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <h3 className="font-semibold mb-3 flex items-center justify-between">
                {selectedNodeData.name}
                <Badge variant={selectedNodeData.status === 'online' ? 'success' : 'warning'}>
                  {selectedNodeData.status}
                </Badge>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{selectedNodeData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{selectedNodeData.capacity} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Load:</span>
                  <span>{selectedNodeData.currentLoad} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Utilization:</span>
                  <span>{Math.round((selectedNodeData.currentLoad / selectedNodeData.capacity) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voltage:</span>
                  <span>{(selectedNodeData.voltage / 1000).toFixed(1)} kV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span>{selectedNodeData.frequency} Hz</span>
                </div>
                {selectedNodeData.efficiency && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span>{selectedNodeData.efficiency}%</span>
                  </div>
                )}
                {selectedNodeData.temperature && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span>{selectedNodeData.temperature}°C</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Offline</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}