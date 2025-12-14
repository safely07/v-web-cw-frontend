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

    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;

    setActiveChat: (chatId: string) => void;
    createChat: (interlocutorId: string) => void;
    createGroupChat: (name: string, userIds: string[]) => void;

    sendMessage: (chatId: string, text: string) => Promise<void>;
    loadMessages: (chatId: string) => Promise<void>;

    updateUserStatus: (isOnline: boolean) => void;

    getActiveChat: () => TChat | undefined;
    getChatMessages: (chatId: string) => TMessage[];
    getInterlocutor: (chat: TChat) => TUser | undefined;
    
    handleIncomingMessage: (message: any) => void;
};