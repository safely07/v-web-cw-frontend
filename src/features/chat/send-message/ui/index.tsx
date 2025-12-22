import type { TChat } from "@/entities/chat";
import type { TUser } from "@/entities/user";
import { useState } from "react";
import { useStore } from "@/app/store";
import { useSocket } from "@/app/web-socket";

type TSendMessageProps = {
    currentUser: TUser | null,
    activeChat: TChat | null,
}

export const SendMessageForm = ({ activeChat }: TSendMessageProps) => {
    const [message, setMessage] = useState('');
    const sendMessage = useStore(state => state.sendMessageOfActiveChat);
    const socket = useSocket().socket;

    const handleSend = async () => {
        if (!activeChat || !message.trim()) return;
        
        try {
            console.log('Отправка сообщения:', message);
            await sendMessage(message);
            socket.emit('send-message', { chatId: activeChat.id, text: message });
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

    const isDisabled = !activeChat || !message.trim();

    return (
        <div style={{ padding: '16px' }} className="border-t border-[var(--border-color)] bg-[var(--panel-background)]">
            <div className="flex items-start" style={{ gap: '12px' }}>
                <div className="flex-1">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={activeChat ? "Введите сообщение..." : "Выберите чат для отправки сообщений"}
                        disabled={!activeChat}
                        className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--input-foreground)] text-[13px] placeholder:text-[var(--input-placeholder)] resize-none focus:outline-none focus:border-[var(--input-focus-border)] focus:shadow-[var(--input-focus-shadow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed max-h-32 min-h-[44px]"
                        rows={1}
                    />
                    
                    <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                        <div className="text-[11px] text-[var(--text-muted)]">
                            {message.length > 0 ? (
                                <span>{message.length} символов</span>
                            ) : (
                                <span>Shift+Enter для новой строки</span>
                            )}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                            Enter для отправки
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={handleSend}
                    disabled={isDisabled}
                    className="h-[44px] bg-[var(--button-background)] hover:bg-[var(--button-hover)] text-[var(--button-foreground)] text-[13px] font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--button-background)] whitespace-nowrap active:scale-[0.98] flex-shrink-0"
                    style={{ padding: '0 20px' }}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};