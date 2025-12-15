import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useStore } from '../../../../shared/lib/zustand/store-context';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    displayName?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const login = useStore(state => state.login); // Для автоматического входа после регистрации
  const isAuth = useStore(state => state.isAuth);
  const navigate = useNavigate();
  
  // Эффект для навигации при успешной авторизации
  useEffect(() => {
    if (isAuth) {
      console.log('✅ Регистрация: isAuth изменился, переход на /home');
      navigate('/home');
    }
  }, [isAuth, navigate]);
  
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Некорректный email';
    }
    
    // Username validation
    if (!username) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Только латинские буквы, цифры и подчеркивание';
    }
    
    // Display name validation (optional)
    if (displayName && displayName.length < 2) {
      newErrors.displayName = 'Минимум 2 символа';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log('📝 Регистрация: Отправка данных...');
      
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          displayName: displayName || username,
          password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }
      
      console.log('✅ Регистрация успешна:', data.user.email);
      
      // Автоматически выполняем вход после успешной регистрации
      console.log('🔐 Автоматический вход после регистрации...');
      await login(email, password);
      
      // useEffect сам переведет на /home при изменении isAuth
      
    } catch (err: any) {
      console.error('❌ Ошибка регистрации:', err);
      
      // Обработка специфичных ошибок
      if (err.message.includes('email уже существует')) {
        setErrors({ email: 'Пользователь с таким email уже существует' });
      } else if (err.message.includes('имя уже существует')) {
        setErrors({ username: 'Пользователь с таким именем уже существует' });
      } else {
        setErrors({ general: err.message || 'Ошибка регистрации' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-w-[400px] max-w-[420px] w-full mx-auto my-12 p-10 bg-var(--sidebar-background) rounded-xl border border-gray-600 shadow-xl">
      
      <div className="pt-8 pb-14">
        <h2 className="text-2xl font-semibold text-center text-gray-100">Регистрация</h2>
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
                className={`w-full px-4 py-3 bg-var(--input-background) border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                disabled={loading}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="w-full max-w-[340px]">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-300">Имя пользователя</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ivan_ivanov"
                className={`w-full px-4 py-3 bg-var(--input-background) border ${errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                disabled={loading}
                required
              />
              {errors.username && (
                <p className="text-red-400 text-sm">{errors.username}</p>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div className="w-full max-w-[340px]">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-300">
                Имя для отображения <span className="text-gray-400 text-sm">(необязательно)</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Иван Иванов"
                className={`w-full px-4 py-3 bg-var(--input-background) border ${errors.displayName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                disabled={loading}
              />
              {errors.displayName && (
                <p className="text-red-400 text-sm">{errors.displayName}</p>
              )}
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
                className={`w-full px-4 py-3 bg-var(--input-background) border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                disabled={loading}
                required
              />
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full max-w-[340px]">
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-300">Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-var(--input-background) border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                disabled={loading}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          {/* Общая ошибка */}
          {errors.general && (
            <div className="w-full max-w-[340px] p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm text-center">{errors.general}</p>
            </div>
          )}
          
          {/* Информация о требованиях */}
          <div className="w-full max-w-[340px] p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm font-medium mb-2">Требования:</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>✓ Email должен быть действительным</li>
              <li>✓ Имя пользователя: латинские буквы, цифры, подчеркивание</li>
              <li>✓ Имя пользователя: минимум 3 символа</li>
              <li>✓ Пароль: минимум 6 символов</li>
            </ul>
          </div>

          {/* Button */}
          <div className="w-full max-w-[180px]">
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-base transition-colors min-h-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>

          {/* Login link */}
          <div className="w-full max-w-[340px] pt-8 border-t border-gray-700 text-center text-gray-400 text-base">
            Уже есть аккаунт?{' '}
            <Link 
              to="/" 
              className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};