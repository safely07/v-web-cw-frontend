import { PressButton } from '@/shared/ui/press-button';
import { useState } from 'react';
import { useStore } from '@/app/store';
import { useSocket } from '@/app/web-socket';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from '@/features/settings';

export const Sidebar = () => {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const socketContext = useSocket();
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    console.log('Выход из системы');
    if (socketContext.socket) {
      socketContext.socket.disconnect();
    }
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.slice(0, 1).toUpperCase();
  };

  const displayName = currentUser?.displayName || currentUser?.username || currentUser?.email || 'Пользователь';

  return (
    <div style={{ padding: '6px' }} className="border-b border-[var(--border-color)] bg-[var(--sidebar-background)]">
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <div className="w-8 h-8 rounded bg-[var(--accent-primary)] flex items-center justify-center">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <h1 className="text-[15px] font-semibold text-[var(--text-heading)]">
            Messenger
          </h1>
        </div>
        
        <div className="flex items-center" style={{ gap: '4px' }}>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Настройки"
          >
            <span className="text-base">⚙</span>
          </button>
           <PressButton 
            onClick={handleLogout}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Выйти"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </PressButton>
        </div>
      </div>
      
      <div className="rounded bg-[var(--panel-background)] border border-[var(--border-color)]" style={{ padding: '12px' }}>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
              <span className="text-sm font-medium text-[var(--accent-primary)]">
                {getInitials(displayName)}
              </span>
            </div>
            
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--status-online)] border-2 border-[var(--sidebar-background)]"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
              {displayName}
            </p>
            
            <div className="flex items-center" style={{ gap: '8px', marginTop: '4px' }}>
              <p className="text-xs text-[var(--text-secondary)]">В сети</p>
            </div>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};