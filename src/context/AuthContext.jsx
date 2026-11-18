import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session dengan fallback offline aman
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!isMounted) return;
        const initialSession = data?.session || null;
        setSession(initialSession);

        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.warn('[AuthContext] Inisialisasi sesi Supabase gagal (offline/unreachable):', err?.message || err);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false); // Pastikan loading selalu selesai agar aplikasi tidak macet
        }
      }
    };

    initSession();

    // Listen for auth changes
    let subscription = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;
        try {
          setSession(newSession);
          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id);
          } else {
            setUser(null);
            setLoading(false);
          }
        } catch (innerErr) {
          console.warn('[AuthContext] Gagal memproses perubahan sesi auth:', innerErr);
          setUser(null);
          setLoading(false);
        }
      });
      subscription = data?.subscription;
    } catch (e) {
      console.warn('[AuthContext] Gagal subscribe ke onAuthStateChange:', e);
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        // Fallback ke auth metadata jika tabel users tidak ditemukan / offline
        try {
          const authRes = await supabase.auth.getUser();
          const authUser = authRes?.data?.user;
          setUser({
            id: userId,
            email: authUser?.email || '',
            username: authUser?.user_metadata?.nama || authUser?.email?.split('@')[0] || 'User',
            role: 'USER'
          });
        } catch {
          setUser({
            id: userId,
            email: '',
            username: 'User',
            role: 'USER'
          });
        }
      } else {
        setUser({
          ...data,
          username: data.nama || data.username // mapping for consistency
        });
      }
    } catch (err) {
      console.warn('[AuthContext] Gagal mengambil profil user (menggunakan fallback):', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (err) {
      console.warn('[AuthContext] Login error (offline):', err);
      return { 
        data: null, 
        error: { message: 'Koneksi ke server gagal atau sedang offline. Silakan periksa jaringan Anda.' } 
      };
    }
  };

  const register = async ({ email, password, username }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama: username
          }
        }
      });
      return { data, error };
    } catch (err) {
      console.warn('[AuthContext] Register error (offline):', err);
      return { 
        data: null, 
        error: { message: 'Koneksi ke server gagal atau sedang offline. Silakan periksa jaringan Anda.' } 
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return { error };
    } catch (err) {
      console.warn('[AuthContext] Logout offline fallback:', err);
      setUser(null);
      setSession(null);
      return { error: null };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
