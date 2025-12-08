import { Link } from "react-router-dom";
import { PressButton } from "../../../../shared/ui/press-button";

export const RegisterForm = () => {
  return (
    <div className="min-w-[400px] max-w-[420px] w-full mx-auto my-12 p-10 bg-var(--sidebar-background) rounded-xl border border-gray-600 shadow-xl">
      {/* Заголовок с отступом */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center text-gray-100">Регистрация</h2>
      </div>

      <div className="flex flex-col items-center gap-7">
        {/* Email */}
        <div className="w-full max-w-[340px]">
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="example@mail.ru"
              className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Username */}
        <div className="w-full max-w-[340px]">
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-300">Имя пользователя</label>
            <input
              type="text"
              placeholder="ivan_ivanov"
              className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Display Name */}
        <div className="w-full max-w-[340px]">
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-300">Имя для отображения</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="w-full max-w-[340px]">
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="w-full max-w-[340px]">
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-300">Подтвердите пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-var(--input-background) border border-gray-600 rounded-lg text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Button */}
        <div className="w-full max-w-[180px]">
          <PressButton 
            moveTo="/login"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-base transition-colors min-h-[30px]"
          >
            Зарегистрироваться
          </PressButton>
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
    </div>
  );
};