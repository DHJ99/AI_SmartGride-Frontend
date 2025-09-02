import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Bot, User, Loader2, Wand2, LineChart, Wrench, AlertTriangle } from 'lucide-react';
import { WorkflowProgress } from '@/components/WorkflowProgress';
import { apiClient } from '@/services/apiClient';
import { websocketClient } from '@/services/websocketClient';

// Conversational agent chat interface for natural language grid management
// Props: onWorkflowStart?: (workflow) => void
export default function ConversationalAgent({ onWorkflowStart }) {
  const [messages, setMessages] = useState([]); // { id, role: 'user'|'agent', text, error?: boolean }
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [currentWorkflow, setCurrentWorkflow] = useState(null); // { workflowType, steps, results, response }

  const containerRef = useRef(null);

  const quickActions = useMemo(() => ([
    { id: 'optimize', label: 'Optimize Grid', icon: <Wand2 className="w-4 h-4" />, prompt: 'Optimize the grid to improve efficiency.' },
    { id: 'predictive', label: 'Predictive Maintenance', icon: <Wrench className="w-4 h-4" />, prompt: 'Run predictive maintenance check for critical nodes.' },
    { id: 'patterns', label: 'Find Patterns', icon: <LineChart className="w-4 h-4" />, prompt: 'Analyze recent metrics for anomalous patterns.' },
  ]), []);

  // Auto-scroll to last message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typing, currentWorkflow]);

  const sendMessage = async (text) => {
    if (!text?.trim() || isProcessing) return;
    setError('');

    const newUserMsg = { id: Date.now().toString(36), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsProcessing(true);
    setTyping(true);

    try {
      const response = await apiClient.chatWithAgent(text.trim());

      if (response?.success && response?.data) {
        const data = response.data;
        
        if (data.response) {
          setMessages(prev => [...prev, { 
            id: `${Date.now()}-agent`, 
            role: 'agent', 
            text: data.response 
          }]);
        }

        if (data.workflowType) {
          const workflow = {
            workflowType: data.workflowType,
            steps: data.steps || [],
            results: data.results || null,
            status: deriveWorkflowStatus(data.steps),
            jobId: data.jobId || Date.now().toString()
          };
          
          setCurrentWorkflow(workflow);
          
          // Subscribe to workflow updates if we have a jobId
          if (data.jobId) {
            websocketClient.subscribeToWorkflow(data.jobId, (update) => {
              setCurrentWorkflow(prev => ({
                ...prev,
                progress: update.progress,
                currentStep: update.currentStep,
                status: update.status,
                results: update.results
              }));
            });
          }
          
          if (typeof onWorkflowStart === 'function') {
            onWorkflowStart(workflow);
          }
        } else {
          setCurrentWorkflow(null);
        }
      } else {
        throw new Error('Invalid response from agent');
      }
    } catch (e) {
      console.error('Agent chat error:', e);
      setError(e.message || 'Something went wrong');
      setMessages(prev => [...prev, { 
        id: `${Date.now()}-err`, 
        role: 'agent', 
        text: 'Sorry, I encountered an error. Please try again.', 
        error: true 
      }]);
    } finally {
      setIsProcessing(false);
      setTyping(false);
    }
  };

  const deriveWorkflowStatus = (steps = []) => {
    if (!steps.length) return 'pending';
    if (steps.some(s => s.status === 'failed')) return 'failed';
    if (steps.every(s => s.status === 'completed')) return 'completed';
    if (steps.some(s => s.status === 'running')) return 'running';
    return 'pending';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>Conversational Agent</span>
          </span>
          <Badge variant="secondary">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map(action => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => sendMessage(action.prompt)}
              disabled={isProcessing}
              aria-label={action.label}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          role="log"
          aria-live="polite"
          className="h-64 overflow-y-auto rounded-lg border bg-white/60 dark:bg-gray-900/40 p-4 space-y-3"
        >
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start space-x-2 ${m.role === 'agent' ? '' : 'justify-end'}`}
            >
              {m.role === 'agent' && (
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${
                  m.role === 'agent'
                    ? m.error
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      : 'bg-gray-100 dark:bg-gray-800'
                    : 'bg-primary text-white'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Agent is typing…</span>
            </div>
          )}
        </div>

        {/* Workflow Progress */}
        {currentWorkflow && (
          <div className="pt-2">
            <WorkflowProgress workflow={currentWorkflow} />
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            placeholder="Ask the agent about the grid…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={!input.trim() || isProcessing} aria-label="Send message">
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}



