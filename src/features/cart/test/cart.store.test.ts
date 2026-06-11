import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as helpers from '@/data/helpers';
import type { CartItem } from '@/types';
import { useCartStore } from '../store/cart.store';

vi.mock('@/data/helpers', () => ({
    addToCart: vi.fn(),
    fetchProductsList: vi.fn(),
}));

const mockedAddToCart = vi.mocked(helpers.addToCart);

const getState = () => useCartStore.getState();

describe('cart store state machine', () => {
    beforeEach(() => {
        useCartStore.setState({
            cartStatus: 'idle',
            cartItems: [],
            error: undefined,
        });
    });

    it('starts in the idle state with an empty cart', () => {
        const state = getState();

        expect(state.cartStatus).toBe('idle');
        expect(state.cartItems).toEqual([]);
        expect(state.error).toBeUndefined();
    });

    it('transitions to pending and optimistically adds the item on addToCart', () => {
        // A promise that never settles keeps the action in the pending state.
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));

        void getState().actions.addToCart(1);

        const state = getState();

        expect(state.cartStatus).toBe('pending');
        expect(state.cartItems).toEqual([{ productId: 1, quantity: 1 }]);
        expect(state.error).toBeUndefined();
    });

    it('optimistically increments the quantity for an existing product', () => {
        useCartStore.setState({ cartItems: [{ productId: 1, quantity: 1 }] });
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));

        void getState().actions.addToCart(1);

        const state = getState();

        expect(state.cartStatus).toBe('pending');
        expect(state.cartItems).toEqual([{ productId: 1, quantity: 2 }]);
    });

    it('reaches the success state and retains the item on a resolved request', async () => {
        vi.useFakeTimers();
        mockedAddToCart.mockResolvedValue([{ productId: 1, quantity: 1 }]);

        await getState().actions.addToCart(1);

        const state = getState();

        expect(state.cartStatus).toBe('success');
        expect(state.cartItems).toEqual([{ productId: 1, quantity: 1 }]);
        expect(state.error).toBeUndefined();
    });

    it('rolls back the cart and sets the error on a rejected request', async () => {
        vi.useFakeTimers();
        const previousItems: CartItem[] = [{ productId: 2, quantity: 1 }];
        useCartStore.setState({ cartItems: previousItems });
        const failure = new Error('Failed to add the product to your cart.');
        mockedAddToCart.mockRejectedValue(failure);

        await getState().actions.addToCart(1);

        const state = getState();

        expect(state.cartStatus).toBe('error');
        expect(state.cartItems).toEqual(previousItems);
        expect(state.error).toBe(failure);
    });

    it('resets back to idle after the status reset delay', async () => {
        vi.useFakeTimers();
        mockedAddToCart.mockResolvedValue([{ productId: 1, quantity: 1 }]);

        await getState().actions.addToCart(1);

        expect(getState().cartStatus).toBe('success');

        vi.advanceTimersByTime(10000);

        const state = getState();

        expect(state.cartStatus).toBe('idle');
        expect(state.error).toBeUndefined();
    });
});
