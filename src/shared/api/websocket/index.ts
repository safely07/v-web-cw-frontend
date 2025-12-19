import { io, Socket } from 'socket.io-client';

export const CreateSocketConnection = (url: string) => {
  return io(url, {
    transports: ['websocket'],
    autoConnect: false,
    withCredentials: true,
  })
}

export const SetupBaseSocketListeners = (
  socket: Socket,
  callbacks: {
    onConnect?: () => void,
    onDisconnect?: () => void,
    onError?: (error: Error) => void,
  }
) => {
  socket.on('connect', () => {
    callbacks.onConnect?.();
  });

  socket.on('disconnect', () => {
    callbacks.onDisconnect?.();
  });

  socket.on('connect_error', (error) => {
    callbacks.onError?.(error);
  });

  return () => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
  }
}