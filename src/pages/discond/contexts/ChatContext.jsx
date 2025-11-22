import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// ✅ Ekspor ChatContext sebagai named export
export const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
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
    let unsubscribe;
    
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      unsubscribe = setupMessagesSubscription(selectedChannel.id);
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedChannel]);

  const fetchServers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at');

      if (error) throw error;
      
      setServers(data || []);
      if (data && data.length > 0) {
        setSelectedServer(data[0]);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async (serverId) => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('server_id', serverId)
        .order('position');

      if (error) throw error;

      if (data && data.length > 0) {
        setSelectedChannel(data[0]);
      } else {
        setSelectedChannel(null);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at')
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchServerMembers = async (serverId) => {
    try {
      const { data, error } = await supabase
        .from('server_members')
        .select(`
          *,
          profiles (*)
        `)
        .eq('server_id', serverId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const setupMessagesSubscription = (channelId) => {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const { data: completeMessage, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles:user_id (
                username,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && completeMessage) {
            setMessages(prev => [...prev, completeMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (content) => {
    if (!selectedChannel || !content.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            channel_id: selectedChannel.id,
            content: content.trim(),
            user_id: user.id
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createServer = async (serverName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('servers')
        .insert([
          {
            name: serverName,
            icon: '🆕',
            is_public: true,
            owner_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('server_members')
        .insert([
          {
            server_id: data.id,
            user_id: user.id,
            role: 'owner'
          }
        ]);

      setServers(prev => [...prev, data]);
      setSelectedServer(data);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const value = {
    servers,
    selectedServer,
    selectedChannel,
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

// ✅ Ekspor useChat sebagai named export
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// ✅ Ekspor default untuk kompatibilitas
export default ChatContext;