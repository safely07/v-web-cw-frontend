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
    <div style={{padding: '16px'}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        style={{width: '100%', maxWidth: '480px'}}
        className="bg-[var(--panel-background)] rounded-lg border border-[var(--border-color)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{padding: '24px'}} className="border-b border-[var(--border-color)]">
          <div style={{marginBottom: '20px'}} className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-heading)]">
              Новый чат
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
          
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск пользователей по имени, логину или email..."
              className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--input-foreground)] placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus-border)] focus:shadow-[var(--input-focus-shadow)] transition-all"
              autoFocus
              style={{fontSize: '15px'}}
            />
          </div>
        </div>

        <div style={{maxHeight: '400px'}} className="overflow-y-auto chat-scrollbar">
          {loading ? (
            <div style={{padding: '48px 0'}} className="flex flex-col items-center justify-center">
              <div style={{marginBottom: '16px'}} className="w-12 h-12 animate-spin rounded-full border-3 border-[var(--accent-primary)] border-t-transparent"></div>
              <p className="text-[var(--text-secondary)] text-base">
                Загрузка пользователей...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{padding: '48px 0'}} className="text-center">
              <p className="text-[var(--text-secondary)] text-base">
                {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--divider-color)]">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleCreateChat(user.id)}
                  style={{padding: '16px 24px'}}
                  className="w-full flex items-center gap-4 hover:bg-[var(--hover-bg)] transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-medium text-base flex-shrink-0">
                    {user.displayName?.charAt(0)?.toUpperCase() || 
                     user.username?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div style={{marginBottom: '6px'}} className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {user.displayName || user.username}
                      </h3>
                      {user.isOnline && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--status-online)]"></div>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      @{user.username}
                      {user.displayName && user.username !== user.displayName && ` • ${user.displayName}`}
                    </p>
                  </div>
                  
                  <div style={{marginLeft: '8px'}} className="hidden md:block">
                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{padding: '16px'}} className="border-t border-[var(--border-color)] bg-[var(--sidebar-background)]">
          <p className="text-xs text-[var(--text-secondary)] text-center">
            Выберите пользователя для создания приватного чата
          </p>
        </div>
      </div>
    </div>
  );
};