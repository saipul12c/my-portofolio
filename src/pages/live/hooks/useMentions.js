// Hook untuk mengelola mention & tag system
import { useState, useCallback } from 'react';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

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
      const response = await fetch(
        `${DATABASE_URL}/users?nama_like=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setMentionedUsers(data.slice(0, 5)); // Limit 5 hasil
        return data.slice(0, 5);
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
      const response = await fetch(`${DATABASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          user_id: userId,
          tag: tag,
          created_at: new Date().toISOString()
        })
      });

      if (response.ok) {
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
      const response = await fetch(
        `${DATABASE_URL}/tags?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
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