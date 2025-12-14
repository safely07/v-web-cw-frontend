import { useState, useEffect } from 'react';
import { useStore } from '../../../shared/lib/zustand/store-context';
import { type TUser } from '../../../entities/user';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (interlocutorId: string) => void;
}

export const NewChatModal = ({ isOpen, onClose, onCreateChat }: NewChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);
  
  const currentUser = useStore(state => state.currentUser);
  const createChat = useStore(state => state.createChat);

  // Загружаем пользователей при открытии модалки
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Фильтруем пользователей при изменении поискового запроса
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.displayName?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const loadUsers = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        headers: { 'X-User-Email': currentUser.email }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (userId: string) => {
    try {
      await createChat(userId);
      onCreateChat(userId);
      onClose();
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="modal-container w-full max-w-md mx-4">
        {/* Заголовок */}
        <div className="modal-header p-4">
          <div className="flex items-center justify-between">
            <h2 className="modal-title">Новый чат</h2>
            <button
              onClick={onClose}
              className="modal-close-button"
            >
              ✕
            </button>
          </div>
          
          {/* Поиск */}
          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск пользователей..."
              className="modal-input py-2"
              autoFocus
            />
          </div>
        </div>

        {/* Список пользователей */}
        <div className="max-h-[400px] overflow-y-auto chat-scrollbar">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-var(--accent)"></div>
              <p className="mt-4 text-[13px] text-gray-400">Загрузка пользователей...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[13px] text-gray-400">
                {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
              </p>
            </div>
          ) : (
            <div>
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleCreateChat(user.id)}
                  className="modal-list-item flex items-center gap-3"
                >
                  {/* Аватар */}
                  <div className="modal-user-avatar">
                    {user.displayName?.charAt(0) || user.username?.charAt(0) || '?'}
                  </div>
                  
                  {/* Информация */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-medium text-var(--foreground) truncate">
                        {user.displayName || user.username}
                      </h3>
                      {user.isOnline && (
                        <div className="sidebar-status-indicator bg-var(--online)"></div>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Подсказка */}
        <div className="modal-footer p-3">
          <p className="text-[11px] text-center">
            Выберите пользователя для создания приватного чата
          </p>
        </div>
      </div>
    </div>
  );
};