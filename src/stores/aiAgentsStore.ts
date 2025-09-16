import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIAgentsState, AIAgent, ChatMessage, ChatSession, QuickAction } from '../types/aiAgents';

// Mock AI agents
const generateAgents = (): AIAgent[] => [
  {
    id: 'grid-operator',
    name: 'GridBot',
    role: 'operator',
    avatar: '🤖',
    description: 'Your intelligent grid operations assistant',
    specialties: ['Grid Operations', 'Load Management', 'System Monitoring', 'Emergency Response'],
    status: 'online',
    personality: {
      tone: 'professional',
      expertise: ['grid_operations', 'load_balancing', 'system_monitoring'],
      responseStyle: 'Clear, concise, and action-oriented responses focused on operational efficiency.',
    },
  },
  {
    id: 'maintenance-advisor',
    name: 'MaintenanceBot',
    role: 'maintenance',
    avatar: '🔧',
    description: 'Expert maintenance and equipment advisor',
    specialties: ['Predictive Maintenance', 'Equipment Health', 'Repair Procedures', 'Asset Management'],
    status: 'online',
    personality: {
      tone: 'technical',
      expertise: ['predictive_maintenance', 'equipment_diagnostics', 'repair_procedures'],
      responseStyle: 'Technical and detailed responses with step-by-step guidance.',
    },
  },
  {
    id: 'analytics-expert',
    name: 'AnalyticsBot',
    role: 'analytics',
    avatar: '📊',
    description: 'Data analytics and insights specialist',
    specialties: ['Data Analysis', 'Performance Metrics', 'Trend Forecasting', 'Report Generation'],
    status: 'online',
    personality: {
      tone: 'friendly',
      expertise: ['data_analysis', 'forecasting', 'performance_optimization'],
      responseStyle: 'Analytical and insightful responses with data-driven recommendations.',
    },
  },
  {
    id: 'security-consultant',
    name: 'SecBot',
    role: 'security',
    avatar: '🛡️',
    description: 'Cybersecurity and compliance expert',
    specialties: ['Security Monitoring', 'Compliance', 'Threat Assessment', 'Incident Response'],
    status: 'online',
    personality: {
      tone: 'urgent',
      expertise: ['cybersecurity', 'compliance', 'threat_intelligence'],
      responseStyle: 'Security-focused responses with emphasis on risk mitigation and compliance.',
    },
  },
];

// Mock AI responses based on agent type and query
const generateAIResponse = (agent: AIAgent, userMessage: string): { content: string; quickActions?: QuickAction[] } => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Grid Operator responses
  if (agent.role === 'operator') {
    if (lowerMessage.includes('efficiency') || lowerMessage.includes('performance')) {
      return {
        content: `Current grid efficiency is at 94.2%, which is excellent! The system is operating within optimal parameters. Key metrics:\n\n• Power generation: 1,247 MW\n• System load: 87.3%\n• Active nodes: 156/160\n\nWould you like me to show you specific areas for improvement?`,
        quickActions: [
          { id: 'show-efficiency', label: 'Show Efficiency Details', action: 'efficiency_details', category: 'analysis' },
          { id: 'optimize-load', label: 'Optimize Load Distribution', action: 'optimize_load', category: 'control' },
        ],
      };
    }
    
    if (lowerMessage.includes('load') || lowerMessage.includes('high')) {
      return {
        content: `I've identified 3 nodes with high load levels:\n\n🔴 Grid Node 7: 94% capacity (Critical)\n🟡 Grid Node 3: 87% capacity (High)\n🟡 Grid Node 12: 82% capacity (High)\n\nRecommendation: Consider load redistribution to prevent overload conditions.`,
        quickActions: [
          { id: 'redistribute-load', label: 'Redistribute Load', action: 'redistribute_load', category: 'control' },
          { id: 'view-nodes', label: 'View Node Details', action: 'view_nodes', category: 'status' },
        ],
      };
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('overview')) {
      return {
        content: `Grid Status Overview:\n\n✅ System Status: Operational\n⚡ Total Generation: 1,247 MW\n📊 Efficiency: 94.2%\n🔗 Active Connections: 156/160\n⚠️ Alerts: 2 minor warnings\n\nAll critical systems are functioning normally.`,
        quickActions: [
          { id: 'view-alerts', label: 'View Alerts', action: 'view_alerts', category: 'status' },
          { id: 'detailed-status', label: 'Detailed Status', action: 'detailed_status', category: 'analysis' },
        ],
      };
    }
    
    return {
      content: `I'm here to help with grid operations! I can assist with:\n\n• Real-time system monitoring\n• Load balancing optimization\n• Performance analysis\n• Emergency response procedures\n\nWhat specific aspect of grid operations would you like to explore?`,
      quickActions: [
        { id: 'system-status', label: 'System Status', action: 'system_status', category: 'status' },
        { id: 'performance-check', label: 'Performance Check', action: 'performance_check', category: 'analysis' },
      ],
    };
  }
  
  // Maintenance Advisor responses
  if (agent.role === 'maintenance') {
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('schedule')) {
      return {
        content: `Upcoming Maintenance Schedule:\n\n🔧 This Week:\n• Transformer T-204: Inspection (Wed)\n• Generator G-102: Routine service (Fri)\n\n⚠️ Overdue:\n• Switch S-301: Quarterly check (2 days overdue)\n\nPredictive maintenance alerts: 3 components require attention within 30 days.`,
        quickActions: [
          { id: 'schedule-maintenance', label: 'Schedule Maintenance', action: 'schedule_maintenance', category: 'control' },
          { id: 'predictive-alerts', label: 'View Predictive Alerts', action: 'predictive_alerts', category: 'analysis' },
        ],
      };
    }
    
    if (lowerMessage.includes('predict') || lowerMessage.includes('failure')) {
      return {
        content: `Predictive Maintenance Analysis:\n\n🔴 High Risk (7-14 days):\n• Transformer T-204: Temperature anomaly detected\n\n🟡 Medium Risk (30-45 days):\n• Generator G-102: Vibration pattern change\n• Breaker B-205: Contact wear indicators\n\nRecommendation: Schedule immediate inspection for T-204.`,
        quickActions: [
          { id: 'schedule-inspection', label: 'Schedule Inspection', action: 'schedule_inspection', category: 'control' },
          { id: 'maintenance-report', label: 'Generate Report', action: 'maintenance_report', category: 'analysis' },
        ],
      };
    }
    
    return {
      content: `I'm your maintenance advisor! I can help with:\n\n• Predictive maintenance scheduling\n• Equipment health monitoring\n• Repair procedure guidance\n• Asset lifecycle management\n\nWhat maintenance topic can I assist you with?`,
      quickActions: [
        { id: 'equipment-health', label: 'Equipment Health', action: 'equipment_health', category: 'status' },
        { id: 'maintenance-schedule', label: 'Maintenance Schedule', action: 'maintenance_schedule', category: 'analysis' },
      ],
    };
  }
  
  // Analytics Expert responses
  if (agent.role === 'analytics') {
    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
      return {
        content: `Load Forecasting Analysis:\n\n📈 Next 24 Hours:\n• Peak demand: 1,340 MW (expected at 2:00 PM)\n• Minimum load: 892 MW (expected at 3:00 AM)\n• Confidence level: 87.3%\n\n📊 Key Insights:\n• 12% increase expected during peak hours\n• Weather impact: High temperature forecast may increase cooling load`,
        quickActions: [
          { id: 'detailed-forecast', label: 'Detailed Forecast', action: 'detailed_forecast', category: 'analysis' },
          { id: 'optimization-suggestions', label: 'Optimization Suggestions', action: 'optimization_suggestions', category: 'control' },
        ],
      };
    }
    
    if (lowerMessage.includes('trend') || lowerMessage.includes('analysis')) {
      return {
        content: `Performance Trend Analysis:\n\n📊 Last 30 Days:\n• Average efficiency: 93.1% (↑2.3%)\n• Peak load utilization: 89.2% (↑1.8%)\n• Renewable integration: 42.8% (↑5.2%)\n\n🎯 Key Trends:\n• Efficiency improving consistently\n• Renewable share increasing\n• Load patterns becoming more predictable`,
        quickActions: [
          { id: 'trend-report', label: 'Generate Trend Report', action: 'trend_report', category: 'analysis' },
          { id: 'benchmark-comparison', label: 'Benchmark Comparison', action: 'benchmark_comparison', category: 'analysis' },
        ],
      };
    }
    
    return {
      content: `I'm your analytics expert! I can provide insights on:\n\n• Performance trend analysis\n• Load forecasting and predictions\n• Efficiency optimization opportunities\n• Custom report generation\n\nWhat data analysis can I help you with?`,
      quickActions: [
        { id: 'performance-analysis', label: 'Performance Analysis', action: 'performance_analysis', category: 'analysis' },
        { id: 'generate-report', label: 'Generate Report', action: 'generate_report', category: 'analysis' },
      ],
    };
  }
  
  // Security Consultant responses
  if (agent.role === 'security') {
    if (lowerMessage.includes('security') || lowerMessage.includes('threat')) {
      return {
        content: `Security Status Report:\n\n🛡️ Overall Security Score: 94.2/100\n\n⚠️ Active Threats:\n• 1 Medium risk vulnerability (SSL certificate expiring)\n• 2 Low risk items (routine updates pending)\n\n✅ Recent Actions:\n• Blocked 15 suspicious login attempts\n• Updated 3 security policies\n• Completed quarterly security scan`,
        quickActions: [
          { id: 'threat-details', label: 'View Threat Details', action: 'threat_details', category: 'status' },
          { id: 'security-scan', label: 'Run Security Scan', action: 'security_scan', category: 'control' },
        ],
      };
    }
    
    if (lowerMessage.includes('compliance') || lowerMessage.includes('audit')) {
      return {
        content: `Compliance Status Overview:\n\n📋 NERC CIP: 94.5% compliant\n• CIP-002: ✅ Compliant\n• CIP-003: ✅ Compliant  \n• CIP-005: ⚠️ Partial (network monitoring gaps)\n\n📋 ISO 27001: 91.2% compliant\n• Access Control: ✅ Compliant\n• Information Security: ⚠️ Policy review overdue\n\nNext audit: 45 days`,
        quickActions: [
          { id: 'compliance-report', label: 'Generate Compliance Report', action: 'compliance_report', category: 'analysis' },
          { id: 'remediation-plan', label: 'View Remediation Plan', action: 'remediation_plan', category: 'control' },
        ],
      };
    }
    
    return {
      content: `I'm your security consultant! I can assist with:\n\n• Security threat monitoring\n• Compliance status tracking\n• Incident response guidance\n• Security best practices\n\nWhat security aspect would you like to discuss?`,
      quickActions: [
        { id: 'security-overview', label: 'Security Overview', action: 'security_overview', category: 'status' },
        { id: 'compliance-check', label: 'Compliance Check', action: 'compliance_check', category: 'analysis' },
      ],
    };
  }
  
  // Default response
  return {
    content: `I'm here to help! As your ${agent.name}, I can assist with ${agent.specialties.join(', ').toLowerCase()}. What would you like to know?`,
  };
};

export const useAIAgentsStore = create<AIAgentsState>()(
  persist(
    (set, get) => ({
      agents: generateAgents(),
      activeAgentId: null,
      currentSession: null,
      chatHistory: [],
      isTyping: false,
      isProcessing: false,

      setActiveAgent: (agentId) => {
        const agent = get().agents.find(a => a.id === agentId);
        if (!agent) return;

        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          agentId,
          messages: [
            {
              id: `msg-${Date.now()}`,
              agentId,
              content: `Hello! I'm ${agent.name}, your ${agent.description.toLowerCase()}. How can I assist you today?`,
              type: 'agent',
              timestamp: Date.now(),
              quickActions: [
                { id: 'help', label: 'What can you help with?', action: 'help', category: 'help' },
                { id: 'status', label: 'System Status', action: 'status', category: 'status' },
              ],
            },
          ],
          startTime: Date.now(),
          lastActivity: Date.now(),
          context: {},
        };

        set({
          activeAgentId: agentId,
          currentSession: newSession,
        });
      },

      sendMessage: (content) => {
        const { activeAgentId, currentSession, agents } = get();
        if (!activeAgentId || !currentSession) return;

        const agent = agents.find(a => a.id === activeAgentId);
        if (!agent) return;

        // Add user message
        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}-user`,
          agentId: activeAgentId,
          content,
          type: 'user',
          timestamp: Date.now(),
        };

        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            messages: [...state.currentSession.messages, userMessage],
            lastActivity: Date.now(),
          } : null,
          isProcessing: true,
        }));

        // Simulate AI processing delay
        setTimeout(() => {
          const response = generateAIResponse(agent, content);
          
          const agentMessage: ChatMessage = {
            id: `msg-${Date.now()}-agent`,
            agentId: activeAgentId,
            content: response.content,
            type: 'agent',
            timestamp: Date.now(),
            quickActions: response.quickActions,
          };

          set((state) => ({
            currentSession: state.currentSession ? {
              ...state.currentSession,
              messages: [...state.currentSession.messages, agentMessage],
              lastActivity: Date.now(),
            } : null,
            isProcessing: false,
          }));
        }, 1000 + Math.random() * 2000); // 1-3 second delay
      },

      executeQuickAction: (action) => {
        const actionMessages: Record<string, string> = {
          help: "I can help you with various tasks related to my expertise. What specific area would you like assistance with?",
          status: "Let me check the current system status for you...",
          efficiency_details: "Here are the detailed efficiency metrics for your review...",
          optimize_load: "Initiating load optimization analysis...",
          system_status: "Checking all system components and their current operational status...",
          performance_check: "Running comprehensive performance analysis...",
          equipment_health: "Analyzing equipment health across all grid components...",
          maintenance_schedule: "Retrieving current and upcoming maintenance schedules...",
          performance_analysis: "Generating comprehensive performance analysis report...",
          generate_report: "Creating custom analytics report based on your requirements...",
          security_overview: "Compiling current security status and threat assessment...",
          compliance_check: "Reviewing compliance status across all applicable frameworks...",
        };

        const message = actionMessages[action.action] || `Executing ${action.label}...`;
        get().sendMessage(message);
      },

      clearChat: () => {
        const { currentSession, chatHistory } = get();
        if (currentSession) {
          set({
            chatHistory: [...chatHistory, currentSession],
            currentSession: null,
            activeAgentId: null,
          });
        }
      },

      loadChatHistory: () => {
        // Implementation for loading chat history
        console.log('Loading chat history...');
      },

      updateAgentStatus: (agentId, status) => {
        set((state) => ({
          agents: state.agents.map(agent =>
            agent.id === agentId ? { ...agent, status } : agent
          ),
        }));
      },
    }),
    {
      name: 'ai-agents-storage',
      partialize: (state) => ({
        chatHistory: state.chatHistory,
      }),
    }
  )
);