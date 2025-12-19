import { API_URL } from "../config";

export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`${API_URL}${url}`, {
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Ошибка запроса');
    return response.json();
  },
  
  post: async (url: string, data: any) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Ошибка запроса');
    return response.json();
  },
};