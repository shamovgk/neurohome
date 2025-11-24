import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/constants/config';
import { SensorData } from '@/types/sensor';
import { store } from '@/store/store';
import { setCurrentData } from '@/store/slices/sensorsSlice';
import { updateDeviceStatus } from '@/store/slices/devicesSlice';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(deviceId: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(API_CONFIG.WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners(deviceId);
  }

  private setupListeners(deviceId: string) {
    if (!this.socket) return;

    // Подключение установлено
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      
      // Подписываемся на данные конкретного устройства
      this.socket?.emit('subscribe', { deviceId });
    });

    // Получение real-time данных датчиков
    this.socket.on('sensor-data', (data: SensorData) => {
      console.log('Received sensor data:', data);
      store.dispatch(setCurrentData(data));
    });

    // Обновление статуса устройства
    this.socket.on('device-status', (data: { id: string; status: 'online' | 'offline' }) => {
      console.log('Device status update:', data);
      store.dispatch(updateDeviceStatus(data));
    });

    // Уведомления о событиях (критические пороги, автополив и т.д.)
    this.socket.on('device-event', (event: {
      deviceId: string;
      type: string;
      message: string;
      timestamp: string;
    }) => {
      console.log('Device event:', event);
      // Здесь можно показать уведомление пользователю
    });

    // Отключение
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
    });

    // Ошибка подключения
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  // Отправка команды управления устройством
  sendControl(deviceId: string, control: string, value: any) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('device-control', {
      deviceId,
      control,
      value,
      timestamp: new Date().toISOString(),
    });
  }

  // Отписка от устройства
  unsubscribe(deviceId: string) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', { deviceId });
    }
  }

  // Закрытие соединения
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
