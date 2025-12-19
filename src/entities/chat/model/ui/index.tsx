import type { TChat } from "../type";

type TChatElementProps = {
    chat: TChat,
    name: string,
}

export const ChatElement = ({chat, name}: TChatElementProps) => {
    return (
        <div className="flex items-center p-4 hover:bg-[var(--chat-background)] cursor-pointer w-full">

            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[var(--accent)]/10 
                flex items-center justify-center">
                <span className="text-lg font-semibold text-[var(--accent)]">
                    {name.slice(0,1)}
                </span>
            </div>

            <div className="flex-1 min-w-0 ml-3">
                
                <div className="flex justify-between items-baseline">
                    <span className="font-semibold truncate text-[var(--foreground)]">
                        {name}
                    </span>
                    <span className="text-sm text-[#858585] ml-2">
                        {chat.lastMessage?.createdAt.toString()}
                    </span>
                </div>
                
                <div className="flex items-center mt-1">
                    <span className="text-[#a0a0a0] truncate flex-1">
                        {chat.lastMessage?.text || "Нет сообщений"}
                    </span>
                    {chat.lastMessage?.isRead && (
                        <svg className="h-4 w-4 text-[var(--accent)] ml-2" 
                             fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {chat.unreadCount > 0 && (
                <div className="flex-shrink-0 ml-3">
                    <div className="h-6 w-6 rounded-full bg-[var(--accent)] 
                                   flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                            {chat.unreadCount}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}