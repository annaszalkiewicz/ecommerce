export interface CartItem {
    productId: number;
    quantity: number;
}

export type CartStatus = 'idle' | 'pending' | 'success' | 'error';

export interface CartActions {
    addToCart: (productId: number) => Promise<void>;
}

export interface CartAction {
    actions: CartActions;
}

export interface CartState {
    cartStatus: CartStatus;
    cartItems: CartItem[];
    error?: Error;
}
