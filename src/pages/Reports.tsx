import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Download, FileText, Plus, Search, Filter, Eye, Share, Clock, CheckCircle } from 'lucide-react'

interface Report {
  id: string
  title: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  status: 'generated' | 'generating' | 'scheduled' | 'failed'
  createdAt: Date
  size: string
  format: 'pdf' | 'excel' | 'csv'
  description: string
}

const reports: Report[] = [
  {
    id: 'daily-001',
    title: 'Daily Operations Report',
    type: 'daily',
    status: 'generated',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    size: '2.4 MB',
    format: 'pdf',
    description: 'Comprehensive daily grid operations summary'
  },
  {
    id: 'weekly-001',
    title: 'Weekly Performance Analysis',
    type: 'weekly',
    status: 'generated',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    size: '5.8 MB',
    format: 'pdf',
    description: 'Weekly performance metrics and trend analysis'
  },
  {
    id: 'monthly-001',
    title: 'Monthly Grid Health Report',
    type: 'monthly',
    status: 'generating',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    size: '12.3 MB',
    format: 'pdf',
    description: 'Comprehensive monthly health assessment'
  },
  {
    id: 'custom-001',
    title: 'Renewable Integration Study',
    type: 'custom',
    status: 'generated',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    size: '8.7 MB',
    format: 'excel',
    description: 'Analysis of renewable energy integration impact'
  },
  {
    id: 'daily-002',
    title: 'Daily Operations Report',
    type: 'daily',
    status: 'scheduled',
    createdAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    size: 'TBD',
    format: 'pdf',
    description: 'Scheduled daily operations summary'
  }
]

const reportTemplates = [
  {
    id: 'operations',
    name: 'Operations Summary',
    description: 'Daily/weekly operations overview',
    components: ['Load Profile', 'Generation Mix', 'Alerts', 'KPIs']
  },
  {
    id: 'performance',
    name: 'Performance Analysis',
    description: 'Detailed performance metrics',
    components: ['Efficiency Trends', 'Reliability Metrics', 'Cost Analysis', 'Benchmarks']
  },
  {
    id: 'maintenance',
    name: 'Maintenance Report',
    description: 'Equipment maintenance status',
    components: ['Maintenance Schedule', 'Asset Health', 'Downtime Analysis', 'Recommendations']
  },
  {
    id: 'regulatory',
    name: 'Regulatory Compliance',
    description: 'Compliance and regulatory reporting',
    components: ['Emissions Data', 'Safety Metrics', 'Compliance Status', 'Violations']
  }
]

const scheduledReports = [
  { name: 'Daily Operations', frequency: 'Daily at 6:00 AM', nextRun: '6:00 AM Tomorrow', status: 'active' },
  { name: 'Weekly Summary', frequency: 'Monday at 8:00 AM', nextRun: 'Monday 8:00 AM', status: 'active' },
  { name: 'Monthly Analysis', frequency: '1st of month at 9:00 AM', nextRun: 'Dec 1st 9:00 AM', status: 'active' },
  { name: 'Quarterly Review', frequency: 'Quarterly', nextRun: 'Jan 1st 2025', status: 'paused' }
]

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || report.type === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'success'
      case 'generating': return 'warning'
      case 'scheduled': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated': return <CheckCircle className="w-4 h-4" />
      case 'generating': return <Clock className="w-4 h-4 animate-spin" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      case 'failed': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automated reporting and data export for grid operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule Report</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Report</span>
          </Button>
        </div>
      </div>

      {/* Report Management */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Reports List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} variant="glass" className="hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{report.title}</span>
                    <Badge variant={getStatusColor(report.status)} className="flex items-center space-x-1">
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">{report.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{report.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium uppercase">{report.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{report.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {report.status === 'scheduled' 
                          ? report.createdAt.toLocaleString()
                          : report.createdAt.toLocaleDateString()
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    {report.status === 'generated' && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    {report.status === 'generating' && (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <Clock className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </Button>
                    )}
                    {report.status === 'scheduled' && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Calendar className="w-3 h-3 mr-1" />
                        Edit Schedule
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} variant="glass" className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div>
                    <Label className="text-xs font-medium">Components:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.components.map((component, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Plus className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((scheduled, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="space-y-1">
                      <div className="font-medium">{scheduled.name}</div>
                      <div className="text-sm text-muted-foreground">{scheduled.frequency}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="font-medium">Next Run</div>
                        <div className="text-muted-foreground">{scheduled.nextRun}</div>
                      </div>
                      <Badge variant={scheduled.status === 'active' ? 'success' : 'secondary'}>
                        {scheduled.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          {scheduled.status === 'active' ? 'Pause' : 'Resume'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Configuration */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input id="report-title" placeholder="Enter report title" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="report-template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date-from">From Date</Label>
                    <Input id="date-from" type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="date-to">To Date</Label>
                    <Input id="date-to" type="date" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Component Selection */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Report Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Executive Summary',
                    'Load Profile Analysis',
                    'Generation Mix',
                    'Performance Metrics',
                    'Alert Summary',
                    'Cost Analysis',
                    'Efficiency Trends',
                    'Reliability Metrics',
                    'Environmental Impact',
                    'Recommendations'
                  ].map((component, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`component-${index}`}
                        className="rounded border-gray-300"
                        defaultChecked={index < 6}
                      />
                      <label htmlFor={`component-${index}`} className="text-sm font-medium">
                        {component}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t mt-4">
                  <Label className="text-sm font-medium">Additional Options</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="include-charts" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="include-charts" className="text-sm">Include charts and graphs</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="include-raw-data" className="rounded border-gray-300" />
                      <label htmlFor="include-raw-data" className="text-sm">Include raw data tables</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="include-recommendations" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="include-recommendations" className="text-sm">Include AI recommendations</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}