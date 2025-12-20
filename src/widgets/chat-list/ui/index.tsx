import { useState } from 'react';
import { useStore } from '@/app/store';
import { NewChatModal } from '@/features/chat/add-new-chat';
import { ChatElement, type TChat } from '@/entities/chat';

export const ChatList = () => {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const chats = useStore(state => state.chats);
  const activeChat = useStore(state => state.activeChat);
  const loadMessages = useStore(state => state.loadMessages);
  const setActiveChat = useStore(state => state.setActiveChat);

  const handleNewChatClick = () => {
    setIsNewChatModalOpen(true);
  };

  const handleChatCreated = (newChat: TChat) => {
    console.log('Переключение на чат ', newChat.id);
    
    if (newChat) {
      setActiveChat(newChat);
    }
  };

  const handleClickChat = async (chat: TChat) => {
    await loadMessages(chat.id);
    setActiveChat(chat);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-[var(--sidebar-background)]">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-[var(--text-heading)]">
              Чаты
            </h2>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--badge-bg)] px-2 py-1 rounded">
              {chats.length}
            </span>
          </div>
          
          {/* New Chat Button */}
          <button 
            onClick={handleNewChatClick}
            className={`
              w-full py-2.5
              bg-[var(--button-background)]
              hover:bg-[var(--button-hover)]
              text-[var(--button-foreground)]
              text-[13px]
              font-medium
              rounded
              transition-colors
              active:scale-[0.98]
            `}
          >
            + Новый чат
          </button>
        </div>
        
        {/* Chats List */}
        <div className="flex-1 overflow-y-auto chat-scrollbar">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => handleClickChat(chat)}
              className="hover:bg-[var(--hover-bg)] transition-colors"
            >
              <ChatElement 
                chat={chat} 
                isActive={activeChat?.id === chat.id} 
                name={chat.name || `Чат ${chat.id.slice(0, 8)}...`}
              />
            </div>
          ))}
          
          {/* Empty state */}
          {chats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-3xl mb-4 opacity-30">💬</div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                Чатов пока нет
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Создайте первый чат, нажав кнопку выше
              </p>
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleChatCreated}
      />
    </>
  );
};