import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [owner, setOwner] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((data) => setOwner(data))
      .catch(() => setOwner(null))
      .finally(() => setChecking(false));
  }, []);

  async function login(username, password) {
    const data = await api.login(username, password);
    setOwner(data);
    return data;
  }

  async function logout() {
    await api.logout();
    setOwner(null);
  }

  return (
    <AuthContext.Provider value={{ owner, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
