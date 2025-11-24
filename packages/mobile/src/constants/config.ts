import { Platform } from 'react-native';

const getApiUrl = () => {
  const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Для Android эмулятора используем 10.0.2.2 вместо localhost
  if (url.includes('localhost') && Platform.OS === 'android') {
    return url.replace('localhost', '10.0.2.2');
  }
  
  return url;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  WS_URL: process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  
  // Devices
  DEVICES: '/api/v1/devices',
  DEVICE_BY_ID: (id: string) => `/api/v1/devices/${id}`,
  
  // Sensors
  SENSORS: (deviceId: string) => `/api/v1/sensors/${deviceId}`,
  SENSORS_LATEST: (deviceId: string) => `/api/v1/sensors/${deviceId}/latest`,
};

export const SENSOR_UPDATE_INTERVAL = 10000; // 10 секунд для разработки

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  MAIN: {
    HOME: '/(tabs)',
    MONITORING: '/(tabs)/monitoring',
    CONTROLS: '/(tabs)/controls',
    ANALYTICS: '/(tabs)/analytics',
  },
} as const;
