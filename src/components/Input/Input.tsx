import React, { useId } from 'react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Label rendered above the field. Always provide one — use `aria-label` on the input only as a last resort. */
  label?: string;
  /** Neutral helper text shown below the field. Disappears when a `stateMessage` is active. */
  helperText?: string;
  /**
   * Validation state. Drives border color, icon tint, and ring color.
   * - **default** — neutral, no validation signal.
   * - **error** — validation failed; always pair with a `stateMessage` explaining what went wrong.
   * - **success** — confirmed valid (e.g. username available).
   * - **warning** — valid but worth attention (e.g. reserved keyword, near a limit).
   */
  inputState?: 'default' | 'error' | 'success' | 'warning';
  /** Replaces `helperText` when shown. Write in plain language: what went wrong and how to fix it. */
  stateMessage?: string;
  /** Phosphor icon name in the left slot. Use to reinforce field type (envelope for email, lock for password). */
  leadingIconName?: string;
  /** Phosphor icon name in the right slot. Use for status indicators or clear buttons. Avoid decorative use. */
  trailingIconName?: string;
  /** Stroke weight for Phosphor icons. */
  iconWeight?: IconWeight;
  /** Static text shown inside the field before the input (e.g. `"https://"`, `"$"`). Not editable. */
  prefix?: string;
  /** Static text shown inside the field after the input (e.g. `".com"`, `"%"`). Not editable. */
  suffix?: string;
  /** **medium** (36px) default. **small** (28px) for dense forms, table filters, or inline edits. */
  size?: 'medium' | 'small';
  /** Stretches the field to fill its container. Use inside grid/flex form layouts. */
  fullWidth?: boolean;
  /** Appends a red `*` to the label and sets `aria-required`. */
  required?: boolean;
  /** Appends `(optional)` to the label — use when most fields are required and this one is the exception. */
  optionalLabel?: boolean;
  /** Custom React node in the trailing slot — e.g. an icon button to copy or clear the value. */
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
