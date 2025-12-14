
export type TMessage = {
    id: string;
    chatId: string;
    userId: string;
    text: string;
    createdAt: Date;
    isRead?: boolean;
    user?: {
        id: string;
        username: string;
        displayName?: string;
    };
};