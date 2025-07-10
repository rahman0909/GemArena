
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import useLocalStorage from './hooks/useLocalStorage';
import type { Chat } from './types';

function App() {
  const [chats, setChats] = useLocalStorage<Chat[]>('chats', []);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // If there's no active chat, select the most recent one.
    if (!activeChatId && chats.length > 0) {
      const sortedChats = [...chats].sort((a, b) => b.createdAt - a.createdAt);
      setActiveChatId(sortedChats[0].id);
    }
    // If the active chat was deleted, select another one or none.
    if (activeChatId && !chats.some(c => c.id === activeChatId)) {
      const sortedChats = [...chats].sort((a, b) => b.createdAt - a.createdAt);
      setActiveChatId(sortedChats.length > 0 ? sortedChats[0].id : null);
    }
  }, [chats, activeChatId]);


  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setChats(prevChats => [newChat, ...prevChats]);
    setActiveChatId(newChat.id);
  }, [setChats]);

  const handleDeleteChat = useCallback((id: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== id));
  }, [setChats]);


  // Update chat title based on first user message
  useEffect(() => {
    const activeChat = chats.find(c => c.id === activeChatId);
    if (activeChat && activeChat.title === 'New Chat' && activeChat.messages.length > 0) {
      const firstUserMessage = activeChat.messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        const newTitle = firstUserMessage.content.substring(0, 25) + (firstUserMessage.content.length > 25 ? '...' : '');
        setChats(prev => prev.map(c => c.id === activeChatId ? {...c, title: newTitle} : c));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, activeChatId]); // This should run when chats change

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat}
      />
      <main className="flex-1">
        <ChatView chat={activeChat} setChats={setChats} />
      </main>
    </div>
  );
}

export default App;
