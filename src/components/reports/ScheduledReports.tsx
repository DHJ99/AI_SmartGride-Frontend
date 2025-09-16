import React, { useState } from 'react';
import { Calendar, Clock, Mail, Play, Pause, Edit, Trash2, Plus } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

export const ScheduledReports: React.FC = () => {
  const { scheduledReports, templates, scheduleReport, updateSchedule, deleteSchedule } = useReportsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    templateId: '',
    name: '',
    description: '',
    frequency: 'daily' as const,
    time: '06:00',
    recipients: [] as any[],
    format: 'pdf' as const,
    deliveryMethod: 'email' as const,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      default:
        return frequency;
    }
  };

  const getNextRunTime = (schedule: any) => {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun <= now) {
      switch (schedule.frequency) {
        case 'daily':
          nextRun = addDays(nextRun, 1);
          break;
        case 'weekly':
          nextRun = addWeeks(nextRun, 1);
          break;
        case 'monthly':
          nextRun = addMonths(nextRun, 1);
          break;
      }
    }
    
    return nextRun;
  };

  const handleCreateSchedule = () => {
    const nextRun = getNextRunTime(newSchedule);
    
    scheduleReport({
      ...newSchedule,
      nextRun: nextRun.getTime(),
      status: 'active',
      settings: {
        includeCharts: true,
        includeRawData: false,
        compressFiles: false,
        passwordProtect: false,
      },
    });

    setNewSchedule({
      templateId: '',
      name: '',
      description: '',
      frequency: 'daily',
      time: '06:00',
      recipients: [],
      format: 'pdf',
      deliveryMethod: 'email',
    });
    setShowCreateModal(false);
  };

  const handleToggleStatus = (scheduleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateSchedule(scheduleId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Scheduled Reports Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {scheduledReports.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Scheduled</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {scheduledReports.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {scheduledReports.filter(s => s.status === 'paused').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Paused</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {scheduledReports.filter(s => s.status === 'error').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
        </Card>
      </div>

      {/* Scheduled Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} className="text-blue-600" />
              <span>Scheduled Reports</span>
            </CardTitle>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={Plus}
            >
              Schedule Report
            </Button>
          </div>
        </CardHeader>

        <div className="space-y-4">
          {scheduledReports.map((schedule) => {
            const template = templates.find(t => t.id === schedule.templateId);
            
            return (
              <div
                key={schedule.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {schedule.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {schedule.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{getFrequencyLabel(schedule.schedule.frequency)} at {schedule.schedule.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{schedule.recipients.length} recipients</span>
                      </div>
                      <span className="uppercase">{schedule.format}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                    <div className="text-xs text-gray-500">
                      Next: {format(schedule.nextRun, 'MMM dd, HH:mm')}
                    </div>
                    {schedule.lastRun && (
                      <div className="text-xs text-gray-500">
                        Last: {format(schedule.lastRun, 'MMM dd, HH:mm')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Template Info */}
                {template && (
                  <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Template: {template.name}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Recipients */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipients:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {schedule.recipients.map((recipient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                      >
                        {recipient.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                      icon={schedule.status === 'active' ? Pause : Play}
                    >
                      {schedule.status === 'active' ? 'Pause' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit}
                    >
                      Edit
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSchedule(schedule.id)}
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {scheduledReports.length === 0 && (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Scheduled Reports
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first scheduled report to automate report generation.
            </p>
          </div>
        )}
      </Card>

      {/* Create Schedule Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Schedule New Report"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Schedule Name"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
              placeholder="Enter schedule name"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Template
              </label>
              <select
                value={newSchedule.templateId}
                onChange={(e) => setNewSchedule({ ...newSchedule, templateId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newSchedule.description}
              onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
              placeholder="Describe the scheduled report"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={newSchedule.frequency}
                onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <Input
              label="Time"
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <select
                value={newSchedule.format}
                onChange={(e) => setNewSchedule({ ...newSchedule, format: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
                <option value="powerpoint">PowerPoint</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipients (one email per line)
            </label>
            <textarea
              placeholder="manager@company.com&#10;analyst@company.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSchedule}
              disabled={!newSchedule.name || !newSchedule.templateId}
            >
              Schedule Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'operational':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    case 'compliance':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    case 'financial':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
    case 'technical':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
  }
};