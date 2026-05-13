import React from 'react';
import { Stack, Cube } from '@phosphor-icons/react';
import styles from './SideNav.module.css';

export type SideNavSectionVariant = 'category' | 'product' | 'label';

export interface SideNavSectionProps {
  /** Section heading text */
  label: string;
  /**
   * **label** — flat uppercase label (e.g. "REFERENCES"). No icon. Use to divide top-level regions.
   * **category** — Stack icon + bold label. Use for API spec groups or feature categories.
   * **product** — Cube icon + bold label. Use for individual products or sub-systems.
   */
  variant?: SideNavSectionVariant;
}

export const SideNavSection = ({ label, variant = 'category' }: SideNavSectionProps) => {
  if (variant === 'label') {
    return <div className={styles.sectionLabel}>{label}</div>;
  }

  const Icon = variant === 'product' ? Cube : Stack;

  return (
    <div className={styles.sectionHeader}>
      <Icon size={14} weight="regular" className={styles.sectionIcon} />
      <span className={styles.sectionText}>{label}</span>
    </div>
  );
};

SideNavSection.displayName = 'SideNavSection';
