import type { TMessage } from "../type";

type TMessageElementProps = {
    message: TMessage,
    isMyMessage?: boolean;
}

export const MessageElement = ({ message, isMyMessage = false }: TMessageElementProps) => {
    const formattedTime = new Date(message.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`} style={{ marginBottom: '6px' }}>
            <div 
                className={`
                    relative
                    ${isMyMessage 
                        ? 'bg-[var(--message-sent-bg)] text-[var(--message-sent-text)] ml-auto' 
                        : 'bg-[var(--message-received-bg)] text-[var(--message-received-text)] mr-auto'
                    }
                    shadow-sm
                `}
                style={{ 
                    padding: '10px 14px',
                    borderRadius: '18px',
                    maxWidth: '60%',
                    minWidth: '50px',
                    ...(isMyMessage && {
                        borderBottomRightRadius: '4px'
                    }),
                    ...(!isMyMessage && {
                        borderBottomLeftRadius: '4px'
                    })
                }}
            >
                
                <div 
                    className="text-[14px] leading-relaxed"
                    style={{ 
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        wordWrap: 'break-word',
                        fontFamily: 'var(--font-ui)',
                        whiteSpace: 'pre-wrap',
                        hyphens: 'auto'
                    }}
                >
                    {message.text}
                </div>
                
                <div className="flex justify-end items-center mt-1">
                    <span 
                        className="text-[11px] whitespace-nowrap opacity-80"
                        style={{ 
                            color: isMyMessage ? 'rgba(255, 255, 255, 0.8)' : 'var(--message-timestamp)',
                            marginTop: '2px'
                        }}
                    >
                        {formattedTime}
                    </span>
                </div>
            </div>
        </div>
    );
};