import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Activity, 
  Settings,
  Zap
} from 'lucide-react';

interface MobileNavigationProps {
  className?: string;
}

const mobileNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI', href: '/optimization', icon: Zap },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30 ${className}`}>
      <div className="grid grid-cols-5 h-16">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `
              flex flex-col items-center justify-center space-y-1 transition-colors duration-200
              ${isActive 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};