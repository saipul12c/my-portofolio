import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '../lib/auth';
import { checkHealth } from '../lib/backend';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      // avoid calling backend if dev proxy/backend is down
      const healthy = await checkHealth(2000).catch(() => false);
      if (!healthy) {
        setUser(null);
        setLoading(false);
        return;
      }

      let token = null;
      try {
        token = localStorage.getItem('token');
      } catch (e) {
        token = null;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      const u = await auth.me();
      setUser(u || null);
    } catch (err) {
      // silent fallback when backend is unavailable or request fails
      console.debug && console.debug('Auth load user skipped or failed:', err?.message || err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password }) => {
    const res = await auth.signin({ email, password });
    if (res && res.token) {
      try {
        localStorage.setItem('token', res.token);
      } catch (e) {}
      // immediately load user
      const u = await auth.me();
      setUser(u || null);
    }
    return res;
  };

  const register = async ({ email, password, username }) => {
    const res = await auth.signup({ email, password, username });
    if (res && res.token) {
      try {
        localStorage.setItem('token', res.token);
      } catch (e) {}
      const u = await auth.me();
      setUser(u || null);
    }
    return res;
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
