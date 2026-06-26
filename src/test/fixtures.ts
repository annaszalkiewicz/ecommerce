import type { Product } from '@/types';

/** Base product shape — override fields in feature fixtures via spread */
export const baseProduct: Product = {
    id: 1,
    name: 'Test product',
    description: 'A product used in tests',
    imgUrl: 'test.png',
    price: 10,
    stock: 5,
    category: 'test',
};

/** Factory for creating product variants without duplication */
export const createProduct = (overrides: Partial<Product> = {}): Product => ({
    ...baseProduct,
    ...overrides,
});
