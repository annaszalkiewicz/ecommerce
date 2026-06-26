import styles from './IconButton.module.scss';

export interface IconButtonProps {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export const IconButton = ({
    label,
    onClick,
    children,
    type = 'button',
    className,
}: IconButtonProps) => (
    <button
        type={type}
        className={className ? `${styles.iconButton} ${className}` : styles.iconButton}
        onClick={onClick}
        aria-label={label}
    >
        {children}
    </button>
);
