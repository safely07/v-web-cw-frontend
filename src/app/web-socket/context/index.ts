import { createContext, useContext } from "react";
import { type Socket } from "socket.io-client";

export type TSocketContext = {
    socket: Socket;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
}

export const SocketContext = createContext<TSocketContext | null>(null);

export const useSocket = () => {
    const socketContext = useContext(SocketContext);

    if (!socketContext) {
        throw new Error('useSocket must be used within SocketProvider');
    }

    return socketContext;
}