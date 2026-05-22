import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartState } from '@/types';

export const useCartStore = create<CartState>()(
    devtools(
        persist(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (_set) => ({
                cartStatus: 'idle',
                cartItems: [],
                error: undefined,

                addToCart: () => {
                    // eslint-disable-next-line no-console
                    console.log('Not implemented yet');
                },
            }),
            {
                name: 'cart-storage',
                partialize: (state) => ({ cartItems: state.cartItems }),
            }
        ),
        { name: 'CartStore' }
    )
);
