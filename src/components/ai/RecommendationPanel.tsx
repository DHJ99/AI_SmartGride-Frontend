import React, { useState } from 'react';
import { Lightbulb, CheckCircle, XCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useOptimizationStore } from '../../stores/optimizationStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const RecommendationPanel: React.FC = () => {
  const {
    recommendations,
    approveRecommendation,
    rejectRecommendation,
    implementRecommendation,
  } = useOptimizationStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'implemented' | 'rejected'>('all');

  const filteredRecommendations = recommendations.filter(rec => 
    filter === 'all' || rec.status === filter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'load_balancing':
        return TrendingUp;
      case 'renewable':
        return Lightbulb;
      case 'maintenance':
        return Clock;
      case 'cost':
        return DollarSign;
      default:
        return Lightbulb;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'implemented':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb size={20} className="text-yellow-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              AI Recommendations ({filteredRecommendations.length})
            </span>
          </div>
          <div className="flex space-x-1">
            {['all', 'pending', 'approved', 'implemented', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(status as any)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => {
          const CategoryIcon = getCategoryIcon(recommendation.category);
          
          return (
            <Card key={recommendation.id} className="hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CategoryIcon size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {recommendation.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(recommendation.status)}`}>
                        {recommendation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    +{recommendation.impact.efficiency.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Efficiency</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {recommendation.impact.cost > 0 ? '+' : ''}{recommendation.impact.cost.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Cost Impact</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    +{recommendation.impact.reliability.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Reliability</div>
                </div>
              </div>

              {/* Implementation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Implementation Effort</p>
                  <p className={`text-sm font-medium capitalize ${getEffortColor(recommendation.implementation.effort)}`}>
                    {recommendation.implementation.effort}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Timeframe</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {recommendation.implementation.timeframe}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expected ROI</p>
                  <p className="text-sm font-medium text-green-600">
                    ${recommendation.roi.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  {recommendation.implementation.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {recommendation.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => approveRecommendation(recommendation.id)}
                    icon={CheckCircle}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rejectRecommendation(recommendation.id)}
                    icon={XCircle}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    Reject
                  </Button>
                </div>
              )}

              {recommendation.status === 'approved' && (
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => implementRecommendation(recommendation.id)}
                    icon={CheckCircle}
                  >
                    Implement
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rejectRecommendation(recommendation.id)}
                    icon={XCircle}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {recommendation.status === 'implemented' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Successfully Implemented</span>
                </div>
              )}

              {recommendation.status === 'rejected' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle size={16} />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? 'No optimization recommendations available at this time.'
                : `No ${filter} recommendations found.`
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};