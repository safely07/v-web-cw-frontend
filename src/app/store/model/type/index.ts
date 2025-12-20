import { type TUser } from "@/entities/user";
import { type TChat } from "@/entities/chat";
import { type TMessage } from "@/entities/message";

export type TAppStore = {

    currentUser: TUser | null;
    isAuth: boolean;

    chats: TChat[];
    activeChat: TChat | null;

    messages: Record<string, TMessage[]>;

    isLoading: boolean;

    error: string | null;

    login: (email: string, password: string) => void;
    logout: () => void;

    setActiveChat: (chat: TChat) => void;
    createChat: (interlocutorId: string) => Promise<TChat>;
    addNewChat: (chat: TChat) => void;

    addNewMessage: (message: TMessage) => void;
    sendMessageOfActiveChat: (text: string) => void;
    loadMessages: (chatId: string) => Promise<any>;

    updateInterlocutorStatus: (userId:string, isOnline: boolean) => void;

    getInterlocutor: () => TUser | undefined;

};