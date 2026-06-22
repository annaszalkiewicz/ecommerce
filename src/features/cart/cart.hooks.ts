import { CART_BACKEND } from './cart.config';
import {
    useStoreCartActions,
    useStoreCartError,
    useStoreCartItems,
    useStoreCartStatus,
} from './store';
import {
    useMachineCartActions,
    useMachineCartError,
    useMachineCartItems,
    useMachineCartStatus,
} from './machine';

const useMachine = CART_BACKEND === 'machine';

/**
 * Public cart hooks. They transparently delegate to whichever backend is
 * selected in `cart.config.ts`. Components never know (or care) whether the
 * data comes from the Zustand store or the XState machine.
 */
export const useCartItems = useMachine ? useMachineCartItems : useStoreCartItems;
export const useCartStatus = useMachine ? useMachineCartStatus : useStoreCartStatus;
export const useCartError = useMachine ? useMachineCartError : useStoreCartError;
export const useCartActions = useMachine ? useMachineCartActions : useStoreCartActions;
