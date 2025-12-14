import { useState } from 'react';
import { useStore } from "../../../shared/lib/zustand/store-context";
import { NewChatModal } from '../../new-chat-modal/ui';

export const ChatList = () => {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const chats = useStore(state => state.chats);
  const activeChatId = useStore(state => state.activeChatId);
  const setActiveChat = useStore(state => state.setActiveChat);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Сегодня
    if (diffDays === 0) {
      if (diffMinutes < 1) return 'только что';
      if (diffMinutes < 60) return `${diffMinutes} мин.`;
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // Вчера
    if (diffDays === 1) return 'вчера';
    
    // На этой неделе
    if (diffDays < 7) {
      const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
      return days[date.getDay()];
    }
    
    // Старее
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const handleNewChatClick = () => {
    setIsNewChatModalOpen(true);
  };

  const handleChatCreated = (interlocutorId: string) => {
    console.log('Чат создан с пользователем:', interlocutorId);
    // Можем сразу открыть созданный чат
    const newChat = chats.find(chat => 
      !chat.isGroup && chat.members.includes(interlocutorId)
    );
    if (newChat) {
      setActiveChat(newChat.id);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto chat-sidebar chat-scrollbar">
        {/* Заголовок */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-white">Чаты</h2>
          </div>
          
          <button 
            onClick={handleNewChatClick}
            className="send-button w-full py-3 text-[14px]"
          >
            Новый чат
          </button>
        </div>
        
        {/* Список чатов */}
        <div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`chat-card ${activeChatId === chat.id ? 'chat-card-active' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Аватар */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="chat-avatar" 
                    style={{ 
                      background: chat.isGroup ? '#8b5cf6' : '#0e639c'
                    }}
                  >
                    <span>
                      {chat.groupName?.slice(0,1) || 'Н'}
                    </span>
                  </div>
                  {!chat.isGroup && chat.unreadCount > 0 && (
                    <div className="unread-badge absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                
                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[14px] font-medium text-white truncate">
                      {chat.groupName || 'Без названия'}
                    </h3>
                    <span className="message-time text-[11px] whitespace-nowrap ml-2">
                      {chat.lastMessage ? formatTime(new Date(chat.lastMessage.createdAt)) : ''}
                    </span>
                  </div>
                  
                  {/* Последнее сообщение */}
                  <p className={`text-[13px] truncate mb-2 ${
                    chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'
                  }`}>
                    {chat.lastMessage?.text || 'Нет сообщений'}
                  </p>
                  
                  {/* Статус */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {chat.isGroup && (
                        <span className="text-[11px] text-gray-500">
                          {chat.members?.length || 0} участников
                        </span>
                      )}
                    </div>
                    
                    {chat.unreadCount > 0 && (
                      <div className="unread-badge px-2 py-1 rounded text-[11px] font-medium">
                        {chat.unreadCount} новое
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Плейсхолдер */}
          {chats.length === 0 && (
            <div className="chat-placeholder py-12">
              <div className="text-3xl mb-4 opacity-30">💬</div>
              <p className="text-[14px] text-gray-400">Чатов пока нет</p>
              <p className="text-[13px] text-gray-500 mt-2">Создайте первый чат!</p>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно нового чата */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleChatCreated}
      />
    </>
  );
};