import type { TChat } from "../type";

type TChatElementProps = {
    chat: TChat,
    isActive: boolean,
    name: string,
    onClick?: () => void;
}

export const ChatElement = ({ chat, isActive, name, onClick }: TChatElementProps) => {
    
    const formatTime = (date?: Date) => {
        if (!date) return '';
        try {
            const messageDate = new Date(date);
            const now = new Date();
            const diffMs = now.getTime() - messageDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'только что';
            if (diffMins < 60) return `${diffMins} мин`;
            if (diffHours < 24) return `${diffHours} ч`;
            if (diffDays < 7) return `${diffDays} д`;
            
            return messageDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit'
            });
        } catch {
            return '';
        }
    };

    const getMessagePreview = (text?: string) => {
        if (!text) return "Нет сообщений";
        if (text.length > 50) {
            return text.slice(0, 50) + '...';
        }
        return text;
    };

    const getInitial = (name: string) => {
        return name.slice(0, 1).toUpperCase();
    };

    return (
        <div 
            onClick={onClick}
            className={`
                w-full
                flex items-center gap-3
                cursor-pointer
                hover:bg-[var(--hover-bg)]
                transition-colors
                ${isActive 
                    ? 'bg-[var(--selection-bg)] border-l-2 border-l-[var(--accent-primary)]' 
                    : ''
                }
            `}
            style={{ 
                padding: '12px 16px'
            }}
        >

            <div className="relative flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-[var(--accent-primary)]">
                        {getInitial(name)}
                    </span>
                </div>
                
                {chat.interlocutor?.isOnline && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--status-online)] border border-[var(--panel-background)]"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                    <span className={`font-medium text-sm truncate ${isActive ? 'text-[var(--text-heading)]' : 'text-[var(--text-primary)]'}`}>
                        {name}
                    </span>
                    
                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap" style={{ marginLeft: '8px' }}>
                        {formatTime(chat.lastMessage?.createdAt)}
                    </span>
                </div>
                
                <div className="flex items-center" style={{ gap: '8px' }}>
                    <span className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                        {getMessagePreview(chat.lastMessage?.text)}
                    </span>
                    
                    {chat.lastMessage?.isRead && (
                        <svg 
                            className="flex-shrink-0" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            style={{ height: '14px', width: '14px', color: 'var(--success)' }}
                        >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {chat.unreadCount > 0 && (
                <div className="flex-shrink-0">
                    <div className="rounded-full bg-[var(--accent-primary)] flex items-center justify-center"
                         style={{ 
                             height: '20px', 
                             minWidth: '20px', 
                             padding: '0 4px' 
                         }}>
                        <span className="text-xs font-semibold text-white">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};