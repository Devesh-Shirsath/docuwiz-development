import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'medium' | 'small';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Spinner = ({ size }: { size: ButtonSize }) => (
  <svg
    className={`${styles.spinner} ${styles[`spinner--${size}`]}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const isIconOnly = !children;

    const classes = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      isIconOnly && styles['button--icon-only'],
      fullWidth && styles['button--full-width'],
      loading && styles['button--loading'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading}
        {...rest}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          iconLeft && <span className={styles.icon} aria-hidden="true">{iconLeft}</span>
        )}
        {children && <span className={styles.label}>{children}</span>}
        {!loading && iconRight && (
          <span className={styles.icon} aria-hidden="true">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
