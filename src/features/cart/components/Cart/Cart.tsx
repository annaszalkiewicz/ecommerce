import { useTranslation } from 'react-i18next';
import { useProductsList } from '@/features/productsList';
import { formatCurrency } from '@/features/productsList/helpers';
import { InfoBar } from '@/ui';
import { useCartItems, useCartStatus } from '../../store';
import styles from './Cart.module.scss';

export const Cart = () => {
    const { t } = useTranslation();
    const cartItems = useCartItems();
    const cartStatus = useCartStatus();
    const productsList = useProductsList();

    const lines = cartItems
        .map((item) => {
            const product = productsList.find((candidate) => candidate.id === item.productId);

            return product ? { ...item, product } : null;
        })
        .filter((line): line is NonNullable<typeof line> => line !== null);

    const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

    return (
        <section className={styles.cart} aria-label={t('cart.title')}>
            <header className={styles.header}>
                <h2 className={styles.title}>{t('cart.title')}</h2>
                {cartStatus === 'pending' && (
                    <span className={styles.syncing} aria-live="polite">
                        {t('cart.syncing')}
                    </span>
                )}
            </header>

            {cartStatus === 'error' && <InfoBar variant="error" message={t('cart.error')} />}

            {lines.length === 0 ? (
                <p className={styles.empty}>{t('cart.empty')}</p>
            ) : (
                <>
                    <ul className={styles.list}>
                        {lines.map((line) => (
                            <li key={line.productId} className={styles.item}>
                                <span className={styles.name}>{line.product.name}</span>
                                <span className={styles.meta}>
                                    {line.quantity} &times; {formatCurrency(line.product.price)}
                                </span>
                                <span className={styles.subtotal}>
                                    {formatCurrency(line.product.price * line.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <footer className={styles.footer}>
                        <span className={styles.totalLabel}>{t('cart.total')}</span>
                        <span className={styles.totalValue}>{formatCurrency(total)}</span>
                    </footer>
                </>
            )}
        </section>
    );
};
