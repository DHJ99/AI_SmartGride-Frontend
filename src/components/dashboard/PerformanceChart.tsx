import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { generateHistoricalData } from '@/data/mockData'

const data = generateHistoricalData(7) // Last 7 days

export function PerformanceChart() {
  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle>System Performance (7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                stroke="rgba(156, 163, 175, 0.5)"
              />
              <YAxis 
                stroke="rgba(156, 163, 175, 0.5)"
                tickFormatter={(value) => `${value} MW`}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} MW`,
                  name === 'totalGeneration' ? 'Generation' : 'Load'
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(156, 163, 175, 0.2)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Area
                type="monotone"
                dataKey="totalGeneration"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#colorGeneration)"
              />
              <Area
                type="monotone"
                dataKey="totalLoad"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorLoad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-muted-foreground">Generation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
            <span className="text-muted-foreground">Load</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}