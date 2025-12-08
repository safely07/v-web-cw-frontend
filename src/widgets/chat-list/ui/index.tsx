
const mockChats = [
  {
    id: '1',
    name: 'Анна Петрова',
    lastMessage: 'Привет! Как дела с курсовой?',
    time: '10:30',
    unread: 2,
    isOnline: true,
    isGroup: false,
  },
  {
    id: '2',
    name: 'Сергей Сидоров',
    lastMessage: 'Завтра встречаемся в 15:00',
    time: 'Вчера',
    unread: 0,
    isOnline: false,
    isGroup: false,
  },
  {
    id: '3',
    name: 'Рабочая группа',
    lastMessage: 'Дедлайн в пятницу!',
    time: 'Пн',
    unread: 5,
    isOnline: true,
    isGroup: true,
  },
  {
    id: '4',
    name: 'Мария Кузнецова',
    lastMessage: 'Отправила тебе файлы',
    time: 'Ср',
    unread: 0,
    isOnline: true,
    isGroup: false,
  },
  {
    id: '5',
    name: 'Команда проекта',
    lastMessage: 'Обсудим архитектуру бекенда',
    time: '2 нед.',
    unread: 0,
    isOnline: false,
    isGroup: true,
  },
];

export const ChatList = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 border-b border-gray-800">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          💬 Новый чат
        </button>
      </div>
      
      <div className="divide-y divide-gray-800">
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            className="p-4 hover:bg-gray-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Аватар чата */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  chat.isGroup ? 'bg-purple-600' : 'bg-blue-600'
                }`}>
                  <span className="text-lg">
                    {chat.isGroup ? '👥' : '👤'}
                  </span>
                </div>
                {!chat.isGroup && chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              
              {/* Информация о чате */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{chat.time}</span>
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  {chat.unread > 0 ? (
                    <>
                      <p className="text-sm text-gray-300 truncate flex-1">{chat.lastMessage}</p>
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {chat.unread}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-500 text-xs">✓</span>
                      <p className="text-sm text-gray-500 truncate flex-1">{chat.lastMessage}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};