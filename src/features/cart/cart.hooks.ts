import { getCartBackend } from './cart.config';
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

/**
 * Public cart hooks. They transparently delegate to whichever backend is
 * selected in `cart.config.ts`. Components never know (or care) whether the
 * data comes from the Zustand store or the XState machine.
 *
 * Backend is resolved once at module load (config constant or build-time env),
 * so each export is a stable hook — no conditional hook calls at render time.
 */
const cartBackend = getCartBackend();

export const useCartItems = cartBackend === 'machine' ? useMachineCartItems : useStoreCartItems;

export const useCartStatus = cartBackend === 'machine' ? useMachineCartStatus : useStoreCartStatus;

export const useCartError = cartBackend === 'machine' ? useMachineCartError : useStoreCartError;

export const useCartActions =
    cartBackend === 'machine' ? useMachineCartActions : useStoreCartActions;
