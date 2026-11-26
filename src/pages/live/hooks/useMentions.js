import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabaseClient';

export const useMentions = () => {
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = useCallback(async (query) => {
    if (!query || query.length < 1 || !isSupabaseConfigured || !supabase) {
      setMentionedUsers([]);
      return;
    }

    setLoading(true);
    try {
      // Gunakan RPC profil publik (tanpa mengekspos email pengguna)
      let { data, error } = await supabase
        .rpc('get_public_profiles')
        .ilike('nama', `%${query}%`)
        .limit(5);

      if (error) {
        const fallback = await supabase
          .from('profiles')
          .select('id, nama, role')
          .ilike('nama', `%${query}%`)
          .limit(5);
        data = fallback.data;
        error = fallback.error;
      }

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