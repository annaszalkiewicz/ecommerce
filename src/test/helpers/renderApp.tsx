import '@/i18n';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { App } from '@/App/App';
import type { CartBackend } from '@/features/cart/cart.config';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useProductsStore } from '@/features/productsList/store/productsList.store';

export const renderApp = () => render(<App />);

export const resetStores = () => {
    useProductsStore.setState({
        productsList: [],
        isLoading: false,
        error: undefined,
    });
    useCartStore.setState({
        cartStatus: 'idle',
        cartItems: [],
        error: undefined,
    });
};

export const setupIntegrationTest = ({
    cartBackend = 'store',
}: { cartBackend?: CartBackend } = {}) => {
    resetStores();
    vi.stubEnv('VITE_CART_BACKEND', cartBackend);
};
