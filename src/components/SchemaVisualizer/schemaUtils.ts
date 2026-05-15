import type { JSONSchema, SchemaDefinitions, TreeNode } from './types';

/* ---------------------------------------------------------------------------
   $ref resolution
   Supports: #/definitions/Foo  #/$defs/Foo  #/components/schemas/Foo
   --------------------------------------------------------------------------- */
export function resolveRef(ref: string, defs: SchemaDefinitions): JSONSchema | null {
  // Last path segment is always the definition key in OpenAPI / JSON Schema
  const key = ref.split('/').pop();
  if (key && defs[key]) return defs[key];
  return null;
}

export function resolveSchema(schema: JSONSchema, defs: SchemaDefinitions): JSONSchema {
  if (!schema) return {};
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, defs);
    if (resolved) return resolveSchema(resolved, defs);
    return schema;
  }
  // Flatten single-entry allOf (common in OpenAPI tooling)
  if (schema.allOf?.length === 1) {
    const { allOf, ...rest } = schema;
    return resolveSchema({ ...allOf[0], ...rest }, defs);
  }
  return schema;
}

/* ---------------------------------------------------------------------------
   Type inference
   --------------------------------------------------------------------------- */
export function getEffectiveType(schema: JSONSchema): string {
  if (schema.enum) return 'enum';
  const raw = Array.isArray(schema.type) ? schema.type.find(t => t !== 'null') ?? schema.type[0] : schema.type;
  if (raw) return raw;
  if (schema.properties || schema.allOf || schema.anyOf || schema.oneOf) return 'object';
  if (schema.items) return 'array';
  return 'string';
}

/* ---------------------------------------------------------------------------
   Constraint chips  — all schema keywords that help consumers understand
   the shape of valid values.
   --------------------------------------------------------------------------- */
export function getConstraintChips(schema: JSONSchema): string[] {
  const c: string[] = [];

  if (schema.format)                              c.push(`format: ${schema.format}`);
  if (schema.minimum    !== undefined)            c.push(`minimum: ${schema.minimum}`);
  if (schema.maximum    !== undefined)            c.push(`maximum: ${schema.maximum}`);
  if (typeof schema.exclusiveMinimum === 'number') c.push(`exclusiveMin: ${schema.exclusiveMinimum}`);
  if (typeof schema.exclusiveMaximum === 'number') c.push(`exclusiveMax: ${schema.exclusiveMaximum}`);
  if (schema.minLength  !== undefined)            c.push(`minLength: ${schema.minLength}`);
  if (schema.maxLength  !== undefined)            c.push(`maxLength: ${schema.maxLength}`);
  if (schema.pattern)                             c.push(`pattern: ${schema.pattern}`);
  if (schema.multipleOf !== undefined)            c.push(`multipleOf: ${schema.multipleOf}`);
  if (schema.minItems   !== undefined)            c.push(`minItems: ${schema.minItems}`);
  if (schema.maxItems   !== undefined)            c.push(`maxItems: ${schema.maxItems}`);
  if (schema.uniqueItems)                         c.push('uniqueItems');
  if (schema.readOnly)                            c.push('readOnly');
  if (schema.writeOnly)                           c.push('writeOnly');
  if (schema.nullable)                            c.push('nullable');
  if (schema.deprecated)                          c.push('deprecated');
  if (schema.default   !== undefined)             c.push(`default: ${JSON.stringify(schema.default)}`);
  if (schema.example   !== undefined)             c.push(`example: ${JSON.stringify(schema.example)}`);
  if (schema.enum) {
    schema.enum.forEach(v => c.push(JSON.stringify(v)));
  }

  return c;
}

/* ---------------------------------------------------------------------------
   Example JSON generation
   --------------------------------------------------------------------------- */
export function generateExample(schema: JSONSchema, defs: SchemaDefinitions, depth = 0): unknown {
  if (depth > 6) return null;
  const s = resolveSchema(schema, defs);

  if (s.example !== undefined) return s.example;

  const type = getEffectiveType(s);

  switch (type) {
    case 'string': {
      if (s.enum) return s.enum[0];
      const fmt = s.format;
      if (fmt === 'date-time')  return '2024-01-01T00:00:00Z';
      if (fmt === 'date')       return '2024-01-01';
      if (fmt === 'time')       return '12:00:00';
      if (fmt === 'email')      return 'user@example.com';
      if (fmt === 'uuid')       return '123e4567-e89b-12d3-a456-426614174000';
      if (fmt === 'uri')        return 'https://example.com';
      if (fmt === 'ipv4')       return '192.168.1.1';
      if (fmt === 'hostname')   return 'example.com';
      if (fmt === 'byte')       return 'c3RyaW5n';
      if (fmt === 'binary')     return '<binary>';
      return s.title?.toLowerCase().replace(/\s+/g, '_') ?? 'string';
    }
    case 'number':  return 0;
    case 'integer': return 0;
    case 'boolean': return true;
    case 'null':    return null;
    case 'enum':    return s.enum?.[0] ?? null;
    case 'array': {
      const itemSchema = Array.isArray(s.items) ? s.items[0] : s.items;
      return itemSchema ? [generateExample(itemSchema, defs, depth + 1)] : [];
    }
    case 'object': {
      const result: Record<string, unknown> = {};
      if (s.properties) {
        for (const [k, v] of Object.entries(s.properties)) {
          result[k] = generateExample(v, defs, depth + 1);
        }
      }
      return result;
    }
    default: return null;
  }
}

/* ---------------------------------------------------------------------------
   Flat tree builder for the left panel
   --------------------------------------------------------------------------- */
export function buildFlatTree(
  schema: JSONSchema,
  defs: SchemaDefinitions,
  key: string,
  depth: number,
  parentPath: string[],
  out: TreeNode[],
): void {
  const s = resolveSchema(schema, defs);
  const type = getEffectiveType(s);
  const path = [...parentPath, key];

  // Determine if this node has navigable children
  let hasChildren = false;
  if (type === 'object' && s.properties && Object.keys(s.properties).length > 0) {
    hasChildren = true;
  } else if (type === 'array') {
    const items = Array.isArray(s.items) ? s.items[0] : s.items;
    if (items) {
      const itemsResolved = resolveSchema(items, defs);
      if (getEffectiveType(itemsResolved) === 'object' && itemsResolved.properties) {
        hasChildren = true;
      }
    }
  }

  out.push({ key, type, depth, path, hasChildren });

  // Recurse into children
  if (type === 'object' && s.properties) {
    for (const [propKey, propSchema] of Object.entries(s.properties)) {
      buildFlatTree(propSchema, defs, propKey, depth + 1, path, out);
    }
  } else if (type === 'array') {
    const items = Array.isArray(s.items) ? s.items[0] : s.items;
    if (items) {
      const itemsResolved = resolveSchema(items, defs);
      if (getEffectiveType(itemsResolved) === 'object' && itemsResolved.properties) {
        for (const [propKey, propSchema] of Object.entries(itemsResolved.properties)) {
          buildFlatTree(propSchema, defs, propKey, depth + 1, path, out);
        }
      }
    }
  }
}

/* ---------------------------------------------------------------------------
   Schema helpers
   --------------------------------------------------------------------------- */
export function getSchemaTitle(schema: JSONSchema, fallback: string): string {
  return schema.title ?? fallback;
}

/** Get the object/items schema when navigating "into" a field. */
export function getNavigableSchema(schema: JSONSchema, defs: SchemaDefinitions): JSONSchema | null {
  const s = resolveSchema(schema, defs);
  const type = getEffectiveType(s);
  if (type === 'object') return s;
  if (type === 'array') {
    const items = Array.isArray(s.items) ? s.items[0] : s.items;
    if (!items) return null;
    const resolved = resolveSchema(items, defs);
    if (getEffectiveType(resolved) === 'object') return resolved;
  }
  return null;
}
