'use client';

import { memo, useEffect, useRef } from 'react';
import { List, AutoSizer, ListRowProps } from 'react-virtualized';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

const MessageBubble = memo(({ message, onRetry }: MessageBubbleProps) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} py-2`}>
      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          message.role === 'user'
            ? 'bg-[#0084ff] text-white chat-bubble-right'
            : 'bg-[#f0f0f0]/10 text-white chat-bubble-left'
        }`}
      >
        {message.content}
        {message.status === 'error' && (
          <button 
            onClick={() => onRetry?.(message.id)}
            className="ml-2 text-xs text-red-500 hover:text-red-400"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
});

interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
  onRetry?: (messageId: string) => void;
}

export const MessageList = memo(({ messages, streamingMessage, onRetry }: MessageListProps) => {
  const listRef = useRef<List | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToRow(messages.length - 1);
    }
  }, [messages.length]);

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const message = messages[index];
    return (
      <div key={key} style={style}>
        <MessageBubble message={message} onRetry={onRetry} />
      </div>
    );
  };

  // Calculate dynamic row heights based on content
  const getRowHeight = ({ index }: { index: number }) => {
    const message = messages[index];
    const contentLength = message.content.length;
    const baseHeight = 60; // Minimum height
    const charactersPerLine = 50; // Approximate characters per line
    const lines = Math.ceil(contentLength / charactersPerLine);
    return Math.max(baseHeight, lines * 24); // 24px per line
  };

  return (
    <div className="flex-1 overflow-hidden">
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={messages.length}
            rowHeight={getRowHeight}
            rowRenderer={rowRenderer}
            scrollToAlignment="end"
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
      {streamingMessage && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#1e1e1e]">
          <div className="flex justify-start">
            <div className="p-3 bg-[#f0f0f0]/10 text-white rounded-lg max-w-[80%]">
              {streamingMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
MessageList.displayName = 'MessageList';