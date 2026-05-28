import type { Product } from '@/types';
import { products } from '../products.json';

export const fetchProductsList = async () =>
    await new Promise<Product[]>((resolve) => setTimeout(() => resolve([...products]), 1000));
