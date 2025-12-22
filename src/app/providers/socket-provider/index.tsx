import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { SocketContext } from '@/app/web-socket';
import { useStore } from '@/app/store';
import configApi from '@/config';
import type { TChat } from '@/entities/chat';
import type { TMessage } from '@/entities/message';

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const addNewChat = useStore(state=>state.addNewChat);
  const addNewMessage = useStore(state=>state.addNewMessage);
  const updateInterlocutorStatus = useStore(state=>state.updateInterlocutorStatus);

  const connect = useCallback(() => {
    if (socket?.connected) return;

    const newSocket = io(configApi.wsUrl, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket подключен');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket отключен');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket ошибка подключения:', error.message);
      setIsConnected(false);
    });

    newSocket.on('new-chat', (chat: TChat) => {
      console.log(`WebSocket новый чат ${chat.id}`);
      addNewChat(chat);
    });

    newSocket.on('new-message', (message: TMessage) => {
      console.log(`WebSocket новое сообщение ${message.text}`);
      addNewMessage(message);
    });

    newSocket.on('user-status-changed', (data: {userId: string, isOnline: boolean }) => {
      console.log(`WebSocket новый статус ${data.isOnline}`);
      updateInterlocutorStatus(data.userId, data.isOnline);
    });

    newSocket.connect();
    setSocket(newSocket);
  }, []);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket.removeAllListeners();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{
      socket: socket!,
      isConnected,
      connect,
      disconnect,
    }}>
      {children}
    </SocketContext.Provider>
  );
};