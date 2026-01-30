import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('ENV Supabase belum diatur. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY ada di file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Get current authenticated user with profile data
 * @returns {Promise<Object|null>} User object with profile or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData?.user) {
      console.error('Auth error:', authError);
      return null;
    }

    const user = authData.user;

    // Fetch user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Return basic user info if profile doesn't exist
      return {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || 'User',
        created_at: user.created_at,
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      username: profile.username || user.user_metadata?.username || 'User',
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Subscribe to realtime messages from the messages table
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Object} Subscription object with unsubscribe method
 */
export const subscribeToMessages = (callback) => {
  const channel = supabase
    .channel('messages-realtime')
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      },
      (payload) => {
        try {
          callback(payload);
        } catch (error) {
          console.error('Error in message subscription callback:', error);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to messages');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Error subscribing to messages channel');
      } else if (status === 'TIMED_OUT') {
        console.error('Realtime subscription timed out');
      }
    });

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
};

/**
 * Check if user session is valid
 * @returns {Promise<boolean>} True if session is valid, false otherwise
 */
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session check error:', error);
      return false;
    }
    return !!session;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

/**
 * Sign out current user
 * @returns {Promise<Object>} Result of sign out operation
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
};

/**
 * Fetch messages with pagination support
 * @param {number} limit - Number of messages to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of messages with user data
 */
export const fetchMessages = async (limit = 100, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:users (
          username,
          email
        )
      `)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { data: [], error };
  }
};

/**
 * Send a new message
 * @param {string} content - Message content
 * @param {string} userId - User ID of sender
 * @returns {Promise<Object>} Result of insert operation
 */
export const sendMessage = async (content, userId) => {
  try {
    if (!content || !content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }
};

/**
 * Delete a message (only if user is the owner)
 * @param {string} messageId - ID of message to delete
 * @param {string} userId - ID of user attempting to delete
 * @returns {Promise<Object>} Result of delete operation
 */
export const deleteMessage = async (messageId, userId) => {
  try {
    // First verify the message belongs to the user
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('user_id')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;
    
    if (message.user_id !== userId) {
      throw new Error('Unauthorized: Cannot delete message from another user');
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error };
  }
};

export default supabase;