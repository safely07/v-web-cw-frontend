import type { TMessage } from "../../../message/model/type";
import type { TUser } from "../../../user"

export type TChat = {
    id: string;
    isGroup: boolean;
    groupName?: string;
    members: TUser[];
    createdAt: Date;
    lastMessage?: TMessage;
    unreadCount: number;
};