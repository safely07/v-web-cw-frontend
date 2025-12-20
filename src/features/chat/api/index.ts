import { API_URL } from '@/shared/api';

export const chatApi = {
  createChat: async (interlocutorId: string) => {
    const response = await fetch(`${API_URL}/api/chats`, {
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
    const response = await fetch(`${API_URL}/api/chats`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить чаты');
    }
    
    return response.json();
  },
  
  getMessages: async (chatId: string): Promise<any> => {
    const response = await fetch(`http://localhost:3001/api/chats/${chatId}/messages`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка загрузки сообщений');
    }
    
    return response.json();
  },
  
  sendMessage: async (chatId: string, text: string) => {
    const response = await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
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
    const response = await fetch(`${API_URL}/api/users`, {
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки пользователей');
    return response.json();
  },
};