import { type ReactNode, useState } from 'react';
import { populateStore } from '../../lib/zustand/create-store';
import { StoreContext } from '../../lib/zustand/store-context';

export const StoreProvider = ({
        children,
}: {
        children?: ReactNode;
    }) => {
            const [store] = useState(populateStore());
            return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};