import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Users, Key, Activity, Eye, RefreshCw } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { securityMetrics, securityEvents, userSessions, securityAlerts, generateSecurityTimelineData, generateThreatIntelligence } from '@/data/securityMockData';
import { formatNumber } from '@/lib/utils';

export function SecurityDashboard() {
  const [timelineData, setTimelineData] = useState([]);
  const [threatData, setThreatData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90;
    setTimelineData(generateSecurityTimelineData(days));
    setThreatData(generateThreatIntelligence());
  }, [selectedTimeRange]);

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/10';
      case 'warning': return 'text-accent-600 bg-accent-100 dark:bg-accent-900/20';
      case 'medium': return 'text-accent-500 bg-accent-50 dark:bg-accent-900/10';
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'low': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/10';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const vulnerabilityData = [
    { name: 'Critical', value: securityMetrics.vulnerabilities.critical, color: '#EF4444' },
    { name: 'High', value: securityMetrics.vulnerabilities.high, color: '#F97316' },
    { name: 'Medium', value: securityMetrics.vulnerabilities.medium, color: '#F59E0B' },
    { name: 'Low', value: securityMetrics.vulnerabilities.low, color: '#10B981' }
  ];

  const complianceData = [
    { standard: 'GDPR', score: securityMetrics.compliance.gdpr },
    { standard: 'SOX', score: securityMetrics.compliance.sox },
    { standard: 'ISO 27001', score: securityMetrics.compliance.iso27001 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor security events, threats, and compliance status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Report
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="w-4 h-4 text-secondary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-600">
              {securityMetrics.securityScore}%
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={securityMetrics.securityScore} className="flex-1 h-2" />
              <Badge variant="success" className="text-xs">+2%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600">
              {securityMetrics.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              of {securityMetrics.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="w-4 h-4 text-accent-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-600">
              {securityMetrics.failedLogins}
            </div>
            <p className="text-xs text-muted-foreground">
              in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {securityMetrics.activeSessions}
            </div>
            <p className="text-xs text-muted-foreground">
              across all devices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Timeline */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Security Events Timeline</span>
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                      <XAxis dataKey="date" stroke="rgba(156, 163, 175, 0.5)" />
                      <YAxis stroke="rgba(156, 163, 175, 0.5)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(156, 163, 175, 0.2)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="securityEvents"
                        stroke="#2563EB"
                        strokeWidth={2}
                        fill="url(#colorEvents)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {securityEvents.slice(0, 6).map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type.includes('failed') || event.type.includes('denied') ? 'bg-red-500' :
                        event.type.includes('suspicious') ? 'bg-accent-500' : 'bg-secondary-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.user} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          IP: {event.ip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Active Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'critical' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-accent-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.type === 'critical' ? 'destructive' : 
                                   alert.type === 'warning' ? 'warning' : 'secondary'}>
                        {alert.type.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Threat Intelligence Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatData.map((threat) => (
                  <div key={threat.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={threat.severity === 'critical' ? 'destructive' : 
                                      threat.severity === 'high' ? 'destructive' :
                                      threat.severity === 'medium' ? 'warning' : 'secondary'}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{threat.type.toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Confidence: {threat.confidence}%
                      </span>
                    </div>
                    <h4 className="font-medium mb-1">{threat.indicator}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {threat.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Source: {threat.source.replace('_', ' ')}</span>
                      <span>Last seen: {new Date(threat.lastSeen).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Compliance Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData.map((item) => (
                    <div key={item.standard} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.standard}</span>
                        <span className="text-sm font-medium">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Compliance Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                      <XAxis dataKey="date" stroke="rgba(156, 163, 175, 0.5)" />
                      <YAxis stroke="rgba(156, 163, 175, 0.5)" domain={[80, 100]} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(156, 163, 175, 0.2)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="securityScore"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Active User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userSessions.filter(session => session.status === 'active').map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium">{session.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.ip}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Login: {new Date(session.loginTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">Active</Badge>
                      <Button variant="outline" size="sm">
                        Terminate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Vulnerability Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vulnerabilityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {vulnerabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  {vulnerabilityData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Vulnerability Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timelineData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                      <XAxis dataKey="date" stroke="rgba(156, 163, 175, 0.5)" />
                      <YAxis stroke="rgba(156, 163, 175, 0.5)" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(156, 163, 175, 0.2)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                      <Bar dataKey="securityEvents" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}