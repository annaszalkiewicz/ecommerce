import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartAction, CartState } from '@/types';
import { addToCart } from '@/data/helpers';

const STATUS_RESET_DELAY = 10000;

const initialState: CartState = {
    cartStatus: 'idle',
    cartItems: [],
    error: undefined,
};

export const useCartStore = create<CartState & CartAction>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,
                actions: {
                    addToCart: async (productId) => {
                        const previousCartItems = get().cartItems;
                        const existing = previousCartItems.find(
                            (item) => item.productId === productId
                        );
                        const cartItems = existing
                            ? previousCartItems.map((item) =>
                                  item.productId === productId
                                      ? { ...item, quantity: item.quantity + 1 }
                                      : item
                              )
                            : [...previousCartItems, { productId, quantity: 1 }];

                        set({ cartItems, cartStatus: 'pending', error: undefined });

                        try {
                            await addToCart(productId);
                            set({ cartStatus: 'success' });
                        } catch (error) {
                            set({
                                cartItems: previousCartItems,
                                cartStatus: 'error',
                                error:
                                    error instanceof Error
                                        ? error
                                        : new Error('Failed to add the product to your cart.'),
                            });
                        } finally {
                            setTimeout(
                                () => set({ cartStatus: 'idle', error: undefined }),
                                STATUS_RESET_DELAY
                            );
                        }
                    },
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
