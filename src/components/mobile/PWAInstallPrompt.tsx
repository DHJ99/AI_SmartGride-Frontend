import React from 'react';
import { Download, X, Smartphone, Wifi, Zap } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const PWAInstallPrompt: React.FC = () => {
  const { showInstallPrompt, installApp, dismissInstallPrompt, isInstallable } = usePWA();

  if (!showInstallPrompt || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Smartphone size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Install Smart Grid App
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get quick access to your grid control center with enhanced mobile experience and offline capabilities.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <Zap size={20} className="text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Instant access from your home screen
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Wifi size={20} className="text-green-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Works offline with cached data
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Download size={20} className="text-purple-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Native app-like experience
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={dismissInstallPrompt}
              icon={X}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              variant="primary"
              onClick={installApp}
              icon={Download}
              className="flex-1"
            >
              Install App
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};