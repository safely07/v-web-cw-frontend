import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/app/store';
import { useSocketChatSubscriptions } from '@/features/chat/hooks';
import { SendMessageForm } from '@/features/chat/send-message';
import { MessageElement, type TMessage } from '@/entities/message';

export const ChatWindow = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeChatMessages, setActiveChatMessages] = useState([] as TMessage[]); 
  
  const activeChat = useStore(state => state.activeChat);
  const currentUser = useStore(state => state.currentUser);
  const messages = useStore(state => state.messages);
  const addMessage = useStore(state => state.addNewMessage);
  const updateUserStatus = useStore(state => state.updateUserStatus);
  const loadMessages = useStore(state => state.loadMessagesInActiveChat);
  
  useEffect(() => {
    useSocketChatSubscriptions({
      handleNewMessage: addMessage,
      handleUpdateUserStatus: updateUserStatus,
    })
  },[]);

  useEffect(() => {
    if (activeChat) {
      console.log(`📥 Загружаем сообщения для чата ${activeChat.id}...`);
      setActiveChatMessages(loadMessages());
    }
  }, [activeChat, loadMessages]);
  
  // Автопрокрутка при изменении сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);
  
  // Если нет активного чата
  if (!activeChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-gray-400">
        <div className="text-5xl mb-4">👈</div>
        <p className="text-xl">Выберите чат для начала общения</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col chat-window">
      <div className="p-5 border-b border-gray-800 bg-[#252526] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="chat-avatar" style={{ background: '#0e639c' }}>
            <span>
              {activeChat?.name?.slice(0,1) || 'Н'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-[16px] text-white mb-1">
              {activeChat?.name || `Неизвестный`}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 chat-scrollbar">
        {messages.length === 0 ? (
          <div className="chat-placeholder h-full flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 opacity-30">💬</div>
            <p className="text-[16px] font-medium mb-2">Нет сообщений</p>
            <p className="text-[14px] mb-6">Начните общение первым!</p>
          </div>
        ) : (
          activeChatMessages.map((msg) => {
            const isMyMessage = currentUser && msg.userId === currentUser.id;
            
            return (
              <MessageElement message={msg} isMyMessage={isMyMessage || true}/>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <SendMessageForm currentUser={currentUser} activeChat={activeChat}/>
    </div>
  );
};