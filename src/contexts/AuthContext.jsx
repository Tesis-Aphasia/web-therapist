import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { loginTherapist, getTherapistData } from '../services/therapistService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedEmail = localStorage.getItem(STORAGE_KEYS.THERAPIST_EMAIL);
        if (storedEmail) {
          const userData = await getTherapistData(storedEmail);
          if (userData) {
            setUser(userData);
          } else {
            // Invalid stored data, clear it
            localStorage.removeItem(STORAGE_KEYS.THERAPIST_EMAIL);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        localStorage.removeItem(STORAGE_KEYS.THERAPIST_EMAIL);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const isValid = await loginTherapist(email, password);
      if (!isValid) {
        throw new Error('Credenciales incorrectas');
      }

      const userData = await getTherapistData(email);
      if (!userData) {
        throw new Error('Error al obtener datos del usuario');
      }

      localStorage.setItem(STORAGE_KEYS.THERAPIST_EMAIL, email);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.THERAPIST_EMAIL);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getCurrentUser = () => {
    return user;
  };

  const getCurrentUserEmail = () => {
    return user?.email || user?.id || null;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    getCurrentUserEmail,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
