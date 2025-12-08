import { PressButton } from '../../../shared/ui/press-button';

export const Sidebar = () => {
  return (
    <div className="p-4 border-b border-gray-800 bg-var(--sidebar-background)">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-var(--accent)">Messenger</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
            ⚙️
          </button>
          <PressButton 
            moveTo="/login"
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
          >
            🚪
          </PressButton>
        </div>
      </div>
      
      {/* Поиск */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</span>
        <input
          type="text"
          placeholder="Поиск чатов..."
          className="w-full pl-10 pr-4 py-2 bg-var(--input-background) border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      {/* Статус пользователя */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span>👤</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <div className="flex-1">
          <p className="font-medium">Иван Иванов</p>
          <p className="text-xs text-gray-400">В сети</p>
        </div>
      </div>
    </div>
  );
};