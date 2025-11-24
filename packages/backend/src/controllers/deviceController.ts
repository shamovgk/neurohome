import { Response } from 'express';
import { AuthRequest } from '@/types';
import Device from '@/models/Device';
import logger from '@/utils/logger';

export const getDevices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const devices = await Device.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    logger.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch devices',
    });
  }
};

export const getDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const device = await Device.findOne({
      where: {
        id,
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

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    logger.error('Get device error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device',
    });
  }
};

export const createDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type, location } = req.body;

    const device = await Device.create({
      userId: req.userId!,
      name,
      type: type || 'plant',
      location,
      status: 'offline',
    });

    logger.info(`Device created: ${device.id} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    logger.error('Create device error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create device',
    });
  }
};

export const updateDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const device = await Device.findOne({
      where: {
        id,
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

    await device.update({ name, location });

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    logger.error('Update device error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update device',
    });
  }
};

export const deleteDevice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const device = await Device.findOne({
      where: {
        id,
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

    await device.destroy();

    logger.info(`Device deleted: ${id} by user ${req.userId}`);

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully',
    });
  } catch (error) {
    logger.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete device',
    });
  }
};
