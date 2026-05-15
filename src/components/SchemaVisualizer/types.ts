/* =============================================================================
   SCHEMA VISUALIZER — Type definitions
   Supports JSON Schema draft-07 / OpenAPI 3.x
   ============================================================================= */

export interface JSONSchema {
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: Record<string, JSONSchema>;
  additionalProperties?: JSONSchema | boolean;
  items?: JSONSchema | JSONSchema[];
  required?: string[];
  enum?: unknown[];
  format?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  multipleOf?: number;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  default?: unknown;
  example?: unknown;
  examples?: Record<string, unknown>;
  $ref?: string;
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  /** Schema title used as the display name */
  $schema?: string;
}

/** A map of named schema definitions — the `definitions`, `$defs`, or `components/schemas` object. */
export type SchemaDefinitions = Record<string, JSONSchema>;

/** One entry in the breadcrumb navigation stack. */
export interface BreadcrumbEntry {
  /** Display label for this level (field name or schema title). */
  label: string;
  /** The resolved schema at this level. */
  schema: JSONSchema;
  /** Set of required field names at this level. */
  requiredFields: Set<string>;
  /** True when this level is an array's items object. */
  isArrayItems?: boolean;
}

/** A flattened node in the left-panel tree. */
export interface TreeNode {
  key: string;
  type: string;
  depth: number;
  /** Full path from root, e.g. ['ConsumerLoanRequest', 'applicantAddress', 'street'] */
  path: string[];
  hasChildren: boolean;
}

export type DataType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'enum'
  | 'null'
  | string;
