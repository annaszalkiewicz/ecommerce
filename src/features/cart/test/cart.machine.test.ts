import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor, type Actor } from 'xstate';
import * as helpers from '@/data/helpers';
import type { CartItem } from '@/types';
import { cartMachine } from '../machine/cart.machine';

vi.mock('@/data/helpers', () => ({
    addToCart: vi.fn(),
    fetchProductsList: vi.fn(),
}));

const mockedAddToCart = vi.mocked(helpers.addToCart);

const STORAGE_KEY = 'cart-storage';

/** Flushes pending microtasks so the invoked promise actor can settle. */
const settle = async () => {
    for (let i = 0; i < 5; i += 1) {
        await Promise.resolve();
    }
};

const startMachine = (): Actor<typeof cartMachine> => {
    const actor = createActor(cartMachine);
    actor.start();

    return actor;
};

describe('cart machine state machine', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('starts in the idle state with an empty cart', () => {
        const actor = startMachine();

        const snapshot = actor.getSnapshot();

        expect(snapshot.value).toBe('idle');
        expect(snapshot.context.cartStatus).toBe('idle');
        expect(snapshot.context.cartItems).toEqual([]);
        expect(snapshot.context.error).toBeUndefined();

        actor.stop();
    });

    it('hydrates the cart from persisted storage on start', () => {
        const persisted: CartItem[] = [{ productId: 7, quantity: 3 }];
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ state: { cartItems: persisted }, version: 0 })
        );

        const actor = startMachine();

        expect(actor.getSnapshot().context.cartItems).toEqual(persisted);

        actor.stop();
    });

    it('transitions to pending and optimistically adds the item on addToCart', () => {
        // A promise that never settles keeps the actor in the pending state.
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));

        const actor = startMachine();
        actor.send({ type: 'addToCart', productId: 1 });

        const snapshot = actor.getSnapshot();

        expect(snapshot.value).toBe('pending');
        expect(snapshot.context.cartStatus).toBe('pending');
        expect(snapshot.context.cartItems).toEqual([{ productId: 1, quantity: 1 }]);
        expect(snapshot.context.error).toBeUndefined();

        actor.stop();
    });

    it('persists the optimistic cart to localStorage on addToCart', () => {
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));

        const actor = startMachine();
        actor.send({ type: 'addToCart', productId: 1 });

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');

        expect(stored.state.cartItems).toEqual([{ productId: 1, quantity: 1 }]);

        actor.stop();
    });

    it('optimistically increments the quantity for an existing product', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ state: { cartItems: [{ productId: 1, quantity: 1 }] }, version: 0 })
        );
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));

        const actor = startMachine();
        actor.send({ type: 'addToCart', productId: 1 });

        const snapshot = actor.getSnapshot();

        expect(snapshot.context.cartStatus).toBe('pending');
        expect(snapshot.context.cartItems).toEqual([{ productId: 1, quantity: 2 }]);

        actor.stop();
    });

    it('retains the item and stays pending on a resolved request', async () => {
        vi.useFakeTimers();
        mockedAddToCart.mockResolvedValue([{ productId: 1, quantity: 1 }]);

        const actor = startMachine();
        actor.send({ type: 'addToCart', productId: 1 });

        await settle();

        const snapshot = actor.getSnapshot();

        expect(snapshot.context.cartStatus).toBe('pending');
        expect(snapshot.context.cartItems).toEqual([{ productId: 1, quantity: 1 }]);
        expect(snapshot.context.error).toBeUndefined();

        actor.stop();
        vi.useRealTimers();
    });

    it('rolls back the cart and sets the error on a rejected request', async () => {
        vi.useFakeTimers();
        const previousItems: CartItem[] = [{ productId: 2, quantity: 1 }];
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ state: { cartItems: previousItems }, version: 0 })
        );
        const failure = new Error('Failed to add the product to your cart.');
        mockedAddToCart.mockRejectedValue(failure);

        const actor = startMachine();
        actor.send({ type: 'addToCart', productId: 1 });

        await settle();

        const snapshot = actor.getSnapshot();

        expect(snapshot.context.cartStatus).toBe('pending');
        expect(snapshot.context.cartItems).toEqual(previousItems);
        expect(snapshot.context.error).toBe(failure);

        actor.stop();
        vi.useRealTimers();
    });

    it('resets back to idle after the status reset delay', async () => {
        vi.useFakeTimers();
        mockedAddToCart.mockResolvedValue([{ productId: 1, quantity: 1 }]);

        const actor = startMachine();
        actor.send({ type: 'addToCart', productId: 1 });

        await settle();

        expect(actor.getSnapshot().context.cartStatus).toBe('pending');

        vi.advanceTimersByTime(10000);

        const snapshot = actor.getSnapshot();

        expect(snapshot.value).toBe('idle');
        expect(snapshot.context.cartStatus).toBe('idle');
        expect(snapshot.context.error).toBeUndefined();

        actor.stop();
        vi.useRealTimers();
    });
});
