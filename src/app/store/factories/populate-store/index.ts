import { type StoreApi, createStore } from 'zustand';
import { type TAppStore } from '@app/store';
import { type TChat } from '@entities/chat';
import { authApi } from '@/features/auth/api';
import { chatApi } from '@/features/chat/api';
import type { TMessage } from '@/entities/message';

export const populateStore = (): StoreApi<TAppStore> =>
    createStore<TAppStore>((set, get) => {
        return {
            currentUser: null,
            isAuth: false,
            chats: [],
            activeChat: null,
            messages: [],
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
  
                try {
                    console.log('Начинаем авторизацию...');
                    const authData = await authApi.login(email, password);
                    
                    console.log('Загружаем чаты пользователя...');
                    const chats = await chatApi.getChats();
                    
                    console.log('Загружаем сообщения текущего пользователя...');
                    const messages = await chatApi.getCurrentUsersMessages();

                    set({
                        currentUser: authData.user,
                        isAuth: true,
                        chats,
                        messages,
                        isLoading: false,
                    });
                    
                    console.log('Авторизация завершена успешно');
                    
                } catch (error: any) {
                    console.error('Ошибка авторизации:', error);
                    
                    set({ 
                        error: error.message || 'Ошибка авторизации', 
                        isLoading: false,
                        isAuth: false,
                        currentUser: null,
                    });
                    
                    throw error;
                }
            },

            logout: async () => {
                try {
                    
                    await authApi.logout();

                    set({
                        currentUser: null,
                        isAuth: false,
                        chats: [],
                        messages: [],
                        activeChat: null,
                    });
                }
                catch (error: any) {
                    set({
                        error: error.message || 'Ошибка выхода',
                        currentUser: null,
                        isAuth: false,
                    });

                    throw error;
                }
            },

            setActiveChat: (chat: TChat) => {
                set({activeChat: chat});
            },

            createChat: async (interlocutorId: string) => {
                const chatData = await chatApi.createChat(interlocutorId);
                
                const newChat = chatData.chat;

                get().addNewChat(newChat);

                return newChat;
            },

            addNewChat: async (chat: TChat) => {
                
                set(state => ({
                    chats: [...state.chats, chat]
                }));
            },

            addNewMessage: async (message: TMessage) => {
                
                set(state => ({
                        messages: [...state.messages, message]
                }));
            },

            sendMessageOfActiveChat: async (text: string) => {
                const { activeChat } = get();

                if (activeChat) {
                    const chatData = await chatApi.sendMessage(activeChat?.id,text);
                    const newMessage = chatData.message;
                    get().addNewMessage(newMessage);
                };
            },

            loadMessagesInActiveChat: () => {
                const { messages, activeChat } = get();
  
                if (!activeChat || !messages) {
                    return [];
                }
                
                return messages.filter(message => message.chatId === activeChat.id);
            },
            
            updateUserStatus: (isOnline: boolean) => {
                set(state => ({
                    currentUser: state.currentUser 
                    ? { ...state.currentUser, isOnline }
                    : null
                }));
            },
            
            getInterlocutor: () => {
                const { activeChat } = get();
                return activeChat?.interlocutor;
            }
        }
    });