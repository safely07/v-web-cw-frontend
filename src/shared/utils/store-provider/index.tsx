import { type ReactNode, useState } from 'react';
import { type TProductState } from '../../../entities/product';
import { populateStore } from '../../lib/zustand/create-store';
import { StoreContext } from '../../lib/zustand/store-context';


export const StoreProvider = ({
        initialState,
        children,
}: {
        initialState: Pick<TProductState, 'products'>;
        children?: ReactNode;
    }) => {
            const [store] = useState(populateStore(initialState));
            return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};