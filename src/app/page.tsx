'use client';

import AuthControls from '@/components/AuthControls';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getMessages } from '@/lib/firestore'; // Adjust the import based on your project structure
import { saveMessage } from "@/lib/firestore"; // adjust path if needed

// At the top of your component (after imports)
const availableModels = [
  { name: 'GPT-3.5 Turbo', value: 'openai/gpt-3.5-turbo' },
  { name: 'GPT-4', value: 'openai/gpt-4' },
  { name: 'Claude 3 Sonnet', value: 'anthropic/claude-3-sonnet:beta' },
  { name: 'Claude 3 Haiku', value: 'anthropic/claude-3-haiku:beta' },
  { name: 'Mistral 7B Instruct', value: 'mistralai/mistral-7b-instruct:free' },
];

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(availableModels[0].value);
  //rename data field to session for clarity
  const { data: session } = useSession();
  console.log('Session:', session);
  useEffect(() => {
    const loadMessages = async () => {
      if (session?.user?.id) {
        // Logged-in: Load from Firestore
        const firestoreMessages = await getMessages(session.user.id);
        setMessages(
          firestoreMessages.map((msg, i) => ({
            id: Date.now() + i, // Give each a temporary ID
            ...msg,
          }))
        );
        // Clear guest data if user logs in
        if (session?.user?.id) {
          localStorage.removeItem("chat_messages");
        }
      } else {
        // Guest: Load from localStorage
        const local = localStorage.getItem("chat_messages");
        if (local) {
          try {
            setMessages(JSON.parse(local));
          } catch (err) {
            console.error("Invalid messages in localStorage");
          }
        }
      }
    };

    loadMessages();
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages, session]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    // 🔐 Save user message to Firestore (if logged in)
    if (session?.user?.id) {
      await saveMessage(session.user.id, {
        role: 'user',
        content: input,
      });
    }

    // 🧠 Call your API here to get assistant reply
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ model, messages: [...messages, { role: 'user', content: input }] }),
    });
    const data = await res.json();

    const newAssistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: data.reply,
    };

    setMessages((prev) => [...prev, newAssistantMessage]);
    // 🔐 Save assistant message to Firestore (if logged in)
    if (session?.user?.id) {
      await saveMessage(session.user.id, {
        role: 'assistant',
        content: data.reply,
      });
    }
  };

  return (
    <main className="flex flex-col h-screen p-4 bg-gray-100">
      <AuthControls />
      <select
        className="mb-4 p-2 border rounded bg-yellow-100"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        {availableModels.map((m) => (
          <option key={m.value} value={m.value}>
            {m.name}
          </option>
        ))}
      </select>
      {/* <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-300 self-start'
              }`}
          >
            {msg.content}
          </div>
        ))}
      </div> */}
      <div className="flex-1 overflow-y-auto space-y-2 bg-white p-2 rounded shadow-inner">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className={`p-2 rounded max-w-[70%] whitespace-pre-wrap ${
        msg.role === 'user' ? 'bg-blue-200 self-end ml-auto' : 'bg-gray-300 self-start mr-auto'
      }`}
    >
      <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
    </div>
  ))}
</div>


      <form className="flex mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </form>
    </main>
  );
}
