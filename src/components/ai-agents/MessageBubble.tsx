import React from 'react';
import { ChatMessage } from '../../types/aiAgents';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
  onQuickAction?: (action: any) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onQuickAction }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl">🤖</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">AI Assistant</span>
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          
          {message.quickActions && message.quickActions.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickAction?.(action)}
                  className={`w-full text-left justify-start ${
                    isUser 
                      ? 'border-white/30 text-white hover:bg-white/10' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  );
};