import { io, Socket } from 'socket.io-client';

// Типы для событий
export type SocketMessage = {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  createdAt: Date;
};

export type TypingEvent = {
  chatId: string;
  userId: string;
  isTyping: boolean;
};

type EventCallbacks = {
  onMessage?: (message: SocketMessage) => void;
  onTyping?: (data: TypingEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onStatusChange?: (data: { userId: string; chatId: string; isOnline: boolean }) => void;
};

class WebSocketService {
  private socket: Socket | null = null;
  private callbacks: EventCallbacks = {};
  private userId: string | null = null; // Добавляем сохранение ID пользователя

  constructor() {
    
  }

  // Установка колбэков
  setCallbacks(callbacks: EventCallbacks) {
    this.callbacks = callbacks;
  }

  connect(userId?: string) { // Добавляем параметр userId
    if (this.socket?.connected) return;

    try {
      this.socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket подключен');
        
        // Если есть userId, аутентифицируемся после подключения
        if (userId) {
          this.authenticate(userId);
        }
        
        this.callbacks.onConnect?.();
      });

      this.socket.on('new-message', (message: SocketMessage) => {
        console.log('💬 Новое сообщение через WS:', message);
        this.callbacks.onMessage?.(message);
      });

      this.socket.on('user-typing', (data: TypingEvent) => {
        console.log('⌨️ Пользователь печатает:', data);
        this.callbacks.onTyping?.(data);
      });
      
      // Добавляем обработчик изменения статуса
      this.socket.on('user-status-change', (data: { userId: string; chatId: string; isOnline: boolean }) => {
        console.log('🔄 Изменение статуса пользователя:', data);
        this.callbacks.onStatusChange?.(data);
      });
      
      // Обработчик успешной аутентификации
      this.socket.on('authenticated', (data: { success: boolean }) => {
        console.log('✅ WebSocket аутентификация успешна');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket отключен');
        this.callbacks.onDisconnect?.();
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('❌ WebSocket ошибка подключения:', error);
        this.callbacks.onError?.(error);
      });
    } catch (error) {
      console.error('❌ Ошибка инициализации WebSocket:', error);
    }
  }

  authenticate(userId: string) {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket не подключен, не могу аутентифицироваться');
      // Сохраняем userId для последующей аутентификации
      this.userId = userId;
      return;
    }
    
    this.socket.emit('authenticate', userId);
    this.userId = userId;
    console.log(`👤 Отправлена аутентификация для пользователя: ${userId}`);
  }

  joinChat(chatId: string) {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket не подключен');
      return;
    }
    
    this.socket.emit('join-chat', chatId);
    console.log(`👥 Присоединились к чату: ${chatId}`);
  }

  leaveChat(chatId: string) {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket не подключен');
      return;
    }
    
    this.socket.emit('leave-chat', chatId);
    console.log(`👋 Покинули чат: ${chatId}`);
  }

  sendTyping(chatId: string, userId: string, isTyping: boolean) {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket не подключен');
      return;
    }
    
    this.socket.emit('typing', { chatId, userId, isTyping });
  }

  sendMessage(message: Omit<SocketMessage, 'id' | 'createdAt'>) {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket не подключен');
      return;
    }
    
    this.socket?.emit('send-message', message);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.userId = null;
    console.log('🔌 WebSocket отключен вручную');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  onMessage(callback: (message: SocketMessage) => void) {
    this.callbacks.onMessage = callback;
  }

  onTyping(callback: (data: TypingEvent) => void) {
    this.callbacks.onTyping = callback;
  }
}

// Экспортируем инстанс
export const websocketService = new WebSocketService();