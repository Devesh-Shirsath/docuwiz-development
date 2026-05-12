import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/* --- Sample icons (inline SVG, no icon lib dependency) --- */
const IconPlug = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 2v3M10 2v3M4 5h8a1 1 0 0 1 1 1v2a5 5 0 0 1-10 0V6a1 1 0 0 1 1-1zM8 13v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 4h10M6 4V3h4v1M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SmallIconPlug = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 2v3M10 2v3M4 5h8a1 1 0 0 1 1 1v2a5 5 0 0 1-10 0V6a1 1 0 0 1 1-1zM8 13v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
          'The Button component supports 4 variants (primary, secondary, tertiary, danger), 2 sizes (medium, small), and multiple states including loading, disabled, icon-left, icon-right, icon-only, and full-width.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['medium', 'small'],
      description: 'Height and padding scale',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches button to fill its container',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'medium',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ============================================================
   INTERACTIVE PLAYGROUND
   ============================================================ */
export const Playground: Story = {
  args: {
    children: 'Primary Button',
    iconLeft: <IconPlug />,
  },
};

/* ============================================================
   VARIANTS — MEDIUM
   ============================================================ */
export const PrimaryMedium: Story = {
  name: 'Primary / Medium',
  args: { variant: 'primary', size: 'medium', children: 'Primary Button', iconLeft: <IconPlug /> },
};

export const SecondaryMedium: Story = {
  name: 'Secondary / Medium',
  args: { variant: 'secondary', size: 'medium', children: 'Primary Button', iconLeft: <IconPlug /> },
};

export const TertiaryMedium: Story = {
  name: 'Tertiary / Medium',
  args: { variant: 'tertiary', size: 'medium', children: 'Primary Button', iconLeft: <IconPlug /> },
};

export const DangerMedium: Story = {
  name: 'Danger / Medium',
  args: { variant: 'danger', size: 'medium', children: 'Delete', iconLeft: <IconTrash /> },
};

/* ============================================================
   VARIANTS — SMALL
   ============================================================ */
export const PrimarySmall: Story = {
  name: 'Primary / Small',
  args: { variant: 'primary', size: 'small', children: 'Primary Button', iconLeft: <SmallIconPlug /> },
};

export const SecondarySmall: Story = {
  name: 'Secondary / Small',
  args: { variant: 'secondary', size: 'small', children: 'Primary Button', iconLeft: <SmallIconPlug /> },
};

export const TertiarySmall: Story = {
  name: 'Tertiary / Small',
  args: { variant: 'tertiary', size: 'small', children: 'Primary Button', iconLeft: <SmallIconPlug /> },
};

export const DangerSmall: Story = {
  name: 'Danger / Small',
  args: { variant: 'danger', size: 'small', children: 'Delete', iconLeft: <SmallIconPlug /> },
};

/* ============================================================
   STATES
   ============================================================ */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" disabled iconLeft={<IconPlug />}>Primary</Button>
      <Button variant="secondary" disabled iconLeft={<IconPlug />}>Secondary</Button>
      <Button variant="tertiary" disabled iconLeft={<IconPlug />}>Tertiary</Button>
      <Button variant="danger" disabled iconLeft={<IconTrash />}>Danger</Button>
    </div>
  ),
  parameters: { docs: { description: { story: 'All variants in disabled state (opacity 0.4).' } } },
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" loading>Connecting</Button>
      <Button variant="secondary" loading>Loading</Button>
      <Button variant="tertiary" loading>Loading</Button>
      <Button variant="danger" loading>Deleting</Button>
    </div>
  ),
  parameters: { docs: { description: { story: 'Loading state shows a spinning indicator and disables interaction.' } } },
};

/* ============================================================
   ICON POSITIONS
   ============================================================ */
export const IconLeft: Story = {
  name: 'Icon / Left',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" size="medium" iconLeft={<IconPlug />}>Connect</Button>
      <Button variant="secondary" size="medium" iconLeft={<IconPlus />}>Add endpoint</Button>
      <Button variant="tertiary" size="medium" iconLeft={<IconArrow />}>Learn more</Button>
    </div>
  ),
};

export const IconRight: Story = {
  name: 'Icon / Right',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary" size="medium" iconRight={<IconArrow />}>Continue</Button>
      <Button variant="secondary" size="medium" iconRight={<IconArrow />}>Next step</Button>
      <Button variant="tertiary" size="medium" iconRight={<IconArrow />}>See all</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: 'Icon / Only',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary" size="medium" iconLeft={<IconPlus />} aria-label="Add" />
      <Button variant="secondary" size="medium" iconLeft={<IconPlus />} aria-label="Add" />
      <Button variant="tertiary" size="medium" iconLeft={<IconPlus />} aria-label="Add" />
      <Button variant="danger" size="medium" iconLeft={<IconTrash />} aria-label="Delete" />
      <Button variant="primary" size="small" iconLeft={<SmallIconPlug />} aria-label="Connect" />
      <Button variant="secondary" size="small" iconLeft={<SmallIconPlug />} aria-label="Connect" />
    </div>
  ),
  parameters: { docs: { description: { story: 'Icon-only buttons are square. Always provide `aria-label` for accessibility.' } } },
};

/* ============================================================
   FULL WIDTH
   ============================================================ */
export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Button variant="primary" fullWidth iconLeft={<IconPlug />}>Connect API</Button>
      <Button variant="secondary" fullWidth>Cancel</Button>
    </div>
  ),
  parameters: { docs: { description: { story: 'Stretches to fill the parent container. Common in mobile layouts and modals.' } } },
};

/* ============================================================
   ALL VARIANTS MATRIX (matches Figma spec)
   ============================================================ */
export const AllVariants: Story = {
  name: 'All Variants Matrix',
  render: () => {
    const variants = ['primary', 'secondary', 'tertiary', 'danger'] as const;
    const sizes = ['medium', 'small'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sizes.map((size) => (
          <div key={size}>
            <p style={{ font: 'var(--typography-body-xs-medium)', color: 'var(--color-font-tertiary)', marginBottom: 12, textTransform: 'capitalize' }}>{size}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {variants.map((variant) => (
                <Button key={variant} variant={variant} size={size} iconLeft={variant === 'danger' ? <IconTrash /> : <IconPlug />}>
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
   EDGE CASES
   ============================================================ */
export const LongLabel: Story = {
  name: 'Edge / Long Label',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
      <Button variant="primary" iconLeft={<IconPlug />}>
        Connect to a very long named API endpoint
      </Button>
      <Button variant="secondary" iconLeft={<IconPlug />}>
        Connect to a very long named API endpoint
      </Button>
    </div>
  ),
  parameters: { docs: { description: { story: 'Long labels wrap inside the button. Use `fullWidth` + fixed container to prevent overflow.' } } },
};

export const NoLabel: Story = {
  name: 'Edge / No Label (icon only)',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary" iconLeft={<IconPlus />} aria-label="Add item" />
      <Button variant="secondary" iconLeft={<IconPlus />} aria-label="Add item" />
      <Button variant="primary" size="small" iconLeft={<SmallIconPlug />} aria-label="Connect" />
    </div>
  ),
};

export const BothIcons: Story = {
  name: 'Edge / Both Icons',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary" iconLeft={<IconPlug />} iconRight={<IconArrow />}>Connect & go</Button>
      <Button variant="secondary" size="small" iconLeft={<SmallIconPlug />} iconRight={<IconArrow />}>Connect</Button>
    </div>
  ),
};

export const AsSubmit: Story = {
  name: 'Edge / Submit Type',
  render: () => (
    <form onSubmit={(e) => { e.preventDefault(); alert('submitted'); }}>
      <Button type="submit" variant="primary">Submit Form</Button>
    </form>
  ),
  parameters: { docs: { description: { story: 'Use `type="submit"` inside forms. The button forwards all native button attributes.' } } },
};

export const LoadingAllSizes: Story = {
  name: 'Edge / Loading All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="primary" size="medium" loading>Connecting</Button>
      <Button variant="primary" size="small" loading>Connecting</Button>
      <Button variant="secondary" size="medium" loading>Loading</Button>
      <Button variant="secondary" size="small" loading>Loading</Button>
    </div>
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
        <div key={variant} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant={variant} size="medium" iconLeft={<IconPlug />}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
          <Button variant={variant} size="medium" iconLeft={<IconPlug />} disabled>
            Disabled
          </Button>
          <Button variant={variant} size="medium" loading>
            Loading
          </Button>
          <Button variant={variant} size="small" iconLeft={<SmallIconPlug />}>
            Small
          </Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { description: { story: 'All variants in dark mode. Uses `[data-theme="dark"]` on the container.' } },
  },
};
