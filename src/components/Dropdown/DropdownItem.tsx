import React from 'react';
import { Check } from '@phosphor-icons/react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import styles from './Dropdown.module.css';

export interface DropdownItemProps {
  label: string;
  description?: string;
  leadingIconName?: string;
  trailingIconName?: string;
  iconWeight?: IconWeight;
  selected?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  /** Show checkbox — use for multi-select menus */
  checkbox?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  'data-focused'?: boolean;
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    {
      label,
      description,
      leadingIconName,
      trailingIconName,
      iconWeight = 'regular',
      selected = false,
      disabled = false,
      destructive = false,
      checkbox = false,
      onClick,
      'data-focused': focused,
    },
    ref
  ) => {
    const LeadingIcon = leadingIconName ? iconMap[leadingIconName] : null;
    const TrailingIcon = trailingIconName ? iconMap[trailingIconName] : null;

    const cls = [
      styles.item,
      destructive ? styles.itemDestructive : '',
      selected && !checkbox ? styles.itemSelected : '',
      focused ? styles.itemFocused : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        disabled={disabled}
        onClick={onClick}
        role={checkbox ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={checkbox ? selected : undefined}
        aria-disabled={disabled}
      >
        {/* Checkbox slot */}
        {checkbox && (
          <span className={`${styles.checkboxSlot} ${selected ? styles.checkboxChecked : ''}`}>
            {selected && <Check size={11} weight="bold" />}
          </span>
        )}

        {/* Leading icon */}
        {LeadingIcon && (
          <span className={styles.itemLeadingIcon}>
            <LeadingIcon size={16} weight={iconWeight} />
          </span>
        )}

        {/* Text content */}
        <span className={styles.itemContent}>
          <span className={styles.itemLabel}>{label}</span>
          {description && <span className={styles.itemDesc}>{description}</span>}
        </span>

        {/* Trailing icon — explicit prop takes priority, then checkmark for single-select */}
        {TrailingIcon ? (
          <span className={styles.itemTrailingIcon}>
            <TrailingIcon size={16} weight={iconWeight} />
          </span>
        ) : selected && !checkbox ? (
          <span className={styles.itemTrailingIcon}>
            <Check size={15} weight="bold" />
          </span>
        ) : null}
      </button>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';
