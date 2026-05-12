import type { Icon, IconWeight } from '@phosphor-icons/react';
import * as PhosphorIcons from '@phosphor-icons/react';

export type { IconWeight };

export type PhosphorIconName = string;

const EXCLUDED = new Set(['IconContext', 'IconBase', 'SSRBase', 'default']);

export const iconMap: Record<string, Icon> = Object.fromEntries(
  Object.entries(PhosphorIcons).filter(
    ([key, val]) => !EXCLUDED.has(key) && typeof val === 'function'
  )
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
