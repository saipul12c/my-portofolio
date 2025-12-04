import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const me = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!me.ok) { setLoading(false); return; }
        const user = await me.json();
        setCurrentUserId(user.id);
        await fetchServers();
      } catch (err) {
        console.error('Chat init error', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedServer) {
      fetchChannels(selectedServer.id);
      fetchServerMembers(selectedServer.id);
    } else {
      setSelectedChannel(null);
      setMessages([]);
      setMembers([]);
    }
  }, [selectedServer]);

  useEffect(() => {
    let cleanup = null;
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      cleanup = setupMessagesSubscription(selectedChannel.id);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [selectedChannel]);

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/servers');
      if (!res.ok) { setServers([]); return; }
      const data = await res.json();
      setServers(data || []);
      if (data && data.length > 0) setSelectedServer(data[0]);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const fetchChannels = async (serverId) => {
    try {
      const res = await fetch(`/api/channels?server_id=${serverId}`);
      if (!res.ok) { setChannels([]); setSelectedChannel(null); return; }
      const data = await res.json();
      setChannels(data || []);
      if (data && data.length > 0) setSelectedChannel(data[0]);
      else setSelectedChannel(null);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const res = await fetch(`/api/messages?channel_id=${channelId}`);
      if (!res.ok) { setMessages([]); return; }
      const data = await res.json();
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchServerMembers = async (serverId) => {
    // not implemented in JSON backend; keep empty
    setMembers([]);
  };

  const setupMessagesSubscription = (channelId) => {
    const token = localStorage.getItem('token');
    if (!socketRef.current) {
      socketRef.current = io(undefined, { auth: { token } });
    }
    const socket = socketRef.current;
    socket.emit('join', { channelId });
    const handler = (msg) => setMessages(prev => [...prev, msg]);
    socket.on('message', handler);
    return () => {
      socket.off('message', handler);
      socket.emit('leave', { channelId });
    };
  };

  const sendMessage = async (content) => {
    if (!selectedChannel || !content.trim()) return;
    try {
      const payload = { channelId: selectedChannel.id, content: content.trim(), userId: currentUserId };
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('message', payload);
      } else {
        await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel_id: selectedChannel.id, content: content.trim(), user_id: currentUserId }) });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createServer = async (serverName) => {
    try {
      const serverId = `${Date.now()}-${Math.floor(Math.random()*10000)}`;
      const ch = { server_id: serverId, server_name: serverName, name: 'general', position: 0 };
      const res = await fetch('/api/channels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ch) });
      if (!res.ok) return { error: 'Failed to create server' };
      await fetchServers();
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const value = {
    servers,
    selectedServer,
    selectedChannel,
    channels,
    messages,
    members,
    loading,
    setSelectedServer,
    setSelectedChannel,
    sendMessage,
    createServer
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export default ChatContext;