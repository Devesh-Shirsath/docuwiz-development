import React from 'react';
import styles from './SideNav.module.css';

export interface SideNavProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Root sidebar navigation container. Renders as a `<nav>` with
 * `role="navigation"`. Place `SideNavSection`, `SideNavGroup`,
 * `SideNavItem`, and `<SideNav.Divider />` as direct children.
 */
export const SideNav = ({ children, className }: SideNavProps) => (
  <nav
    className={[styles.nav, className].filter(Boolean).join(' ')}
    aria-label="Sidebar navigation"
  >
    {children}
  </nav>
);

/** Horizontal rule that visually separates sections. */
SideNav.Divider = function SideNavDivider() {
  return <hr className={styles.divider} aria-hidden="true" />;
};

SideNav.displayName = 'SideNav';
