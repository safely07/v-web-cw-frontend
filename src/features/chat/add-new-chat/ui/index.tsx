import { useState, useEffect } from 'react';
import { useStore } from '@/app/store';
import { type TUser } from '@/entities/user';
import { chatApi } from '@features/chat/api';
import { useSocket } from '@/app/web-socket';
import type { TChat } from '@/entities/chat';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (newChat: TChat) => void;
}

export const NewChatModal = ({ isOpen, onClose, onCreateChat }: NewChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);
  const socket = useSocket().socket;
  
  const createChat = useStore(state => state.createChat);
  const getInterlocutor = useStore(state => state.getInterlocutor);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      
      try {
        const usrs = await chatApi.getAllUsers();
        setUsers(usrs);
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

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

  const handleCreateChat = async (userId: string) => {
    try {
      const newChat = await createChat(userId);
      onCreateChat(newChat);
      onClose();
      
      if (socket) {
        socket.emit('create-chat', { interlocutorId: getInterlocutor()?.id });
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-[var(--panel-background)] rounded-lg border border-[var(--border-color)] shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-heading)]">
              Новый чат
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Search input */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск пользователей по имени, логину или email..."
              className="w-full px-4 py-2.5 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--input-foreground)] placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus-border)] focus:shadow-[var(--input-focus-shadow)] transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Users list */}
        <div className="max-h-[400px] overflow-y-auto chat-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-[var(--accent-primary)] border-t-transparent mb-4"></div>
              <p className="text-[var(--text-secondary)] text-sm">
                Загрузка пользователей...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[var(--text-secondary)] text-sm">
                {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--divider-color)]">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleCreateChat(user.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--hover-bg)] transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-medium text-sm">
                    {user.displayName?.charAt(0)?.toUpperCase() || 
                     user.username?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  
                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {user.displayName || user.username}
                      </h3>
                      {user.isOnline && (
                        <div className="w-2 h-2 rounded-full bg-[var(--status-online)]"></div>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      @{user.username}
                      {user.displayName && user.username !== user.displayName && ` • ${user.displayName}`}
                    </p>
                  </div>
                  
                  {/* Email (hidden on small screens) */}
                  <div className="hidden md:block ml-2">
                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--sidebar-background)]">
          <p className="text-xs text-[var(--text-secondary)] text-center">
            Выберите пользователя для создания приватного чата
          </p>
        </div>
      </div>
    </div>
  );
};