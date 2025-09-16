import React, { useState } from 'react';
import { Plus, Save, Eye, Settings, Layout, BarChart3, Table, Type, Image } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

export const ReportBuilder: React.FC = () => {
  const { templates, createTemplate, updateTemplate, selectedTemplate, setSelectedTemplate } = useReportsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'operational' as const,
    type: 'summary' as const,
    dataSource: ['grid_metrics'],
    tags: [] as string[],
  });

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const reportCategories = [
    { value: 'operational', label: 'Operational', color: 'blue' },
    { value: 'compliance', label: 'Compliance', color: 'green' },
    { value: 'financial', label: 'Financial', color: 'purple' },
    { value: 'technical', label: 'Technical', color: 'orange' },
  ];

  const reportTypes = [
    { value: 'dashboard', label: 'Dashboard', description: 'Visual dashboard with key metrics' },
    { value: 'summary', label: 'Summary', description: 'High-level overview report' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive detailed analysis' },
    { value: 'executive', label: 'Executive', description: 'Executive summary format' },
  ];

  const componentLibrary = [
    { id: 'chart', name: 'Chart', icon: BarChart3, description: 'Add data visualization charts' },
    { id: 'table', name: 'Table', icon: Table, description: 'Add data tables' },
    { id: 'text', name: 'Text Block', icon: Type, description: 'Add text content' },
    { id: 'image', name: 'Image', icon: Image, description: 'Add images or logos' },
  ];

  const handleCreateTemplate = () => {
    createTemplate({
      ...newTemplate,
      layout: {
        orientation: 'portrait',
        pageSize: 'A4',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        header: {
          id: 'header',
          type: 'header',
          title: newTemplate.name,
          position: { x: 0, y: 0, width: 100, height: 10 },
          styling: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#ffffff',
            border: false,
            alignment: 'center',
          },
        },
        footer: {
          id: 'footer',
          type: 'footer',
          content: 'Smart Grid Platform',
          position: { x: 0, y: 90, width: 100, height: 5 },
          styling: {
            fontSize: 10,
            fontWeight: 'normal',
            color: '#666666',
            backgroundColor: '#ffffff',
            border: false,
            alignment: 'center',
          },
        },
        sections: [],
      },
      filters: [],
      charts: [],
      tables: [],
      createdBy: 'current_user',
      isPublic: false,
    });

    setNewTemplate({
      name: '',
      description: '',
      category: 'operational',
      type: 'summary',
      dataSource: ['grid_metrics'],
      tags: [],
    });
    setShowCreateModal(false);
  };

  const getCategoryColor = (category: string) => {
    const categoryData = reportCategories.find(c => c.value === category);
    return categoryData?.color || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Template Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Layout size={20} className="text-blue-600" />
              <span>Report Templates</span>
            </CardTitle>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              icon={Plus}
            >
              Create Template
            </Button>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const categoryColor = getCategoryColor(template.category);
            const isSelected = selectedTemplate === template.id;
            
            return (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize bg-${categoryColor}-100 text-${categoryColor}-800 dark:bg-${categoryColor}-900/20 dark:text-${categoryColor}-400`}>
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {template.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.charts.length} charts, {template.tables.length} tables</span>
                  <span>{template.isPublic ? 'Public' : 'Private'}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Template Editor */}
      {selectedTemplateData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Settings size={20} className="text-green-600" />
                <span>Template Editor - {selectedTemplateData.name}</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                >
                  Preview
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Save}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Component Library */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Component Library
              </h4>
              <div className="space-y-2">
                {componentLibrary.map((component) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={18} className="text-blue-600" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                            {component.name}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {component.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layout Canvas */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Report Layout
              </h4>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Layout size={48} className="mx-auto mb-4" />
                  <p className="text-sm">Drag components here to build your report</p>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Properties
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Page Orientation
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Page Size
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Data Sources
                  </label>
                  <div className="space-y-1">
                    {['grid_metrics', 'power_data', 'historical_data', 'alerts', 'compliance_data'].map((source) => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTemplateData.dataSource.includes(source)}
                          className="mr-2"
                          readOnly
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {source.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Create Template Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Report Template"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            placeholder="Enter template name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              placeholder="Describe the report template"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {reportCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Sources
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['grid_metrics', 'power_data', 'historical_data', 'alerts', 'compliance_data', 'security_metrics'].map((source) => (
                <label key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.dataSource.includes(source)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewTemplate({
                          ...newTemplate,
                          dataSource: [...newTemplate.dataSource, source],
                        });
                      } else {
                        setNewTemplate({
                          ...newTemplate,
                          dataSource: newTemplate.dataSource.filter(s => s !== source),
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {source.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
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
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name || !newTemplate.description}
            >
              Create Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};