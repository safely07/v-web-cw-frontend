import { createContext, useContext } from 'react';
import { type StoreApi, useStore as defaultUseStore } from 'zustand';
import { type TAppStore } from '../../../app/store';

export const StoreContext = createContext<StoreApi<TAppStore> | null>(null);

export const useStore = <S,>(selector: (state: TAppStore) => S): S => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('[ERROR] useStore must be used within a StoreProvider');
    return defaultUseStore(store, selector);
};