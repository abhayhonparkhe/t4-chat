import { Timestamp } from 'firebase/firestore';

export type MessageRole = 'user' | 'assistant';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date | Timestamp;
  status?: MessageStatus;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}