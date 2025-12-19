import { UseSocket } from "@/app/web-socket";
import type { TChat } from "@/entities/chat";
import type { TMessage } from "@/entities/message";
import { useEffect } from "react";

export const useSocketChatSubscriptions = (callbacks: {
    handleNewMessage?: (message: TMessage) => void,
    handleNewChat?: (chat: TChat) => void,
    handleUpdateUserStatus?: (isOnline: boolean) => void,
  }) => {

  const socket = UseSocket().socket;
  
  useEffect(() => {
    if (!socket) return;
    
    if (callbacks.handleNewChat) {
      socket.on('new-chat', callbacks.handleNewChat);
    }

    if (callbacks.handleNewMessage) {
      socket.on('new-message', callbacks.handleNewMessage);
    }

    if (callbacks.handleUpdateUserStatus) {
      socket.on('update-user-status', callbacks.handleUpdateUserStatus);
    }
    
    return () => {
      if (callbacks.handleNewChat) {
        socket.off('new-chat', callbacks.handleNewChat);
      }

      if (callbacks.handleNewMessage) {
        socket.off('new-message', callbacks.handleNewMessage);
      }

      if (callbacks.handleUpdateUserStatus) {
        socket.off('update-user-status', callbacks.handleUpdateUserStatus);
      }
    };
  }, [socket]);
};