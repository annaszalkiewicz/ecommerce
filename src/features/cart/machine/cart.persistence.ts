import type { CartItem } from '@/types';

/**
 * Persistence for the XState cart backend.
 *
 * Reads/writes the exact same localStorage key and payload shape that the
 * Zustand `persist` middleware uses for the store backend (see
 * `src/features/cart/store/cart.store.ts`). Sharing the format keeps the cart
 * contents continuous when switching `CART_BACKEND` between `'store'` and
 * `'machine'`.
 */
const STORAGE_KEY = 'cart-storage';
const STORAGE_VERSION = 0;

interface PersistedCart {
    state: {
        cartItems: CartItem[];
    };
    version: number;
}

export const loadCartItems = (): CartItem[] => {
    if (typeof localStorage === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as Partial<PersistedCart>;
        const cartItems = parsed?.state?.cartItems;

        return Array.isArray(cartItems) ? cartItems : [];
    } catch {
        return [];
    }
};

export const saveCartItems = (cartItems: CartItem[]): void => {
    if (typeof localStorage === 'undefined') {
        return;
    }

    try {
        const payload: PersistedCart = {
            state: { cartItems },
            version: STORAGE_VERSION,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // Ignore write failures (e.g. storage quota exceeded or unavailable).
    }
};
