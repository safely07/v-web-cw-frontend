import type { TMessage } from "../type";

type TMessageElementProps = {
    message: TMessage,
    isMyMessage?: boolean;
}

export const MessageElement = ({ message, isMyMessage = false }: TMessageElementProps) => {
    return (
        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
            
            <div className={`
                max-w-[80%] 
                rounded-xl 
                px-3 py-2 
                ${isMyMessage 
                    ? 'bg-[var(--message-sent)] text-white text-right' 
                    : 'bg-[var(--message-received)] text-white text-left'
                }
            `}>
                
                <p>{message.text}</p>
                
                <div className="text-right mt-1">
                    <span className="text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

