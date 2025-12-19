import { type ReactNode, useRef } from 'react';
import { populateStore, StoreContext } from '@app/store';

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const storeRef = useRef(populateStore());

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};