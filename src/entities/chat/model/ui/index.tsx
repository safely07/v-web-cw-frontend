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
            
            // Если больше недели - показываем дату
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
                w-full px-4 py-3
                flex items-center gap-3
                cursor-pointer
                hover:bg-[var(--hover-bg)]
                transition-colors
                ${isActive 
                    ? 'bg-[var(--selection-bg)] border-l-2 border-l-[var(--accent-primary)]' 
                    : ''
                }
            `}
        >

            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-[var(--accent-primary)]">
                        {getInitial(name)}
                    </span>
                </div>
                
                {/* Online status */}
                {chat.interlocutor?.isOnline && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--status-online)] border border-[var(--panel-background)]"></div>
                )}
            </div>

            {/* Chat info */}
            <div className="flex-1 min-w-0">
                
                {/* Name and time */}
                <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium text-sm truncate ${isActive ? 'text-[var(--text-heading)]' : 'text-[var(--text-primary)]'}`}>
                        {name}
                    </span>
                    
                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-2">
                        {formatTime(chat.lastMessage?.createdAt)}
                    </span>
                </div>
                
                {/* Message preview */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                        {getMessagePreview(chat.lastMessage?.text)}
                    </span>
                    
                    {/* Read indicator */}
                    {chat.lastMessage?.isRead && (
                        <svg 
                            className="h-3.5 w-3.5 text-[var(--success)] flex-shrink-0" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Unread counter */}
            {chat.unreadCount > 0 && (
                <div className="flex-shrink-0">
                    <div className="h-5 min-w-5 px-1 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};