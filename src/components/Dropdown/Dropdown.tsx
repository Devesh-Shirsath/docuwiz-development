import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import styles from './Dropdown.module.css';

export interface DropdownProps {
  /** Button label */
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'medium' | 'small';
  /** Phosphor icon name for button leading icon */
  iconLeftName?: string;
  iconWeight?: IconWeight;
  disabled?: boolean;
  /** Full width trigger */
  fullWidth?: boolean;
  /** Controlled open state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Popup children — DropdownItem nodes */
  children?: React.ReactNode;
  /** Popup width: 'trigger' matches trigger width, 'auto' fits content */
  popupWidth?: 'trigger' | 'auto';
  /** Popup horizontal alignment */
  align?: 'start' | 'end';
  /** Section label above children */
  sectionLabel?: string;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      variant = 'secondary',
      size = 'medium',
      iconLeftName,
      iconWeight = 'regular',
      disabled = false,
      fullWidth = false,
      open: controlledOpen,
      onOpenChange,
      children,
      popupWidth = 'trigger',
      align = 'start',
      sectionLabel,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const toggle = () => {
      if (!disabled) setOpen(!open);
    };

    /* Close on outside click */
    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [open, setOpen]);

    /* Close on Escape, navigate with arrow keys */
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const items = popupRef.current?.querySelectorAll<HTMLButtonElement>(
            'button[role="menuitem"]:not(:disabled), button[role="menuitemcheckbox"]:not(:disabled)'
          );
          if (!items?.length) return;
          const arr = Array.from(items);
          const focused = document.activeElement;
          const idx = arr.indexOf(focused as HTMLButtonElement);
          const next =
            e.key === 'ArrowDown'
              ? (idx + 1) % arr.length
              : (idx - 1 + arr.length) % arr.length;
          arr[next].focus();
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [open, setOpen]);

    /* Focus first item when popup opens */
    useEffect(() => {
      if (!open) return;
      const first = popupRef.current?.querySelector<HTMLButtonElement>(
        'button[role="menuitem"]:not(:disabled), button[role="menuitemcheckbox"]:not(:disabled)'
      );
      first?.focus();
    }, [open]);

    const LeadingIcon = iconLeftName ? iconMap[iconLeftName] : null;

    const triggerCls = [
      styles.trigger,
      styles[`trigger_${variant}`],
      styles[`trigger_${size}`],
      open ? styles.triggerOpen : '',
      fullWidth ? styles.triggerFullWidth : '',
    ]
      .filter(Boolean)
      .join(' ');

    const popupCls = [
      styles.popup,
      open ? styles.popupOpen : '',
      align === 'end' ? styles.popupEnd : '',
    ]
      .filter(Boolean)
      .join(' ');

    const containerCls = [styles.container, fullWidth ? styles.containerFullWidth : '']
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }} className={containerCls}>
        <button
          ref={triggerRef}
          type="button"
          className={triggerCls}
          disabled={disabled}
          onClick={toggle}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {LeadingIcon && (
            <span className={styles.triggerLeadingIcon}>
              <LeadingIcon size={size === 'small' ? 14 : 16} weight={iconWeight} />
            </span>
          )}
          <span className={styles.triggerLabel}>{label}</span>
          <CaretDown
            size={size === 'small' ? 12 : 14}
            weight="bold"
            className={`${styles.caret} ${open ? styles.caretOpen : ''}`}
          />
        </button>

        <div
          ref={popupRef}
          className={popupCls}
          role="menu"
          aria-label={label}
          style={popupWidth === 'trigger' ? { minWidth: '100%' } : undefined}
        >
          {sectionLabel && (
            <span className={styles.sectionLabel}>{sectionLabel}</span>
          )}
          {children}
        </div>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
