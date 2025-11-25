import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/api/authService';
import { User } from '@/types/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import { setDevices, setSelectedDevice } from '@/store/slices/devicesSlice';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Проверка сохраненной сессии при запуске
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        // Здесь можно сделать запрос на /me для получения данных пользователя
        setIsAuthenticated(true);
        // TODO: Fetch user data from API
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken,
      }));
      dispatch(setDevices([]));
      dispatch(setSelectedDevice(null));
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken,
      }));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      dispatch(logoutAction());
      dispatch(setDevices([]));
      dispatch(setSelectedDevice(null));
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
