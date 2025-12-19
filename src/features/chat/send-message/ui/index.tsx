import type { TChat } from "@/entities/chat";
import type { TUser } from "@/entities/user";
import { useState } from "react";
import { useStore } from "@/app/store";
import { UseSocket } from "@/app/web-socket";

type TSendMessageProps = {
    currentUser: TUser | null,
    activeChat: TChat | null,
}

export const SendMessageForm = ({currentUser, activeChat}: TSendMessageProps) => {
    const [message, setMessage] = useState('');
    const sendMessage = useStore(state => state.sendMessageOfActiveChat);
    const socket = UseSocket().socket;

    const handleSend = async () => {
        if (!activeChat || !message.trim()) return;
        
        try {
            console.log('Отправка сообщения:', message);
            await sendMessage(message);
            socket.emit('new-message', {chatId: activeChat.id, userId: currentUser?.id});
            setMessage('');
        } catch (error) {
            console.error('Ошибка отправки:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      };
    
    return (
        <div className="p-6 border-t border-gray-800 bg-[#252526]">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Введите сообщение (Shift+Enter для новой строки)..."
              className="chat-input w-full p-5 rounded text-[16px] resize-none max-h-[50px]"
              rows={2}
            />
            <div className="text-[12px] text-gray-500 mt-3 flex items-center gap-4">
              {message.length > 0 && (
                <span>{message.length} символов</span>
              )}
              <span>Enter для отправки</span>
            </div>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="send-button px-7 py-5 text-[14px] font-medium" 
          >
            Отправить
          </button>
        </div>
      </div>
    );
}