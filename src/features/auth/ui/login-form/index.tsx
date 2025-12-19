import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useStore } from '@/app/store'; 
import { UseSocket } from '@/app/web-socket';
import { FormField } from '../form-field';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketContext = UseSocket();
  
  const login = useStore(state => state.login);
  const isAuth = useStore(state => state.isAuth);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth && socketContext?.socket) {
      const socket = socketContext.socket;
      
      if (!socket.connected) {
        socket.connect();
      }
      
      socket.emit('update-user-status', { isOnline: true });
      
      navigate('/home');
    }
  }, [isAuth, socketContext, navigate]);
  
  return (
    <div className="min-w-[400px] max-w-[420px] w-full mx-auto my-12 p-10 bg-[var(--sidebar-background)] rounded-xl border border-gray-600">
      
      <h2 className="text-2xl font-semibold text-center text-gray-100 pt-8 pb-14">
        Вход в аккаунт
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-7">
          
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="example@mail.ru"
            disabled={loading}
            error=''
          />
          
          <FormField
            label="Пароль"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            disabled={loading}
          />
          
          {error && (
            <div className="w-full max-w-[340px] p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full max-w-[100px] py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <div className="w-full max-w-[340px] pt-8 border-t border-gray-700 text-center text-gray-400">
            Нет аккаунта?{' '}
            <Link 
              to="/register" 
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};