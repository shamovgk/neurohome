export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  WS_URL: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000',
  TIMEOUT: 10000,
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
