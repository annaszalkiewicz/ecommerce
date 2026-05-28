import { useTranslation } from 'react-i18next';
import { ProductsList } from '@/features/productsList';
import styles from './App.module.scss';

export const App = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
            </header>
            <main className={styles.main}>
                <ProductsList />
            </main>
        </div>
    );
};
