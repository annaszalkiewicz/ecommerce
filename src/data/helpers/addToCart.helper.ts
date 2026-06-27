import type { CartItem } from '@/types';

const FAILURE_RATE = 0.3;

export const addToCart = async (productId: number): Promise<CartItem[]> =>
    await new Promise<CartItem[]>((resolve, reject) =>
        setTimeout(() => {
            if (Math.random() < FAILURE_RATE) {
                reject(new Error('Failed to add the product to your cart.'));

                return;
            }

            resolve([{ productId, quantity: 1 }]);
        }, 1000)
    );
