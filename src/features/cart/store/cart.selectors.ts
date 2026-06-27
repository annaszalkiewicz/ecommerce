import { useCartStore } from './cart.store';

export const useStoreCartItems = () => useCartStore((state) => state.cartItems);

export const useStoreCartStatus = () => useCartStore((state) => state.cartStatus);

export const useStoreCartError = () => useCartStore((state) => state.error);

export const useStoreCartActions = () => useCartStore((state) => state.actions);
