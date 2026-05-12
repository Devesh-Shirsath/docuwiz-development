import React from 'react';
import type { IconWeight } from '@phosphor-icons/react';
import { iconMap } from '@/utils/iconMap';
import styles from './Button.module.css';

export type { IconWeight };
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'medium' | 'small';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Render a Phosphor icon by name (left slot). Overrides iconLeft. */
  iconLeftName?: string;
  /** Render a Phosphor icon by name (right slot). Overrides iconRight. */
  iconRightName?: string;
  /** Phosphor icon weight applied to both named icons */
  iconWeight?: IconWeight;
  /** Custom React node for left icon slot */
  iconLeft?: React.ReactNode;
  /** Custom React node for right icon slot */
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const ICON_SIZE: Record<ButtonSize, number> = { medium: 16, small: 14 };

function resolveIcon(
  name: string | undefined,
  fallback: React.ReactNode,
  weight: IconWeight,
  size: number
): React.ReactNode {
  if (name && name !== 'none') {
    const IconComponent = iconMap[name];
    if (IconComponent) return <IconComponent weight={weight} size={size} />;
  }
  return fallback;
}

const Spinner = ({ size }: { size: ButtonSize }) => (
  <svg
    className={`${styles.spinner} ${styles[`spinner--${size}`]}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="8" cy="8" r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="28"
      strokeDashoffset="10"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      iconLeftName,
      iconRightName,
      iconWeight = 'regular',
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
    const iconSize = ICON_SIZE[size];

    const resolvedLeft = resolveIcon(iconLeftName, iconLeft, iconWeight, iconSize);
    const resolvedRight = resolveIcon(iconRightName, iconRight, iconWeight, iconSize);
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
          resolvedLeft && (
            <span className={styles.icon} aria-hidden="true">{resolvedLeft}</span>
          )
        )}
        {children && <span className={styles.label}>{children}</span>}
        {!loading && resolvedRight && (
          <span className={styles.icon} aria-hidden="true">{resolvedRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
