import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface NetworkStatusProps {
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg border
        ${isOnline 
          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
          : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
        }
      `}>
        {isOnline ? (
          <>
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Back online</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span className="text-sm font-medium">You're offline</span>
          </>
        )}
      </div>
    </div>
  );
};

export const ConnectionIndicator: React.FC<{ isConnected: boolean; className?: string }> = ({ 
  isConnected, 
  className = '' 
}) => (
  <div className={`flex items-center space-x-1 ${className}`}>
    {isConnected ? (
      <Wifi size={16} className="text-green-500" />
    ) : (
      <WifiOff size={16} className="text-red-500" />
    )}
    <span className="text-xs text-gray-500 hidden sm:inline">
      {isConnected ? 'Connected' : 'Disconnected'}
    </span>
  </div>
);