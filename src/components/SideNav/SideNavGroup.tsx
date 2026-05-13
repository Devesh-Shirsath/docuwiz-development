import React, { useState } from 'react';
import { CaretRight, CaretDown, WarningCircle } from '@phosphor-icons/react';
import { iconMap } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';
import styles from './SideNav.module.css';

export interface SideNavGroupProps {
  /** Group header label */
  label: string;
  /**
   * Expanded by default (uncontrolled).
   * For controlled mode use `expanded` + `onExpandedChange`.
   */
  defaultExpanded?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Shows a WarningCircle trailing icon on the group header.
   * Use when the group contains items with validation errors or deprecation warnings.
   */
  hasWarning?: boolean;
  /** Optional Phosphor icon name shown between the caret and the label. */
  leadingIconName?: string;
  iconWeight?: IconWeight;
  /** `SideNavItem` children rendered when the group is expanded. */
  children?: React.ReactNode;
}

export const SideNavGroup = ({
  label,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
  hasWarning = false,
  leadingIconName,
  iconWeight = 'regular',
  children,
}: SideNavGroupProps) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const toggle = () => {
    if (!isControlled) setInternalExpanded((v) => !v);
    onExpandedChange?.(!expanded);
  };

  const LeadingIcon = leadingIconName ? iconMap[leadingIconName] : null;

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={`${styles.groupTrigger} ${expanded ? styles.groupTriggerExpanded : ''}`}
        onClick={toggle}
        aria-expanded={expanded}
      >
        <span className={styles.groupCaret} aria-hidden="true">
          {expanded
            ? <CaretDown  size={14} weight="bold" />
            : <CaretRight size={14} weight="bold" />}
        </span>
        {LeadingIcon && (
          <span className={styles.groupLeadingIcon} aria-hidden="true">
            <LeadingIcon size={14} weight={iconWeight} />
          </span>
        )}
        <span className={styles.groupLabel}>{label}</span>
        {hasWarning && (
          <span className={styles.groupWarning} aria-label="Has warnings">
            <WarningCircle size={12} weight="fill" />
          </span>
        )}
      </button>

      {expanded && (
        <div className={styles.groupChildren} role="group" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
};

SideNavGroup.displayName = 'SideNavGroup';
