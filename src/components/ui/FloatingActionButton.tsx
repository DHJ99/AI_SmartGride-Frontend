import React, { useState } from 'react';
import { Plus, X, Zap, BarChart3, Settings, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface FABAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
  color: string;
}

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions: FABAction[] = [
    {
      id: 'optimization',
      label: 'AI Optimization',
      icon: Zap,
      action: () => navigate('/optimization'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'alerts',
      label: 'View Alerts',
      icon: AlertTriangle,
      action: () => navigate('/alerts'),
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  const handleActionClick = (action: FABAction) => {
    action.action();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40">
      {/* Action Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center space-x-3 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={() => handleActionClick(action)}
                  className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110`}
                >
                  <Icon size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};