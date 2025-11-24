import mongoose, { Schema, Document } from 'mongoose';

export interface ISensorData extends Document {
  deviceId: string;
  soilMoisture: number;
  temperature: number;
  airHumidity: number;
  lightLevel: number;
  waterLevel: number;
  timestamp: Date;
}

const SensorDataSchema = new Schema<ISensorData>(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    temperature: {
      type: Number,
      required: true,
    },
    airHumidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    lightLevel: {
      type: Number,
      required: true,
      min: 0,
    },
    waterLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'deviceId',
      granularity: 'minutes',
    },
    timestamps: false,
  }
);

// Индекс для быстрого поиска по устройству и времени
SensorDataSchema.index({ deviceId: 1, timestamp: -1 });

export default mongoose.model<ISensorData>('SensorData', SensorDataSchema);
