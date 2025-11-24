import { apiClient } from './client';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types/api';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '@/constants/config';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    const data = response.data.data;
    
    // Сохраняем токены
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    
    return data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.REGISTER,
      data
    );
    
    const authData = response.data.data;
    
    await SecureStore.setItemAsync('accessToken', authData.accessToken);
    await SecureStore.setItemAsync('refreshToken', authData.refreshToken);
    
    return authData;
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
