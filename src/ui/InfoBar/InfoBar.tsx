import SuccessIcon from '@/assets/icons/success.svg?react';
import InfoIcon from '@/assets/icons/info.svg?react';
import ErrorIcon from '@/assets/icons/error.svg?react';
import WarningIcon from '@/assets/icons/warning.svg?react';
import styles from './InfoBar.module.scss';

export type InfoBarVariant = 'success' | 'info' | 'error' | 'warning';

export interface InfoBarProps {
    variant: InfoBarVariant;
    message: string;
    onDismiss?: () => void;
    role?: 'status' | 'alert';
    dismissLabel?: string;
}

const icons: Record<InfoBarVariant, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
    success: SuccessIcon,
    info: InfoIcon,
    error: ErrorIcon,
    warning: WarningIcon,
};

export const InfoBar = ({
    variant,
    message,
    onDismiss,
    role = variant === 'error' ? 'alert' : 'status',
    dismissLabel = 'Dismiss',
}: InfoBarProps) => {
    const Icon = icons[variant];

    return (
        <div className={`${styles.infoBar} ${styles[variant]}`} role={role}>
            <Icon
                className={styles.icon}
                width={20}
                height={20}
                aria-hidden="true"
                focusable="false"
            />
            <span className={styles.message}>{message}</span>
            {onDismiss && (
                <button
                    type="button"
                    className={styles.dismiss}
                    onClick={onDismiss}
                    aria-label={dismissLabel}
                >
                    &times;
                </button>
            )}
        </div>
    );
};
