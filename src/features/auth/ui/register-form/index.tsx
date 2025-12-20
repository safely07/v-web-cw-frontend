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
    
    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Некорректный email адрес';
    }
    
    // Username validation
    if (!form.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (form.username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    } else if (form.username.length > 20) {
      newErrors.username = 'Максимум 20 символов';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = 'Только латинские буквы, цифры и подчеркивание';
    }
    
    // Display name validation
    if (form.displayName.trim() && form.displayName.length < 2) {
      newErrors.displayName = 'Минимум 2 символа';
    } else if (form.displayName.length > 30) {
      newErrors.displayName = 'Максимум 30 символов';
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (form.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    } else if (form.password.length > 50) {
      newErrors.password = 'Максимум 50 символов';
    }
    
    // Confirm password validation
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
      await authApi.register(
        form.email.trim(),
        form.password,
        form.username.trim(),
        form.displayName.trim()
      );
      
      navigate('/login', { 
        state: { 
          registered: true,
          email: form.email 
        } 
      });
    } 
    catch (err: any) {
      const message = err.message || 'Ошибка регистрации';
      
      if (message.toLowerCase().includes('email') || message.includes('почта')) {
        setErrors({ email: 'Пользователь с таким email уже существует' });
      } else if (message.toLowerCase().includes('username') || message.includes('имя')) {
        setErrors({ username: 'Пользователь с таким именем уже существует' });
      } else if (message.includes('слабый') || message.includes('password')) {
        setErrors({ password: 'Пароль слишком слабый' });
      } else {
        setErrors({ general: message });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const updateField = (field: keyof typeof form) => 
    (value: string) => {
      setForm(prev => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
  
  const passwordStrength = form.password ? (
    form.password.length < 6 ? 'weak' :
    form.password.length < 10 ? 'medium' : 'strong'
  ) : null;
  
  return (
    <div className="bg-[var(--panel-background)] rounded-2xl border border-[var(--border-color)] shadow-xl w-full max-w-lg">
      {/* Контейнер с отступами от краев панели */}
      <div className="p-8">
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
            Регистрация
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Создайте новый аккаунт
          </p>
        </div>
        
        {/* Форма с отступами */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
          
          {/* Password strength indicator */}
          {form.password && !errors.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--text-secondary)] text-sm">
                  Сложность пароля:
                </span>
                <span className={`text-sm font-medium ${
                  passwordStrength === 'weak' ? 'text-[var(--error)]' :
                  passwordStrength === 'medium' ? 'text-[var(--warning)]' :
                  'text-[var(--success)]'
                }`}>
                  {passwordStrength === 'weak' ? 'Слабый' :
                   passwordStrength === 'medium' ? 'Средний' : 'Сильный'}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      passwordStrength === 'weak' && i === 1 ? 'bg-[var(--error)]' :
                      passwordStrength === 'medium' && i <= 2 ? 'bg-[var(--warning)]' :
                      passwordStrength === 'strong' && i <= 3 ? 'bg-[var(--success)]' :
                      'bg-[var(--border-color)]'
                    } transition-all duration-300`}
                  />
                ))}
              </div>
            </div>
          )}
          
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
            <div className="p-4 bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-lg">
              <p className="text-[var(--error)] text-sm text-center flex items-center justify-center gap-2">
                <span className="text-base">⚠</span>
                {errors.general}
              </p>
            </div>
          )}
          
          <div className="p-4 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-lg">
            <p className="text-[var(--text-primary)] text-sm font-medium mb-3">
              Требования к регистрации:
            </p>
            <ul className="text-[var(--text-secondary)] text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className={`shrink-0 mt-0.5 ${form.email && !errors.email ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                  ✓
                </span>
                <span>Email должен быть действительным</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`shrink-0 mt-0.5 ${form.username && form.username.length >= 3 && !errors.username ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                  ✓
                </span>
                <span>Имя пользователя: 3-20 символов (латиница, цифры, _)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`shrink-0 mt-0.5 ${form.password && form.password.length >= 6 && !errors.password ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                  ✓
                </span>
                <span>Пароль: минимум 6 символов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`shrink-0 mt-0.5 ${form.confirmPassword && form.password === form.confirmPassword ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                  ✓
                </span>
                <span>Пароли должны совпадать</span>
              </li>
            </ul>
          </div>
          
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
                Регистрация...
              </span>
            ) : 'Зарегистрироваться'}
          </button>
          
          <div className="pt-6 border-t border-[var(--divider-color)] text-center">
            <p className="text-[var(--text-secondary)] text-sm pt-4">
              Уже есть аккаунт?{' '}
              <Link 
                to="/" 
                className="text-[var(--text-link)] hover:text-[var(--text-link-hover)] hover:underline font-medium transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};