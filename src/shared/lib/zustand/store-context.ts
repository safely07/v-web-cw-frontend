import { createContext, useContext } from 'react';
import { type StoreApi, useStore as defaultUseStore } from 'zustand';
import { type TProductState } from '../../../entities/product';

export const StoreContext = createContext<StoreApi<TProductState> | null>(null);

export const useStore = <S,>(selector: (state: TProductState) => S): S => {
    const store = useContext(StoreContext);
    if (!store) throw new Error('[ERROR] useStore must be used within a StoreProvider');
    return defaultUseStore(store, selector);
};