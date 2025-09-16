import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, FileText, Download, Calendar } from 'lucide-react';
import { useSecurityStore } from '../../stores/securityStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

export const ComplianceMonitor: React.FC = () => {
  const { complianceFrameworks, generateComplianceReport, isLoading } = useSecurityStore();
  const [selectedFramework, setSelectedFramework] = useState(complianceFrameworks[0]?.id || '');

  const selectedFrameworkData = complianceFrameworks.find(f => f.id === selectedFramework);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'non_compliant':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'partial':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'not_assessed':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return CheckCircle;
      case 'non_compliant':
        return AlertCircle;
      case 'partial':
        return Clock;
      default:
        return FileText;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleGenerateReport = async () => {
    if (selectedFramework) {
      await generateComplianceReport(selectedFramework);
    }
  };

  return (
    <div className="space-y-6">
      {/* Framework Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {complianceFrameworks.map((framework) => (
          <Card
            key={framework.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedFramework === framework.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedFramework(framework.id)}
          >
            <div className="text-center">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {framework.name}
              </h3>
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(framework.overallScore)}`}>
                {framework.overallScore.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overall Compliance
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Last assessed: {format(framework.lastAssessment, 'MMM dd, yyyy')}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Framework Details */}
      {selectedFrameworkData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText size={20} className="text-blue-600" />
                <span>{selectedFrameworkData.name} - Detailed Assessment</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateReport}
                  loading={isLoading}
                  icon={Download}
                >
                  Generate Report
                </Button>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next assessment: {format(selectedFrameworkData.nextAssessment, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {selectedFrameworkData.requirements.filter(r => r.status === 'compliant').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Compliant</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">
                  {selectedFrameworkData.requirements.filter(r => r.status === 'partial').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Partial</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-lg font-bold text-red-600">
                  {selectedFrameworkData.requirements.filter(r => r.status === 'non_compliant').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Non-Compliant</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-bold text-gray-600">
                  {selectedFrameworkData.requirements.filter(r => r.status === 'not_assessed').length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Not Assessed</div>
              </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Compliance Requirements
              </h4>
              {selectedFrameworkData.requirements.map((requirement) => {
                const StatusIcon = getStatusIcon(requirement.status);
                
                return (
                  <div
                    key={requirement.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <StatusIcon size={20} className={
                          requirement.status === 'compliant' ? 'text-green-600' :
                          requirement.status === 'non_compliant' ? 'text-red-600' :
                          requirement.status === 'partial' ? 'text-yellow-600' :
                          'text-gray-600'
                        } />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {requirement.code}
                            </h5>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(requirement.status)}`}>
                              {requirement.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {requirement.title}
                          </h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {requirement.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(requirement.score)}`}>
                          {requirement.score}%
                        </div>
                        {requirement.dueDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Due: {format(requirement.dueDate, 'MMM dd')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Evidence */}
                    {requirement.evidence.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Evidence:
                        </h6>
                        <div className="flex flex-wrap gap-1">
                          {requirement.evidence.map((evidence, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                            >
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gaps */}
                    {requirement.gaps.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Identified Gaps:
                        </h6>
                        <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                          {requirement.gaps.map((gap, index) => (
                            <li key={index}>• {gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Remediation */}
                    {requirement.remediation.length > 0 && (
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Remediation Actions:
                        </h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {requirement.remediation.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};