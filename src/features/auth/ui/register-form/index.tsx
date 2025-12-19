import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormField } from '../form-field';
import { authApi } from '../../api';

export const RegisterForm = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!form.username) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (form.username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = 'Только латинские буквы, цифры и подчеркивание';
    }
    
    if (form.displayName && form.displayName.length < 2) {
      newErrors.displayName = 'Минимум 2 символа';
    }
    
    if (!form.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (form.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      authApi.register(form.email,form.password,form.username,form.displayName);
      navigate('/login');
    } 
    catch (err: any) {
      const message = err.message || 'Ошибка регистрации';
      
      if (message.includes('email уже существует')) {
        setErrors({ email: 'Пользователь с таким email уже существует' });
      } else if (message.includes('имя уже существует')) {
        setErrors({ username: 'Пользователь с таким именем уже существует' });
      } else {
        setErrors({ general: message });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const updateField = (field: keyof typeof form) => 
    (value: string) => setForm(prev => ({ ...prev, [field]: value }));
  
  return (
    <div className="min-w-[400px] max-w-[420px] w-full mx-auto my-12 p-10 bg-[var(--sidebar-background)] rounded-xl border border-gray-600">
      
      <h2 className="text-2xl font-semibold text-center text-gray-100 pt-8 pb-14">
        Регистрация
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-7">
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={updateField('email')}
          placeholder="example@mail.ru"
          error={errors.email}
          disabled={loading}
          required
        />
        
        <FormField
          label="Имя пользователя"
          type="text"
          value={form.username}
          onChange={updateField('username')}
          placeholder="ivan_ivanov"
          error={errors.username}
          disabled={loading}
          required
        />
        
        <FormField
          label="Имя для отображения (необязательно)"
          type="text"
          value={form.displayName}
          onChange={updateField('displayName')}
          placeholder="Иван Иванов"
          error={errors.displayName}
          disabled={loading}
        />
        
        <FormField
          label="Пароль"
          type="password"
          value={form.password}
          onChange={updateField('password')}
          placeholder="••••••••"
          error={errors.password}
          disabled={loading}
          required
        />
        
        <FormField
          label="Подтвердите пароль"
          type="password"
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          placeholder="••••••••"
          error={errors.confirmPassword}
          disabled={loading}
          required
        />
        
        {errors.general && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm text-center">{errors.general}</p>
          </div>
        )}
        
        <div className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm font-medium mb-2">Требования:</p>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>✓ Email должен быть действительным</li>
            <li>✓ Имя пользователя: латинские буквы, цифры, подчеркивание</li>
            <li>✓ Имя пользователя: минимум 3 символа</li>
            <li>✓ Пароль: минимум 6 символов</li>
          </ul>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        
        <div className="pt-8 border-t border-gray-700 text-center text-gray-400">
          Уже есть аккаунт?{' '}
          <Link to="/" className="text-blue-400 hover:text-blue-300 hover:underline">
            Войти
          </Link>
        </div>
      </form>
    </div>
  );
};