import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import devicesRoutes from './devices.routes';
import sensorsRoutes from './sensors.routes';

const router = Router();

// API маршруты
router.use('/auth', authRoutes);
router.use('/devices', devicesRoutes);
router.use('/sensors', sensorsRoutes);

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
