import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AuthContext } from './authContextObject';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authUser) => {
    if (!authUser?.id || !isSupabaseConfigured || !supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error || !data) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          username: authUser.user_metadata?.nama || authUser.email?.split('@')[0] || 'User',
          role: (authUser.app_metadata?.role || 'USER').toUpperCase(),
          bio: '',
          avatar_url: authUser.user_metadata?.avatar_url || ''
        });
      } else {
        setUser({
          ...data,
          username: data.nama || data.username || authUser.email?.split('@')[0] || 'User',
          role: (data.role || 'USER').toUpperCase()
        });
      }
    } catch (err) {
      console.warn('[AuthContext] Gagal mengambil profil user (menggunakan fallback):', err?.message || err);
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        username: authUser.user_metadata?.nama || authUser.email?.split('@')[0] || 'User',
        role: (authUser.app_metadata?.role || 'USER').toUpperCase()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Inisialisasi sesi dan listener auth TANPA memanggil async Supabase di dalam callback onAuthStateChange
  // (mencegah deadlock Web Locks pada @supabase/auth-js)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initSession = async () => {
      try {
        // Verifikasi user langsung ke server Auth (standar modern Supabase, tanpa mengandalkan getSession lokal)
        const { data: userRes, error: userErr } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (userErr || !userRes?.user) {
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setSession({ user: userRes.user });
      } catch (err) {
        console.warn('[AuthContext] Inisialisasi sesi Supabase gagal (offline/unreachable):', err?.message || err);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      // Hanya lakukan state update sinkron di dalam callback listener
      setSession(newSession);
      if (!newSession?.user) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Ambil profil secara terpisah di luar lock onAuthStateChange saat session.user berubah
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    if (session?.user) {
      fetchUserProfile(session.user);
    }
  }, [session?.user, fetchUserProfile]);

  const login = async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: { message: 'Konfigurasi Supabase belum aktif.' }
      };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
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
    if (!isSupabaseConfigured || !supabase) {
      return {
        data: null,
        error: { message: 'Konfigurasi Supabase belum aktif.' }
      };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            nama: username?.trim()
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

  const updateProfile = async (updates) => {
    if (!isSupabaseConfigured || !supabase || !user?.id) {
      return { error: { message: 'Sesi pengguna tidak aktif.' } };
    }
    try {
      const payload = {
        ...(updates.username !== undefined ? { nama: updates.username.trim() } : {}),
        ...(updates.nama !== undefined ? { nama: updates.nama.trim() } : {}),
        ...(updates.description !== undefined ? { bio: updates.description } : {}),
        ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
        ...(updates.avatar_url !== undefined ? { avatar_url: updates.avatar_url } : {}),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', user.id)
        .select()
        .maybeSingle();

      if (error) return { data: null, error };

      if (data) {
        setUser((prev) => ({
          ...prev,
          ...data,
          username: data.nama || prev?.username
        }));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err?.message || 'Gagal memperbarui profil.' } };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      return { error: null };
    }
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
    <AuthContext.Provider value={{ user, session, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
