import React, { useContext, useState, useEffect } from 'react';
import { friendlyFetchError } from '../utils/helpers';
import { AuthContext } from './AuthContextObject';
import api from '../lib/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.auth.me();
        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchUserProfile = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const data = await api.auth.me();
      setUser(data);
      return;
    } catch (err) {
      const localUser = {
        id: userId || `local-${Date.now()}`,
        username: localStorage.getItem('username') || 'localuser',
        email: localStorage.getItem('email') || 'local@local.dev',
        role: 'user',
        tier: 'bronze'
      };
      setUser(localUser);
      return;
    }
  };

  const signUp = async (email, password, username) => {
    try {
      try {
        const data = await api.auth.signUp(email, password, username);
        if (data?.error) return { error: data.error };
        if (data?.token) localStorage.setItem('token', data.token);
        await fetchUserProfile(data?.user?.id || data?.id);
        return { error: null };
      } catch (err) {
        const mockUser = { id: `local-${Date.now()}`, username: username || email.split('@')[0], email, role: 'user', tier: 'bronze' };
        localStorage.setItem('token', 'local-dev-token');
        localStorage.setItem('username', mockUser.username);
        localStorage.setItem('email', mockUser.email);
        setUser(mockUser);
        return { error: null };
      }
    } catch (error) {
      return { error: friendlyFetchError(error) };
    }
  };

  const signIn = async (email, password) => {
    try {
      try {
        const data = await api.auth.signIn(email, password);
        if (data?.error) return { error: data.error };
        if (data?.token) localStorage.setItem('token', data.token);
        await fetchUserProfile(data?.user?.id || data?.id);
        return { error: null };
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          const mockUser = { id: `local-${Date.now()}`, username: email.split('@')[0], email, role: 'user', tier: 'bronze' };
          localStorage.setItem('token', 'local-dev-token');
          localStorage.setItem('username', mockUser.username);
          localStorage.setItem('email', mockUser.email);
          setUser(mockUser);
          return { error: null };
        }
        return { error: friendlyFetchError(err) };
      }
    } catch (error) {
      return { error: friendlyFetchError(error) };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { error: 'Not authenticated' };
      const data = await api.profiles.update(user.id, updates);
      if (data?.error) return { error: data.error };
      setUser(prev => ({ ...prev, ...data }));
      return { error: null };
    } catch (error) {
      return { error: friendlyFetchError(error) };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthProvider;