import { type StoreApi, createStore } from 'zustand';
import { type TAppStore } from '../../../app/store';
import { type TChat } from '../../../entities/chat';

export const populateStore = (): StoreApi<TAppStore> =>
    createStore<TAppStore>((set, get) => ({
        currentUser: null,
        isAuth: false,
        chats: [],
        activeChatId: null,
        messages: {},
        isLoading: false,
        error: null,

        login: (email:string, password: string) => {

        },

        logout: () => {},

        setActiveChat: (chatId: string) => {

        },

        createChat(interlocutorId: string) {
            
        },

        createGroupChat(name: string, userIds: string[]) {
            
        },

        sendMessage(chatId: string, text: string) {
            
        },

        loadMessages(chatId: string) {
            
        },

        updateUserStatus(isOnline: boolean) {
            set(state => ({
            currentUser: state.currentUser 
                ? { ...state.currentUser, isOnline }
                : null,
            }));
        },

        getActiveChat() {
            const { chats, activeChatId } = get();
            return chats.find(chat => chat.id === activeChatId);
        },

        getChatMessages(chatId: string) {
            return get().messages[chatId] || []
        },

        getInterlocutor(chat: TChat) {
            return undefined
        },
    }));