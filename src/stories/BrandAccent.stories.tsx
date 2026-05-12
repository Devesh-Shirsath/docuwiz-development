import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/Button';
import styles from './BrandAccent.module.css';

/**
 * Demonstrates how --color-brand-accent works for single and dual-brand workspaces.
 * In production, workspace settings inject these CSS vars via a <style> tag.
 */

const BrandDemo = ({
  brand,
  accent,
  accentHover,
  accentPressed,
  label,
}: {
  brand: string;
  accent: string;
  accentHover: string;
  accentPressed: string;
  label: string;
}) => (
  <div
    className={styles.demo}
    style={
      {
        '--color-brand': brand,
        '--color-brand-accent': accent,
        '--color-brand-accent-hover': accentHover,
        '--color-brand-accent-pressed': accentPressed,
        /* secondary/tertiary hover surfaces derived from accent tint */
        '--color-blue-100': `${accent}18`,
        '--color-blue-200': `${accent}30`,
      } as React.CSSProperties
    }
  >
    <div className={styles.demoHeader}>
      <span className={styles.dot} style={{ background: brand }} />
      <span className={styles.dot} style={{ background: accent }} />
      <span className={styles.demoLabel}>{label}</span>
    </div>
    <div className={styles.buttonRow}>
      <Button variant="primary" size="medium" iconLeftName="Plugs">Connect API</Button>
      <Button variant="secondary" size="medium">Cancel</Button>
      <Button variant="tertiary" size="medium" iconLeftName="ArrowRight">Learn more</Button>
      <Button variant="danger" size="medium" iconLeftName="Trash">Delete</Button>
    </div>
    <div className={styles.buttonRow}>
      <Button variant="primary" size="small" iconLeftName="Plus">Add endpoint</Button>
      <Button variant="secondary" size="small">Dismiss</Button>
      <Button variant="primary" size="medium" iconLeftName="Plus" aria-label="Add" />
    </div>
    <div className={styles.tokenRow}>
      <code>--color-brand: <span style={{ color: brand }}>{brand}</span></code>
      <code>--color-brand-accent: <span style={{ color: accent }}>{accent}</span></code>
    </div>
  </div>
);

const meta: Meta = {
  title: 'DocuWiz Design System/Brand Accent',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`--color-brand` is the identity color (backgrounds, logo). `--color-brand-accent` is the action color (buttons, links, focus rings). ' +
          'Single-brand workspaces leave `--color-brand-accent` unset — it defaults to `--color-brand`. ' +
          'Dual-brand workspaces inject both via a workspace-level `<style>` tag from admin settings.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const SingleBrand: Story = {
  name: 'Single Brand (default)',
  render: () => (
    <BrandDemo
      brand="#0265dc"
      accent="#0265dc"
      accentHover="#0255c0"
      accentPressed="#024fb5"
      label="DocuWiz Blue — brand = accent"
    />
  ),
};

export const DualBrandPurpleMagenta: Story = {
  name: 'Dual Brand — Purple + Magenta',
  render: () => (
    <BrandDemo
      brand="#6B21A8"
      accent="#DB2777"
      accentHover="#BE185D"
      accentPressed="#9D174D"
      label="Purple (identity) + Magenta (action)"
    />
  ),
};

export const DualBrandTealOrange: Story = {
  name: 'Dual Brand — Teal + Orange',
  render: () => (
    <BrandDemo
      brand="#0F766E"
      accent="#EA580C"
      accentHover="#C2410C"
      accentPressed="#9A3412"
      label="Teal (identity) + Orange (action)"
    />
  ),
};

export const DualBrandNavyGold: Story = {
  name: 'Dual Brand — Navy + Gold',
  render: () => (
    <BrandDemo
      brand="#1E3A5F"
      accent="#D97706"
      accentHover="#B45309"
      accentPressed="#92400E"
      label="Navy (identity) + Gold (action)"
    />
  ),
};
