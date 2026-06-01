import { useTranslation } from 'react-i18next';
import { ProductsList } from '@/features/productsList';
import { Cart } from '@/features/cart';
import styles from './App.module.scss';

export const App = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
            </header>
            <main className={styles.main}>
                <section className={styles.products}>
                    <ProductsList />
                </section>
                <aside className={styles.sidebar}>
                    <Cart />
                </aside>
            </main>
        </div>
    );
};
