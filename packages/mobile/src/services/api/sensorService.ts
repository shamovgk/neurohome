import { apiClient } from './client';
import { SensorData } from '@/types/sensor';
import { ApiResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/constants/config';

export const sensorService = {
  async getSensorData(
    deviceId: string,
    params?: {
      limit?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<SensorData[]> {
    const response = await apiClient.get<ApiResponse<SensorData[]>>(
      API_ENDPOINTS.SENSORS(deviceId),
      { params }
    );
    return response.data.data;
  },

  async getLatestSensorData(deviceId: string): Promise<SensorData | null> {
    const response = await apiClient.get<ApiResponse<SensorData>>(
      API_ENDPOINTS.SENSORS_LATEST(deviceId)
    );
    return response.data.data;
  },
};
