import React, { useMemo, useState } from 'react';
import {
  SidebarSimple,
  Article,
  TextAlignCenter,
  CaretDown,
  CaretRight,
  ArrowRight,
  TreeStructure,
} from '@phosphor-icons/react';
import { DataTypeIcon } from './DataTypeIcon';
import {
  resolveSchema,
  getEffectiveType,
  getConstraintChips,
  generateExample,
  buildFlatTree,
  getNavigableSchema,
} from './schemaUtils';
import type { BreadcrumbEntry, JSONSchema, SchemaDefinitions, TreeNode } from './types';
import styles from './SchemaVisualizer.module.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────────────────────────────────────── */

export interface SchemaVisualizerProps {
  /**
   * The root JSON Schema object to visualise.
   * Accepts JSON Schema draft-07 or OpenAPI 3.x schema objects.
   */
  schema: JSONSchema;
  /**
   * Named schema definitions for `$ref` resolution.
   * Pass the contents of `components.schemas`, `definitions`, or `$defs`.
   */
  definitions?: SchemaDefinitions;
  /** Display name for the root schema (used in breadcrumb and header). */
  schemaName?: string;
  /** The MIME type shown in the left-panel header dropdown. */
  contentType?: string;
  /** Initial tab. Defaults to "schema". */
  defaultTab?: 'schema' | 'example';
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Breadcrumb bar
   ───────────────────────────────────────────────────────────────────────────── */
interface BreadcrumbBarProps {
  entries: BreadcrumbEntry[];
  onNavigate: (index: number) => void;
}

function BreadcrumbBar({ entries, onNavigate }: BreadcrumbBarProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Schema navigation">
      {entries.map((entry, i) => {
        const isCurrent = i === entries.length - 1;
        const Icon = i === 0 ? Article : TextAlignCenter;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className={styles.breadcrumbSep} aria-hidden>
                <CaretDown size={12} weight="bold" />
              </span>
            )}
            <button
              type="button"
              className={[
                styles.breadcrumbItem,
                isCurrent ? styles.breadcrumbItemCurrent : '',
              ].join(' ')}
              onClick={() => !isCurrent && onNavigate(i)}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <span className={styles.breadcrumbIcon}>
                <Icon size={12} weight="bold" />
              </span>
              {entry.label.toUpperCase()}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Left-panel tree
   ───────────────────────────────────────────────────────────────────────────── */
interface SchemaTreeProps {
  nodes: TreeNode[];
  contentType: string;
  currentPath: string[];
  collapsedPaths: Set<string>;
  onToggleCollapse: (pathKey: string) => void;
  onNodeClick: (node: TreeNode) => void;
}

function SchemaTree({
  nodes,
  contentType,
  currentPath,
  collapsedPaths,
  onToggleCollapse,
  onNodeClick,
}: SchemaTreeProps) {
  /** Check whether a node is an ancestor of the current breadcrumb path */
  const isOnPath = (nodePath: string[]) => {
    if (nodePath.length > currentPath.length) return false;
    return nodePath.every((seg, i) => seg === currentPath[i]);
  };

  const isCurrent = (nodePath: string[]) =>
    nodePath.length === currentPath.length &&
    nodePath.every((seg, i) => seg === currentPath[i]);

  /** Determine if a node should be hidden (an ancestor is collapsed) */
  const isHidden = (node: TreeNode): boolean => {
    for (let d = 1; d < node.path.length; d++) {
      const ancestorKey = node.path.slice(0, d).join('\0');
      if (collapsedPaths.has(ancestorKey)) return true;
    }
    return false;
  };

  return (
    <div className={styles.tree}>
      {/* Header: content type selector */}
      <div className={styles.treeHeader}>
        <span className={styles.treeHeaderIcon}>
          <TreeStructure size={14} />
        </span>
        <span className={styles.contentTypeLabel}>{contentType}</span>
        <span className={styles.treeHeaderCaret}>
          <CaretDown size={12} />
        </span>
      </div>

      <div className={styles.treeList} role="tree" aria-label="Schema tree">
        {nodes.map((node) => {
          if (isHidden(node)) return null;

          const pathKey = node.path.join('\0');
          const isCollapsed = collapsedPaths.has(pathKey);
          const active = isCurrent(node.path);
          const onPath = isOnPath(node.path);

          const indent = 16 + node.depth * 22;

          return (
            <button
              key={pathKey}
              type="button"
              role="treeitem"
              aria-expanded={node.hasChildren ? !isCollapsed : undefined}
              className={[
                styles.treeRow,
                active ? styles.treeRowActive : '',
                !active && onPath ? styles.treeRowOnPath : '',
              ].join(' ')}
              style={{ paddingLeft: indent }}
              onClick={() => {
                if (node.hasChildren) {
                  onToggleCollapse(pathKey);
                }
                onNodeClick(node);
              }}
            >
              {/* Expand / collapse caret */}
              {node.hasChildren && (
                <span
                  className={[
                    styles.treeCaret,
                    !isCollapsed ? styles.treeCaretExpanded : '',
                  ].join(' ')}
                  style={{ left: indent - 14 }}
                  aria-hidden
                >
                  <CaretRight size={10} weight="bold" />
                </span>
              )}

              {/* Type icon */}
              <span className={styles.treeIcon}>
                <DataTypeIcon type={node.type} size={14} />
              </span>

              {/* Field name */}
              <span className={styles.treeLabel}>{node.key}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Single field row (right panel)
   ───────────────────────────────────────────────────────────────────────────── */
interface FieldRowProps {
  fieldName: string;
  schema: JSONSchema;
  defs: SchemaDefinitions;
  required: boolean;
  onViewProperties: () => void;
}

function FieldRow({ fieldName, schema, defs, required, onViewProperties }: FieldRowProps) {
  const resolved = resolveSchema(schema, defs);
  const type = getEffectiveType(resolved);
  const chips = getConstraintChips(resolved);
  const navigable = getNavigableSchema(resolved, defs);

  const typeLabel = type === 'array'
    ? (() => {
        const items = Array.isArray(resolved.items) ? resolved.items[0] : resolved.items;
        if (items) {
          const itemsResolved = resolveSchema(items, defs);
          const itemType = getEffectiveType(itemsResolved);
          return `array[${itemType}]`;
        }
        return 'array';
      })()
    : type;

  return (
    <div className={styles.fieldRow}>
      {/* Name + type + required */}
      <div className={styles.fieldTop}>
        <span className={styles.fieldIcon}>
          <DataTypeIcon type={type} size={18} />
        </span>
        <div className={styles.fieldMeta}>
          <span className={styles.fieldName}>{fieldName}</span>
          <span className={styles.fieldType}>{typeLabel}</span>
          {required && <span className={styles.fieldRequired}>*</span>}
        </div>
      </div>

      {/* Description */}
      {resolved.description && (
        <p className={styles.fieldDesc}>{resolved.description}</p>
      )}

      {/* Constraint chips */}
      {chips.length > 0 && (
        <div className={styles.chipsRow} aria-label="Constraints">
          {chips.map((chip, i) => (
            <span key={i} className={styles.chip}>{chip}</span>
          ))}
        </div>
      )}

      {/* View Properties (object / array-of-objects) */}
      {navigable && (
        <div>
          <button
            type="button"
            className={styles.viewProps}
            onClick={onViewProperties}
          >
            View Properties
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main SchemaVisualizer
   ───────────────────────────────────────────────────────────────────────────── */
export function SchemaVisualizer({
  schema,
  definitions = {},
  schemaName = 'Schema',
  contentType = 'application/json',
  defaultTab = 'schema',
  className,
}: SchemaVisualizerProps) {
  /* ── State ──────────────────────────────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'schema' | 'example'>(defaultTab);
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());

  // Breadcrumb: stack of nav entries. Starts at root schema.
  const rootResolved = resolveSchema(schema, definitions);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbEntry[]>([
    {
      label: schemaName,
      schema: rootResolved,
      requiredFields: new Set(rootResolved.required ?? []),
    },
  ]);

  /* ── Derived data ───────────────────────────────────────────────────────── */
  const current = breadcrumb[breadcrumb.length - 1];
  const currentSchema = current.schema;
  const currentRequired = current.requiredFields;

  const currentType = getEffectiveType(currentSchema);
  const properties = currentSchema.properties ?? {};

  // Build flat tree nodes once
  const treeNodes = useMemo<TreeNode[]>(() => {
    const out: TreeNode[] = [];
    buildFlatTree(rootResolved, definitions, schemaName, 0, [], out);
    return out;
  }, [rootResolved, definitions, schemaName]);

  // Current path in terms of the tree (last breadcrumb path)
  const currentTreePath = breadcrumb.map(e => e.label);

  /* ── Example JSON ───────────────────────────────────────────────────────── */
  const exampleJson = useMemo(
    () => JSON.stringify(generateExample(currentSchema, definitions), null, 2),
    [currentSchema, definitions]
  );

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const handleNavigateTo = (index: number) => {
    setBreadcrumb(prev => prev.slice(0, index + 1));
  };

  const handleViewProperties = (fieldName: string, fieldSchema: JSONSchema) => {
    const resolved = resolveSchema(fieldSchema, definitions);
    const navTarget = getNavigableSchema(resolved, definitions);
    if (!navTarget) return;

    const type = getEffectiveType(resolved);
    const label = type === 'array' ? `${fieldName}[]` : fieldName;

    setBreadcrumb(prev => [
      ...prev,
      {
        label,
        schema: navTarget,
        requiredFields: new Set(navTarget.required ?? []),
        isArrayItems: type === 'array',
      },
    ]);
  };

  const handleTreeNodeClick = (node: TreeNode) => {
    // Navigate breadcrumb to the clicked node's path
    if (node.path.length === 0) return;

    // Walk down from root schema to reconstruct breadcrumb
    let currentS = rootResolved;
    const newBreadcrumb: BreadcrumbEntry[] = [
      {
        label: schemaName,
        schema: rootResolved,
        requiredFields: new Set(rootResolved.required ?? []),
      },
    ];

    for (let i = 1; i < node.path.length; i++) {
      const key = node.path[i];
      const prop = currentS.properties?.[key];
      if (!prop) break;

      const resolved = resolveSchema(prop, definitions);
      const nav = getNavigableSchema(resolved, definitions);
      if (!nav) break;

      const type = getEffectiveType(resolved);
      newBreadcrumb.push({
        label: type === 'array' ? `${key}[]` : key,
        schema: nav,
        requiredFields: new Set(nav.required ?? []),
        isArrayItems: type === 'array',
      });
      currentS = nav;
    }

    setBreadcrumb(newBreadcrumb);
  };

  const handleToggleCollapse = (pathKey: string) => {
    setCollapsedPaths(prev => {
      const next = new Set(prev);
      if (next.has(pathKey)) next.delete(pathKey);
      else next.add(pathKey);
      return next;
    });
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>

      {/* ── Left: tree panel ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <SchemaTree
          nodes={treeNodes}
          contentType={contentType}
          currentPath={currentTreePath}
          collapsedPaths={collapsedPaths}
          onToggleCollapse={handleToggleCollapse}
          onNodeClick={handleTreeNodeClick}
        />
      )}

      {/* ── Right: content panel ─────────────────────────────────────────── */}
      <div className={styles.content}>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          {/* Sidebar toggle */}
          <button
            type="button"
            className={styles.toolbarToggle}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <SidebarSimple size={14} />
          </button>

          {/* Breadcrumb */}
          <BreadcrumbBar entries={breadcrumb} onNavigate={handleNavigateTo} />

          {/* Schema / Example toggle */}
          <div className={styles.segmented}>
            <div className={styles.segmentedInner}>
              <button
                type="button"
                className={[styles.segmentBtn, activeTab === 'schema' ? styles.segmentBtnActive : ''].join(' ')}
                onClick={() => setActiveTab('schema')}
              >
                Schema
              </button>
              <button
                type="button"
                className={[styles.segmentBtn, activeTab === 'example' ? styles.segmentBtnActive : ''].join(' ')}
                onClick={() => setActiveTab('example')}
              >
                Example
              </button>
            </div>
          </div>
        </div>

        {/* ── Schema tab ─────────────────────────────────────────────────── */}
        {activeTab === 'schema' && (
          <div className={styles.schemaContent}>

            {/* Object header */}
            <div className={styles.schemaHeader}>
              <div className={styles.schemaHeaderIcon}>
                <DataTypeIcon type={currentType} size={20} />
              </div>
              <div className={styles.schemaHeaderMeta}>
                <div className={styles.schemaHeaderTitle}>
                  <span className={styles.schemaName}>{current.label}</span>
                  <span className={styles.schemaTypeLabel}>
                    {current.isArrayItems ? `array[object]` : currentType}
                  </span>
                </div>
                {currentSchema.description && (
                  <p className={styles.schemaHeaderDesc}>{currentSchema.description}</p>
                )}
              </div>
            </div>

            {/* Properties list */}
            {Object.keys(properties).length > 0 ? (
              <>
                <span className={styles.propertiesLabel}>Properties</span>
                <div role="list">
                  {Object.entries(properties).map(([key, fieldSchema]) => (
                    <div key={key} role="listitem">
                      <FieldRow
                        fieldName={key}
                        schema={fieldSchema}
                        defs={definitions}
                        required={currentRequired.has(key)}
                        onViewProperties={() => handleViewProperties(key, fieldSchema)}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                No properties defined at this level.
              </div>
            )}
          </div>
        )}

        {/* ── Example tab ────────────────────────────────────────────────── */}
        {activeTab === 'example' && (
          <div className={styles.exampleContent}>
            <pre className={styles.exampleCode}>{exampleJson}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
