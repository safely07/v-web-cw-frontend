// lib/zustand/index.tsx
import { type ReactNode, useState, useEffect } from 'react';
import { populateStore } from '../../lib/zustand/create-store';
import { StoreContext } from '../../lib/zustand/store-context';
import { websocketService } from '../../api/websocket';

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [store] = useState(() => populateStore());

  useEffect(() => {
    console.log('StoreProvider mounted');

    // Способ 1: Без селектора (подписываемся на все изменения)
    const unsubscribe = store.subscribe((state, prevState) => {
      // Проверяем изменение isAuth
      if (state.isAuth !== prevState.isAuth) {
        console.log('isAuth changed:', state.isAuth);
        if (state.isAuth) {
          websocketService.connect();
        } else {
          websocketService.disconnect();
        }
      }
      
      // Проверяем изменение activeChatId
      if (state.activeChatId !== prevState.activeChatId) {
        console.log('activeChatId changed:', state.activeChatId);
        if (state.activeChatId && websocketService.isConnected()) {
          websocketService.joinChat(state.activeChatId);
        }
      }
    });

    return () => {
      unsubscribe();
      websocketService.disconnect();
    };
  }, [store]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};