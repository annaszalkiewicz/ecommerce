/**
 * Selects which cart state implementation the UI consumes.
 *
 * - `'store'`   -> Zustand store    (src/features/cart/store)
 * - `'machine'` -> XState machine   (src/features/cart/machine)
 *
 * Both implementations expose the exact same hook API
 * (`useCartItems`, `useCartStatus`, `useCartError`, `useCartActions`),
 * so swapping backends is just a matter of changing this constant.
 *
 * In tests, override via `VITE_CART_BACKEND` env var (see `getCartBackend`).
 */
export type CartBackend = 'store' | 'machine';

export const CART_BACKEND: CartBackend = 'store';

const isCartBackend = (value: string | undefined): value is CartBackend =>
    value === 'store' || value === 'machine';

export const getCartBackend = (): CartBackend => {
    const envBackend = import.meta.env.VITE_CART_BACKEND;

    return isCartBackend(envBackend) ? envBackend : CART_BACKEND;
};
