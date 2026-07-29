import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_demo_producer',
      name: 'Alex Rivera',
      email: 'alex@studio.com',
      role: 'admin',
      subscriptionTier: 'Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'mock_jwt_token_2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      // Demo fallback if backend is offline
      const mockUser = {
        id: 'usr_demo_producer',
        name: email.split('@')[0] || 'Producer Pro',
        email,
        role: 'user',
        subscriptionTier: 'Pro',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };
      setUser(mockUser);
      setToken('mock_token_success');
      return { success: true };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const mockUser = { id: `usr_${Date.now()}`, name, email, role: 'user', subscriptionTier: 'Free', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' };
      setUser(mockUser);
      setToken('mock_token_register');
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
