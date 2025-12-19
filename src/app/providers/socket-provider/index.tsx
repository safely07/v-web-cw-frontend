import { type ReactNode, useRef, useEffect } from 'react';
import { CreateSocketConnection, SetupBaseSocketListeners } from '@shared/api';
import { SocketContext } from '@/app/web-socket';
import { API_URL } from '@shared/api';

export const SocketProvider = ({ children }: { children?: ReactNode }) => {
  const socketRef = useRef(CreateSocketConnection(API_URL));
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cleanupRef.current = SetupBaseSocketListeners(socketRef.current, {
      onConnect: () => console.log('WebSocket подключен'),
      onDisconnect: () => console.log('WebSocket отключен'),
      onError: (error) => console.error('WebSocket ошибка:', error),
    });

    return () => {
      cleanupRef.current?.();
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      cleanupSocketListeners: cleanupRef.current,
    }}>
      {children}
    </SocketContext.Provider>
  );
};