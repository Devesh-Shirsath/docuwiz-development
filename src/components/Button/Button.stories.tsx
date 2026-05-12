import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { iconNames, ICON_WEIGHTS } from '@/utils/iconMap';

/* ============================================================
   META
   ============================================================ */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Button supports 4 variants, 2 sizes, loading/disabled states, Phosphor icons (left, right, icon-only), full-width, and dark mode. Use `iconLeftName` / `iconRightName` with any of the 1,512 Phosphor icon names.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      description: 'Visual style',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
      description: 'Height & padding scale',
      table: { defaultValue: { summary: 'medium' } },
    },
    iconLeftName: {
      control: 'select',
      options: ['none', ...iconNames],
      description: '🔍 Search & pick a Phosphor icon for the left slot',
      table: { category: 'Icons' },
    },
    iconRightName: {
      control: 'select',
      options: ['none', ...iconNames],
      description: '🔍 Search & pick a Phosphor icon for the right slot',
      table: { category: 'Icons' },
    },
    iconWeight: {
      control: 'select',
      options: ICON_WEIGHTS,
      description: 'Phosphor icon weight',
      table: { category: 'Icons', defaultValue: { summary: 'regular' } },
    },
    loading: {
      control: 'boolean',
      description: 'Shows spinner, disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches to fill container',
    },
    children: {
      control: 'text',
      description: 'Button label. Leave empty for icon-only.',
    },
    /* hide internal props from controls */
    iconLeft: { table: { disable: true } },
    iconRight: { table: { disable: true } },
  },
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'medium',
    iconLeftName: 'Plugs',
    iconRightName: 'none',
    iconWeight: 'regular',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ============================================================
   PLAYGROUND — fully interactive controls
   ============================================================ */
export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the **Controls** panel to try every combination. Pick any icon from the `iconLeftName` / `iconRightName` dropdowns (type to search).',
      },
    },
  },
};

/* ============================================================
   VARIANTS × SIZES (matches Figma matrix)
   ============================================================ */
export const AllVariantsMatrix: Story = {
  name: 'All Variants Matrix',
  render: () => {
    const variants = ['primary', 'secondary', 'tertiary', 'danger'] as const;
    const sizes = ['medium', 'small'] as const;
    const icons = ['Plugs', 'Plugs'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sizes.map((size, si) => (
          <div key={size}>
            <p style={{ font: 'var(--typography-body-xs-medium)', color: 'var(--color-font-tertiary)', marginBottom: 12, textTransform: 'capitalize' }}>
              {size}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {variants.map((variant) => (
                <Button
                  key={variant}
                  variant={variant}
                  size={size}
                  iconLeftName={icons[si]}
                  iconWeight="regular"
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ============================================================
   STATES
   ============================================================ */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['primary', 'secondary', 'tertiary', 'danger'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--typography-body-xs-medium)', color: 'var(--color-font-tertiary)', width: 72, textTransform: 'capitalize', flexShrink: 0 }}>
            {variant}
          </span>
          <Button variant={variant} size="medium" iconLeftName="Plugs" iconWeight="regular">Default</Button>
          <Button variant={variant} size="medium" iconLeftName="Plugs" iconWeight="regular" disabled>Disabled</Button>
          <Button variant={variant} size="medium" loading>Loading</Button>
          <Button variant={variant} size="small" iconLeftName="Plugs" iconWeight="regular">Small</Button>
          <Button variant={variant} size="small" iconLeftName="Plugs" iconWeight="regular" disabled>Disabled</Button>
          <Button variant={variant} size="small" loading>Loading</Button>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
   ICON WEIGHTS IN BUTTON
   ============================================================ */
export const IconWeights: Story = {
  name: 'Icon Weights',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {ICON_WEIGHTS.map((weight) => (
        <div key={weight} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ font: 'var(--typography-body-xs-medium)', color: 'var(--color-font-tertiary)', width: 72, flexShrink: 0 }}>
            {weight}
          </span>
          <Button variant="primary" iconLeftName="Plugs" iconWeight={weight}>Connect</Button>
          <Button variant="secondary" iconLeftName="ArrowRight" iconWeight={weight} iconRightName="none">Navigate</Button>
          <Button variant="tertiary" iconLeftName="MagnifyingGlass" iconWeight={weight}>Search</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'All 6 Phosphor icon weights applied to the same button.' },
    },
  },
};

/* ============================================================
   ICON POSITIONS
   ============================================================ */
export const IconLeft: Story = {
  name: 'Icon / Left',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" size="medium" iconLeftName="Plugs">Connect</Button>
      <Button variant="secondary" size="medium" iconLeftName="Plus">Add endpoint</Button>
      <Button variant="tertiary" size="medium" iconLeftName="ArrowRight">Learn more</Button>
      <Button variant="primary" size="small" iconLeftName="Plugs">Connect</Button>
      <Button variant="secondary" size="small" iconLeftName="Plus">Add</Button>
    </div>
  ),
};

export const IconRight: Story = {
  name: 'Icon / Right',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" size="medium" iconRightName="ArrowRight">Continue</Button>
      <Button variant="secondary" size="medium" iconRightName="ArrowRight">Next step</Button>
      <Button variant="tertiary" size="medium" iconRightName="ArrowUpRight">Open docs</Button>
      <Button variant="primary" size="small" iconRightName="ArrowRight">Go</Button>
    </div>
  ),
};

export const BothIcons: Story = {
  name: 'Icon / Both',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" size="medium" iconLeftName="Plugs" iconRightName="ArrowRight">Connect & go</Button>
      <Button variant="secondary" size="medium" iconLeftName="MagnifyingGlass" iconRightName="X">Search</Button>
      <Button variant="primary" size="small" iconLeftName="Plugs" iconRightName="ArrowRight">Connect</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: 'Icon / Only (square)',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary" size="medium" iconLeftName="Plus" aria-label="Add" />
      <Button variant="secondary" size="medium" iconLeftName="Plus" aria-label="Add" />
      <Button variant="tertiary" size="medium" iconLeftName="Plus" aria-label="Add" />
      <Button variant="danger" size="medium" iconLeftName="Trash" aria-label="Delete" />
      <Button variant="primary" size="small" iconLeftName="Plus" aria-label="Add" />
      <Button variant="secondary" size="small" iconLeftName="MagnifyingGlass" aria-label="Search" />
      <Button variant="tertiary" size="small" iconLeftName="DotsThree" aria-label="More" />
      <Button variant="danger" size="small" iconLeftName="Trash" aria-label="Delete" />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Icon-only buttons are square. Always pass `aria-label` for accessibility.' },
    },
  },
};

/* ============================================================
   FULL WIDTH
   ============================================================ */
export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Button variant="primary" fullWidth iconLeftName="Plugs">Connect API</Button>
      <Button variant="secondary" fullWidth>Cancel</Button>
      <Button variant="danger" fullWidth iconLeftName="Trash">Delete workspace</Button>
    </div>
  ),
};

/* ============================================================
   EDGE CASES
   ============================================================ */
export const LongLabel: Story = {
  name: 'Edge / Long Label',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
      <Button variant="primary" iconLeftName="Plugs">Connect to a very long named API endpoint</Button>
      <Button variant="secondary" iconLeftName="Plugs">Connect to a very long named API endpoint</Button>
    </div>
  ),
};

export const LoadingStates: Story = {
  name: 'Edge / Loading All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary" size="medium" loading>Connecting</Button>
      <Button variant="secondary" size="medium" loading>Loading</Button>
      <Button variant="tertiary" size="medium" loading>Loading</Button>
      <Button variant="danger" size="medium" loading>Deleting</Button>
      <Button variant="primary" size="small" loading>Connecting</Button>
      <Button variant="secondary" size="small" loading>Loading</Button>
    </div>
  ),
};

export const AsSubmit: Story = {
  name: 'Edge / Submit Form',
  render: () => (
    <form onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button type="submit" variant="primary" iconLeftName="Check">Submit</Button>
        <Button type="reset" variant="tertiary">Reset</Button>
      </div>
    </form>
  ),
};

/* ============================================================
   DARK MODE
   ============================================================ */
export const DarkMode: Story = {
  name: 'Dark Mode',
  render: () => (
    <div
      data-theme="dark"
      style={{
        background: 'var(--color-surface-ground)',
        padding: 24,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {(['primary', 'secondary', 'tertiary', 'danger'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ font: 'var(--typography-body-xs-medium)', color: 'var(--color-font-tertiary)', width: 72, textTransform: 'capitalize', flexShrink: 0 }}>
            {variant}
          </span>
          <Button variant={variant} size="medium" iconLeftName="Plugs" iconWeight="regular">Default</Button>
          <Button variant={variant} size="medium" disabled iconLeftName="Plugs">Disabled</Button>
          <Button variant={variant} size="medium" loading>Loading</Button>
          <Button variant={variant} size="small" iconLeftName="Plugs">Small</Button>
          <Button variant={variant} size="medium" iconLeftName="Plugs" aria-label="Icon only" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
