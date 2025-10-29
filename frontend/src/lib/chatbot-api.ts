/**
 * Chatbot API Client
 * Handles communication with NikoiDev chatbot backend
 */

import { api } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
  session_id?: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
  tokens_used?: number;
  session_id: string;
}

export interface ChatbotInfo {
  name: string;
  version: string;
  model: string;
  rate_limit: {
    max_requests: number;
    window_seconds: number;
  };
  capabilities: string[];
  languages: string[];
}

export interface ChatbotHealth {
  status: 'healthy' | 'unhealthy';
  chatbot_name?: string;
  timestamp?: string;
  message?: string;
}

/**
 * Send a message to the chatbot
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  return api.post<ChatResponse>('/api/v1/chatbot/chat', request);
}

/**
 * Get chatbot information
 */
export async function getChatbotInfo(): Promise<ChatbotInfo> {
  return api.get<ChatbotInfo>('/api/v1/chatbot/info');
}

/**
 * Check chatbot health status
 */
export async function getChatbotHealth(): Promise<ChatbotHealth> {
  return api.get<ChatbotHealth>('/api/v1/chatbot/health');
}

