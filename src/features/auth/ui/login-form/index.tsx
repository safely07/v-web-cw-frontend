import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useStore } from '@/app/store';
import { useSocket } from '@/app/web-socket';
import { FormField } from '../form-field';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const socketContext = useSocket();
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email обязателен для заполнения');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Введите корректный email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Пароль обязателен для заполнения');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await login(email, password);

      if (socketContext && !socketContext.isConnected) {
        console.log('Подключаем WebSocket...');
        socketContext.connect();
      }

      navigate('/home');
    } catch (err: any) {
      const errorMessage = err.message || 'Ошибка авторизации. Проверьте данные.';
      setError(errorMessage);

      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setEmailError('Неверный email или пароль');
      } else if (errorMessage.includes('парол') || errorMessage.includes('password')) {
        setPasswordError('Неверный email или пароль');
      }
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="bg-[var(--panel-background)] rounded-2xl border border-[var(--border-color)] shadow-xl w-full max-w-md">
      {/* Контейнер с отступами от краев панели */}
      <div className="p-8">
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
            Вход в аккаунт
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Введите данные для входа в систему
          </p>
        </div>
        
        {/* Форма с отступами */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (emailError) setEmailError('');
            }}
            placeholder="example@mail.ru"
            disabled={loading}
            error={emailError}
            required
          />
          
          <FormField
            label="Пароль"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              if (passwordError) setPasswordError('');
            }}
            placeholder="••••••••"
            disabled={loading}
            error={passwordError}
            required
          />
          
          {error && !emailError && !passwordError && (
            <div className="p-4 bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-lg">
              <p className="text-[var(--error)] text-sm text-center flex items-center justify-center gap-2">
                <span className="text-base">⚠</span>
                {error}
              </p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`
              w-full py-3.5 mt-2
              bg-[var(--button-background)] 
              hover:bg-[var(--button-hover)]
              text-white 
              font-medium 
              rounded-lg
              transition-all duration-200
              disabled:opacity-50 
              disabled:cursor-not-allowed
              disabled:hover:bg-[var(--button-background)]
              focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]
              active:scale-[0.99]
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Вход...
              </span>
            ) : 'Войти'}
          </button>

          <div className="pt-6 border-t border-[var(--divider-color)] text-center">
            <p className="text-[var(--text-secondary)] text-sm pt-4">
              Нет аккаунта?{' '}
              <Link 
                to="/register" 
                className="text-[var(--text-link)] hover:text-[var(--text-link-hover)] hover:underline font-medium transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};