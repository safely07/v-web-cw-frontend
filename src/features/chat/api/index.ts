import { API_URL } from '@/shared/api';

export const chatApi = {
  createChat: async (interlocutorId: string) => {
    const response = await fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId: interlocutorId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка создания чата');
    }
    
    return response.json();
  },
  
  getChats: async () => {
    const response = await fetch(`${API_URL}/chats`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить чаты');
    }
    
    return response.json();
  },
  
  getCurrentUsersMessages: async () => {
    const response = await fetch(
      `${API_URL}/chats/messages`,
      { credentials: 'include' }
    );
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить сообщения');
    }
    
    return response.json();
  },
  
  sendMessage: async (chatId: string, text: string) => {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка отправки сообщения');
    }
    
    return response.json();
  },
  
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки пользователей');
    return response.json();
  },
};