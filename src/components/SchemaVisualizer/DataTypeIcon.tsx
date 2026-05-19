import React from 'react';
import {
  Hash,
  TextT,
  ToggleRight,
  ListNumbers,
  LadderSimple,
  TextIndent,
  CirclesFour,
  Intersect,
  Question,
} from '@phosphor-icons/react';
import type { DataType } from './types';

interface DataTypeIconProps {
  type: DataType;
  size?: number;
  className?: string;
}

/**
 * Renders the appropriate Phosphor icon for a given JSON Schema data type.
 *
 * | Type    | Icon          | Mnemonic                     |
 * |---------|---------------|------------------------------|
 * | number  | Hash          | # numeric                    |
 * | string  | TextT         | T for text                   |
 * | boolean | ToggleRight   | on/off toggle                |
 * | integer | ListNumbers   | numbered list                |
 * | array   | LadderSimple  | stacked rungs                |
 * | object  | TextIndent    | indented block               |
 * | enum    | CirclesFour   | fixed set of values          |
 */
export function DataTypeIcon({ type, size = 16, className }: DataTypeIconProps) {
  const props = { size, weight: 'regular' as const };

  switch (type) {
    case 'number':  return <Hash  {...props} className={className} />;
    case 'string':  return <TextT {...props} className={className} />;
    case 'boolean': return <ToggleRight {...props} className={className} />;
    case 'integer': return <ListNumbers {...props} className={className} />;
    case 'array':   return <LadderSimple {...props} className={className} />;
    case 'object':  return <TextIndent {...props} className={className} />;
    case 'enum':    return <CirclesFour {...props} className={className} />;
    case 'oneOf':
    case 'anyOf':   return <Intersect {...props} className={className} />;
    default:        return <Question {...props} className={className} />;
  }
}
