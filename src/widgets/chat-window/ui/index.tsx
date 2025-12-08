import React, { useState } from 'react';
import { PressButton } from '../../../shared/ui/press-button';

const mockMessages = [
  { id: 1, text: 'Привет! Как дела с курсовой?', time: '10:30', isOwn: false },
  { id: 2, text: 'Привет! Почти закончил фронтенд', time: '10:32', isOwn: true },
  { id: 3, text: 'Сейчас делаю бекенд на Express + TypeORM', time: '10:33', isOwn: true },
  { id: 4, text: 'Круто! Покажешь когда закончишь?', time: '10:35', isOwn: false },
  { id: 5, text: 'Конечно! Завтра уже должен быть готов', time: '10:36', isOwn: true },
  { id: 6, text: 'Отлично, жду результат!', time: '10:37', isOwn: false },
  { id: 7, text: 'Кстати, какие технологии используешь для WebSocket?', time: '10:38', isOwn: false },
  { id: 8, text: 'Socket.IO с интеграцией в Zustand стор', time: '10:40', isOwn: true },
];

export const ChatWindow = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Отправка:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Шапка чата */}
      <div className="p-5 border-b border-gray-700 bg-[#2d2d30] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#3c3c3c] rounded-full flex items-center justify-center border border-gray-600">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Анна Петрова</h2>
            <p className="text-sm text-green-500">в сети</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 text-lg">
            📞
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 text-lg">
            📹
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 text-lg">
            🔍
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 text-xl">
            ⋮
          </button>
        </div>
      </div>

      {/* Сообщения с большими отступами */}
      <div className="flex-1 overflow-y-auto px-10 py-8 space-y-7 bg-[#1e1e1e]">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl ${
                msg.isOwn
                  ? 'bg-[#2d5b8a] text-white rounded-br-none'  // Темно-синий для своих
                  : 'bg-[#404040] text-[#e0e0e0] rounded-bl-none'  // Темно-серый для чужих
              }`}
            >
              {/* Большие внутренние отступы */}
              <div className="px-6 py-4">
                <p className="text-base leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-3 ${msg.isOwn ? 'text-[#a0c8ff]' : 'text-[#aaaaaa]'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ввод сообщения */}
      <div className="p-6 border-t border-gray-700 bg-[#2d2d30]">
        <div className="flex items-end gap-5">
          <button className="p-4 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 text-xl">
            📎
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Введите сообщение..."
              className="w-full p-5 bg-[#3c3c3c] border border-gray-600 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-white"
              rows={2}
            />
            <button className="absolute right-4 bottom-4 p-2 hover:bg-gray-800 rounded text-gray-400 text-xl">
              😊
            </button>
          </div>
          
          <PressButton
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-7 py-5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg"
          >
            📤
          </PressButton>
        </div>
      </div>
    </div>
  );
};