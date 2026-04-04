import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useMentions = () => {
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [personalTags, setPersonalTags] = useState([]);

  // Cari user untuk mention
  const searchUsers = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setMentionedUsers([]);
      return [];
    }

    try {
      const { data, error } = await supabase.from('users').select('*').ilike('nama', `%${query}%`).limit(5);

      if (!error && data && data.length > 0) {
        setMentionedUsers(data);
        return data;
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
    return [];
  }, []);

  // Tambah mention ke pesan
  const addMentionToMessage = (message, user) => {
    return message + ` @${user.nama}`;
  };

  // Extract mention dari pesan
  const extractMentions = (message) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(message)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  };

  // Tambah tag personal untuk user
  const addPersonalTag = useCallback(async (email, userId, tag) => {
    try {
      const { error } = await supabase.from('tags').insert([{
        email,
        user_id: userId,
        tag: tag,
        created_at: new Date().toISOString()
      }]);

      if (!error) {
        setPersonalTags(prev => [...prev, { email, user_id: userId, tag }]);
        return true;
      }
    } catch (error) {
      console.error('Error adding personal tag:', error);
    }
    return false;
  }, []);

  // Load personal tags
  const loadPersonalTags = useCallback(async (email) => {
    try {
      const { data, error } = await supabase.from('tags').select('*').eq('email', email);

      if (!error && data && data.length > 0) {
        setPersonalTags(data);
      }
    } catch (error) {
      console.error('Error loading personal tags:', error);
    }
  }, []);

  // Get tag untuk user tertentu
  const getTagForUser = (userId) => {
    const tag = personalTags.find(t => t.user_id === userId);
    return tag ? tag.tag : null;
  };

  return {
    mentionedUsers,
    personalTags,
    searchUsers,
    addMentionToMessage,
    extractMentions,
    addPersonalTag,
    loadPersonalTags,
    getTagForUser
  };
};