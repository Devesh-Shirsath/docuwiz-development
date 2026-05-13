import React from 'react';
import styles from './SideNav.module.css';

export type HttpMethod =
  | 'GET' | 'POST' | 'PUT' | 'PATCH'
  | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE';

export interface MethodBadgeProps {
  /**
   * HTTP method. Drives the badge background color.
   * Each method has a distinct solid color so engineers can scan a list at a glance.
   */
  method: HttpMethod;
}

export const MethodBadge = ({ method }: MethodBadgeProps) => (
  <span
    className={`${styles.badge} ${styles[`badge_${method.toLowerCase()}`]}`}
    aria-label={`HTTP ${method}`}
  >
    {method}
  </span>
);

MethodBadge.displayName = 'MethodBadge';
