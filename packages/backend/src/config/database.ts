import { Sequelize } from 'sequelize';
import config from './env';
import logger from '@/utils/logger';

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectPostgres = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connected successfully');
    
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synced');
    }
  } catch (error) {
    logger.error('Unable to connect to PostgreSQL:', error);
    process.exit(1);
  }
};

export default sequelize;
