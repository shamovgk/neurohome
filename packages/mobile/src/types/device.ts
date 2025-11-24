export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  lastSeen: string;
  location?: string;
  plantProfile?: PlantProfile;
}

export interface PlantProfile {
  id: string;
  name: string;
  species: string;
  image?: string;
  thresholds: {
    soilMoisture: { min: number; max: number };
    temperature: { min: number; max: number };
    airHumidity: { min: number; max: number };
    light: { min: number; max: number };
  };
}

export interface DeviceControl {
  pump: boolean;
  growLight: boolean;
  fan: boolean;
}
