import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '@/config/env';
import { connectPostgres } from '@/config/database';
import { connectMongoDB } from '@/config/mongodb';
import { mqttService } from '@/services/mqttService';
import { socketService } from '@/services/socketService';
import routes from '@/routes';
import { errorHandler } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

class Server {
  private app: Application;
  private httpServer: http.Server;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security
    this.app.use(helmet());
    this.app.use(cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    }));

    // Logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.app.use('/api/v1', routes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Подключение к базам данных
      await connectPostgres();
      await connectMongoDB();

      // Инициализация Socket.IO
      socketService.initialize(this.httpServer);

      // Подключение к MQTT брокеру
      mqttService.connect();

      // Запуск HTTP сервера
      this.httpServer.listen(config.PORT, config.HOST, () => {
        logger.info(`Server running on http://${config.HOST}:${config.PORT}`);
        logger.info(`Environment: ${config.NODE_ENV}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    logger.info('Shutting down server...');
    
    mqttService.disconnect();
    
    this.httpServer.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  }
}

// Создание и запуск сервера
const server = new Server();
server.start();

// Graceful shutdown
process.on('SIGTERM', () => server.stop());
process.on('SIGINT', () => server.stop());
