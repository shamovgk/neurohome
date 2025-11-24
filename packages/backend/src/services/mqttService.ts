import mqtt, { MqttClient } from 'mqtt';
import config from '@/config/env';
import logger from '@/utils/logger';
import SensorData from '@/models/SensorData';
import Device from '@/models/Device';
import { socketService } from './socketService';

class MQTTService {
  private client: MqttClient | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  public connect(): void {
    try {
      this.client = mqtt.connect(config.MQTT_BROKER_URL, {
        clientId: config.MQTT_CLIENT_ID,
        username: config.MQTT_USERNAME,
        password: config.MQTT_PASSWORD,
        clean: true,
        reconnectPeriod: 1000,
      });

      this.setupEventHandlers();
    } catch (error) {
      logger.error('MQTT connection error:', error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      logger.info('MQTT connected successfully');
      this.reconnectAttempts = 0;

      // Подписываемся на топики датчиков
      this.client?.subscribe('neurohome/+/sensors', (err) => {
        if (err) {
          logger.error('MQTT subscription error:', err);
        } else {
          logger.info('Subscribed to sensor data topics');
        }
      });

      // Подписываемся на события устройств
      this.client?.subscribe('neurohome/+/events', (err) => {
        if (err) {
          logger.error('MQTT subscription error:', err);
        } else {
          logger.info('Subscribed to device events topics');
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        await this.handleMessage(topic, message);
      } catch (error) {
        logger.error('Error handling MQTT message:', error);
      }
    });

    this.client.on('error', (error) => {
      logger.error('MQTT error:', error);
    });

    this.client.on('close', () => {
      logger.warn('MQTT connection closed');
    });

    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      logger.info(`MQTT reconnecting... (attempt ${this.reconnectAttempts})`);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logger.error('Max MQTT reconnect attempts reached');
        this.client?.end();
      }
    });
  }

  private async handleMessage(topic: string, message: Buffer): Promise<void> {
    const topicParts = topic.split('/');
    const deviceId = topicParts[1];
    const messageType = topicParts[2];

    if (messageType === 'sensors') {
      await this.handleSensorData(deviceId, message);
    } else if (messageType === 'events') {
      await this.handleDeviceEvent(deviceId, message);
    }
  }

  private async handleSensorData(deviceId: string, message: Buffer): Promise<void> {
    try {
      const data = JSON.parse(message.toString());

      // Сохраняем данные в MongoDB
      const sensorData = await SensorData.create({
        deviceId,
        soilMoisture: data.soilMoisture,
        temperature: data.temperature,
        airHumidity: data.airHumidity,
        lightLevel: data.lightLevel,
        waterLevel: data.waterLevel,
        timestamp: new Date(data.timestamp || Date.now()),
      });

      // Обновляем статус устройства
      await Device.update(
        {
          status: 'online',
          lastSeen: new Date(),
        },
        {
          where: { id: deviceId },
        }
      );

      // Отправляем данные через WebSocket подписчикам
      socketService.emitToDevice(deviceId, 'sensor-data', sensorData);

      logger.debug(`Sensor data saved for device ${deviceId}`);
    } catch (error) {
      logger.error('Error handling sensor data:', error);
    }
  }

  private async handleDeviceEvent(deviceId: string, message: Buffer): Promise<void> {
    try {
      const event = JSON.parse(message.toString());

      logger.info(`Device event from ${deviceId}:`, event);

      // Отправляем событие через WebSocket
      socketService.emitToDevice(deviceId, 'device-event', {
        deviceId,
        type: event.type,
        message: event.message,
        timestamp: new Date(event.timestamp || Date.now()),
      });
    } catch (error) {
      logger.error('Error handling device event:', error);
    }
  }

  public publishControl(deviceId: string, control: string, value: any): void {
    if (!this.client?.connected) {
      logger.error('MQTT client not connected');
      return;
    }

    const topic = `neurohome/${deviceId}/control/${control}`;
    const payload = JSON.stringify(value);

    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        logger.error(`Error publishing to ${topic}:`, err);
      } else {
        logger.info(`Control published to ${topic}:`, payload);
      }
    });
  }

  public disconnect(): void {
    if (this.client) {
      this.client.end();
      logger.info('MQTT disconnected');
    }
  }
}

export const mqttService = new MQTTService();
