import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { verifyToken } from '@/utils/jwt';
import logger from '@/utils/logger';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: '', // Заполнится из БД если нужно
    };

    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};
