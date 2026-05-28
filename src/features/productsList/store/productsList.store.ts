import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ProductsAction, ProductsState } from '@/types';
import { fetchProductsList } from '@/data/helpers';

const initialState: ProductsState = {
    productsList: [],
    isLoading: false,
    error: undefined,
};

export const useProductsStore = create<ProductsState & ProductsAction>()(
    devtools(
        (set) => ({
            ...initialState,
            actions: {
                getProductsList: async () => {
                    set({ isLoading: true });
                    try {
                        const products = await fetchProductsList();
                        set({ productsList: products });
                    } catch (error) {
                        set({ error: error instanceof Error ? error : new Error(String(error)) });
                    } finally {
                        set({ isLoading: false });
                    }
                },
            },
        }),
        { name: 'ProductsStore' }
    )
);
