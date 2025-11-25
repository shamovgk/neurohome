import User from '../models/User';
import Device from '../models/Device';
import SensorData from '../models/SensorData';
import { connectPostgres } from '../config/database';
import { connectMongoDB } from '../config/mongodb';
import logger from '../utils/logger';

async function seedDemoData() {
  try {
    await connectPostgres();
    await connectMongoDB();

    logger.info('Starting demo data seeding...');

    // Создаем демо пользователя
    let demoUser = await User.findOne({ where: { email: 'demo@neurohome.com' } });
    
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@neurohome.com',
        password: 'demo123', // Будет захеширован
      });
      logger.info('Demo user created');
    }

    // Создаем демо устройство
    let demoDevice = await Device.findOne({
      where: {
        userId: demoUser.id,
        name: 'Демо Фикус',
      },
    });

    if (!demoDevice) {
      demoDevice = await Device.create({
        userId: demoUser.id,
        name: 'Демо Фикус',
        type: 'plant',
        status: 'online',
        location: 'Гостиная (демо)',
        lastSeen: new Date(),
      });
      logger.info('Demo device created');
    } else {
      // Обновляем статус на online
      await demoDevice.update({ status: 'online', lastSeen: new Date() });
    }

    // Создаем демо данные датчиков (последние 24 часа)
    const now = new Date();
    const sensorDataPoints = [];

    for (let i = 0; i < 288; i++) { // 288 точек = каждые 5 минут за 24 часа
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
      
      // Генерируем реалистичные данные с небольшими колебаниями
      const baseTemp = 22;
      const baseMoisture = 45;
      const baseHumidity = 60;
      const baseLight = 8000;
      
      sensorDataPoints.push({
        deviceId: demoDevice.id,
        soilMoisture: baseMoisture + Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 3,
        temperature: baseTemp + Math.sin(i / 15) * 2 + (Math.random() - 0.5) * 1,
        airHumidity: baseHumidity + Math.sin(i / 12) * 5 + (Math.random() - 0.5) * 3,
        lightLevel: i % 24 < 12 ? baseLight + Math.random() * 2000 : 1000 + Math.random() * 500,
        waterLevel: 85 + Math.random() * 10,
        timestamp,
      });
    }

    // Удаляем старые данные для этого устройства
    await SensorData.deleteMany({ deviceId: demoDevice.id });
    
    // Вставляем новые данные
    await SensorData.insertMany(sensorDataPoints);
    
    logger.info(`Created ${sensorDataPoints.length} sensor data points`);
    logger.info('Demo data seeding completed!');
    logger.info('\nDemo credentials:');
    logger.info('Email: demo@neurohome.com');
    logger.info('Password: demo123');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding demo data:', error);
    process.exit(1);
  }
}

seedDemoData();
