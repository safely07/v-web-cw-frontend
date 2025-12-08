import { type TUser } from "../../entities/user";
import { type TChat } from "../../entities/chat";
import { type TMessage } from "../../entities/message";

export type TAppStore = {

    currentUser: TUser | null;
    isAuth: boolean;

    chats: TChat[];
    activeChatId: string | null;

    messages: Record<string, TMessage[]>;

    isLoading: boolean;

    login: (email: string, password: string) => void;
    logout: () => void;

    setActiveChat: (chatId: string) => void;
    createChat: (interlocutorId: string) => void;
    createGroupChat: (name: string, userIds: string[]) => void;

    sendMessage: (chatId: string, text: string) => void;
    loadMessages: (chatId: string) => void;

    updateUserStatus: (isOnline: boolean) => void;

    getActiveChat: () => TChat | undefined;
    getChatMessages: (chatId: string) => TMessage[];
    getInterlocutor: (chat: TChat) => TUser | undefined;
};