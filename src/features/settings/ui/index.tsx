import { useState } from 'react';

type TSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TTheme = 'light' | 'dark' | 'system';

export const SettingsModal = ({ isOpen, onClose }: TSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<'appearance'>('appearance');
  const [theme, setTheme] = useState<TTheme>(() => {
    const savedTheme = localStorage.getItem('theme') as TTheme;
    return savedTheme || 'system';
  });

  const handleThemeChange = (newTheme: TTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--panel-background)] rounded-lg border border-[var(--border-color)] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '8px' }} className="border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-heading)]">
            Настройки
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="flex">
          <div style={{ width: '192px', padding: '8px' }} className="border-r border-[var(--border-color)] bg-[var(--sidebar-background)]">
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left px-4 py-2.5 rounded text-sm transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-[var(--selection-bg)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                }`}
              >
                🎨 Внешний вид
              </button>
            </nav>
          </div>

          <div className="flex-1" style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(90vh - 160px)' }}>
            {activeTab === 'appearance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h3 className="text-[16px] font-medium text-[var(--text-primary)]" style={{ marginBottom: '20px' }}>
                    Тема оформления
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '16px' }}>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-[var(--accent-primary)] bg-[var(--selection-bg)]'
                          : 'border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50'
                      }`}
                      style={{ padding: '16px' }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 rounded bg-[#1e1e1e] mb-4 border border-[#454545] overflow-hidden">
                          <div className="h-3 bg-[#007acc]"></div>
                          <div style={{ padding: '8px' }}>
                            <div className="h-2 bg-[#3c3c3c] rounded mb-1 w-3/4"></div>
                            <div className="h-2 bg-[#2d2d30] rounded w-1/2"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Темная
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]" style={{ marginTop: '4px' }}>
                          VS Code стиль
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-[var(--accent-primary)] bg-[var(--selection-bg)]'
                          : 'border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50'
                      }`}
                      style={{ padding: '16px' }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 rounded bg-[#ffffff] mb-4 border border-[#dddddd] overflow-hidden">
                          <div className="h-3 bg-[#007acc]"></div>
                          <div style={{ padding: '8px' }}>
                            <div className="h-2 bg-[#f0f0f0] rounded mb-1 w-3/4"></div>
                            <div className="h-2 bg-[#e8e8e8] rounded w-1/2"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Светлая
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]" style={{ marginTop: '4px' }}>
                          Чистый вид
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`rounded-lg border-2 transition-all ${
                        theme === 'system'
                          ? 'border-[var(--accent-primary)] bg-[var(--selection-bg)]'
                          : 'border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:border-[var(--accent-primary)]/50'
                      }`}
                      style={{ padding: '16px' }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 rounded bg-gradient-to-br from-[#1e1e1e] to-[#ffffff] mb-4 border border-[var(--border-color)] overflow-hidden">
                          <div className="h-3 bg-gradient-to-r from-[#007acc] to-[#68217a]"></div>
                          <div style={{ padding: '8px' }}>
                            <div className="h-2 bg-gradient-to-r from-[#3c3c3c] to-[#f0f0f0] rounded mb-1 w-3/4"></div>
                            <div className="h-2 bg-gradient-to-r from-[#2d2d30] to-[#e8e8e8] rounded w-1/2"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Системная
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]" style={{ marginTop: '4px' }}>
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

        <div style={{ padding: '8px' }} className="border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[var(--button-background)] hover:bg-[var(--button-hover)] text-[var(--button-foreground)] rounded-md text-sm font-medium transition-colors"
            style={{ padding: '10px 20px' }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};