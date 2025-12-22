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
    <div style={{margin: '16px'}} className="bg-[var(--panel-background)] rounded-2xl border border-[var(--border-color)] shadow-xl w-full max-w-md !p-0">
      <div style={{padding: '32px'}}>
        <div style={{marginBottom: '32px'}} className="text-center">
          <h2 style={{marginBottom: '16px'}} className="text-2xl font-bold text-[var(--text-heading)]">
            Вход в аккаунт
          </h2>
          <p className="text-[var(--text-secondary)] text-base">
            Введите данные для входа в систему
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '24px'}}>
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
          </div>
          
          <div style={{marginBottom: '24px'}}>
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
          </div>
          
          {error && !emailError && !passwordError && (
            <div style={{marginBottom: '24px'}} className="p-5 bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-lg">
              <p className="text-[var(--error)] text-sm text-center flex items-center justify-center gap-2">
                <span className="text-base flex-shrink-0">⚠</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          <div style={{marginTop: '32px', marginBottom: '24px'}}>
            <button 
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 0',
                fontSize: '16px',
                fontWeight: 500
              }}
              className="w-full rounded-lg bg-[var(--button-background)] hover:bg-[var(--button-hover)] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Вход...
                </span>
              ) : 'Войти'}
            </button>
          </div>

          <div style={{paddingTop: '16px', borderTop: '1px solid var(--divider-color)'}} className="text-center">
            <p style={{marginTop: '8px'}} className="text-[var(--text-secondary)] text-base">
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