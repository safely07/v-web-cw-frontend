import { API_URL } from "@/shared/api";

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка авторизации');
    }
    
    return response.json();
  },
  
  logout: async () => {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },
  
  checkAuth: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  register: async (email:string, password: string, username: string, displayName: string) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, username, displayName }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка регистрации');
    }
    
    return response.json();
  },

};