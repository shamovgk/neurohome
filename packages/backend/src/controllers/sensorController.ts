import { Response } from 'express';
import { AuthRequest } from '@/types';
import SensorData from '@/models/SensorData';
import Device from '@/models/Device';
import logger from '@/utils/logger';

export const getSensorData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deviceId } = req.params;
    const { limit = 100, startDate, endDate } = req.query;

    // Проверка владения устройством
    const device = await Device.findOne({
      where: {
        id: deviceId,
        userId: req.userId,
      },
    });

    if (!device) {
      res.status(404).json({
        success: false,
        error: 'Device not found',
      });
      return;
    }

    // Построение запроса
    const query: any = { deviceId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const sensorData = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string, 10));

    res.status(200).json({
      success: true,
      data: sensorData,
    });
  } catch (error) {
    logger.error('Get sensor data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensor data',
    });
  }
};

export const getLatestSensorData = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { deviceId } = req.params;

    // Проверка владения устройством
    const device = await Device.findOne({
      where: {
        id: deviceId,
        userId: req.userId,
      },
    });

    if (!device) {
      res.status(404).json({
        success: false,
        error: 'Device not found',
      });
      return;
    }

    const latestData = await SensorData.findOne({ deviceId })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: latestData,
    });
  } catch (error) {
    logger.error('Get latest sensor data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest sensor data',
    });
  }
};
