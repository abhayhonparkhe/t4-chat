'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getChats, deleteChat } from "@/lib/firestore";
import { Chat } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { debounce } from "lodash";
import {
  Plus,
  Search,
  Github,
  LogOut,
  Trash2,
  Loader2,
} from "lucide-react";

interface SidebarProps {
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  currentChatId: string | null;
}

export default function Sidebar({ onChatSelect, onNewChat, currentChatId }: SidebarProps) {
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    try {
      if (session?.user?.id) {
        const loadedChats = await getChats(session.user.id);
        setChats(loadedChats.filter(chat => chat && chat.title));
      } else {
        const savedChats = localStorage.getItem('local_chats');
        if (savedChats) {
          setChats(JSON.parse(savedChats));
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    const handleChatsUpdated = () => loadChats();
    window.addEventListener('chatsUpdated', handleChatsUpdated);
    return () => window.removeEventListener('chatsUpdated', handleChatsUpdated);
  }, [loadChats]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    []
  );

  const filteredChats = useMemo(() => 
    chats.filter(chat => 
      chat.title.toLowerCase().includes(search.toLowerCase())
    ),
    [chats, search]
  );

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chatId || !session?.user?.id) return;

    try {
      await deleteChat(session.user.id, chatId);
      await loadChats();
      
      if (chatId === currentChatId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-80 h-screen overflow-hidden">
      <div className="absolute inset-0 sidebar-bg" />
      
      <div className="relative z-10 h-full glass-sidebar flex flex-col text-white">
        {/* Profile Section */}
        <div className="p-4">
          {session ? (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-white/10"
                  />
                )}
                <span className="font-medium">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button className="github-signin" onClickCapture={() => signIn('github')}>
              <Github size={16} />
              Sign in with GitHub
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <button
            onClick={onNewChat}
            className="w-full py-2.5 px-4 glass-button rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative w-full">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search chats..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="glass-search w-full h-10 pl-10 pr-4 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto"> {/* Removed px-2 */}
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 size={24} className="animate-spin text-white/50" />
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`chat-list-item cursor-pointer group ${
                  currentChatId === chat.id ? 'active' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <p className="text-sm text-white/60 truncate">{chat.lastMessage}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition-all ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}