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

    // Функция для обработки длинных слов (перенос по слогам)
    const breakLongWords = (text: string) => {
        // Заменяем слишком длинные слова (более 20 символов) с переносами
        return text.replace(/(\S{20,})/g, (match) => {
            // Вставляем мягкие переносы каждые 15 символов
            return match.replace(/(.{15})/g, '$1\u00AD'); // \u00AD = мягкий перенос
        });
    };

    const processedText = breakLongWords(message.text);

    return (
        <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                isMyMessage 
                    ? 'bg-[var(--message-sent-bg)] text-[var(--message-sent-text)] ml-auto rounded-br-sm' 
                    : 'bg-[var(--message-received-bg)] text-[var(--message-received-text)] mr-auto rounded-bl-sm'
            }`}>
                
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-all break-words overflow-wrap-anywhere hyphens-auto">
                    {processedText}
                </p>
                
                <div className="flex justify-end items-center gap-2 mt-1">
                    <span className="text-[11px] text-[var(--message-timestamp)] whitespace-nowrap">
                        {formattedTime}
                    </span>
                    
                    {isMyMessage && (
                        <div className="h-3 w-3 flex items-center justify-center flex-shrink-0">
                            {message.isRead ? (
                                <svg 
                                    className="h-3 w-3 text-[var(--success)]" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                </svg>
                            ) : (
                                <svg 
                                    className="h-3 w-3 text-[var(--text-muted)]" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                </svg>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};