import { useProductsStore } from './productsList.store';

export const useProductsList = () =>
    useProductsStore((state) => ({ productsList: state.productsList }));

export const useIsLoading = () => useProductsStore((state) => ({ isLoading: state.isLoading }));

export const useError = () => useProductsStore((state) => ({ error: state.error }));

export const useProductsListActions = () => useProductsStore((state) => state.actions);
