import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Play, Square, Map, Filter } from 'lucide-react';
import { useTopologyStore } from '../../stores/topologyStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const GridControls: React.FC = () => {
  const { 
    zoom, 
    setZoom, 
    viewBox, 
    setViewBox, 
    isSimulating, 
    startSimulation, 
    stopSimulation,
    nodes,
    connections 
  } = useTopologyStore();

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
  };

  const handleReset = () => {
    setZoom(1);
    setViewBox({ x: 0, y: 0, width: 900, height: 700 });
  };

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  const getStatusCounts = () => {
    const nodeCounts = nodes.reduce((acc, node) => {
      acc[node.status] = (acc[node.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const connectionCounts = connections.reduce((acc, conn) => {
      acc[conn.status] = (acc[conn.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { nodeCounts, connectionCounts };
  };

  const { nodeCounts, connectionCounts } = getStatusCounts();

  return (
    <div className="absolute top-4 left-4 z-30 space-y-4 lg:left-4">
      {/* Main Controls */}
      <Card padding="sm" className="shadow-lg w-48">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              icon={ZoomIn}
              disabled={zoom >= 3}
              aria-label="Zoom in"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              icon={ZoomOut}
              disabled={zoom <= 0.3}
              aria-label="Zoom out"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              icon={RotateCcw}
              aria-label="Reset view"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isSimulating ? "secondary" : "primary"}
              size="sm"
              onClick={handleToggleSimulation}
              icon={isSimulating ? Square : Play}
              className="w-full"
            >
              {isSimulating ? 'Stop' : 'Start'} Simulation
            </Button>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t">
            <p>Zoom: {(zoom * 100).toFixed(0)}%</p>
            <p>Nodes: {nodes.length} | Connections: {connections.length}</p>
          </div>
        </div>
      </Card>

      {/* Status Overview */}
      <Card padding="sm" className="shadow-lg w-48">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
            <Filter size={14} />
            <span>System Status</span>
          </h3>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nodes</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(nodeCounts).map(([status, count]) => (
                  <span
                    key={status}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      status === 'maintenance' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {count} {status}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Connections</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(connectionCounts).map(([status, count]) => (
                  <span
                    key={status}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      status === 'overloaded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      status === 'fault' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {count} {status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Minimap */}
      <Card padding="sm" className="shadow-lg w-48">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
            <Map size={14} />
            <span>Minimap</span>
          </h3>
          
          <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded border relative overflow-hidden">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 900 700"
              className="absolute inset-0"
            >
              {/* Simplified node representation */}
              {nodes.map((node) => (
                <circle
                  key={node.id}
                  cx={node.position.x}
                  cy={node.position.y}
                  r="3"
                  className={
                    node.status === 'online' ? 'fill-green-500' :
                    node.status === 'warning' ? 'fill-yellow-500' :
                    node.status === 'maintenance' ? 'fill-blue-500' :
                    node.status === 'critical' ? 'fill-red-500' :
                    'fill-gray-500'
                  }
                />
              ))}
              
              {/* Current view indicator */}
              <rect
                x={viewBox.x}
                y={viewBox.y}
                width={viewBox.width / zoom}
                height={viewBox.height / zoom}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
};