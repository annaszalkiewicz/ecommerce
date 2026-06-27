import { createProduct } from '@/test/fixtures';

export const productsListProduct = createProduct({
    name: 'Classic Blue Ballpoint Pen',
    description:
        'Smooth-writing ballpoint pen with comfortable grip and reliable blue ink. Perfect for everyday writing tasks.',
    price: 4.99,
});

export const productsListFetchError = new Error('Failed to fetch the products list.');
