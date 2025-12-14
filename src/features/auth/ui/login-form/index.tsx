// features/auth/LoginForm/index.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useStore } from '../../../../shared/lib/zustand/store-context';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const login = useStore(state => state.login);
  const isAuth = useStore(state => state.isAuth);
  const navigate = useNavigate();
  
  // Эффект для навигации при изменении isAuth
  useEffect(() => {
    if (isAuth) {
      console.log('✅ isAuth изменился, переход на /home');
      navigate('/home');
    }
  }, [isAuth, navigate]);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Начинаем процесс авторизации...');
      await login(email, password);
      
      // НЕ проверяем isAuth здесь - это сделает useEffect
      // Если login успешно завершился, значит авторизация прошла
      console.log('✅ login() завершился успешно');
      
    } catch (err: any) {
      console.error('❌ Ошибка авторизации:', err);
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-w-[400px] max-w-[420px] w-full mx-auto my-12 p-10 bg-var(--sidebar-background) rounded-xl border border-gray-600 shadow-xl">
      
      <div className="pt-8 pb-14">
        <h2 className="text-2xl font-semibold text-center text-gray-100">Вход в аккаунт</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-7">
          {/* Email */}
          <div className="w-full max-w-[340px]">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.ru"
                className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="w-full max-w-[340px]">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-300">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>
          </div>
          
          {/* Ошибка */}
          {error && (
            <div className="w-full max-w-[340px] p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Button */}
          <div className="w-full max-w-[100px]">
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-base transition-colors min-h-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>

          {/* Registration link */}
          <div className="w-full max-w-[340px] pt-8 border-t border-gray-700 text-center text-gray-400 text-base">
            Нет аккаунта?{' '}
            <Link 
              to="/register" 
              className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};