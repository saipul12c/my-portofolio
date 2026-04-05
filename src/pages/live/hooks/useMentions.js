import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useMentions = () => {
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = useCallback(async (query) => {
    if (!query || query.length < 1) {
      setMentionedUsers([]);
      return;
    }

    setLoading(true);
    try {
      // Search in 'profiles' view to respect privacy
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nama, email')
        .ilike('nama', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setMentionedUsers(data || []);
    } catch (err) {
      console.error('Error searching users for mention:', err);
      setMentionedUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchUsers,
    mentionedUsers,
    loading
  };
};