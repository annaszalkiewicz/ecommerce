import type { CartItem } from '@/types';

const FAILURE_RATE = 0.3;

export const removeFromCart = async (productId: number): Promise<CartItem[]> =>
    await new Promise<CartItem[]>((resolve, reject) =>
        setTimeout(() => {
            if (Math.random() < FAILURE_RATE) {
                reject(new Error('Failed to remove the product from your cart.'));

                return;
            }

            resolve([{ productId, quantity: 0 }]);
        }, 1000)
    );
