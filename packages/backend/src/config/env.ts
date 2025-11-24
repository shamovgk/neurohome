import dotenv from 'dotenv';
import path from 'path';

// Загружаем .env файл
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  
  // PostgreSQL
  DATABASE_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  
  // MongoDB
  MONGODB_URL: string;
  MONGODB_DB_NAME: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  
  // MQTT
  MQTT_BROKER_URL: string;
  MQTT_CLIENT_ID: string;
  MQTT_USERNAME?: string;
  MQTT_PASSWORD?: string;
  
  // CORS
  CORS_ORIGIN: string[];
  
  // Logging
  LOG_LEVEL: string;
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  
  DATABASE_URL: process.env.DATABASE_URL || '',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: process.env.DB_NAME || 'neurohome_dev',
  DB_USER: process.env.DB_USER || 'dev',
  DB_PASSWORD: process.env.DB_PASSWORD || 'dev123',
  
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/neurohome_dev',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'neurohome_dev',
  
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
  MQTT_CLIENT_ID: process.env.MQTT_CLIENT_ID || 'neurohome-backend',
  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,
  
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:19006'],
  
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Валидация критичных переменных
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'MONGODB_URL'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
