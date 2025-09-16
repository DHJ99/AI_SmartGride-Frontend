import React from 'react';
import { useAIAgentsStore } from '../../stores/aiAgentsStore';
import { Card } from '../ui/Card';

export const AgentSelector: React.FC = () => {
  const { agents, activeAgentId, setActiveAgent } = useAIAgentsStore();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'operator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'analytics':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Choose Your AI Assistant
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              activeAgentId === agent.id 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveAgent(agent.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{agent.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className="text-xs text-gray-500 capitalize">{agent.status}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {agent.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(agent.role)}`}>
                    {agent.role}
                  </span>
                  
                  {activeAgentId === agent.id && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Active
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        {specialty}
                      </span>
                    ))}
                    {agent.specialties.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{agent.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};