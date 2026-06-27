import { addToCart, removeFromCart } from '@/data/helpers';
import type { CartItem, CartStatus } from '@/types';
import { assign, fromPromise, setup } from 'xstate';
import { loadCartItems, saveCartItems } from './cart.persistence';

const STATUS_RESET_DELAY = 10000;

interface CartMachineContext {
    cartStatus: CartStatus;
    cartItems: CartItem[];
    error: Error | undefined;
    previousCartItems: CartItem[];
}

type CartMachineEvent =
    | { type: 'addToCart'; productId: number }
    | { type: 'removeFromCart'; productId: number };

export const cartMachine = setup({
    types: {
        context: {} as CartMachineContext,
        events: {} as CartMachineEvent,
    },
    actors: {
        cartOperationActor: fromPromise(
            async ({ input }: { input: { productId: number; operation: 'add' | 'remove' } }) =>
                input.operation === 'remove'
                    ? removeFromCart(input.productId)
                    : addToCart(input.productId)
        ),
    },
    actions: {
        persistCartItems: ({ context }) => saveCartItems(context.cartItems),
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnALgWVcgFgJYB2YAdIRADZgDEqEEAKgPYDCGmA2gAwC6iUAAcWsQpkItigkAA9EARgBsSsj3UaATAE4A7Jt0BmAKwAaEAE9FugCxkbxwwpsmAHK82HNPTQF9f5mhYuAQk5EJgxBAkULRg6Ogs6GRCVKiYAGZJALZkQTh4RKQpkdHEUAgkAG4saBJSvHyNMiJi9dJIcogmumTGnjYKrgraSgq6SrrmVgjaCmTajs4jSq42Nq5Khv6BnCFF4aUxtLKwmOnkqBmY8QAUCho8AJS0+fthJVExzZ2t4pIdUDyBCaBSGMgTYxKUETIYbHzTRDDPpaZSaaGubROfwBEDEFgQOAyN6FMItUT-KQyYEAWiUiIQNOMC20rLZ7LZ21xJNCxUoNHJbQB1MQNk0DO8mjIHh0hiUYs0xn02j83L2pOKES+5UFlMBXQQhhcZCNhiMxiVjh47imlkUmIWPGhSj0W36o1cON8QA */
    id: 'cartMachine',

    context: () => ({
        cartStatus: 'idle',
        cartItems: loadCartItems(),
        error: undefined,
        previousCartItems: [],
    }),

    initial: 'idle',

    states: {
        idle: {
            on: {
                addToCart: {
                    target: 'pending',
                    actions: [
                        assign({
                            cartStatus: 'pending',
                            previousCartItems: ({ context }) => context.cartItems,
                            cartItems: ({ context, event }) => {
                                const existing = context.cartItems.find(
                                    (item) => item.productId === event.productId
                                );

                                return existing
                                    ? context.cartItems.map((item) =>
                                          item.productId === event.productId
                                              ? { ...item, quantity: item.quantity + 1 }
                                              : item
                                      )
                                    : [
                                          ...context.cartItems,
                                          { productId: event.productId, quantity: 1 },
                                      ];
                            },
                            error: undefined,
                        }),
                        'persistCartItems',
                    ],
                },
                removeFromCart: {
                    target: 'pending',
                    actions: [
                        assign({
                            cartStatus: 'pending',
                            previousCartItems: ({ context }) => context.cartItems,
                            cartItems: ({ context, event }) =>
                                context.cartItems.filter(
                                    (item) => item.productId !== event.productId
                                ),
                            error: undefined,
                        }),
                        'persistCartItems',
                    ],
                },
            },
        },

        pending: {
            invoke: {
                src: 'cartOperationActor',
                input: ({ event }) => ({
                    productId: (event as CartMachineEvent).productId,
                    operation:
                        (event as CartMachineEvent).type === 'removeFromCart'
                            ? ('remove' as const)
                            : ('add' as const),
                }),
                onError: {
                    actions: [
                        assign({
                            cartItems: ({ context }) => context.previousCartItems,
                            error: ({ event }) =>
                                event.error instanceof Error
                                    ? event.error
                                    : new Error('Failed to update your cart.'),
                        }),
                    ],
                },
            },

            after: {
                [STATUS_RESET_DELAY]: {
                    target: 'idle',
                    actions: assign({
                        cartStatus: 'idle',
                        error: undefined,
                    }),
                },
            },
        },
    },
});
