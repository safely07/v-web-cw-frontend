import { useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/app/store';
import { useSocket } from '@/app/web-socket';
import { SendMessageForm } from '@/features/chat/send-message';
import { MessageElement } from '@/entities/message';

export const ChatWindow = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeChat = useStore(state => state.activeChat);
  const currentUser = useStore(state => state.currentUser);
  const messages = useStore(state => state.messages);
  const loadMessages = useStore(state => state.loadMessages);
  const socket = useSocket().socket;
  const interlocutorStatus = useStore(state => state.activeChat?.interlocutor?.isOnline ?? false);

  const chatMessages = useMemo(() => {
    if (!activeChat) return [];
    return messages[activeChat.id] || [];
  }, [messages, activeChat]);

  useEffect(() => {
    if (activeChat) {
      console.log(`📥 Загружаем сообщения для чата ${activeChat.id}...`);
      loadMessages(activeChat.id);
      socket.emit('join-chat', activeChat.id);
    }
  }, [activeChat, loadMessages, socket]);
  
  // Автопрокрутка при изменении сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Если нет активного чата
  if (!activeChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[var(--background)]">
        <div className="text-4xl mb-4 opacity-30">💬</div>
        <p className="text-lg text-[var(--text-secondary)] mb-2">
          Выберите чат для начала общения
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Или создайте новый чат
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--panel-background)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
              <span className="text-sm font-medium text-[var(--accent-primary)]">
                {activeChat?.name?.slice(0,1)?.toUpperCase() || 'Ч'}
              </span>
            </div>
            {/* Online status indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--panel-background)] ${
              interlocutorStatus ? 'bg-[var(--status-online)]' : 'bg-[var(--status-offline)]'
            }`} />
          </div>
          
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--text-heading)]">
              {activeChat?.name || `Чат ${activeChat.id.slice(0, 8)}...`}
            </h2>
            <p className={`text-xs ${interlocutorStatus ? 'text-[var(--status-online)]' : 'text-[var(--status-offline)]'}`}>
              {interlocutorStatus ? 'В сети' : 'Не в сети'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 chat-scrollbar bg-[var(--editor-background)]">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-3xl mb-3 opacity-20">💬</div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              Нет сообщений
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Начните общение первым!
            </p>
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => {
              const isMyMessage = currentUser && msg.userId === currentUser.id;
              
              return (
                <MessageElement 
                  key={msg.id} 
                  message={msg} 
                  isMyMessage={isMyMessage || false}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <SendMessageForm currentUser={currentUser} activeChat={activeChat}/>
    </div>
  );
};