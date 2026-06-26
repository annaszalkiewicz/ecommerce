import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as helpers from '@/data/helpers';
import { saveCartItems } from '@/features/cart/machine/cart.persistence';
import { useCartStore } from '@/features/cart/store/cart.store';
import { renderApp, setupIntegrationTest } from '@/test/helpers/renderApp';
import type { CartItem } from '@/types';
import { addToCartError, cartProduct, resolvedCartItem } from './fixtures';

vi.mock('@/data/helpers', () => ({
    addToCart: vi.fn(),
    fetchProductsList: vi.fn(),
}));

const mockedFetchProductsList = vi.mocked(helpers.fetchProductsList);
const mockedAddToCart = vi.mocked(helpers.addToCart);

const getCartSection = () => screen.getByRole('region', { name: 'Your cart' });

const loadProducts = async () => {
    mockedFetchProductsList.mockResolvedValue([cartProduct]);
    renderApp();

    await waitFor(() => {
        expect(screen.getByRole('heading', { name: cartProduct.name })).toBeInTheDocument();
    });
};

const seedCartWithItem = (quantity: number) => {
    const cartItems = [{ productId: cartProduct.id, quantity }];

    saveCartItems(cartItems);
    useCartStore.setState({ cartItems, cartStatus: 'idle', error: undefined });
};

describe.each(['store', 'machine'] as const)('cart integration (%s backend)', (backend) => {
    beforeEach(() => {
        setupIntegrationTest({ cartBackend: backend });
    });

    it('shows empty cart on load', async () => {
        await loadProducts();

        expect(within(getCartSection()).getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('optimistically updates the cart when add to cart is clicked', async () => {
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));

        await loadProducts();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: 'Add to cart' }));

        const cart = within(getCartSection());

        expect(cart.getByText(cartProduct.name)).toBeInTheDocument();
        expect(cart.getByText('Syncing...')).toBeInTheDocument();
        expect(cart.getByText(/1 × 19,99/)).toBeInTheDocument();
    });

    it('rolls back the cart and shows an error when add to cart fails', async () => {
        mockedAddToCart.mockRejectedValue(addToCartError);

        await loadProducts();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: 'Add to cart' }));

        const cart = within(getCartSection());

        await waitFor(() => {
            expect(cart.getByText('Your cart is empty.')).toBeInTheDocument();
        });

        expect(
            screen.getByText('Could not add the item to your cart. Please try again.')
        ).toBeInTheDocument();
    });

    it('increments quantity when the same product is added again', async () => {
        mockedAddToCart.mockReturnValue(new Promise<CartItem[]>(() => {}));
        seedCartWithItem(1);

        await loadProducts();

        await waitFor(() => {
            expect(within(getCartSection()).getByText(/1 × 19,99/)).toBeInTheDocument();
        });

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: 'Add to cart' }));

        expect(within(getCartSection()).getByText(/2 × 19,99/)).toBeInTheDocument();
    });

    it('keeps the item in the cart after a successful add to cart request', async () => {
        mockedAddToCart.mockResolvedValue(resolvedCartItem(cartProduct.id));

        await loadProducts();

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: 'Add to cart' }));

        const cart = within(getCartSection());

        await waitFor(() => {
            expect(cart.getByText(cartProduct.name)).toBeInTheDocument();
        });

        const footer = cart.getByText('Total').closest('footer');

        expect(footer).not.toBeNull();
        expect(within(footer!).getByText(/19,99/)).toBeInTheDocument();
    });
});
