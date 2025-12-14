// lib/zustand/use-websocket.ts
import { useEffect, useCallback, useState } from 'react';
import { websocketService } from '../../api/websocket';
import { useStore } from '../../lib/zustand/store-context';
import { type TMessage } from '../../../entities/message';

export const useWebSocket = () => {
  const currentUser = useStore(state => state.currentUser);
  const isAuth = useStore(state => state.isAuth);
  const handleIncomingMessage = useStore(state => state.handleIncomingMessage);
  const updateUserStatus = useStore(state => state.updateUserStatus);
  
  const [isConnected, setIsConnected] = useState(websocketService.isConnected());
  
  // Подписываемся на WebSocket события только при авторизации
  useEffect(() => {
    if (!isAuth) {
      console.log('🔒 Пользователь не авторизован, пропускаем инициализацию WebSocket');
      return;
    }
    
    console.log('🔄 Инициализация WebSocket хука...');
    
    if (!websocketService.isConnected()) {
      console.log('🔌 Подключаем WebSocket...');
      websocketService.connect();
    } else {
      console.log('✅ WebSocket уже подключен');
    }
    
    // Устанавливаем колбэки для обработки событий
    websocketService.setCallbacks({
      onMessage: (message: any) => {
        console.log('💬 useWebSocket: Получено сообщение', {
            id: message.id,
            userId: message.userId,
            text: message.text,
            isMyMessage: currentUser && message.userId === currentUser.id
        });
        
        // НЕ фильтруем сообщения от себя - они нужны для замены временных сообщений
        if (handleIncomingMessage) {
            handleIncomingMessage(message);
        }
      },
      onTyping: (data: any) => {
        console.log('⌨️ useWebSocket: Пользователь печатает', data);
        // Здесь можно добавить логику для отображения "печатает..."
      },
      onStatusChange: (data: any) => {
        console.log('🔄 useWebSocket: Изменение статуса', data);
        // Здесь можно обновить статус в сторе
        if (currentUser && data.userId !== currentUser.id) {
          // TODO: Обновить статус пользователя в чатах
        }
      },
      onConnect: () => {
        console.log('✅ useWebSocket: Подключено');
        setIsConnected(true);
        if (updateUserStatus) {
          updateUserStatus(true);
        }
      },
      onDisconnect: () => {
        console.log('❌ useWebSocket: Отключено');
        setIsConnected(false);
        if (updateUserStatus) {
          updateUserStatus(false);
        }
      },
      onError: (error: Error) => {
        console.error('❌ useWebSocket: Ошибка', error);
      }
    });
    
    // При размонтировании отключаемся
    return () => {
      console.log('🧹 Очистка WebSocket хука');
      websocketService.setCallbacks({});
      // Не отключаем WebSocket полностью, так как он нужен другим компонентам
    };
  }, [isAuth, currentUser?.id, handleIncomingMessage, updateUserStatus]);
  
  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (!currentUser) {
      console.warn('⚠️ Нет текущего пользователя для отправки typing');
      return;
    }
    
    console.log(`⌨️ Отправка typing: ${chatId}, ${isTyping}`);
    websocketService.sendTyping(
      chatId,
      currentUser.id,
      isTyping
    );
  }, [currentUser]);
  
  const joinChat = useCallback((chatId: string) => {
    console.log(`👥 Присоединяемся к чату: ${chatId}`);
    websocketService.joinChat(chatId);
  }, []);
  
  const leaveChat = useCallback((chatId: string) => {
    console.log(`👋 Выходим из чата: ${chatId}`);
    websocketService.leaveChat(chatId);
  }, []);
  
  const sendMessage = useCallback((message: Omit<TMessage, 'id' | 'createdAt'>) => {
    console.log('📤 Отправка сообщения через WS:', message);
    websocketService.sendMessage(message);
  }, []);
  
  return {
    isConnected,
    sendTyping,
    joinChat,
    leaveChat,
    sendMessage
  };
};