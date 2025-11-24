export const SENSOR_THRESHOLDS = {
  SOIL_MOISTURE: {
    MIN: 30,
    MAX: 60,
    UNIT: '%',
    CRITICAL_LOW: 20,
    CRITICAL_HIGH: 80,
  },
  TEMPERATURE: {
    MIN: 18,
    MAX: 28,
    UNIT: '°C',
    CRITICAL_LOW: 10,
    CRITICAL_HIGH: 35,
  },
  AIR_HUMIDITY: {
    MIN: 40,
    MAX: 70,
    UNIT: '%',
    CRITICAL_LOW: 30,
    CRITICAL_HIGH: 85,
  },
  LIGHT: {
    MIN: 5000,
    MAX: 15000,
    UNIT: 'lux',
    CRITICAL_LOW: 2000,
    CRITICAL_HIGH: 25000,
  },
} as const;

export type SensorType = keyof typeof SENSOR_THRESHOLDS;
