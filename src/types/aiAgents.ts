export interface AIAgent {
  id: string;
  name: string;
  role: 'operator' | 'maintenance' | 'analytics' | 'security';
  avatar: string;
  description: string;
  specialties: string[];
  status: 'online' | 'busy' | 'offline';
  personality: {
    tone: 'professional' | 'friendly' | 'technical' | 'urgent';
    expertise: string[];
    responseStyle: string;
  };
}

export interface ChatMessage {
  id: string;
  agentId: string;
  content: string;
  type: 'user' | 'agent';
  timestamp: number;
  isTyping?: boolean;
  quickActions?: QuickAction[];
  attachments?: MessageAttachment[];
}

export interface QuickAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
  category: 'status' | 'control' | 'analysis' | 'help';
}

export interface MessageAttachment {
  id: string;
  type: 'chart' | 'report' | 'image' | 'data';
  title: string;
  url?: string;
  data?: any;
}

export interface ChatSession {
  id: string;
  agentId: string;
  messages: ChatMessage[];
  startTime: number;
  lastActivity: number;
  context: Record<string, any>;
}

export interface AIAgentsState {
  agents: AIAgent[];
  activeAgentId: string | null;
  currentSession: ChatSession | null;
  chatHistory: ChatSession[];
  isTyping: boolean;
  isProcessing: boolean;
  
  // Actions
  setActiveAgent: (agentId: string) => void;
  sendMessage: (content: string) => void;
  executeQuickAction: (action: QuickAction) => void;
  clearChat: () => void;
  loadChatHistory: () => void;
  updateAgentStatus: (agentId: string, status: AIAgent['status']) => void;
}