import { useTranslation } from 'react-i18next';
import type { Product } from '@/types';
import imagePlaceholder from '../../assets/image-placeholder.svg';
import styles from './ProductCard.module.scss';
import { formatCurrency } from '../../helpers';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { t } = useTranslation();

    const handleAddToCart = () => {
        console.log('Not implemented yet');
    };

    return (
        <article className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    className={styles.image}
                    src={product.imgUrl}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = imagePlaceholder;
                        e.currentTarget.onerror = null;
                    }}
                />
            </div>
            <div className={styles.body}>
                <h2 className={styles.name}>{product.name}</h2>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.footer}>
                    <span className={styles.price}>{formatCurrency(product.price, 'PLN')}</span>
                    <button type="button" className={styles.addToCart} onClick={handleAddToCart}>
                        {t('addToCart')}
                    </button>
                </div>
            </div>
        </article>
    );
};
