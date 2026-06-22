/**
 * Selects which cart state implementation the UI consumes.
 *
 * - `'store'`   -> Zustand store    (src/features/cart/store)
 * - `'machine'` -> XState machine   (src/features/cart/machine)
 *
 * Both implementations expose the exact same hook API
 * (`useCartItems`, `useCartStatus`, `useCartError`, `useCartActions`),
 * so swapping backends is just a matter of changing this constant.
 */
export type CartBackend = 'store' | 'machine';

export const CART_BACKEND: CartBackend = 'store';
