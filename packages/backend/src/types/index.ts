import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SensorData {
  deviceId: string;
  soilMoisture: number;
  temperature: number;
  airHumidity: number;
  lightLevel: number;
  waterLevel: number;
  timestamp: Date;
}

export interface DeviceControl {
  deviceId: string;
  control: string;
  value: any;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
