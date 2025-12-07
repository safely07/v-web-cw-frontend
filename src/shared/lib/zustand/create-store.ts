import { type StoreApi, createStore } from 'zustand';
import { type TProductState, type TProduct } from ;

export const populateStore = (initialState: Pick<TProductState, 'products'>): StoreApi<TProductState> =>
    createStore<TProductState>((set, get) => ({
        ...initialState,
        productsInCart: [],
        productsInFavourite: [],
        
        addProduct: (product: TProduct) =>
            set((state) => ({ 
                products: [...state.products, product] 
            })),
            
        delProduct: (id: number) =>
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            })),
            
        searchProducts: (query: string) => {
            const searchQuery = query.toLowerCase().trim();
            if (!searchQuery) return [];
            
            return get().products.filter((p) => {
                const title = p.title.toLowerCase();
                
                if (searchQuery.length <= 2) {
                    return title.startsWith(searchQuery);
                }
                
                return title.includes(searchQuery);
            });
        },
        
        // КОРЗИНА
        addProductInCart: (product: TProduct) =>
            set((state) => {
                // Проверяем, есть ли уже товар в корзине
                const existingProduct = state.productsInCart.find(p => p.id === product.id);
                
                if (existingProduct) {
                    // Если есть - увеличиваем quantity
                    return {
                        productsInCart: state.productsInCart.map(p =>
                            p.id === product.id
                                ? { ...p, quantity: (p.quantity || 1) + 1 }
                                : p
                        )
                    };
                } else {
                    // Если нет - добавляем с quantity = 1
                    return {
                        productsInCart: [...state.productsInCart, { ...product, quantity: 1 }]
                    };
                }
            }),
            
        delProductFromCart: (id: number) =>
            set((state) => ({
                productsInCart: state.productsInCart.filter((p) => p.id !== id),
            })),
            
        // обновление quantity в корзине
        updateCartQuantity: (id: number, quantity: number) =>
            set((state) => ({
                productsInCart: state.productsInCart.map(p =>
                    p.id === id
                        ? { ...p, quantity: Math.max(1, quantity) } // quantity не меньше 1
                        : p
                )
            })),
            
        // Увеличение quantity в корзине
        incProductQuantity: (id: number) =>
            set((state) => ({
                productsInCart: state.productsInCart.map(p =>
                    p.id === id
                        ? { ...p, quantity: (p.quantity || 1) + 1 }
                        : p
                )
            })),
            
        // Уменьшение quantity в корзине
        decProductQuantity: (id: number) =>
            set((state) => ({
                productsInCart: state.productsInCart.map(p =>
                    p.id === id
                        ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) } // не меньше 1
                        : p
                )
            })),
        
        // ИЗБРАННОЕ
        addProductInFavourite: (product: TProduct) =>
            set((state) => ({ 
                productsInFavourite: [...state.productsInFavourite, product] 
            })),
            
        delProductFromFavourite: (id: number) =>
            set((state) => ({
                productsInFavourite: state.productsInFavourite.filter((p) => p.id !== id),
            })),
            
        // ПРОВЕРКИ
        isProductInFavouriteById: (id: number) => {
            return get().productsInFavourite.some(p => p.id === id);
        },

        isProductInCartById: (id: number) => {
            return get().productsInCart.some(p => p.id === id);
        },
        
        // Дополнительные полезные методы
        getCartTotal: () => {
            return get().productsInCart.reduce((total, product) => {
                const price = product.discountPrice || product.price;
                const quantity = product.quantity || 1;
                return total + (price * quantity);
            }, 0);
        },
        
        getCartItemsCount: () => {
            return get().productsInCart.reduce((count, product) => {
                return count + (product.quantity || 1);
            }, 0);
        },
        
        getCartUniqueItemsCount: () => {
            return get().productsInCart.length;
        }
    }));