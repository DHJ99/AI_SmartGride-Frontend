import React from 'react';
import { useAIAgentsStore } from '../../stores/aiAgentsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { MessageSquare, Clock, BarChart3 } from 'lucide-react';

export const AgentStatus: React.FC = () => {
  const { agents, currentSession, chatHistory, clearChat } = useAIAgentsStore();

  const onlineAgents = agents.filter(agent => agent.status === 'online').length;
  const totalMessages = currentSession?.messages.length || 0;
  const sessionDuration = currentSession 
    ? Math.floor((Date.now() - currentSession.startTime) / 60000)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 size={20} className="text-green-600" />
            <span>Session Status</span>
          </CardTitle>
          {currentSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
            >
              New Chat
            </Button>
          )}
        </div>
      </CardHeader>

      <div className="space-y-4">
        {/* Agent Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{onlineAgents}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Agents Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalMessages}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{sessionDuration}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
          </div>
        </div>

        {/* Current Session Info */}
        {currentSession && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare size={16} className="text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Active Session
              </span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Started {new Date(currentSession.startTime).toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
              <Clock size={16} />
              <span>Recent Chats</span>
            </h4>
            <div className="space-y-2">
              {chatHistory.slice(-3).map((session) => {
                const agent = agents.find(a => a.id === session.agentId);
                return (
                  <div
                    key={session.id}
                    className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {agent?.name || 'Unknown Agent'}
                      </span>
                      <span className="text-gray-500">
                        {session.messages.length} messages
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};