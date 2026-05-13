import React, { useId, useState } from 'react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import styles from './Tabs.module.css';

/* ── Tab count badge ──────────────────────────────────────────────────────── */
interface CountBadgeProps {
  count: number;
  active?: boolean;
  disabled?: boolean;
}

const CountBadge = ({ count, active, disabled }: CountBadgeProps) => (
  <span
    className={[
      styles.count,
      active ? styles.countActive : '',
      disabled ? styles.countDisabled : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {count > 999 ? '999+' : count}
  </span>
);

/* ── TabItem definition ───────────────────────────────────────────────────── */
export interface TabItem {
  /** Unique value used to identify the active tab. */
  value: string;
  /** Label shown in the tab. */
  label: string;
  /**
   * Optional count shown as a small badge beside the label.
   * Use for unread items, results, or pending actions.
   */
  count?: number;
  /** Phosphor icon name shown before the label. */
  leadingIconName?: string;
  /** Prevents the tab from being selected. */
  disabled?: boolean;
}

/* ── Tabs props ───────────────────────────────────────────────────────────── */
export interface TabsProps {
  /** Tab definitions. Order here = render order. */
  tabs: TabItem[];
  /**
   * Controlled active value. Pair with `onChange`.
   * Omit to use uncontrolled mode with `defaultValue`.
   */
  value?: string;
  /** Initial active tab in uncontrolled mode. Defaults to the first non-disabled tab. */
  defaultValue?: string;
  /** Called with the new value when the user clicks a tab. */
  onChange?: (value: string) => void;
  /**
   * **line** (default) — minimal underline style, fits most page-level navigation.
   * **pill** — filled pill style for secondary in-page switching (e.g. inside a card or panel).
   */
  variant?: 'line' | 'pill';
  /** Stretch tabs to fill the full container width. Avoid on pill variant with many tabs. */
  fullWidth?: boolean;
  /** Phosphor icon weight applied to all leading icons. */
  iconWeight?: IconWeight;
  /**
   * Content panels. Each child is shown when its index matches the active tab.
   * Alternatively, manage panels yourself and just use `value` / `onChange`.
   */
  children?: React.ReactNode;
  /** Extra class on the root element. */
  className?: string;
}

/* ── Tabs component ───────────────────────────────────────────────────────── */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      value: controlledValue,
      defaultValue,
      onChange,
      variant = 'line',
      fullWidth = false,
      iconWeight = 'regular',
      children,
      className,
    },
    ref
  ) => {
    const firstEnabled = tabs.find((t) => !t.disabled)?.value ?? tabs[0]?.value;
    const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);

    const isControlled = controlledValue !== undefined;
    const active = isControlled ? controlledValue : internalValue;

    const handleSelect = (val: string) => {
      if (!isControlled) setInternalValue(val);
      onChange?.(val);
    };

    /* Keyboard navigation within the tab list */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabled = tabs.filter((t) => !t.disabled).map((t) => t.value);
      const idx = enabled.indexOf(active);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSelect(enabled[(idx + 1) % enabled.length]);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSelect(enabled[(idx - 1 + enabled.length) % enabled.length]);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        handleSelect(enabled[0]);
      }
      if (e.key === 'End') {
        e.preventDefault();
        handleSelect(enabled[enabled.length - 1]);
      }
    };

    const childrenArray = React.Children.toArray(children);
    const activeIndex = tabs.findIndex((t) => t.value === active);

    const rootCls = [styles.root, styles[`root_${variant}`], className]
      .filter(Boolean)
      .join(' ');

    const listCls = [styles.list, styles[`list_${variant}`], fullWidth ? styles.listFullWidth : '']
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={rootCls}>
        {/* Tab strip */}
        <div
          role="tablist"
          className={listCls}
          onKeyDown={handleKeyDown}
          aria-orientation="horizontal"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === active;
            const LeadingIcon = tab.leadingIconName ? iconMap[tab.leadingIconName] : null;

            const tabCls = [
              styles.tab,
              styles[`tab_${variant}`],
              isActive ? styles[`tab_${variant}_active`] : '',
              tab.disabled ? styles.tabDisabled : '',
              fullWidth ? styles.tabFullWidth : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={tab.value}
                role="tab"
                type="button"
                className={tabCls}
                aria-selected={isActive}
                aria-disabled={tab.disabled}
                disabled={tab.disabled}
                tabIndex={isActive ? 0 : -1}
                onClick={() => !tab.disabled && handleSelect(tab.value)}
              >
                {LeadingIcon && (
                  <span className={styles.tabIcon} aria-hidden="true">
                    <LeadingIcon size={14} weight={iconWeight} />
                  </span>
                )}
                <span className={styles.tabLabel}>{tab.label}</span>
                {tab.count !== undefined && (
                  <CountBadge
                    count={tab.count}
                    active={isActive}
                    disabled={tab.disabled}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab panels — only rendered when children are passed */}
        {childrenArray.length > 0 && (
          <div className={styles.panels}>
            {childrenArray.map((child, i) => (
              <div
                key={i}
                role="tabpanel"
                hidden={i !== activeIndex}
                className={styles.panel}
              >
                {i === activeIndex ? child : null}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
