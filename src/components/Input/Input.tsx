import React, { useId } from 'react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Visible label above the field */
  label?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Validation state */
  inputState?: 'default' | 'error' | 'success' | 'warning';
  /** Message shown for error / success / warning */
  stateMessage?: string;
  /** Phosphor icon name on the left */
  leadingIconName?: string;
  /** Phosphor icon name on the right */
  trailingIconName?: string;
  iconWeight?: IconWeight;
  /** Text prefix inside the field (e.g. "https://") */
  prefix?: string;
  /** Text suffix inside the field (e.g. ".com") */
  suffix?: string;
  /** Input size */
  size?: 'medium' | 'small';
  /** Stretch to fill parent */
  fullWidth?: boolean;
  /** Show required asterisk on label */
  required?: boolean;
  /** Optional label for the optional indicator */
  optionalLabel?: boolean;
  /** Custom trailing action element (e.g. copy/clear button) */
  trailingAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      inputState = 'default',
      stateMessage,
      leadingIconName,
      trailingIconName,
      iconWeight = 'regular',
      prefix,
      suffix,
      size = 'medium',
      fullWidth = false,
      required,
      optionalLabel,
      trailingAction,
      disabled,
      readOnly,
      id: idProp,
      className,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const helperId = `${id}-helper`;

    const LeadingIcon = leadingIconName ? iconMap[leadingIconName] : null;
    const TrailingIcon = trailingIconName ? iconMap[trailingIconName] : null;

    const iconSize = size === 'small' ? 14 : 16;

    const wrapperCls = [
      styles.wrapper,
      fullWidth ? styles.wrapperFullWidth : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const fieldCls = [
      styles.field,
      styles[`field_${size}`],
      styles[`field_${inputState}`],
      disabled ? styles.fieldDisabled : '',
      readOnly ? styles.fieldReadonly : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperCls}>
        {/* Label row */}
        {label && (
          <label className={styles.label} htmlFor={id}>
            <span className={styles.labelText}>{label}</span>
            {required && <span className={styles.required} aria-hidden="true">*</span>}
            {optionalLabel && !required && (
              <span className={styles.optional}>(optional)</span>
            )}
          </label>
        )}

        {/* Input field */}
        <div className={fieldCls}>
          {/* Leading icon */}
          {LeadingIcon && (
            <span className={styles.leadingIcon}>
              <LeadingIcon size={iconSize} weight={iconWeight} />
            </span>
          )}

          {/* Prefix text */}
          {prefix && <span className={styles.prefix}>{prefix}</span>}

          <input
            ref={ref}
            id={id}
            className={styles.input}
            disabled={disabled}
            readOnly={readOnly}
            aria-describedby={helperText || stateMessage ? helperId : undefined}
            aria-invalid={inputState === 'error' ? true : undefined}
            aria-required={required}
            {...rest}
          />

          {/* Suffix text */}
          {suffix && <span className={styles.suffix}>{suffix}</span>}

          {/* Trailing icon */}
          {TrailingIcon && !trailingAction && (
            <span className={styles.trailingIcon}>
              <TrailingIcon size={iconSize} weight={iconWeight} />
            </span>
          )}

          {/* Trailing action slot (custom node, e.g. icon button) */}
          {trailingAction && (
            <span className={styles.trailingAction}>{trailingAction}</span>
          )}
        </div>

        {/* Helper / state message */}
        {(helperText || stateMessage) && (
          <span id={helperId} className={`${styles.helper} ${stateMessage ? styles[`helper_${inputState}`] : ''}`}>
            {stateMessage || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
