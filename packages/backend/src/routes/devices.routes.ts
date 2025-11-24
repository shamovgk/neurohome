import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from '@/controllers/deviceController';

const router = Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

router.get('/', getDevices);
router.get('/:id', getDevice);
router.post('/', createDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;
