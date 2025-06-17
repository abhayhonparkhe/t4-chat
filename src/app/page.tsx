'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Message, Chat } from '@/types/chat';
import Sidebar from '@/components/Sidebar';
import { getMessages, saveMessage, createNewChat } from '@/lib/firestore';
import ClientOnly from '@/components/ClientOnly';
import { Bot, Send, ChevronDown } from 'lucide-react';

const availableModels = [
  { name: 'GPT-3.5 Turbo', value: 'openai/gpt-3.5-turbo' },
  { name: 'GPT-4', value: 'openai/gpt-4' },
  { name: 'Claude 3 Sonnet', value: 'anthropic/claude-3-sonnet:beta' },
  { name: 'Claude 3 Haiku', value: 'anthropic/claude-3-haiku:beta' },
  { name: 'Mistral 7B Instruct', value: 'mistralai/mistral-7b-instruct:free' },
];

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { data: session } = useSession();
  const [selectedModel, setSelectedModel] = useState(availableModels[0]); // Set default model
  const [isOpen, setIsOpen] = useState(false);

  // Load initial chat history for guest users
  useEffect(() => {
    if (!session?.user?.id) {
      const lastChatId = localStorage.getItem('lastChatId');
      if (lastChatId) {
        setCurrentChatId(lastChatId);
      }
    }
  }, [session?.user?.id]);

  // Wrap loadMessages in useCallback
  const loadMessages = useCallback(async (chatId: string) => {
    setIsLoadingMessages(true);
    try {
      if (session?.user?.id) {
        const loadedMessages = await getMessages(session.user.id, chatId);
        console.log('Loaded messages:', loadedMessages);
        setMessages(loadedMessages);
      } else {
        const localMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '{}');
        setMessages(localMessages[chatId] || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [session?.user?.id]); // Only depend on session user ID

  // Update the useEffect to remove loadMessages from dependencies
  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
      if (!session?.user?.id) {
        localStorage.setItem('lastChatId', currentChatId);
      }
    }
  }, [currentChatId, session?.user?.id, loadMessages]); // Add loadMessages to dependencies

  const saveGuestChat = (chatId: string, message: string, isNew = false) => {
    const localChats = JSON.parse(localStorage.getItem('local_chats') || '[]');
    const timestamp = new Date();
    
    if (isNew) {
      const newChat: Chat = {
        id: chatId,
        title: message.slice(0, 30),
        lastMessage: message,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      localChats.unshift(newChat);
    } else {
      const chatIndex = localChats.findIndex((chat: Chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        localChats[chatIndex] = {
          ...localChats[chatIndex],
          lastMessage: message,
          updatedAt: timestamp
        };
      }
    }
    
    localStorage.setItem('local_chats', JSON.stringify(localChats));
    window.dispatchEvent(new Event('chatsUpdated'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    const userInput = input;
    setInput('');

    try {
      const isNewChat = !currentChatId;
      let chatId = isNewChat ? Date.now().toString() : currentChatId!;
      const timestamp = new Date();

      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userInput,
        createdAt: timestamp
      };

      // Add message to state immediately
      setMessages(prev => [...prev, userMessage]);

      if (session?.user?.id) {
        if (isNewChat) {
          // Create new chat with initial message
          chatId = await createNewChat(session.user.id, chatId, userInput);
          setCurrentChatId(chatId);
        } else {
          // Save message to existing chat, it will create the chat if it doesn't exist
          await saveMessage(session.user.id, chatId, userMessage);
        }
      } else {
        // Handle guest user
        chatId = isNewChat ? Date.now().toString() : currentChatId!;
        const guestMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '{}');
        if (!guestMessages[chatId]) {
          guestMessages[chatId] = [];
        }
        guestMessages[chatId].push(userMessage);
        localStorage.setItem('local_chat_messages', JSON.stringify(guestMessages));
        saveGuestChat(chatId, userInput, isNewChat);
        
        if (isNewChat) {
          setCurrentChatId(chatId);
        }
      }

      // Show loading state
      setIsLoading(true);

      // Get AI response
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel.value
        })
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();

      // Create assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reply || 'Sorry, I could not generate a response.',
        createdAt: new Date()
      };

      // Update UI with assistant message
      setMessages(prev => [...prev, assistantMessage]);

      if (session?.user?.id) {
        // Save assistant message
        await saveMessage(session.user.id, chatId, assistantMessage);
        // Trigger chat list refresh
        window.dispatchEvent(new Event('chatsUpdated'));
      } else {
        // Handle guest user assistant message
        const updatedGuestMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '{}');
        if (!updatedGuestMessages[chatId]) {
          updatedGuestMessages[chatId] = [];
        }
        updatedGuestMessages[chatId].push(assistantMessage);
        localStorage.setItem('local_chat_messages', JSON.stringify(updatedGuestMessages));
        saveGuestChat(chatId, assistantMessage.content);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        createdAt: new Date()
      }]);
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  // Add useEffect to clear messages when starting a new chat
  useEffect(() => {
    if (!currentChatId) {
      setMessages([]);
    }
  }, [currentChatId]);

  // Adjust textarea height
  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const sidebarProps = {
    onChatSelect: setCurrentChatId,
    onNewChat: () => {
      setCurrentChatId(null);
      setMessages([]);
    },
    currentChatId
  };

  return (
    <div className="relative flex h-screen bg-[#1e1e1e]">
      <ClientOnly>
        <Sidebar {...sidebarProps} />
      </ClientOnly>
      
      <main className="flex-1 flex flex-col ml-80 relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 max-w-[70%] ${
                    message.role === 'user' 
                      ? 'chat-bubble-right text-white' 
                      : 'chat-bubble-left text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 relative z-10">
          <div className="flex items-center gap-3">
            {/* Model Selection */}
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="model-select-button"
              >
                <Bot size={16} />
                <span>{selectedModel.name}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popup and backdrop */}
              {isOpen && (
                <>
                  <div className="model-selector-backdrop" onClick={() => setIsOpen(false)} />
                  <div className="model-selector-popup">
                    <div className="text-sm text-white/50 mb-2 px-2">Select AI Model</div>
                    {availableModels.map((model) => (
                      <div
                        key={model.value}
                        className={`model-selector-option ${selectedModel.value === model.value ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsOpen(false);
                        }}
                      >
                        <Bot size={16} className="mr-2" />
                        {model.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type a message..."
                className="w-full min-h-[48px] max-h-[200px] pl-4 pr-12 glass-input rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none overflow-y-auto"
                rows={1}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  input.trim() && !isLoading
                    ? 'text-blue-500 hover:text-blue-400'
                    : 'text-white/30 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
