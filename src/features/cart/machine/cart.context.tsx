import { useMemo } from 'react';
import { createActorContext } from '@xstate/react';
import type { CartActions, CartItem, CartStatus } from '@/types';
import { cartMachine } from './cart.machine';

export const CartMachineContext = createActorContext(cartMachine);

export const CartMachineProvider = CartMachineContext.Provider;

export const useMachineCartItems = (): CartItem[] =>
    CartMachineContext.useSelector((state) => state.context.cartItems);

export const useMachineCartStatus = (): CartStatus =>
    CartMachineContext.useSelector((state) => state.context.cartStatus);

export const useMachineCartError = (): Error | undefined =>
    CartMachineContext.useSelector((state) => state.context.error);

export const useMachineCartActions = (): CartActions => {
    const actorRef = CartMachineContext.useActorRef();

    return useMemo(
        () => ({
            addToCart: async (productId: number) => {
                actorRef.send({ type: 'addToCart', productId });
            },
            removeFromCart: async (productId: number) => {
                actorRef.send({ type: 'removeFromCart', productId });
            },
        }),
        [actorRef]
    );
};
