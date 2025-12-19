import type { TUser } from "@/entities/user";
import type { TMessage } from "../../../message/model/type";

export type TChat = {
    id: string;
    name?: string;
    createdAt: Date;
    lastMessage?: TMessage;
    unreadCount: number;
    interlocutor?: TUser;
    lastMessageText?: string;
    lastMessageDate?: Date;
};