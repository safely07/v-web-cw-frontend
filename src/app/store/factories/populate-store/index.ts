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
            messages: {},
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
  
                try {
                    console.log('Начинаем авторизацию...');
                    const authData = await authApi.login(email, password);
                    
                    console.log('Загружаем чаты пользователя...');
                    const chats = await chatApi.getChats();

                    set({
                        currentUser: authData.user,
                        isAuth: true,
                        chats,
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

            loadMessages: async (chatId: string) => {
                set({ isLoading: true });
                
                try {
                    let messages = await chatApi.getMessages(chatId);
                    messages = (messages as TMessage[]).sort((a, b) => {
                        const dateA = new Date(a.createdAt).getTime();
                        const dateB = new Date(b.createdAt).getTime();
                        return dateA - dateB;
                    });
                    set(state => ({
                        messages: {
                            ...state.messages,
                            [chatId]: messages
                        },
                        isLoading: false
                    }));
                    
                    return messages;
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
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
                        messages: {},
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
                set({
                    activeChat: chat,
                });
            },

            createChat: async (interlocutorId: string) => {
                const chatData: TChat = await chatApi.createChat(interlocutorId);
                
                if (get().chats.findIndex(chat => chat.id === chatData.id) === -1) {
                    console.log('Новый чат добавляем');
                    set(state => ({
                        chats: [...state.chats, chatData],
                    }));
                };

                return chatData;
            },

            addNewChat: async (newChat: TChat) => {
                if ((get().chats.findIndex(chat => chat.id === newChat.id) === -1)&&(get().currentUser?.id === newChat?.interlocutor?.id)) {
                    console.log('новый чат', newChat);
                    set(state => ({
                        chats: [...state.chats, newChat],
                    }));
                }
            },

            addNewMessage: (message: TMessage) => {
                
                if (!message?.chatId) return;
                
                console.log('addNewMessage для чата:', message.chatId);
                
                set(state => {
                    const newMessages = { ...state.messages };
                    
                    const chatMessages = newMessages[message.chatId] 
                        ? [...newMessages[message.chatId]] 
                        : [];
                    
                    chatMessages.push(message);
                    
                    newMessages[message.chatId] = chatMessages;
                    
                    return {
                        ...state,
                        messages: newMessages
                    };
                });
            },

            sendMessageOfActiveChat: async (text: string) => {
                const { activeChat } = get();

                if (activeChat) {
                    const chatData = await chatApi.sendMessage(activeChat?.id,text);
                    const newMessage = chatData.message;
                    get().addNewMessage(newMessage);
                };
            },

            updateInterlocutorStatus: (userId: string, isOnline: boolean) => {
                set(state => {
                    const updatedChats = state.chats.map(chat => {
                    if (chat.interlocutor?.id === userId) {
                        return {
                        ...chat,
                        interlocutor: {
                            ...chat.interlocutor,
                            isOnline: isOnline
                        }
                        };
                    }
                    return chat;
                    });
                    
                    let updatedActiveChat = state.activeChat;
                    if (state.activeChat?.interlocutor?.id === userId) {
                    updatedActiveChat = {
                        ...state.activeChat,
                        interlocutor: {
                        ...state.activeChat.interlocutor,
                        isOnline: isOnline
                        }
                    };
                    }
                    
                    return {
                    ...state,
                    chats: updatedChats,
                    activeChat: updatedActiveChat,
                    };
                });
            },
            
            getInterlocutor: () => {
                const { activeChat } = get();
                return activeChat?.interlocutor;
            }
        }
    });