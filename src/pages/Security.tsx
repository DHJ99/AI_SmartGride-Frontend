import React, { useState } from 'react';
import { Shield, FileText, AlertTriangle, Eye, BarChart3 } from 'lucide-react';
import { SecurityDashboard } from '../components/security/SecurityDashboard';
import { ComplianceMonitor } from '../components/security/ComplianceMonitor';
import { ThreatIntelligence } from '../components/security/ThreatIntelligence';
import { SecurityAlerts } from '../components/security/SecurityAlerts';
import { AuditLogs } from '../components/security/AuditLogs';
import { Button } from '../components/ui/Button';

export const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'compliance' | 'threats' | 'alerts' | 'audit'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Security Dashboard', icon: Shield },
    { id: 'compliance', label: 'Compliance Monitor', icon: FileText },
    { id: 'threats', label: 'Threat Intelligence', icon: AlertTriangle },
    { id: 'alerts', label: 'Security Alerts', icon: Eye },
    { id: 'audit', label: 'Audit Logs', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <Shield size={32} className="text-white" />
            <h1 className="text-3xl font-bold">
              Security & Compliance Center
            </h1>
          </div>
          <p className="text-red-100 text-lg">
            Comprehensive security monitoring, threat intelligence, and compliance management for critical infrastructure protection.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                icon={Icon}
                className="flex-1 justify-center"
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'dashboard' && <SecurityDashboard />}
        {activeTab === 'compliance' && <ComplianceMonitor />}
        {activeTab === 'threats' && <ThreatIntelligence />}
        {activeTab === 'alerts' && <SecurityAlerts />}
        {activeTab === 'audit' && <AuditLogs />}
      </div>
    </div>
  );
};