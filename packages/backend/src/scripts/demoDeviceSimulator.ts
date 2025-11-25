import mqtt from 'mqtt';
import config from '../config/env';
import logger from '../utils/logger';
import Device from '../models/Device';
import User from '../models/User';
import { connectPostgres } from '../config/database';

async function startSimulator() {
  await connectPostgres();

  // Найти демо устройство
  const demoUser = await User.findOne({ where: { email: 'demo@neurohome.com' } });
  if (!demoUser) {
    logger.error('Demo user not found. Run seed:demo first');
    process.exit(1);
  }

  const demoDevice = await Device.findOne({
    where: {
      userId: demoUser.id,
      name: 'Демо Фикус',
    },
  });

  if (!demoDevice) {
    logger.error('Demo device not found. Run seed:demo first');
    process.exit(1);
  }

  // Подключаемся к MQTT
  const client = mqtt.connect(config.MQTT_BROKER_URL, {
    clientId: 'demo-device-simulator',
  });

  client.on('connect', () => {
    logger.info('Demo device simulator connected to MQTT');

    // Отправляем данные каждые 10 секунд
    setInterval(() => {
      const data = {
        soilMoisture: 45 + Math.sin(Date.now() / 10000) * 10 + (Math.random() - 0.5) * 5,
        temperature: 22 + Math.sin(Date.now() / 15000) * 3 + (Math.random() - 0.5) * 2,
        airHumidity: 60 + Math.sin(Date.now() / 12000) * 8 + (Math.random() - 0.5) * 4,
        lightLevel: new Date().getHours() >= 8 && new Date().getHours() < 20
          ? 8000 + Math.random() * 3000
          : 500 + Math.random() * 500,
        waterLevel: 85 + Math.random() * 10,
        timestamp: new Date().toISOString(),
      };

      const topic = `neurohome/${demoDevice.id}/sensors`;
      client.publish(topic, JSON.stringify(data));
      logger.debug(`Published demo data to ${topic}`);
    }, 10000);

    logger.info('Demo device simulator is sending data every 10 seconds');
  });

  client.on('error', (error) => {
    logger.error('MQTT error:', error);
  });
}

startSimulator();
