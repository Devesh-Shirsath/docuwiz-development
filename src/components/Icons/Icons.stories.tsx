import React, { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { iconMap, iconNames, ICON_WEIGHTS } from '@/utils/iconMap';
import type { IconWeight } from '@/utils/iconMap';
import styles from './Icons.module.css';

/* ============================================================
   ICON GALLERY COMPONENT
   ============================================================ */
interface IconGalleryProps {
  weight: IconWeight;
  size: number;
}

const IconGallery = ({ weight, size }: IconGalleryProps) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      search.trim()
        ? iconNames.filter((n) =>
            n.toLowerCase().includes(search.toLowerCase())
          )
        : iconNames,
    [search]
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Phosphor Icons</h1>
        <p className={styles.meta}>
          {filtered.length} of {iconNames.length} icons · weight:{' '}
          <strong>{weight}</strong> · size: <strong>{size}px</strong>
        </p>
        <input
          className={styles.search}
          type="search"
          placeholder="Search icons…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No icons match "{search}"</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((name) => {
            const IconComponent = iconMap[name];
            return (
              <button
                key={name}
                className={styles.tile}
                title={name}
                onClick={() => {
                  navigator.clipboard?.writeText(name);
                }}
              >
                <IconComponent weight={weight} size={size} />
                <span className={styles.name}>{name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   WEIGHT SHOWCASE
   ============================================================ */
const WeightShowcase = ({ iconName, size }: { iconName: string; size: number }) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return <p>Icon "{iconName}" not found.</p>;

  return (
    <div className={styles.weightsPage}>
      <h2 className={styles.heading}>Weight Variants — {iconName}</h2>
      <div className={styles.weightGrid}>
        {ICON_WEIGHTS.map((w) => (
          <div key={w} className={styles.weightTile}>
            <IconComponent weight={w} size={size} />
            <span className={styles.weightLabel}>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   META
   ============================================================ */
const meta: Meta = {
  title: 'Components/Icons',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Phosphor Icons** — 1,512 icons across 6 weights. All icons are available in any component that accepts \`iconLeftName\` / \`iconRightName\`.

**Picking a weight**

| Weight | When to use |
|---|---|
| **regular** | Default for most UI contexts |
| **bold** | Small sizes (≤14px), dense toolbars |
| **light** | Large decorative icons, empty states |
| **fill** | Active/selected states, toggle indicators |
| **duotone** | Illustrations, feature spotlights |
| **thin** | Rare — very large display icons only |

Click any icon tile to copy its name to clipboard, then paste it into any icon prop.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ============================================================
   STORIES
   ============================================================ */
export const Gallery: Story = {
  name: 'Gallery (all 1512)',
  args: {
    weight: 'regular',
    size: 24,
  },
  argTypes: {
    weight: {
      control: 'select',
      options: ICON_WEIGHTS,
      description: 'Phosphor icon weight',
    },
    size: {
      control: { type: 'range', min: 16, max: 48, step: 4 },
      description: 'Icon size in px',
    },
  },
  render: (args) => (
    <IconGallery weight={args.weight as IconWeight} size={args.size as number} />
  ),
};

export const WeightVariants: Story = {
  name: 'Weight Variants',
  args: {
    iconName: 'Plugs',
    size: 32,
  },
  argTypes: {
    iconName: {
      control: 'select',
      options: iconNames,
      description: 'Pick any Phosphor icon',
    },
    size: {
      control: { type: 'range', min: 16, max: 64, step: 4 },
    },
  },
  render: (args) => (
    <WeightShowcase iconName={args.iconName as string} size={args.size as number} />
  ),
};
