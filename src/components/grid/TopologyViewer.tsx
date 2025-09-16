import React, { useEffect, useRef, useState } from 'react';
import { useTopologyStore } from '../../stores/topologyStore';
import { GridNode, GridConnection } from '../../types/topology';
import { ConnectionLines } from './ConnectionLines';
import { NodeDetails } from './NodeDetails';

export const TopologyViewer: React.FC = () => {
  const {
    nodes,
    connections,
    selectedNodeId,
    selectedConnectionId,
    setSelectedNode,
    setSelectedConnection,
    viewBox,
    setViewBox,
    zoom,
    generateMockData,
  } = useTopologyStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (nodes.length === 0) {
      generateMockData();
    }
  }, [nodes.length, generateMockData]);

  const getNodeColor = (node: GridNode) => {
    switch (node.status) {
      case 'online':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'maintenance':
        return '#3b82f6';
      case 'critical':
        return '#ef4444';
      case 'offline':
      default:
        return '#6b7280';
    }
  };

  const getNodeShape = (node: GridNode) => {
    switch (node.type) {
      case 'powerplant':
        return 'circle';
      case 'substation':
        return 'rect';
      case 'distribution':
        return 'triangle';
      case 'consumer':
      default:
        return 'circle';
    }
  };

  const getNodeSize = (node: GridNode) => {
    switch (node.type) {
      case 'powerplant':
        return 16;
      case 'substation':
        return 14;
      case 'distribution':
        return 10;
      case 'consumer':
      default:
        return 8;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNodeId === nodeId ? null : nodeId);
    setSelectedConnection(null);
  };

  const handleConnectionClick = (connectionId: string) => {
    setSelectedConnection(selectedConnectionId === connectionId ? null : connectionId);
    setSelectedNode(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedNode(null);
      setSelectedConnection(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && svgRef.current) {
      const deltaX = (e.clientX - panStart.x) / zoom;
      const deltaY = (e.clientY - panStart.y) / zoom;
      
      setViewBox({
        ...viewBox,
        x: viewBox.x - deltaX,
        y: viewBox.y - deltaY,
      });
      
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const svgX = (mouseX / rect.width) * viewBox.width + viewBox.x;
    const svgY = (mouseY / rect.height) * viewBox.height + viewBox.y;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, zoom * zoomFactor));
    
    const newViewBox = {
      ...viewBox,
      x: svgX - (svgX - viewBox.x) * (newZoom / zoom),
      y: svgY - (svgY - viewBox.y) * (newZoom / zoom),
    };

    setViewBox(newViewBox);
  };

  const renderNode = (node: GridNode) => {
    const size = getNodeSize(node);
    const color = getNodeColor(node);
    const shape = getNodeShape(node);
    const isSelected = selectedNodeId === node.id;
    const strokeWidth = isSelected ? 3 : 1;
    const strokeColor = isSelected ? '#3b82f6' : '#ffffff';

    const commonProps = {
      fill: color,
      stroke: strokeColor,
      strokeWidth,
      cursor: 'pointer',
      onClick: () => handleNodeClick(node.id),
      className: 'transition-all duration-200 hover:brightness-110',
    };

    switch (shape) {
      case 'rect':
        return (
          <rect
            key={node.id}
            x={node.position.x - size / 2}
            y={node.position.y - size / 2}
            width={size}
            height={size}
            rx={2}
            {...commonProps}
          />
        );
      case 'triangle':
        const points = [
          [node.position.x, node.position.y - size / 2],
          [node.position.x - size / 2, node.position.y + size / 2],
          [node.position.x + size / 2, node.position.y + size / 2],
        ].map(p => p.join(',')).join(' ');
        
        return (
          <polygon
            key={node.id}
            points={points}
            {...commonProps}
          />
        );
      case 'circle':
      default:
        return (
          <circle
            key={node.id}
            cx={node.position.x}
            cy={node.position.y}
            r={size / 2}
            {...commonProps}
          />
        );
    }
  };

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Grid background */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(156, 163, 175, 0.2)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connections */}
        <ConnectionLines
          connections={connections}
          nodes={nodes}
          selectedConnectionId={selectedConnectionId}
          onConnectionClick={handleConnectionClick}
        />

        {/* Nodes */}
        <g className="nodes">
          {nodes.map(renderNode)}
        </g>

        {/* Node labels */}
        <g className="node-labels">
          {nodes.map((node) => (
            <text
              key={`label-${node.id}`}
              x={node.position.x}
              y={node.position.y + getNodeSize(node) + 12}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700 dark:fill-gray-300 pointer-events-none"
              style={{ fontSize: `${12 / zoom}px` }}
            >
              {node.name}
            </text>
          ))}
        </g>
      </svg>

      {/* Node Details Panel */}
      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Power Plant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Substation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-orange-500"></div>
            <span className="text-gray-700 dark:text-gray-300 ml-1">Distribution</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Consumer</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-red-600"></div>
              <span className="text-gray-700 dark:text-gray-300">High Voltage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-blue-600"></div>
              <span className="text-gray-700 dark:text-gray-300">Medium Voltage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-green-600"></div>
              <span className="text-gray-700 dark:text-gray-300">Low Voltage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};