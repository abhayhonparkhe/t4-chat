import { Message, Chat } from '@/types/chat';
import debounce from 'lodash/debounce';

export const MessageStorage = {
  async saveMessage(chatId: string, message: Message, isGuest: boolean) {
    if (isGuest) {
      const messages = this.getGuestMessages(chatId);
      messages.push(message);
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    }
    return message;
  },

  getGuestMessages(chatId: string): Message[] {
    const stored = localStorage.getItem(`chat_${chatId}`);
    return stored ? JSON.parse(stored) : [];
  }
};

export const streamResponse = async (response: Response, onChunk: (chunk: string) => void) => {
  const reader = response.body?.getReader();
  if (!reader) return '';

  const decoder = new TextDecoder();
  let message = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      message += chunk;
      onChunk(message);
    }
  } finally {
    reader.releaseLock();
  }
  return message;
};

export const generateChatTitle = async (firstMessage: string, model: string) => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{
        role: 'system',
        content: 'Generate a very brief title (2-3 words) based on the topic or main idea of this message.'
      }, {
        role: 'user',
        content: firstMessage
      }],
      model
    })
  });

  const data = await res.json();
  return data.reply || firstMessage.split(' ').slice(0, 3).join(' ');
};

export const debouncedSearch = debounce((term: string, chats: Chat[], callback: (results: Chat[]) => void) => {
  const results = chats.filter(chat => 
    chat.title.toLowerCase().includes(term.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(term.toLowerCase())
  );
  callback(results);
}, 300);