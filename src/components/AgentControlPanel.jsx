import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Wrench, LineChart, Loader2 } from 'lucide-react';

// Props: { onWorkflowStart?: (workflow) => void, selectedNodeId?: string }
export default function AgentControlPanel({ onWorkflowStart, selectedNodeId }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const [activeWorkflow, setActiveWorkflow] = useState(null); // 'optimize' | 'maintenance' | 'patterns'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const trigger = async (type) => {
    if (isProcessing) return;
    setError('');
    setActiveWorkflow(type);
    setIsProcessing(true);

    let endpoint = '/api/agents/chat';
    let payload = {};

    if (type === 'optimize') {
      endpoint = '/api/agents/optimize';
      payload = { nodeId: selectedNodeId || null };
    } else if (type === 'maintenance') {
      endpoint = '/api/agents/maintenance';
      payload = { nodeId: selectedNodeId || null };
    } else if (type === 'patterns') {
      endpoint = '/api/agents/chat';
      payload = { message: 'Analyze recent grid patterns and highlight anomalies.' };
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || 'Workflow request failed');
      }
      const data = json.data || {};
      const workflow = {
        workflowType: data.workflowType || type,
        steps: data.steps || [],
        results: data.results || null,
        status: deriveWorkflowStatus(data.steps)
      };
      if (typeof onWorkflowStart === 'function') onWorkflowStart(workflow);
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
      setActiveWorkflow(null);
    }
  };

  const deriveWorkflowStatus = (steps = []) => {
    if (!steps.length) return 'pending';
    if (steps.some(s => s.status === 'failed')) return 'failed';
    if (steps.every(s => s.status === 'completed')) return 'completed';
    if (steps.some(s => s.status === 'running')) return 'running';
    return 'pending';
  };

  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>Agent Control Panel</span>
          {selectedNodeId && <Badge variant="outline" className="text-xs">Node: {selectedNodeId}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
            onClick={() => trigger('optimize')}
            disabled={isProcessing}
            aria-label="Trigger Grid Optimization"
          >
            {activeWorkflow === 'optimize' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>Optimize Grid</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
            onClick={() => trigger('maintenance')}
            disabled={isProcessing}
            aria-label="Run Predictive Maintenance"
          >
            {activeWorkflow === 'maintenance' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wrench className="w-4 h-4" />
            )}
            <span>Predictive Maintenance</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
            onClick={() => trigger('patterns')}
            disabled={isProcessing}
            aria-label="Analyze Patterns"
          >
            {activeWorkflow === 'patterns' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LineChart className="w-4 h-4" />
            )}
            <span>Pattern Analysis</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



