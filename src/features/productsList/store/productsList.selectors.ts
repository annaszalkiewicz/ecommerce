import { useProductsStore } from './productsList.store';

export const useProductsList = () => useProductsStore((state) => state.productsList);

export const useIsLoading = () => useProductsStore((state) => state.isLoading);

export const useError = () => useProductsStore((state) => state.error);

export const useProductsListActions = () => useProductsStore((state) => state.actions);
