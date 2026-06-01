import { useCartStore } from './cart.store';

export const useCartItems = () => useCartStore((state) => state.cartItems);

export const useCartStatus = () => useCartStore((state) => state.cartStatus);

export const useCartError = () => useCartStore((state) => state.error);

export const useCartActions = () => useCartStore((state) => state.actions);
