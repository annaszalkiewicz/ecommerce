import { createProduct } from '@/test/fixtures';
import type { CartItem } from '@/types';

export const cartProduct = createProduct({
    id: 1,
    name: 'Cart test product',
    price: 19.99,
});

export const secondCartProduct = createProduct({
    id: 2,
    name: 'Second product',
    price: 5,
});

export const addToCartError = new Error('Failed to add the product to your cart.');

export const removeFromCartError = new Error('Failed to remove the product from your cart.');

export const resolvedCartItem = (productId: number): CartItem[] => [{ productId, quantity: 1 }];
