import React from 'react';
import { GridConnection, GridNode } from '../../types/topology';

interface ConnectionLinesProps {
  connections: GridConnection[];
  nodes: GridNode[];
  selectedConnectionId: string | null;
  onConnectionClick: (connectionId: string) => void;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  connections,
  nodes,
  selectedConnectionId,
  onConnectionClick,
}) => {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.position : { x: 0, y: 0 };
  };

  const getConnectionStyle = (connection: GridConnection) => {
    const baseStyles = {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    switch (connection.type) {
      case 'high':
        return {
          ...baseStyles,
          stroke: connection.status === 'fault' ? '#ef4444' : 
                 connection.status === 'overloaded' ? '#f59e0b' : '#dc2626',
          strokeWidth: connection.status === 'fault' ? 6 : 4,
          strokeDasharray: connection.status === 'inactive' ? '10,5' : 'none',
          opacity: connection.status === 'inactive' ? 0.5 : 1,
        };
      case 'medium':
        return {
          ...baseStyles,
          stroke: connection.status === 'fault' ? '#ef4444' : 
                 connection.status === 'overloaded' ? '#f59e0b' : '#2563eb',
          strokeWidth: connection.status === 'fault' ? 4 : 3,
          strokeDasharray: connection.status === 'inactive' ? '8,4' : 'none',
          opacity: connection.status === 'inactive' ? 0.5 : 1,
        };
      case 'low':
        return {
          ...baseStyles,
          stroke: connection.status === 'fault' ? '#ef4444' : 
                 connection.status === 'overloaded' ? '#f59e0b' : '#10b981',
          strokeWidth: connection.status === 'fault' ? 3 : 2,
          strokeDasharray: connection.status === 'inactive' ? '6,3' : 'none',
          opacity: connection.status === 'inactive' ? 0.5 : 1,
        };
      default:
        return baseStyles;
    }
  };

  const getFlowAnimation = (connection: GridConnection) => {
    if (connection.status === 'active' && connection.currentFlow > 0) {
      return {
        strokeDasharray: '8,4',
        animation: 'flow 2s linear infinite',
      };
    }
    return {};
  };

  return (
    <g className="connections">
      <style>
        {`
          @keyframes flow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 12; }
          }
          .connection-line:hover {
            filter: brightness(1.2);
            stroke-width: 6 !important;
          }
          .connection-selected {
            filter: brightness(1.3) drop-shadow(0 0 8px currentColor);
          }
        `}
      </style>
      
      {connections.map((connection) => {
        const fromPos = getNodePosition(connection.fromNodeId);
        const toPos = getNodePosition(connection.toNodeId);
        const style = getConnectionStyle(connection);
        const flowStyle = getFlowAnimation(connection);
        const isSelected = selectedConnectionId === connection.id;

        return (
          <g key={connection.id}>
            {/* Main connection line */}
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              style={{ ...style, ...flowStyle }}
              className={`connection-line ${isSelected ? 'connection-selected' : ''}`}
              onClick={() => onConnectionClick(connection.id)}
            />
            
            {/* Power flow indicator */}
            {connection.status === 'active' && connection.currentFlow > 0 && (
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1"
                strokeDasharray="4,8"
                style={{
                  animation: 'flow 1.5s linear infinite',
                  pointerEvents: 'none',
                }}
              />
            )}
            
            {/* Connection label */}
            {isSelected && (
              <g>
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 10}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-900 dark:fill-white"
                  style={{ pointerEvents: 'none' }}
                >
                  {connection.currentFlow.toFixed(0)} MW
                </text>
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 + 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                  style={{ pointerEvents: 'none' }}
                >
                  {connection.type.toUpperCase()} • {connection.status.toUpperCase()}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};