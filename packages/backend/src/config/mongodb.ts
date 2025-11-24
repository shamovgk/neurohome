import mongoose from 'mongoose';
import config from './env';
import logger from '@/utils/logger';

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URL, {
      dbName: config.MONGODB_DB_NAME,
    });
    
    logger.info('MongoDB connected successfully');
    
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default mongoose;
