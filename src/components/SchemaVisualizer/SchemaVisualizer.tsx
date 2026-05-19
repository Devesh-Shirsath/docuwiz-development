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
   * Fully reactive — changing this prop resets the navigator to the root.
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
  /** Ref map populated with each row's DOM element for programmatic scrolling. */
  rowRefsMap: React.MutableRefObject<Record<string, HTMLElement | null>>;
  onToggleCollapse: (pathKey: string) => void;
  onNodeClick: (node: TreeNode) => void;
}

function SchemaTree({
  nodes,
  contentType,
  breadcrumbKeys,
  collapsedPaths,
  rowRefsMap,
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
      <div className={styles.treeHeader}>
        <span className={styles.treeHeaderIcon}><TreeStructure size={14} /></span>
        <span className={styles.contentTypeLabel}>{contentType}</span>
        <span className={styles.treeHeaderCaret}><CaretDown size={12} /></span>
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
              ref={el => { rowRefsMap.current[pathKey] = el; }}
              className={[
                styles.treeRow,
                active ? styles.treeRowActive : '',
                onPath ? styles.treeRowOnPath : '',
              ].join(' ')}
              style={{ paddingLeft: indent }}
              onClick={() => onNodeClick(node)}
            >
              {node.hasChildren && (
                <span
                  className={[styles.treeCaret, !isCollapsed ? styles.treeCaretExpanded : ''].join(' ')}
                  style={{ left: indent - 14 }}
                  aria-hidden
                  onClick={(e) => { e.stopPropagation(); onToggleCollapse(pathKey); }}
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
  /* ── Core state ─────────────────────────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [activeTab, setActiveTab]       = useState<'schema' | 'example'>(defaultTab);
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());

  const rootResolved = useMemo(
    () => resolveSchema(schema, definitions),
    [schema, definitions],
  );

  const makeRootBreadcrumb = (): BreadcrumbEntry[] => [{
    label: schemaName,
    schema: rootResolved,
    requiredFields: new Set(rootResolved.required ?? []),
  }];

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbEntry[]>(makeRootBreadcrumb);

  /* ── Right-panel scroll / highlight ────────────────────────────────────── */
  const [scrollTarget,    setScrollTarget]    = useState<string | null>(null);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const fieldRefsMap    = useRef<Record<string, HTMLElement | null>>({});
  const contentScrollRef = useRef<HTMLDivElement>(null);

  /* ── Left-panel (tree) scroll ───────────────────────────────────────────── */
  /** Path key of the tree row to scroll into view after navigation. */
  const [treeScrollTarget, setTreeScrollTarget] = useState<string | null>(null);
  const treeRowRefsMap = useRef<Record<string, HTMLElement | null>>({});

  /* ─────────────────────────────────────────────────────────────────────────
     REACTIVE: reset the whole navigator when schema/definitions/schemaName
     props change (e.g. Storybook controls, runtime schema swap).
     ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    setBreadcrumb([{
      label: schemaName,
      schema: rootResolved,
      requiredFields: new Set(rootResolved.required ?? []),
    }]);
    setScrollTarget(null);
    setHighlightedField(null);
    setTreeScrollTarget(null);
    setCollapsedPaths(new Set());
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, definitions, schemaName]); // intentionally NOT rootResolved to avoid double-fire

  /* ── Right-panel scroll effect ──────────────────────────────────────────── */
  useEffect(() => {
    if (!scrollTarget) return;
    const el = fieldRefsMap.current[scrollTarget];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setHighlightedField(scrollTarget);
      setScrollTarget(null);
    }
  }, [scrollTarget, breadcrumb]);

  useEffect(() => {
    if (!highlightedField) return;
    const t = setTimeout(() => setHighlightedField(null), 2200);
    return () => clearTimeout(t);
  }, [highlightedField]);

  /* ── Tree scroll effect ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!treeScrollTarget) return;
    const el = treeRowRefsMap.current[treeScrollTarget];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTreeScrollTarget(null);
    }
  }, [treeScrollTarget, breadcrumb]);

  /* ── Derived ────────────────────────────────────────────────────────────── */
  const current        = breadcrumb[breadcrumb.length - 1];
  const currentSchema  = current.schema;
  const currentRequired = current.requiredFields;
  const currentType    = getEffectiveType(currentSchema);
  const properties     = currentSchema.properties ?? {};

  const treeNodes = useMemo<TreeNode[]>(() => {
    const out: TreeNode[] = [];
    buildFlatTree(rootResolved, definitions, schemaName, 0, [], out);
    return out;
  }, [rootResolved, definitions, schemaName]);

  const breadcrumbKeys = useMemo(
    () => breadcrumb.map(e => e.label.replace(/\[\]$/, '')),
    [breadcrumb],
  );

  const exampleJson = useMemo(
    () => JSON.stringify(generateExample(currentSchema, definitions), null, 2),
    [currentSchema, definitions],
  );

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const handleNavigateTo = (index: number) => {
    setBreadcrumb(prev => prev.slice(0, index + 1));
    // Scroll tree to the breadcrumb level we're going back to
    const targetPath = breadcrumb.slice(0, index + 1).map(e => e.label.replace(/\[\]$/, '')).join('\0');
    setTreeScrollTarget(targetPath);
  };

  /**
   * "View Properties →" button: navigate INTO the field.
   * Also scrolls the tree to the matching node.
   */
  const handleViewProperties = (fieldName: string, fieldSchema: JSONSchema) => {
    const resolved   = resolveSchema(fieldSchema, definitions);
    const navTarget  = getNavigableSchema(resolved, definitions);
    if (!navTarget) return;

    const type  = getEffectiveType(resolved);
    const label = type === 'array' ? `${fieldName}[]` : fieldName;

    const newEntry: BreadcrumbEntry = {
      label,
      schema: navTarget,
      requiredFields: new Set(navTarget.required ?? []),
      isArrayItems: type === 'array',
    };

    setBreadcrumb(prev => [...prev, newEntry]);

    // Scroll the tree to the node we just navigated into
    const newTreePathKey = [...breadcrumbKeys, fieldName].join('\0');
    setTreeScrollTarget(newTreePathKey);

    // Also auto-expand the path in the tree so the node is visible
    setCollapsedPaths(prev => {
      const next = new Set(prev);
      // Ensure every ancestor node along this path is expanded
      for (let d = 1; d <= breadcrumbKeys.length; d++) {
        next.delete(breadcrumbKeys.slice(0, d).join('\0'));
      }
      next.delete(newTreePathKey);
      return next;
    });
  };

  /**
   * Tree click: navigate breadcrumb to the PARENT of the clicked node,
   * then scroll the right panel to the clicked field.
   */
  const handleTreeNodeClick = (node: TreeNode) => {
    const fieldKey = node.path[node.path.length - 1];

    // Root node → reset to root
    if (node.path.length === 1) {
      setBreadcrumb(makeRootBreadcrumb());
      contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigate breadcrumb to this node's parent, then scroll to the field
    const parentPath = node.path.slice(0, -1);
    let walkSchema   = rootResolved;
    const newBreadcrumb: BreadcrumbEntry[] = [{
      label: schemaName,
      schema: rootResolved,
      requiredFields: new Set(rootResolved.required ?? []),
    }];

    for (let i = 1; i < parentPath.length; i++) {
      const key  = parentPath[i];
      const prop = walkSchema.properties?.[key];
      if (!prop) break;

      const resolved = resolveSchema(prop, definitions);
      const nav      = getNavigableSchema(resolved, definitions);
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
          rowRefsMap={treeRowRefsMap}
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
