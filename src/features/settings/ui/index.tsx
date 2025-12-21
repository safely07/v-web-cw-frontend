import { useState } from 'react';

type TSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TTheme = 'light' | 'dark' | 'system';

export const SettingsModal = ({ isOpen, onClose }: TSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<|'appearance'>('appearance');
  const [theme, setTheme] = useState<TTheme>(() => {
    const savedTheme = localStorage.getItem('theme') as TTheme;
    return savedTheme || 'system';
  });

  const handleThemeChange = (newTheme: TTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Применяем тему
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.body.setAttribute('data-theme', newTheme);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--panel-background)] rounded-lg border border-[var(--border-color)] shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-heading)]">
            Настройки
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex">
          {/* Sidebar tabs */}
          <div className="w-48 border-r border-[var(--border-color)] bg-[var(--sidebar-background)] p-4">
            <nav className="space-y-1">
              
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-[var(--selection-bg)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                }`}
              >
                🎨 Внешний вид
              </button>
              
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--text-primary)] mb-4">
                    Тема оформления
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Dark theme */}
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-[var(--accent-primary)] bg-[var(--selection-bg)]'
                          : 'border-[var(--border-color)] bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 rounded bg-[#1e1e1e] mb-3 border border-[#454545] overflow-hidden">
                          <div className="h-3 bg-[#007acc]"></div>
                          <div className="p-2">
                            <div className="h-2 bg-[#3c3c3c] rounded mb-1 w-3/4"></div>
                            <div className="h-2 bg-[#2d2d30] rounded w-1/2"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Темная
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] mt-1">
                          VS Code стиль
                        </span>
                      </div>
                    </button>

                    {/* Light theme */}
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-[var(--accent-primary)] bg-[var(--selection-bg)]'
                          : 'border-[var(--border-color)] bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 rounded bg-[#ffffff] mb-3 border border-[#dddddd] overflow-hidden">
                          <div className="h-3 bg-[#007acc]"></div>
                          <div className="p-2">
                            <div className="h-2 bg-[#f0f0f0] rounded mb-1 w-3/4"></div>
                            <div className="h-2 bg-[#e8e8e8] rounded w-1/2"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Светлая
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] mt-1">
                          Чистый вид
                        </span>
                      </div>
                    </button>

                    {/* System theme */}
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'system'
                          ? 'border-[var(--accent-primary)] bg-[var(--selection-bg)]'
                          : 'border-[var(--border-color)] bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 rounded bg-gradient-to-br from-[#1e1e1e] to-[#ffffff] mb-3 border border-[var(--border-color)] overflow-hidden">
                          <div className="h-3 bg-gradient-to-r from-[#007acc] to-[#68217a]"></div>
                          <div className="p-2">
                            <div className="h-2 bg-gradient-to-r from-[#3c3c3c] to-[#f0f0f0] rounded mb-1 w-3/4"></div>
                            <div className="h-2 bg-gradient-to-r from-[#2d2d30] to-[#e8e8e8] rounded w-1/2"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Системная
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] mt-1">
                          Следует настройкам ОС
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--button-background)] hover:bg-[var(--button-hover)] text-[var(--button-foreground)] rounded text-sm font-medium transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};