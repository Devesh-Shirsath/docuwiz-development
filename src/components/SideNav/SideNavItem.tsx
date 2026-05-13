import React from 'react';
import { BracketsCurly, BookOpen } from '@phosphor-icons/react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import { MethodBadge } from './MethodBadge';
import type { HttpMethod } from './MethodBadge';
import styles from './SideNav.module.css';

export type SideNavItemType = 'endpoint' | 'guide' | 'item';

export interface SideNavItemProps {
  /** Display label — keep to one line; long labels truncate with ellipsis. */
  label: string;
  /**
   * **endpoint** — API operation row. Shows `{}` (BracketsCurly) icon + optional HTTP method badge.
   * **guide** — Documentation page row. Shows BookOpen icon, no badge.
   * **item** — Generic row. No default icon; supply one via `leadingIconName`.
   */
  type?: SideNavItemType;
  /** HTTP method badge shown on the trailing edge. Only meaningful for `type="endpoint"`. */
  method?: HttpMethod;
  /** Highlights the item with the brand left-border indicator. */
  active?: boolean;
  /** Greys out and prevents interaction. */
  disabled?: boolean;
  /** Phosphor icon name — overrides the default icon for the item's type. */
  leadingIconName?: string;
  /** Icon stroke weight */
  iconWeight?: IconWeight;
  onClick?: () => void;
  /** Rendered as an anchor when provided. */
  href?: string;
}

export const SideNavItem = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, SideNavItemProps>(
  (
    {
      label,
      type = 'item',
      method,
      active = false,
      disabled = false,
      leadingIconName,
      iconWeight = 'regular',
      onClick,
      href,
    },
    ref
  ) => {
    const DefaultIcon =
      type === 'endpoint' ? BracketsCurly :
      type === 'guide'    ? BookOpen : null;

    const IconComponent = leadingIconName ? iconMap[leadingIconName] : DefaultIcon;

    const cls = [
      styles.item,
      active ? styles.itemActive : '',
      disabled ? styles.itemDisabled : '',
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {IconComponent && (
          <span className={styles.itemIcon} aria-hidden="true">
            <IconComponent size={14} weight={iconWeight} />
          </span>
        )}
        <span className={styles.itemLabel}>{label}</span>
        {method && <MethodBadge method={method} />}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={href}
          className={cls}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        className={cls}
        onClick={onClick}
        disabled={disabled}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </button>
    );
  }
);

SideNavItem.displayName = 'SideNavItem';
