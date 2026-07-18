// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiHelper from '../utils/apiHelper';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('webToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    
    try {
      const response = await apiHelper.get("/webauth/me");
      if (response.success) {
        setUser(response.user);
        // Store user type for quick access
        localStorage.setItem('userType', response.user.isVendor ? 'vendor' : 'user');
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userType', userData.isVendor ? 'vendor' : 'user');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('webToken');
    localStorage.removeItem('userType');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isVendor: user?.isVendor || false,
    refreshUser: fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};