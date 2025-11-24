export interface SensorData {
  deviceId: string;
  soilMoisture: number;
  temperature: number;
  airHumidity: number;
  lightLevel: number;
  waterLevel: number;
  timestamp: string;
}

export interface SensorReading {
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
}

export interface SensorHistory {
  timestamp: string;
  value: number;
}

export type SensorType = 'soilMoisture' | 'temperature' | 'airHumidity' | 'lightLevel' | 'waterLevel';
