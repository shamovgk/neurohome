import { apiClient } from './client';
import { Device } from '@/types/device';
import { ApiResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/constants/config';

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const response = await apiClient.get<ApiResponse<Device[]>>(
      API_ENDPOINTS.DEVICES
    );
    return response.data.data;
  },

  async getDevice(id: string): Promise<Device> {
    const response = await apiClient.get<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICE_BY_ID(id)
    );
    return response.data.data;
  },

  async createDevice(device: {
    name: string;
    type?: string;
    location?: string;
  }): Promise<Device> {
    const response = await apiClient.post<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICES,
      device
    );
    return response.data.data;
  },

  async updateDevice(
    id: string,
    updates: { name?: string; location?: string }
  ): Promise<Device> {
    const response = await apiClient.put<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICE_BY_ID(id),
      updates
    );
    return response.data.data;
  },

  async deleteDevice(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DEVICE_BY_ID(id));
  },
};
