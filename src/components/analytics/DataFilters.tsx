import React, { useState } from 'react';
import { Calendar, Filter, RefreshCw, Download } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

export const DataFilters: React.FC = () => {
  const { filters, setFilters, refreshData, isLoading } = useAnalyticsStore();
  const [showFilters, setShowFilters] = useState(false);

  const datePresets = [
    { label: 'Last 7 days', value: 7, unit: 'days' },
    { label: 'Last 30 days', value: 30, unit: 'days' },
    { label: 'Last 3 months', value: 3, unit: 'months' },
    { label: 'Last 6 months', value: 6, unit: 'months' },
  ];

  const granularityOptions = [
    { label: 'Hourly', value: 'hourly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  const metricOptions = [
    { label: 'Efficiency', value: 'efficiency' },
    { label: 'Generation', value: 'generation' },
    { label: 'Consumption', value: 'consumption' },
    { label: 'Load', value: 'load' },
    { label: 'Cost', value: 'cost' },
    { label: 'Emissions', value: 'emissions' },
  ];

  const gridSectionOptions = [
    { label: 'All Sections', value: 'all' },
    { label: 'Zone A', value: 'zone-a' },
    { label: 'Zone B', value: 'zone-b' },
    { label: 'Zone C', value: 'zone-c' },
    { label: 'Zone D', value: 'zone-d' },
  ];

  const handleDatePreset = (preset: typeof datePresets[0]) => {
    const end = new Date();
    let start: Date;

    if (preset.unit === 'days') {
      start = subDays(end, preset.value);
    } else if (preset.unit === 'months') {
      start = subMonths(end, preset.value);
    } else {
      start = subWeeks(end, preset.value);
    }

    setFilters({
      dateRange: { start, end },
    });
  };

  const handleMetricToggle = (metric: string) => {
    const currentMetrics = filters.metrics;
    const newMetrics = currentMetrics.includes(metric)
      ? currentMetrics.filter(m => m !== metric)
      : [...currentMetrics, metric];
    
    setFilters({ metrics: newMetrics });
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // In a real app, this would trigger the export
    console.log(`Exporting data as ${format}`);
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {format(filters.dateRange.start, 'MMM dd')} - {format(filters.dateRange.end, 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="flex space-x-1">
              {datePresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDatePreset(preset)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={Filter}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              icon={RefreshCw}
              loading={isLoading}
            >
              Refresh
            </Button>
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                icon={Download}
              >
                Export
              </Button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Granularity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Granularity
              </label>
              <div className="space-y-2">
                {granularityOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="granularity"
                      value={option.value}
                      checked={filters.granularity === option.value}
                      onChange={(e) => setFilters({ granularity: e.target.value as any })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Metrics to Display
              </label>
              <div className="space-y-2">
                {metricOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.metrics.includes(option.value)}
                      onChange={() => handleMetricToggle(option.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grid Sections */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grid Sections
              </label>
              <div className="space-y-2">
                {gridSectionOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="gridSection"
                      value={option.value}
                      checked={filters.gridSections.includes(option.value)}
                      onChange={(e) => setFilters({ gridSections: [e.target.value] })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={format(filters.dateRange.start, 'yyyy-MM-dd')}
                  onChange={(e) => setFilters({
                    dateRange: {
                      ...filters.dateRange,
                      start: new Date(e.target.value),
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="date"
                  value={format(filters.dateRange.end, 'yyyy-MM-dd')}
                  onChange={(e) => setFilters({
                    dateRange: {
                      ...filters.dateRange,
                      end: new Date(e.target.value),
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};