// widgets/chat-window/SimpleChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../shared/lib/zustand/store-context';
import { useWebSocket } from '../../../shared/hooks/use-websocket';

export const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Подписываемся на нужные части store
  const activeChatId = useStore(state => state.activeChatId);
  const currentUser = useStore(state => state.currentUser);
  const chats = useStore(state => state.chats);
  const messages = useStore(state => state.messages);
  const loadMessages = useStore(state => state.loadMessages);
  const sendMessage = useStore(state => state.sendMessage);
  
  // Получаем все методы из useWebSocket
  const { isConnected, sendTyping, joinChat, leaveChat } = useWebSocket();
  
  // Находим активный чат
  const activeChat = activeChatId 
    ? chats.find(chat => chat.id === activeChatId)
    : undefined;
  
  // Сообщения активного чата
  const activeChatMessages = activeChatId 
    ? messages[activeChatId] || [] 
    : [];
  
  // Загрузка сообщений при изменении активного чата
  useEffect(() => {
    if (activeChatId) {
      console.log(`📥 Загружаем сообщения для чата ${activeChatId}...`);
      loadMessages(activeChatId).catch(console.error);
    }
  }, [activeChatId, loadMessages]);
  
  // Управление WebSocket подключением к чату
  useEffect(() => {
    console.log('🔄 Обновление WebSocket подключения к чату...');
    console.log('📡 Состояние подключения:', isConnected);
    console.log('💬 Активный чат:', activeChatId);
    
    if (!isConnected) {
      console.log('🔌 WebSocket не подключен, пропускаем присоединение к чату');
      return;
    }
    
    if (activeChatId) {
      console.log(`👥 Присоединяемся к чату ${activeChatId} через WebSocket...`);
      joinChat(activeChatId);
      
      // Возвращаем функцию очистки для выхода из чата
      return () => {
        console.log(`👋 Выходим из чата ${activeChatId}`);
        leaveChat(activeChatId);
      };
    }
  }, [activeChatId, isConnected, joinChat, leaveChat]);
  
  // Автопрокрутка при изменении сообщений
  useEffect(() => {
    if (activeChatMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatMessages.length]);
  
  const handleSend = async () => {
    if (!activeChatId || !message.trim()) return;
    
    try {
      console.log('📤 Отправка сообщения:', message);
      await sendMessage(activeChatId, message);
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
  
  const handleTyping = (isTyping: boolean) => {
    if (!activeChatId || !currentUser) return;
    console.log(`⌨️ Отправка события набора текста: ${isTyping}`);
    sendTyping(activeChatId, isTyping);
  };
  
  // Если нет активного чата
  if (!activeChatId) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-gray-400">
        <div className="text-5xl mb-4">👈</div>
        <p className="text-xl">Выберите чат для начала общения</p>
      </div>
    );
  }
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col chat-window">
      {/* Шапка чата */}
      <div className="p-5 border-b border-gray-800 bg-[#252526] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="chat-avatar" style={{ background: '#0e639c' }}>
            <span>
              {activeChat?.groupName?.slice(0,1) || 'Н'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-[16px] text-white mb-1">
              {activeChat?.groupName || `${activeChatId?.slice(0, 16)}...`}
              {activeChat?.isGroup && <span className="group-badge">Группа</span>}
            </h2>
            <div className="flex items-center gap-3">
              {activeChat && (
                <span className="text-[12px] text-gray-500">
                  {activeChat.members?.length || 0} участников
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 chat-scrollbar">
        {activeChatMessages.length === 0 ? (
          <div className="chat-placeholder h-full flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 opacity-30">💬</div>
            <p className="text-[16px] font-medium mb-2">Нет сообщений</p>
            <p className="text-[14px] mb-6">Начните общение первым!</p>
            <div className="text-[12px] bg-[#252526] px-4 py-3 rounded">
              <p>WebSocket: <span className={isConnected ? 'status-online' : 'status-offline'}>
                {isConnected ? 'Подключен' : 'Отключен'}
              </span></p>
            </div>
          </div>
        ) : (
          activeChatMessages.map((msg, index) => {
            const isMyMessage = currentUser && msg.userId === currentUser.id;
            const isTemporary = msg.id?.startsWith('temp-');
            const showSender = !isMyMessage && msg.user && index > 0 && 
              activeChatMessages[index - 1]?.userId !== msg.userId;
            
            return (
              <div
                key={msg.id}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} message-appear mx-2`}
              >
                <div className={`max-w-[90%] min-w-[60px] max-w-[500px] ${isMyMessage ? 'mr-4' : 'ml-4'}`}>
                  {/* Имя отправителя для групповых чатов */}
                  {showSender && (
                    <div className="message-sender mb-2 ml-2">
                      {msg.user?.displayName || msg.user?.username || 'Пользователь'}
                    </div>
                  )}
                  
                  {/* Сообщение */}
                  <div
                    className={`px-5 py-4 ${isMyMessage ? 'message-bubble-sent' : 'message-bubble-received'}
                      isTemporary ? 'message-bubble-temporary' : ''
                    }`}
                  >
                    <p className={`text-[14px] leading-relaxed whitespace-pre-wrap break-words ${isMyMessage ? 'text-right' : 'text-left'}`}>
                      {msg.text}
                    </p>
                    
                    {/* Время и статус */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="message-time text-[11px]">
                        {formatTime(new Date(msg.createdAt))}
                      </span>
                      <div className="flex items-center gap-2">
                        {isTemporary && (
                          <span className="text-[11px] text-[#d7ba7d] animate-pulse">Отправка...</span>
                        )}
                        {isMyMessage && (
                          <span className="text-[11px] text-[#89d185]">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ввод сообщения */}
      <div className="p-6 border-t border-gray-800 bg-[#252526]">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => handleTyping(true)}
              onBlur={() => handleTyping(false)}
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
    </div>
  );
};