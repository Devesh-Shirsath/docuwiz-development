import type { Icon, IconWeight } from '@phosphor-icons/react';
import * as PhosphorIcons from '@phosphor-icons/react';

export type { IconWeight };

export type PhosphorIconName = string;

const EXCLUDED = new Set(['IconContext', 'IconBase', 'SSRBase', 'SSR', 'default']);

export const iconMap: Record<string, Icon> = Object.fromEntries(
  Object.entries(PhosphorIcons).filter(([key, val]) => {
    if (EXCLUDED.has(key)) return false;
    if (key.endsWith('Icon')) return false; // skip *Icon aliases
    // Phosphor icons are forwardRef objects — require displayName ending in "Icon"
    const v = val as { displayName?: string };
    return typeof v?.displayName === 'string' && v.displayName.endsWith('Icon');
  })
) as Record<string, Icon>;

export const iconNames: PhosphorIconName[] = Object.keys(iconMap).sort();

export const ICON_WEIGHTS: IconWeight[] = [
  'thin',
  'light',
  'regular',
  'bold',
  'fill',
  'duotone',
];
