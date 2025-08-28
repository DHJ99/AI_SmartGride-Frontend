import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

// Props: { workflow: { workflowType, steps: [{ step, action, status }], results?, status } }
export function WorkflowProgress({ workflow }) {
  const [expanded, setExpanded] = useState(true);

  const { percent, variantLabel, variantBadge } = useMemo(() => {
    const steps = workflow?.steps || [];
    const total = steps.length || 1;
    const completed = steps.filter(s => s.status === 'completed').length;
    const running = steps.some(s => s.status === 'running');
    const failed = steps.some(s => s.status === 'failed');

    const pct = Math.round((completed / total) * 100);
    let label = 'Pending';
    let badge = 'secondary';
    if (failed) { label = 'Failed'; badge = 'error'; }
    else if (running) { label = 'Running'; badge = 'warning'; }
    else if (pct === 100) { label = 'Completed'; badge = 'success'; }

    return { percent: pct, variantLabel: label, variantBadge: badge };
  }, [workflow]);

  if (!workflow) return null;

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center space-x-2">
            <span className="capitalize">{(workflow.workflowType || 'workflow').replace('_', ' ')}</span>
            <Badge variant={variantBadge}>{variantLabel}</Badge>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{percent}%</span>
            <Button variant="ghost" size="icon" aria-label={expanded ? 'Collapse' : 'Expand'} onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={percent} variant={variantBadge === 'error' ? 'error' : variantBadge === 'warning' ? 'warning' : variantBadge === 'success' ? 'success' : 'default'} className="h-2" />

        {expanded && (
          <div className="space-y-2">
            {(workflow.steps || []).map((s) => (
              <div key={s.step} className="flex items-center justify-between p-2 rounded border bg-white/50 dark:bg-gray-800/50">
                <div className="flex items-center space-x-2">
                  {s.status === 'completed' && <CheckCircle className="w-4 h-4 text-secondary-500" />}
                  {s.status === 'running' && <Loader2 className="w-4 h-4 text-accent-500 animate-spin" />}
                  {s.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {(!['completed','running','failed'].includes(s.status)) && <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />}
                  <span className="text-sm">Step {s.step}: {s.action}</span>
                </div>
                <Badge variant={s.status === 'completed' ? 'success' : s.status === 'running' ? 'warning' : s.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize">
                  {s.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {workflow.results && (
          <div className="pt-2 border-t space-y-1">
            <div className="text-sm font-medium">Results Summary</div>
            <div className="text-xs text-muted-foreground">
              {workflow.results.improvement !== undefined && (
                <div>Improvement: <span className="font-medium text-secondary-600">{workflow.results.improvement}%</span></div>
              )}
              {Array.isArray(workflow.results.recommendations) && workflow.results.recommendations.length > 0 && (
                <div className="mt-1">
                  <div className="font-medium">Recommendations:</div>
                  <ul className="list-disc list-inside">
                    {workflow.results.recommendations.slice(0, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



