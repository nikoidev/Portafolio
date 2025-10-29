/**
 * Chatbot TypeScript types
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastMessageAt: Date;
}

export interface ChatbotState {
  isOpen: boolean;
  isLoading: boolean;
  currentSession: ChatSession | null;
  error: string | null;
}

