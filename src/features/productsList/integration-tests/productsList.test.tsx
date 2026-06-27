import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import * as helpers from '@/data/helpers';
import { renderApp, setupIntegrationTest } from '@/test/helpers/renderApp';
import { productsListFetchError, productsListProduct } from './fixtures';

vi.mock('@/data/helpers', () => ({
    addToCart: vi.fn(),
    fetchProductsList: vi.fn(),
}));

const mockedFetchProductsList = vi.mocked(helpers.fetchProductsList);

describe('productsList integration', () => {
    beforeEach(() => {
        setupIntegrationTest();
    });

    it('renders product card with correct info', async () => {
        mockedFetchProductsList.mockResolvedValue([productsListProduct]);

        renderApp();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByRole('heading', { name: productsListProduct.name })
            ).toBeInTheDocument();
        });

        expect(screen.getByText(productsListProduct.description)).toBeInTheDocument();
        expect(screen.getByText(/4,99/)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: productsListProduct.name })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
    });

    it('shows loading state while products are being fetched', () => {
        mockedFetchProductsList.mockReturnValue(new Promise(() => {}));

        renderApp();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('shows fetch error when the products request fails', async () => {
        mockedFetchProductsList.mockRejectedValue(productsListFetchError);

        renderApp();

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(
                `Failed to load products: ${productsListFetchError.message}`
            );
        });
    });
});
