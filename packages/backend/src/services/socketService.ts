import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import config from '@/config/env';
import logger from '@/utils/logger';
import { verifyToken } from '@/utils/jwt';
import { mqttService } from './mqttService';

class SocketService {
  private io: SocketIOServer | null = null;

  public initialize(httpServer: HTTPServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    logger.info('Socket.IO initialized');
  }

  private setupMiddleware(): void {
    // Middleware для аутентификации
    this.io?.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = verifyToken(token);
        socket.data.userId = decoded.userId;
        socket.data.email = decoded.email;
        next();
      } catch (error) {
        logger.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io?.on('connection', (socket: Socket) => {
      logger.info(`Client connected: ${socket.id} (user: ${socket.data.userId})`);

      // Подписка на устройство
      socket.on('subscribe', ({ deviceId }: { deviceId: string }) => {
        socket.join(`device:${deviceId}`);
        logger.info(`Socket ${socket.id} subscribed to device ${deviceId}`);
      });

      // Отписка от устройства
      socket.on('unsubscribe', ({ deviceId }: { deviceId: string }) => {
        socket.leave(`device:${deviceId}`);
        logger.info(`Socket ${socket.id} unsubscribed from device ${deviceId}`);
      });

      // Отправка команды управления устройством
      socket.on(
        'device-control',
        ({ deviceId, control, value }: { deviceId: string; control: string; value: any }) => {
          logger.info(`Control command from ${socket.id}:`, { deviceId, control, value });
          
          // Публикуем команду в MQTT
          mqttService.publishControl(deviceId, control, value);
          
          // Подтверждение отправки
          socket.emit('control-sent', { deviceId, control, value });
        }
      );

      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id} (reason: ${reason})`);
      });

      socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  // Отправка данных всем подписчикам устройства
  public emitToDevice(deviceId: string, event: string, data: any): void {
    this.io?.to(`device:${deviceId}`).emit(event, data);
  }

  // Отправка данных конкретному пользователю
  public emitToUser(userId: string, event: string, data: any): void {
    this.io?.to(`user:${userId}`).emit(event, data);
  }

  public getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const socketService = new SocketService();
