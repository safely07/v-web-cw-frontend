
export type TMessage = {
    id: string;
    chatId: string;
    userId: string;
    text: string;
    createdAt: Date;
    isRead?: boolean;
};