import { apiClient } from './client';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types/api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login',
      credentials
    );
    
    // Сохраняем токены
    await SecureStore.setItemAsync('accessToken', response.data.data.accessToken);
    await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
    
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/register',
      data
    );
    
    await SecureStore.setItemAsync('accessToken', response.data.data.accessToken);
    await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
    
    return response.data.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },

  async checkAuth(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('accessToken');
    return !!token;
  },
};
