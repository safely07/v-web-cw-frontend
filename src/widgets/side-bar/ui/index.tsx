import { PressButton } from '@/shared/ui/press-button';
import { useStore } from '@/app/store';
import { UseSocket } from '@/app/web-socket';
import { useEffect } from 'react';

export const Sidebar = () => {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const isAuth = useStore(state => state.isAuth);
  const socketContext = UseSocket();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
      if (isAuth && socketContext?.socket) {
        const socket = socketContext.socket;
        
        if (!socket.connected) {
          socket.disconnect();
        }
        
        socket.emit('update-user-status', { isOnline: false });
        
      }
  }, [isAuth, socketContext]);

  return (
    <div className="sidebar-header p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-var(--accent) rounded flex items-center justify-center">
            <span className="text-[14px] font-bold">M</span>
          </div>
          <h1 className="text-[16px] font-semibold text-var(--foreground)">Messenger</h1>
        </div>
        <div className="flex items-center gap-1">
          <button className="sidebar-button" title="Настройки">
            <span className="text-[16px]">⚙</span>
          </button>
          <PressButton 
            onClick={handleLogout}
            moveTo="/"
            className="sidebar-button"
            title="Выйти"
          >
            <span className="text-[15px]">🚪</span>
          </PressButton>
        </div>
      </div>
      
      {/* Статус пользователя */}
      <div className="sidebar-user-info p-3 flex items-center gap-3">
        <div className="relative">
          <div className="sidebar-user-avatar">
            {currentUser?.displayName?.[0] || currentUser?.username?.[0] || '👤'}
          </div>
          <div className="sidebar-status-indicator absolute bottom-0 right-0 bg-var(--online)"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-var(--foreground) truncate">
            {currentUser?.displayName || currentUser?.username || currentUser?.email || 'Пользователь'}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-gray-500">В сети</p>
            <span className="text-[10px] bg-var(--online)/20 text-var(--online) px-1.5 py-0.5 rounded">
              WS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};