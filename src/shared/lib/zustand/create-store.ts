import { type StoreApi, createStore } from 'zustand';
import { type TAppStore } from '../../../app/store';
import { type TChat } from '../../../entities/chat';
import { type TMessage } from '../../../entities/message';
import { type TUser } from '../../../entities/user';
import { websocketService } from '../../api/websocket'; // Импортируем WebSocket сервис

const API_URL = 'http://localhost:3001/api';

export const populateStore = (): StoreApi<TAppStore> =>
    createStore<TAppStore>((set, get) => {
        // Функция для обработки входящих WebSocket сообщений
        const handleIncomingMessage = (message: any) => {
            console.log('🆕 Обработка входящего сообщения в сторе:', {
                id: message.id,
                userId: message.userId,
                text: message.text,
                chatId: message.chatId
            });
            
            // Проверяем, что это объект сообщения
            if (!message || !message.chatId) {
                console.error('❌ Некорректное сообщение:', message);
                return;
            }
            
            set(state => {
                const currentUser = state.currentUser;
                const currentMessages = state.messages[message.chatId] || [];
                
                // Определяем, является ли это сообщением текущего пользователя
                const isMyMessage = currentUser && message.userId === currentUser.id;
                
                // Если это сообщение от текущего пользователя, проверяем временные сообщения
                if (isMyMessage) {
                    console.log('👤 Это сообщение от текущего пользователя');
                    
                    // Ищем временное сообщение с таким же текстом в последние 5 секунд
                    const now = new Date();
                    const recentTempMessages = currentMessages.filter(msg => 
                        msg.id.startsWith('temp-') && 
                        msg.text === message.text &&
                        (now.getTime() - new Date(msg.createdAt).getTime()) < 5000
                    );
                    
                    if (recentTempMessages.length > 0) {
                        console.log('🔄 Найдено временное сообщение для замены:', recentTempMessages[0].id);
                        // Заменяем первое найденное временное сообщение
                        return {
                            messages: {
                                ...state.messages,
                                [message.chatId]: currentMessages.map(msg =>
                                    msg.id === recentTempMessages[0].id ? message : msg
                                ),
                            },
                            // Обновляем информацию о чате
                            chats: state.chats.map(chat => {
                                if (chat.id === message.chatId) {
                                    return {
                                        ...chat,
                                        lastMessage: message,
                                        lastMessageText: message.text,
                                        lastMessageDate: message.createdAt,
                                        // Для своих сообщений не увеличиваем unreadCount
                                    };
                                }
                                return chat;
                            }),
                        };
                    }
                }
                
                // Проверяем, есть ли уже такое сообщение (по id)
                const messageExists = currentMessages.some(m => m.id === message.id);
                
                if (messageExists) {
                    console.log('🔄 Обновляем существующее сообщение:', message.id);
                    // Обновляем существующее сообщение
                    return {
                        messages: {
                            ...state.messages,
                            [message.chatId]: currentMessages.map(m =>
                                m.id === message.id ? { ...m, ...message } : m
                            ),
                        },
                        // Обновляем информацию о чате
                        chats: state.chats.map(chat => {
                            if (chat.id === message.chatId) {
                                const isMyMessage = currentUser && message.userId === currentUser.id;
                                
                                return {
                                    ...chat,
                                    lastMessage: message,
                                    lastMessageText: message.text,
                                    lastMessageDate: message.createdAt,
                                    unreadCount: isMyMessage ? chat.unreadCount : (chat.unreadCount + 1)
                                };
                            }
                            return chat;
                        }),
                    };
                } else {
                    console.log('➕ Добавляем новое сообщение:', message.id);
                    // Добавляем новое сообщение
                    return {
                        messages: {
                            ...state.messages,
                            [message.chatId]: [...currentMessages, message],
                        },
                        // Обновляем информацию о чате
                        chats: state.chats.map(chat => {
                            if (chat.id === message.chatId) {
                                const isMyMessage = currentUser && message.userId === currentUser.id;
                                
                                return {
                                    ...chat,
                                    lastMessage: message,
                                    lastMessageText: message.text,
                                    lastMessageDate: message.createdAt,
                                    unreadCount: isMyMessage ? chat.unreadCount : (chat.unreadCount + 1)
                                };
                            }
                            return chat;
                        }),
                    };
                }
            });
        };
        
        return {
            currentUser: null,
            isAuth: false,
            chats: [],
            activeChatId: null,
            messages: {},
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                
                try {
                    console.log('🔐 Отправка запроса на логин...');
                    
                    const response = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error || 'Ошибка авторизации');
                    }
                    
                    console.log('✅ Успешный логин:', data.user.email);
                    
                    // Получаем чаты
                    const chatsResponse = await fetch(`${API_URL}/chats`, {
                        headers: { 'X-User-Email': email }
                    });
                    
                    if (!chatsResponse.ok) {
                        throw new Error('Не удалось загрузить чаты');
                    }
                    
                    const chats = await chatsResponse.json();

                    set({
                        currentUser: data.user,
                        isAuth: true,
                        chats,
                        isLoading: false,
                        error: null
                    });
                    
                } catch (error: any) {
                    console.error('❌ Ошибка авторизации:', error);
                    set({ 
                        error: error.message || 'Ошибка авторизации', 
                        isLoading: false,
                        isAuth: false,
                        currentUser: null
                    });
                    throw error;
                }
            },

            logout: () => {
                const { currentUser } = get();
                
                // Отключаем WebSocket
                websocketService.disconnect();
                
                // Отправляем запрос на логаут
                if (currentUser?.email) {
                    fetch(`${API_URL}/logout`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: currentUser.email })
                    }).catch(console.error);
                }
                
                set({
                    currentUser: null,
                    isAuth: false,
                    chats: [],
                    messages: {},
                    activeChatId: null,
                });
                
                console.log('🚪 Выход из системы');
            },

            setActiveChat: (chatId: string) => {
                const previousChatId = get().activeChatId;
                
                // Выходим из предыдущего чата
                if (previousChatId) {
                    websocketService.leaveChat(previousChatId);
                }
                
                // Входим в новый чат
                websocketService.joinChat(chatId);
                
                set({ activeChatId: chatId });
                
                // Сбрасываем непрочитанные при открытии чата
                set(state => ({
                    chats: state.chats.map(chat => 
                        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
                    ),
                }));
                
                console.log(`Активирован чат: ${chatId}`);
            },

            createChat: async (interlocutorId: string) => {
                const { currentUser, chats } = get();
                if (!currentUser) return;
                
                // Проверяем, нет ли уже чата с этим пользователем
                const existingChat = chats.find(chat => 
                    !chat.isGroup && 
                    chat.members.includes(interlocutorId) &&
                    chat.members.includes(currentUser.id)
                );
                
                if (existingChat) {
                    console.log('✅ Чат уже существует, активируем его:', existingChat.id);
                    set({ activeChatId: existingChat.id });
                    return existingChat;
                }
                
                set({ isLoading: true, error: null });
                
                try {
                    const response = await fetch(`${API_URL}/chats`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-User-Email': currentUser.email 
                        },
                        body: JSON.stringify({ userId: interlocutorId }),
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Ошибка создания чата');
                    }
                    
                    const newChat = await response.json();
                    
                    // Проверяем, не создали ли мы уже такой чат (на случай дублирования)
                    const alreadyExists = get().chats.some(chat => chat.id === newChat.id);
                    if (alreadyExists) {
                        console.log('✅ Чат уже добавлен, пропускаем дублирование');
                        set({ isLoading: false });
                        return newChat;
                    }
                    
                    // Присоединяемся к новому чату через WebSocket
                    websocketService.joinChat(newChat.id);
                    
                    set(state => ({
                        chats: [newChat, ...state.chats],
                        messages: {
                            ...state.messages,
                            [newChat.id]: [],
                        },
                        activeChatId: newChat.id, // Автоматически активируем новый чат
                        isLoading: false,
                    }));
                    
                    console.log(`✅ Создан чат с пользователем ${interlocutorId}`);
                    return newChat;
                } catch (error: any) {
                    console.error('❌ Ошибка создания чата:', error);
                    set({ 
                        error: error.message || 'Не удалось создать чат', 
                        isLoading: false 
                    });
                    return null;
                }
            },

            createGroupChat: async (groupName: string, userIds: string[]) => {
                return;
            },

            sendMessage: async (chatId, text) => {
                const { currentUser } = get();
                if (!currentUser) return;
                
                console.log('📤 Начинаем отправку сообщения:', { chatId, text, userId: currentUser.id });
                
                // Оптимистичное обновление - добавляем временное сообщение
                const tempMessage: TMessage = {
                    id: `temp-${Date.now()}`,
                    chatId,
                    userId: currentUser.id,
                    text,
                    createdAt: new Date(),
                };
                
                console.log('📝 Добавляем временное сообщение:', tempMessage.id);
                
                set(state => ({
                    messages: {
                        ...state.messages,
                        [chatId]: [...(state.messages[chatId] || []), tempMessage],
                    },
                }));
                
                try {
                    console.log('📡 Отправляем HTTP запрос...');
                    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-User-Email': currentUser.email 
                        },
                        body: JSON.stringify({ text }),
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Ошибка отправки');
                    }
                    
                    const realMessage = await response.json();
                    console.log('✅ Сообщение получено от сервера (HTTP):', realMessage);
                    
                    // НЕ ЗАМЕНЯЕМ временное сообщение здесь!
                    // WebSocket событие само заменит его
                    
                    console.log('✅ Сообщение отправлено успешно (HTTP)');
                    
                } catch (error: any) {
                    console.error('❌ Ошибка отправки:', error);
                    
                    // Помечаем временное сообщение как ошибочное
                    set(state => ({
                        messages: {
                            ...state.messages,
                            [chatId]: state.messages[chatId].map(msg =>
                                msg.id === tempMessage.id 
                                    ? { ...msg, isError: true, error: 'Не отправлено' }
                                    : msg
                            ),
                        },
                        error: error.message || 'Не удалось отправить сообщение',
                    }));
                }
            },

            loadMessages: async (chatId) => {
                const { currentUser } = get();
                set({ isLoading: true, error: null });
                
                try {
                    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
                    headers: { 
                        'X-User-Email': currentUser?.email || '' 
                    }
                    });
                    
                    if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Ошибка загрузки');
                    }
                    
                    const messages = await response.json();
                    
                    // ВАЖНО: заменяем сообщения, а не добавляем к существующим
                    set(state => ({
                    messages: {
                        ...state.messages,
                        [chatId]: messages, // ← ЗАМЕНЯЕМ полностью
                    },
                    isLoading: false,
                    }));
                    
                    console.log(`✅ Загружены сообщения чата ${chatId} (${messages.length} сообщений)`);
                } catch (error: any) {
                    console.error('❌ Ошибка загрузки сообщений:', error);
                    set({ 
                    error: error.message || 'Не удалось загрузить сообщения', 
                    isLoading: false 
                    });
                }
            },

            updateUserStatus: (isOnline: boolean) => {
                set(state => ({
                    currentUser: state.currentUser 
                        ? { ...state.currentUser, isOnline }
                        : null,
                }));
                
                console.log(`Статус обновлен: ${isOnline ? 'онлайн' : 'офлайн'}`);
            },

            getActiveChat() {
                const { chats, activeChatId } = get();
                return chats.find(chat => chat.id === activeChatId);
            },

            getChatMessages(chatId: string) {
                return get().messages[chatId] || []
            },

            getInterlocutor: (chat: TChat) => {
                const { currentUser } = get();
                if (!currentUser || chat.isGroup) return undefined;
                
                const interlocutorId = chat.members.find(id => id !== currentUser.id);
                if (!interlocutorId) return undefined;
                
                const mockInterlocutor: TUser = {
                    id: interlocutorId,
                    email: `user${interlocutorId}@mail.ru`,
                    username: `user_${interlocutorId}`,
                    displayName: chat.groupName || `Пользователь ${interlocutorId}`,
                    isOnline: Math.random() > 0.5,
                };
                
                return mockInterlocutor;
            },
            
            // Добавляем метод для обработки входящих WebSocket сообщений
            handleIncomingMessage,
        };
    });