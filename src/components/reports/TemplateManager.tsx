import React, { useState } from 'react';
import { FileText, Copy, Trash2, Edit, Share, Download, Star } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

export const TemplateManager: React.FC = () => {
  const { templates, duplicateTemplate, deleteTemplate, updateTemplate } = useReportsStore();
  const [filter, setFilter] = useState<'all' | 'operational' | 'compliance' | 'financial' | 'technical'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'created' | 'updated'>('updated');

  const filteredTemplates = templates
    .filter(template => filter === 'all' || template.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return b.createdAt - a.createdAt;
        case 'updated':
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

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

  const handleTogglePublic = (templateId: string, isPublic: boolean) => {
    updateTemplate(templateId, { isPublic: !isPublic });
  };

  const templateCounts = {
    all: templates.length,
    operational: templates.filter(t => t.category === 'operational').length,
    compliance: templates.filter(t => t.category === 'compliance').length,
    financial: templates.filter(t => t.category === 'financial').length,
    technical: templates.filter(t => t.category === 'technical').length,
  };

  return (
    <div className="space-y-6">
      {/* Template Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('all')}>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {templateCounts.all}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Templates</div>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('operational')}>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {templateCounts.operational}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Operational</div>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('compliance')}>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {templateCounts.compliance}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Compliance</div>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('financial')}>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {templateCounts.financial}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Financial</div>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('technical')}>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {templateCounts.technical}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Technical</div>
        </Card>
      </div>

      {/* Filter and Sort Controls */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Templates ({filteredTemplates.length})
              </span>
            </div>
            <div className="flex space-x-1">
              {['all', 'operational', 'compliance', 'financial', 'technical'].map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(category as any)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Created Date</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Templates List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Template</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Components</th>
                <th className="text-left py-3 px-4">Updated</th>
                <th className="text-left py-3 px-4">Visibility</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {template.description}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">
                    {template.type}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {template.charts.length} charts, {template.tables.length} tables
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {format(template.updatedAt, 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublic(template.id, template.isPublic)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        template.isPublic
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}
                    >
                      {template.isPublic ? 'Public' : 'Private'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateTemplate(template.id)}
                        icon={Copy}
                        aria-label="Duplicate template"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        aria-label="Edit template"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Share}
                        aria-label="Share template"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Delete template"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Templates Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? 'No report templates available.'
                : `No ${filter} templates found.`
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};