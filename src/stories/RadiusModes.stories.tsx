import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/Button';
import styles from './RadiusModes.module.css';

/* --- Surface previews for each radius token --- */
const surfaces = [
  { label: 'Button',   token: '--radius-button',  height: 36 },
  { label: 'Input',    token: '--radius-input',   height: 36 },
  { label: 'Badge',    token: '--radius-badge',   height: 22 },
  { label: 'Card',     token: '--radius-card',    height: 80 },
  { label: 'Popup',    token: '--radius-popup',   height: 80 },
  { label: 'Overlay',  token: '--radius-overlay', height: 100 },
  { label: 'Tooltip',  token: '--radius-tooltip', height: 32 },
  { label: 'Avatar',   token: '--radius-avatar',  height: 40 },
];

const MODES = ['sharp', 'smooth', 'rounded'] as const;
type RadiusMode = typeof MODES[number];

const ModeColumn = ({ mode }: { mode: RadiusMode }) => (
  <div className={styles.column} data-radius={mode}>
    <h3 className={styles.modeTitle}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</h3>
    <div className={styles.surfaceList}>
      {surfaces.map(({ label, token, height }) => (
        <div key={label} className={styles.surfaceRow}>
          <span className={styles.surfaceLabel}>{label}</span>
          <div
            className={styles.surface}
            style={{ height, borderRadius: `var(${token})` }}
          />
          <code className={styles.tokenValue}>{token}</code>
        </div>
      ))}
    </div>

    <div className={styles.buttonGroup}>
      <Button variant="primary" size="medium" iconLeftName="Plugs">Connect API</Button>
      <Button variant="secondary" size="medium">Cancel</Button>
      <Button variant="primary" size="small" iconLeftName="Plus">Add</Button>
      <Button variant="primary" size="medium" iconLeftName="Plus" aria-label="Add" />
    </div>
  </div>
);

const RadiusShowcase = () => (
  <div className={styles.page}>
    <h1 className={styles.heading}>Radius Modes</h1>
    <p className={styles.description}>
      Set <code>data-radius="sharp|smooth|rounded"</code> on <code>&lt;html&gt;</code>.
      Use the <strong>Radius</strong> toolbar above to preview all components live.
      Components reference semantic tokens (<code>--radius-button</code>, <code>--radius-card</code>, etc.) —
      never primitive values directly.
    </p>
    <div className={styles.grid}>
      {MODES.map((mode) => <ModeColumn key={mode} mode={mode} />)}
    </div>
  </div>
);

const meta: Meta = {
  title: 'DocuWiz Design System/Radius Modes',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const AllModes: Story = {
  name: 'All Modes Side-by-Side',
  render: () => <RadiusShowcase />,
};
