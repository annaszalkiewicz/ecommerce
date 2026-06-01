export interface Product {
    id: number;
    name: string;
    description: string;
    imgUrl: string;
    price: number;
    stock: number;
    category: string;
}

export interface ProductsActions {
    getProductsList: () => Promise<Product[]>;
}

export interface ProductsAction {
    actions: ProductsActions;
}

export interface ProductsState {
    productsList: Product[];
    isLoading: boolean;
    error?: Error;
}
