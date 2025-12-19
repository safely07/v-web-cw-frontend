import { createContext, useContext } from "react";
import { type Socket } from "socket.io-client";

type TSocketContext = {
    socket: Socket,
    cleanupSocketListeners: (()=>void) | null,
}

export const SocketContext = createContext<TSocketContext | null>(null);

export const UseSocket = () => {
    const socket = useContext(SocketContext);

    if (!socket) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    };

    return socket;
}