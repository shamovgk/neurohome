import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  getSensorData,
  getLatestSensorData,
} from '@/controllers/sensorController';

const router = Router();

router.use(authenticateToken);

router.get('/:deviceId', getSensorData);
router.get('/:deviceId/latest', getLatestSensorData);

export default router;
