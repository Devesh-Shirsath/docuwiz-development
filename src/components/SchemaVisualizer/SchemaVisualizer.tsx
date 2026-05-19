import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  /** Normalized breadcrumb path ([] suffixes stripped). */
  breadcrumbKeys: string[];
  collapsedPaths: Set<string>;
  onToggleCollapse: (pathKey: string) => void;
  onNodeClick: (node: TreeNode) => void;
}

function SchemaTree({
  nodes,
  contentType,
  breadcrumbKeys,
  collapsedPaths,
  onToggleCollapse,
  onNodeClick,
}: SchemaTreeProps) {
  const isOnPath = (nodePath: string[]) => {
    if (nodePath.length > breadcrumbKeys.length) return false;
    return nodePath.every((seg, i) => seg === breadcrumbKeys[i]);
  };

  const isCurrent = (nodePath: string[]) =>
    nodePath.length === breadcrumbKeys.length &&
    nodePath.every((seg, i) => seg === breadcrumbKeys[i]);

  const isHidden = (node: TreeNode): boolean => {
    for (let d = 1; d < node.path.length; d++) {
      if (collapsedPaths.has(node.path.slice(0, d).join('\0'))) return true;
    }
    return false;
  };

  return (
    <div className={styles.tree}>
      {/* Header: content type */}
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
          const onPath = !active && isOnPath(node.path);
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
                onPath ? styles.treeRowOnPath : '',
              ].join(' ')}
              style={{ paddingLeft: indent }}
              onClick={() => onNodeClick(node)}
            >
              {/* Expand / collapse caret — separate click target */}
              {node.hasChildren && (
                <span
                  className={[
                    styles.treeCaret,
                    !isCollapsed ? styles.treeCaretExpanded : '',
                  ].join(' ')}
                  style={{ left: indent - 14 }}
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollapse(pathKey);
                  }}
                >
                  <CaretRight size={10} weight="bold" />
                </span>
              )}

              <span className={styles.treeIcon}>
                <DataTypeIcon type={node.type} size={14} />
              </span>
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

  // Human-readable type label
  const typeLabel = (() => {
    if (type === 'array') {
      const items = Array.isArray(resolved.items) ? resolved.items[0] : resolved.items;
      if (items) {
        const itemType = getEffectiveType(resolveSchema(items, defs));
        return `array[${itemType}]`;
      }
      return 'array';
    }
    if (type === 'oneOf') return resolved.oneOf?.map((s, i) => resolveSchema(s, defs).title ?? `option${i + 1}`).join(' | ') ?? 'oneOf';
    if (type === 'anyOf') return resolved.anyOf?.map((s, i) => resolveSchema(s, defs).title ?? `option${i + 1}`).join(' | ') ?? 'anyOf';
    return type;
  })();

  return (
    <div className={styles.fieldRow}>
      <div className={styles.fieldTop}>
        <span className={styles.fieldIcon}>
          <DataTypeIcon type={type} size={18} />
        </span>
        <div className={styles.fieldMeta}>
          <span className={styles.fieldName}>{fieldName}</span>
          <span className={styles.fieldType}>{typeLabel}</span>
          {required && <span className={styles.fieldRequired} title="Required">*</span>}
        </div>
      </div>

      {resolved.description && (
        <p className={styles.fieldDesc}>{resolved.description}</p>
      )}

      {chips.length > 0 && (
        <div className={styles.chipsRow} aria-label="Constraints">
          {chips.map((chip, i) => (
            <span key={i} className={styles.chip}>{chip}</span>
          ))}
        </div>
      )}

      {navigable && (
        <div>
          <button type="button" className={styles.viewProps} onClick={onViewProperties}>
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

  const rootResolved = useMemo(() => resolveSchema(schema, definitions), [schema, definitions]);

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbEntry[]>([
    {
      label: schemaName,
      schema: rootResolved,
      requiredFields: new Set(rootResolved.required ?? []),
    },
  ]);

  /* ── Scroll / highlight state ───────────────────────────────────────────── */
  /** Field key to scroll into view after the next render. */
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  /** Field key currently flashing with the highlight animation. */
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  /** Map of field key → DOM element for the field rows at the current level. */
  const fieldRefsMap = useRef<Record<string, HTMLElement | null>>({});
  /** Ref to the scrollable schema content div (for scroll-to-top). */
  const contentScrollRef = useRef<HTMLDivElement>(null);

  /* ── Scroll effect — runs after render when scrollTarget is set ─────────── */
  useEffect(() => {
    if (!scrollTarget) return;
    const el = fieldRefsMap.current[scrollTarget];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setHighlightedField(scrollTarget);
      setScrollTarget(null);
    }
  }, [scrollTarget, breadcrumb]); // re-check after breadcrumb change (new fields mounted)

  /* ── Highlight timeout — clear after animation completes ────────────────── */
  useEffect(() => {
    if (!highlightedField) return;
    const t = setTimeout(() => setHighlightedField(null), 2200);
    return () => clearTimeout(t);
  }, [highlightedField]);

  /* ── Derived data ───────────────────────────────────────────────────────── */
  const current = breadcrumb[breadcrumb.length - 1];
  const currentSchema = current.schema;
  const currentRequired = current.requiredFields;
  const currentType = getEffectiveType(currentSchema);
  const properties = currentSchema.properties ?? {};

  const treeNodes = useMemo<TreeNode[]>(() => {
    const out: TreeNode[] = [];
    buildFlatTree(rootResolved, definitions, schemaName, 0, [], out);
    return out;
  }, [rootResolved, definitions, schemaName]);

  /** Normalized breadcrumb path with [] suffixes stripped — used for tree highlight. */
  const breadcrumbKeys = useMemo(
    () => breadcrumb.map(e => e.label.replace(/\[\]$/, '')),
    [breadcrumb]
  );

  const exampleJson = useMemo(
    () => JSON.stringify(generateExample(currentSchema, definitions), null, 2),
    [currentSchema, definitions]
  );

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const handleNavigateTo = (index: number) => {
    setBreadcrumb(prev => prev.slice(0, index + 1));
  };

  /** View Properties → button: navigate INTO the field. */
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

  /**
   * Tree click: navigate breadcrumb to the PARENT of the clicked node,
   * then scroll the right panel to the clicked field.
   * This keeps the flat view stable — clicking the tree never opens an object
   * directly; it scrolls to it instead.
   */
  const handleTreeNodeClick = (node: TreeNode) => {
    const fieldKey = node.path[node.path.length - 1];

    // Clicking the root node → reset to root, scroll content to top
    if (node.path.length === 1) {
      setBreadcrumb([{
        label: schemaName,
        schema: rootResolved,
        requiredFields: new Set(rootResolved.required ?? []),
      }]);
      contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Walk the parent path to rebuild the breadcrumb up to (but not including) this node
    const parentPath = node.path.slice(0, -1); // e.g. ['Root', 'applicantAddress']
    let walkSchema = rootResolved;
    const newBreadcrumb: BreadcrumbEntry[] = [{
      label: schemaName,
      schema: rootResolved,
      requiredFields: new Set(rootResolved.required ?? []),
    }];

    for (let i = 1; i < parentPath.length; i++) {
      const key = parentPath[i];
      const prop = walkSchema.properties?.[key];
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
      walkSchema = nav;
    }

    // Navigate breadcrumb to parent level, then scroll to the clicked field
    setBreadcrumb(newBreadcrumb);
    setScrollTarget(fieldKey);
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
          breadcrumbKeys={breadcrumbKeys}
          collapsedPaths={collapsedPaths}
          onToggleCollapse={handleToggleCollapse}
          onNodeClick={handleTreeNodeClick}
        />
      )}

      {/* ── Right: content panel ─────────────────────────────────────────── */}
      <div className={styles.content}>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.toolbarToggle}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <SidebarSimple size={14} />
          </button>

          <BreadcrumbBar entries={breadcrumb} onNavigate={handleNavigateTo} />

          <div className={styles.segmented}>
            <div className={styles.segmentedInner}>
              {(['schema', 'example'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={[styles.segmentBtn, activeTab === tab ? styles.segmentBtnActive : ''].join(' ')}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Schema tab ─────────────────────────────────────────────────── */}
        {activeTab === 'schema' && (
          <div className={styles.schemaContent} ref={contentScrollRef}>

            <div className={styles.schemaHeader}>
              <div className={styles.schemaHeaderIcon}>
                <DataTypeIcon type={currentType} size={20} />
              </div>
              <div className={styles.schemaHeaderMeta}>
                <div className={styles.schemaHeaderTitle}>
                  <span className={styles.schemaName}>{current.label}</span>
                  <span className={styles.schemaTypeLabel}>
                    {current.isArrayItems ? 'array[object]' : currentType}
                  </span>
                </div>
                {currentSchema.description && (
                  <p className={styles.schemaHeaderDesc}>{currentSchema.description}</p>
                )}
              </div>
            </div>

            {Object.keys(properties).length > 0 ? (
              <>
                <span className={styles.propertiesLabel}>Properties</span>
                <div role="list">
                  {Object.entries(properties).map(([key, fieldSchema]) => (
                    <div
                      key={key}
                      role="listitem"
                      ref={el => { fieldRefsMap.current[key] = el; }}
                      className={highlightedField === key ? styles.fieldRowHighlighted : ''}
                    >
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
              <div className={styles.empty}>No properties defined at this level.</div>
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
