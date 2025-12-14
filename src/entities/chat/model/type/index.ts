import type { TMessage } from "../../../message/model/type";

export type TChat = {
    id: string;
    isGroup: boolean;
    groupName?: string;
    members: string[];
    createdAt: Date;
    lastMessage?: TMessage;
    unreadCount: number;
    interlocutorId?: string; // ID собеседника для приватных чатов
    interlocutorStatus?: 'online' | 'offline'; // Статус собеседника
    lastSeen?: Date; // Время последней активности
    lastMessageText?: string; // Текст последнего сообщения
    lastMessageDate?: Date; // Дата последнего сообщения
};