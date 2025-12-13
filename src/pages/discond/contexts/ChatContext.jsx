import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { friendlyFetchError } from '../utils/helpers';
import api from '../lib/api';

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
        // Use cookie-based auth (httpOnly cookies). Try to fetch current user; if unauthenticated, continue in fallback/mock mode.
        try {
          const user = await api.auth.me();
          if (user && user.id) setCurrentUserId(user.id);
        } catch (err) {
          console.warn('Chat init auth error (likely unauthenticated):', err);
          // continue, non-authenticated users can still view public servers (or see mock data)
        }
        await fetchServers();
      } catch (err) {
        console.error('Chat init error', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Ensure socket is disconnected when provider unmounts to avoid leaks
  useEffect(() => {
    return () => {
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      } catch (e) { /* ignore */ }
    };
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
        const data = await api.servers.list();
        // normalize/dedupe by id to avoid duplicated server entries from backend
        const uniqueServers = (data || []).reduce((acc, s) => {
          const id = s && s.id ? String(s.id) : JSON.stringify(s);
          if (!acc.map.has(id)) {
            acc.map.set(id, true);
            acc.list.push(s);
          }
          return acc;
        }, { map: new Map(), list: [] }).list;
        setServers(uniqueServers);
        if (uniqueServers && uniqueServers.length > 0) setSelectedServer(uniqueServers[0]);
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
        const data = await api.channels.list(serverId);
        // normalize/dedupe channels by id to avoid duplicate listings
        const uniqueChannels = (data || []).reduce((acc, c) => {
          const id = c && c.id ? String(c.id) : JSON.stringify(c);
          if (!acc.map.has(id)) {
            acc.map.set(id, true);
            acc.list.push(c);
          }
          return acc;
        }, { map: new Map(), list: [] }).list;
        setChannels(uniqueChannels);
        if (uniqueChannels && uniqueChannels.length > 0) setSelectedChannel(uniqueChannels[0]);
        else setSelectedChannel(null);
        return;
      } catch (err) {
        // fallback mock channels
        const mock = [
          { id: `ch-${serverId}-1`, name: 'general', type: 'text', __mock: true },
          { id: `ch-${serverId}-2`, name: 'random', type: 'text', __mock: true }
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
        const data = await api.messages.list(channelId);
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
    try {
      // Try server admin endpoint first
      let data = null;
      try {
        data = await api.serversAdmin.get(serverId).catch(() => null);
      } catch { data = null; }

      // Fallback to discord-style server endpoint
      if (!data) {
        try { data = await api.discord.servers.get(serverId).catch(() => null); } catch { data = null; }
      }

      let membersList = [];
      if (data && Array.isArray(data.members)) membersList = data.members;
      else if (data && Array.isArray(data.users)) membersList = data.users;
      else if (data && Array.isArray(data.members_list)) membersList = data.members_list;
      else {
        // Last-resort: try fetching users (no server filter available)
        try {
          const users = await api.users.list().catch(() => null);
          membersList = Array.isArray(users) ? users.slice(0, 30) : [];
        } catch { membersList = []; }
      }

      // Normalize members and fetch presence where possible
      const normalized = (membersList || []).map(m => ({
        id: m.id || m.user_id || (m.user && m.user.id),
        username: m.username || m.name || (m.user && m.user.username) || 'Unknown',
        avatar_url: m.avatar_url || m.avatar || (m.user && m.user.avatar_url) || null,
        isBot: !!(m.is_bot || m.bot || (m.user && m.user.is_bot)),
        presence: m.presence || 'offline'
      }));

      const presencePromises = normalized.map(async (m) => {
        if (!m.id) return m.presence || 'offline';
        try {
          const p = await api.discord.presence.get(m.id).catch(() => null);
          if (p && p.status) return p.status;
          return m.presence || 'offline';
        } catch { return m.presence || 'offline'; }
      });

      const presResults = await Promise.allSettled(presencePromises);
      const withPresence = normalized.map((m, i) => ({
        ...m,
        presence: presResults[i]?.status === 'fulfilled' ? (presResults[i].value || m.presence) : m.presence
      }));

      setMembers(withPresence);
    } catch (err) {
      console.error('Error fetching server members:', err);
      setMembers([]);
    }
  };

  const setupMessagesSubscription = (channelId) => {
    if (!socketRef.current) {
      const base = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : undefined;
      // Attach token for socket authentication when available
      const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('token') : null;
      const auth = token ? { token } : undefined;
      socketRef.current = io(base, { withCredentials: true, auth });
    }
    const socket = socketRef.current;
    socket.emit('join', { channelId });
    const handler = (msg) => setMessages(prev => [...prev, msg]);
    socket.on('message', handler);
    const typingHandler = (payload) => {
      // payload: { channel_id, user_id, typing, at }
      // optionally show ephemeral typing indicators - simple implementation: add to members state as typing
      setMembers(prev => {
        try {
          const idx = prev.findIndex(m => String(m.id) === String(payload.user_id));
          if (idx === -1) return prev;
          const copy = [...prev];
          copy[idx] = { ...copy[idx], typing: !!payload.typing, typing_at: payload.at };
          return copy;
        } catch (e) { return prev; }
      });
    };
    socket.on('typing', typingHandler);

    const presenceHandler = (payload) => {
      // payload: { user_id, status }
      setMembers(prev => {
        try {
          const idx = prev.findIndex(m => String(m.id) === String(payload.user_id));
          if (idx === -1) return prev;
          const copy = [...prev];
          copy[idx] = { ...copy[idx], presence: payload.status, presence_at: payload.updated_at || new Date().toISOString() };
          return copy;
        } catch (e) { return prev; }
      });
    };
    socket.on('presence', presenceHandler);
    return () => {
      socket.off('message', handler);
      socket.off('typing', typingHandler);
      socket.off('presence', presenceHandler);
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
          await api.messages.send(selectedChannel.id, currentUserId, content.trim());
        } catch (err) {
          // fallback: append locally so UI feels responsive without backend
          const mockMsg = { id: `local-${Date.now()}`, content: content.trim(), created_at: new Date().toISOString(), profiles: { username: localStorage.getItem('username') || 'You' } };
          setMessages(prev => [...prev, mockMsg]);
          console.error('Error sending message via API, appended locally', err);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendTyping = async (isTyping = true) => {
    if (!selectedChannel) return;
    const payload = { channel_id: selectedChannel.id, user_id: currentUserId, typing: !!isTyping };
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('typing', payload);
      } else {
        // fallback to POST endpoint
        await fetch('/api/typing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
    } catch (err) {
      // ignore
    }
  };

  const createServer = async (serverName) => {
    try {
      const serverId = `${Date.now()}-${Math.floor(Math.random()*10000)}`;
      const ch = { server_id: serverId, server_name: serverName, name: 'general', position: 0 };
      try {
        await api.channels.create(ch);
      } catch (err) {
        return { error: err?.error || friendlyFetchError(err) };
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
    createServer,
    sendTyping
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