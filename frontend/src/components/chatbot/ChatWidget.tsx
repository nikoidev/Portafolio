'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Loader2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '@/lib/chatbot-api';
import type { ChatMessage, ChatSession } from '@/types/chatbot';
import { v4 as uuidv4 } from 'uuid';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session
  useEffect(() => {
    if (isOpen && !session) {
      const newSession: ChatSession = {
        id: uuidv4(),
        messages: [
          {
            role: 'assistant',
            content: '¡Hola! 👋 Soy NikoiDev, el asistente de Nicolás. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date().toISOString()
          }
        ],
        startedAt: new Date(),
        lastMessageAt: new Date()
      };
      setSession(newSession);
    }
  }, [isOpen, session]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !session) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Update session with user message
    const updatedSession = {
      ...session,
      messages: [...session.messages, userMessage],
      lastMessageAt: new Date()
    };
    setSession(updatedSession);
    setMessage('');
    setError(null);
    setIsLoading(true);

    try {
      // Send to backend
      const response = await sendChatMessage({
        message: userMessage.content,
        conversation_history: session.messages.slice(-10), // Last 10 messages
        session_id: session.id
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp
      };

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, assistantMessage],
        lastMessageAt: new Date()
      } : null);

    } catch (err: any) {
      console.error('Chat error:', err);
      
      let errorMessage = 'Lo siento, hubo un error. Por favor intenta de nuevo.';
      
      if (err.response?.status === 429) {
        errorMessage = 'Has enviado demasiados mensajes. Por favor espera un momento.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      
      // Add error message to chat
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMsg],
        lastMessageAt: new Date()
      } : null);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow group"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
            style={{ height: isMinimized ? 'auto' : '600px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">NikoiDev</h3>
                  <p className="text-xs text-white/80">Asistente Virtual</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMinimize}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleChat}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                  {session?.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Powered by Gemini Flash 2.5
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

