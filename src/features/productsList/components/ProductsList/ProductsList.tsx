import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useError, useIsLoading, useProductsList, useProductsListActions } from '../../store';
import { ProductCard } from '../ProductCard';
import styles from './ProductsList.module.scss';

export const ProductsList = () => {
    const { t } = useTranslation();
    const productsList = useProductsList();
    const isLoading = useIsLoading();
    const error = useError();
    const { getProductsList } = useProductsListActions();

    useEffect(() => {
        if (productsList.length === 0 && !isLoading && !error) {
            void getProductsList();
        }
    }, [productsList.length, isLoading, error, getProductsList]);

    if (error) {
        return (
            <p className={styles.status} role="alert">
                {t('error', { message: error.message })}
            </p>
        );
    }

    if (isLoading && productsList.length === 0) {
        return (
            <p className={styles.status} aria-live="polite">
                {t('loading')}
            </p>
        );
    }

    return (
        <ul className={styles.list}>
            {productsList.map((product) => (
                <li key={product.id} className={styles.item}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
};
