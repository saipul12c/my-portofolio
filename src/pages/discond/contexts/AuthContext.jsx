import { useContext, useState, useEffect } from 'react';
import { USER_ROLES, USER_TIERS } from '../utils/constants';
import { AuthContext } from './AuthContextObject';

// ✅ Ekspor AuthProvider sebagai named export
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize by checking backend session token
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error checking session', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, username) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Signup failed' };
      // save token
      if (data.token) localStorage.setItem('token', data.token);
      await fetchUserProfile(data.user.id);
      return { error: null };
    } catch (error) {
      return { error: error.message || 'Signup failed' };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Signin failed' };
      if (data.token) localStorage.setItem('token', data.token);
      await fetchUserProfile(data.user.id);
      return { error: null };
    } catch (error) {
      return { error: error.message || 'Signin failed' };
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
      const res = await fetch(`/api/profiles/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Update failed' };
      setUser(prev => ({ ...prev, ...data }));
      return { error: null };
    } catch (error) {
      return { error: error.message };
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

// ✅ Ekspor useAuth sebagai named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ✅ Ekspor default untuk kompatibilitas
export default AuthProvider;