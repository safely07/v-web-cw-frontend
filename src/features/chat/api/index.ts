import configApi from "@/config";

export const chatApi = {
  createChat: async (interlocutorId: string) => {
    const response = await fetch(`${configApi.apiUrl}/api/chats`, {
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
    const response = await fetch(`${configApi.apiUrl}/api/chats`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить чаты');
    }
    
    return response.json();
  },
  
  getMessages: async (chatId: string): Promise<any> => {
    const response = await fetch(`${configApi.apiUrl}/api/chats/${chatId}/messages`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка загрузки сообщений');
    }
    
    return response.json();
  },
  
  sendMessage: async (chatId: string, text: string) => {
    const response = await fetch(`${configApi.apiUrl}/api/chats/${chatId}/messages`, {
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
    const response = await fetch(`${configApi.apiUrl}/api/users`, {
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки пользователей');
    return response.json();
  },
};