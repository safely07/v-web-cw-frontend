import { useState, useEffect } from 'react';
import { useStore } from '@/app/store';
import { NewChatModal } from '@/features/chat/add-new-chat';
import { ChatElement } from '@/entities/chat';
import { useSocketChatSubscriptions } from '@/features/chat/hooks';

export const ChatList = () => {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const chats = useStore(state => state.chats);
  const addNewChat = useStore(state => state.addNewChat);
  const setActiveChat = useStore(state => state.setActiveChat);

  useEffect(() => {
      useSocketChatSubscriptions({
        handleNewChat: addNewChat
      })
  },[]);

  const handleNewChatClick = () => {
    setIsNewChatModalOpen(true);
  };

  const handleChatCreated = (interlocutorId: string) => {
    console.log('Чат создан с пользователем:', interlocutorId);
    const newChat = chats.find(chat => 
      chat.interlocutor?.id == interlocutorId
    );
    if (newChat) {
      setActiveChat(newChat);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto chat-sidebar chat-scrollbar">
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
        
        <div>
          {chats.map((chat) => (
            <ChatElement chat={chat} name={chat.name ? chat.name : 'Неизвестный '+chat.id} />
            ))
          }
          
          {chats.length === 0 && (
            <div className="chat-placeholder py-12">
              <div className="text-3xl mb-4 opacity-30">💬</div>
              <p className="text-[14px] text-gray-400">Чатов пока нет</p>
              <p className="text-[13px] text-gray-500 mt-2">Создайте первый чат!</p>
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