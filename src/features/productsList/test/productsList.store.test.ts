import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as helpers from '@/data/helpers';
import type { Product } from '@/types';
import { useProductsStore } from '../store/productsList.store';

vi.mock('@/data/helpers', () => ({
    addToCart: vi.fn(),
    fetchProductsList: vi.fn(),
}));

const mockedFetchProductsList = vi.mocked(helpers.fetchProductsList);

const getState = () => useProductsStore.getState();

const product: Product = {
    id: 1,
    name: 'Test product',
    description: 'A product used in tests',
    imgUrl: 'test.png',
    price: 10,
    stock: 5,
    category: 'test',
};

describe('productsList store', () => {
    beforeEach(() => {
        useProductsStore.setState({
            productsList: [],
            isLoading: false,
            error: undefined,
        });
    });

    it('starts empty, not loading and without an error', () => {
        const state = getState();

        expect(state.productsList).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeUndefined();
    });

    it('sets isLoading to true while the request is pending', () => {
        // A promise that never settles keeps the request in the loading state.
        mockedFetchProductsList.mockReturnValue(new Promise<Product[]>(() => {}));

        void getState().actions.getProductsList();

        expect(getState().isLoading).toBe(true);
    });

    it('populates the list and stops loading on a resolved request', async () => {
        mockedFetchProductsList.mockResolvedValue([product]);

        await getState().actions.getProductsList();

        const state = getState();

        expect(state.productsList).toEqual([product]);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeUndefined();
    });

    it('sets the error and stops loading on a rejected request', async () => {
        const failure = new Error('Failed to fetch the products list.');
        mockedFetchProductsList.mockRejectedValue(failure);

        await getState().actions.getProductsList();

        const state = getState();

        expect(state.error).toBe(failure);
        expect(state.isLoading).toBe(false);
        expect(state.productsList).toEqual([]);
    });
});
