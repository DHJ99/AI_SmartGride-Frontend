import React from 'react';
import { Menu, Wifi, WifiOff, Download, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePWA } from '../../hooks/usePWA';
import { Button } from '../ui/Button';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick, title }) => {
  const { user } = useAuthStore();
  const { isOnline, isInstallable, installApp, showInstallPrompt, dismissInstallPrompt } = usePWA();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            icon={Menu}
            aria-label="Open menu"
          />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi size={16} className="text-green-500" />
            ) : (
              <WifiOff size={16} className="text-red-500" />
            )}
            <span className="text-xs text-gray-500 hidden sm:inline">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>

      {/* PWA Install Prompt */}
      {showInstallPrompt && isInstallable && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Install Smart Grid App
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Get quick access and offline capabilities
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={installApp}
                icon={Download}
              >
                Install
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissInstallPrompt}
                icon={X}
              />
            </div>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <WifiOff size={16} className="text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              You're offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}
    </header>
  );
};