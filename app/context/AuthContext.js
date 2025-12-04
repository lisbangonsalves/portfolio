'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    try {
      const loggedInUser = localStorage.getItem('adminUser');
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    } catch (error) {
      // Clear corrupted data
      localStorage.removeItem('adminUser');
      console.error('Failed to parse user data:', error);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Admin credentials from environment variables
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = { email: ADMIN_EMAIL, name: 'Admin' };
      setUser(userData);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
