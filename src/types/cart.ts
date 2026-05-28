export interface CartItem {
    productId: number;
    quantity: number;
}

export type CartStatus = 'idle' | 'pending' | 'success' | 'error';

export interface CartState {
    cartStatus: CartStatus;
    cartItems: CartItem[];
    error?: Error;
    addToCart: (productId: number) => void;
}
