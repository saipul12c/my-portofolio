import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { friendlyFetchError } from '../utils/helpers';

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
          if (!me.ok) { console.error('Chat init auth error', friendlyFetchError(null, me)); setLoading(false); return; }
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
      try {
        const res = await fetch('/api/servers');
        if (!res.ok) { console.error('Error fetching servers', friendlyFetchError(null, res)); setServers([]); return; }
        const data = await res.json();
        setServers(data || []);
        if (data && data.length > 0) setSelectedServer(data[0]);
        return;
      } catch (err) {
        // fallback mock servers for local/dev
        const mock = [
          { id: 'local-1', name: 'Local Server', icon: '🌐', is_public: true },
          { id: 'local-2', name: 'Community Hub', icon: '🛠️', is_public: true }
        ];
        setServers(mock);
        setSelectedServer(mock[0]);
        return;
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const fetchChannels = async (serverId) => {
    try {
      try {
        const res = await fetch(`/api/channels?server_id=${serverId}`);
        if (!res.ok) { console.error('Error fetching channels', friendlyFetchError(null, res)); setChannels([]); setSelectedChannel(null); return; }
        const data = await res.json();
        setChannels(data || []);
        if (data && data.length > 0) setSelectedChannel(data[0]);
        else setSelectedChannel(null);
        return;
      } catch (err) {
        // fallback mock channels
        const mock = [
          { id: `ch-${serverId}-1`, name: 'general', type: 'text' },
          { id: `ch-${serverId}-2`, name: 'random', type: 'text' }
        ];
        setChannels(mock);
        setSelectedChannel(mock[0]);
        return;
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      try {
        const res = await fetch(`/api/messages?channel_id=${channelId}`);
        if (!res.ok) { console.error('Error fetching messages', friendlyFetchError(null, res)); setMessages([]); return; }
        const data = await res.json();
        setMessages(data || []);
        return;
      } catch (err) {
        // fallback mock messages
        const mock = [
          { id: `m-${channelId}-1`, content: 'Halo! Selamat datang di channel.', created_at: new Date().toISOString(), profiles: { username: 'System' } },
          { id: `m-${channelId}-2`, content: 'Ini adalah pesan percobaan.', created_at: new Date().toISOString(), profiles: { username: 'LocalUser' } }
        ];
        setMessages(mock);
        return;
      }
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
      const base = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : undefined;
      socketRef.current = io(base, { auth: { token } });
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
        try {
          const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel_id: selectedChannel.id, content: content.trim(), user_id: currentUserId }) });
          if (!res.ok) console.error('Error sending message', friendlyFetchError(null, res));
        } catch (err) {
          // fallback: append locally so UI feels responsive without backend
          const mockMsg = { id: `local-${Date.now()}`, content: content.trim(), created_at: new Date().toISOString(), profiles: { username: localStorage.getItem('username') || 'You' } };
          setMessages(prev => [...prev, mockMsg]);
        }
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
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          return { error: data?.error || friendlyFetchError(null, res) };
        }
      await fetchServers();
      return { error: null };
    } catch (error) {
      return { error: friendlyFetchError(error) };
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