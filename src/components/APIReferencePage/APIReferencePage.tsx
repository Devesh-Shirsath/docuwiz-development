import React, { useState } from 'react';
import { CaretDown, CaretRight } from '@phosphor-icons/react';

import { SideNav } from '../SideNav/SideNav';
import { SideNavSection } from '../SideNav/SideNavSection';
import { SideNavGroup } from '../SideNav/SideNavGroup';
import { SideNavItem } from '../SideNav/SideNavItem';
import { MethodBadge } from '../SideNav/MethodBadge';
import type { HttpMethod } from '../SideNav/MethodBadge';

import { SchemaVisualizer } from '../SchemaVisualizer/SchemaVisualizer';
import type { JSONSchema, SchemaDefinitions } from '../SchemaVisualizer/types';

import { TryoutPanel } from '../CodeBlock/TryoutPanel';
import type { TryoutPanelProps } from '../CodeBlock/TryoutPanel';
import type { ResponseEntry } from '../CodeBlock/ResponseBlock';

import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownItem } from '../Dropdown/DropdownItem';
import { Tabs } from '../Tabs/Tabs';
import { Input } from '../Input/Input';

import styles from './APIReferencePage.module.css';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Data shapes                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface ParameterDef {
  name: string;
  /** Where the parameter is sent. */
  in: 'header' | 'query' | 'path';
  required?: boolean;
  type?: string;
  description?: string;
  example?: string;
}

export interface ResponseDef {
  statusCode: string;
  description?: string;
  /** JSON schema for the response body. */
  schema?: JSONSchema;
  definitions?: SchemaDefinitions;
}

export interface EnvironmentDef {
  label: string;
  url: string;
}

export interface NavItem {
  label: string;
  method?: HttpMethod;
  active?: boolean;
  onClick?: () => void;
}

export interface NavGroupDef {
  label: string;
  defaultExpanded?: boolean;
  items: NavItem[];
}

export interface NavSectionDef {
  label: string;
  variant?: 'category' | 'product' | 'label';
  groups?: NavGroupDef[];
  items?: NavItem[];
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CollapsibleSection — inline sub-component                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

interface CollapsibleSectionProps {
  title: string;
  badge?: string | number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  badge,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.collapsibleTrigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.collapsibleCaret}>
          {open ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
        </span>
        <span className={styles.collapsibleTitle}>{title}</span>
        {badge !== undefined && (
          <span className={styles.collapsibleBadge}>{badge}</span>
        )}
      </button>

      {open && <div className={styles.collapsibleBody}>{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ParameterTable — shows params, optionally with Input fields in tryout mode  */
/* ─────────────────────────────────────────────────────────────────────────── */

interface ParameterTableProps {
  parameters: ParameterDef[];
  mode: 'schema' | 'tryout';
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

function ParameterTable({ parameters, mode, values, onChange }: ParameterTableProps) {
  if (parameters.length === 0) return null;

  return (
    <div className={styles.paramTable}>
      {parameters.map((param) => (
        <div key={param.name} className={styles.paramRow}>
          {/* Left: name + type + required */}
          <div className={styles.paramMeta}>
            <span className={styles.paramName}>{param.name}</span>
            {param.type && <span className={styles.paramType}>{param.type}</span>}
            {param.required && <span className={styles.paramRequired}>required</span>}
          </div>

          {/* Right: description + optional input */}
          <div className={styles.paramDetail}>
            {param.description && (
              <span className={styles.paramDescription}>{param.description}</span>
            )}
            {mode === 'tryout' && (
              <Input
                size="small"
                fullWidth
                placeholder={param.example ?? `Enter ${param.name}`}
                value={values[param.name] ?? ''}
                onChange={(e) => onChange(param.name, e.target.value)}
                aria-label={param.name}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ResponseList — collapsible response entries                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

interface ResponseListProps {
  responses: ResponseDef[];
}

function ResponseList({ responses }: ResponseListProps) {
  return (
    <>
      {responses.map((res) => {
        const code = parseInt(res.statusCode, 10);
        const isError = code >= 400;
        const isRedirect = code >= 300 && code < 400;

        const statusCls = [
          styles.statusCode,
          isError ? styles['statusCode--error'] : '',
          isRedirect ? styles['statusCode--redirect'] : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <CollapsibleSection
            key={res.statusCode}
            title=""
            defaultOpen={!isError}
          >
            <div className={styles.responseEntry}>
              <div className={styles.responseHeader}>
                <span className={statusCls}>{res.statusCode}</span>
                {res.description && (
                  <span className={styles.responseDescription}>{res.description}</span>
                )}
              </div>

              {res.schema && (
                <div className={styles.responseBody}>
                  <SchemaVisualizer
                    schema={res.schema}
                    definitions={res.definitions}
                    mode="schema"
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  APIReferencePage props                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface APIReferencePageProps {
  /* ── Endpoint metadata ─── */
  method: HttpMethod;
  path: string;
  title: string;
  description?: string;
  /** Breadcrumb path shown above the title, e.g. ['API', 'Payments']. */
  breadcrumb?: string[];

  /* ── Parameters ─── */
  /** Header parameters shown in the Header Parameters section. */
  headerParameters?: ParameterDef[];
  /** Query parameters shown in the Query Parameters section. */
  queryParameters?: ParameterDef[];

  /* ── Request body ─── */
  requestBodySchema?: JSONSchema;
  requestBodyDefinitions?: SchemaDefinitions;
  /** Content-type label shown above the request body schema, e.g. 'application/json'. */
  requestBodyContentType?: string;

  /* ── Responses ─── */
  responses?: ResponseDef[];

  /* ── Code panel ─── */
  /** Available code samples passed to TryoutPanel / EndpointBlock. */
  codeSamples: TryoutPanelProps['codeSamples'];
  defaultLanguage?: TryoutPanelProps['defaultLanguage'];
  /** Called when the ▶ Run button is pressed in the code panel. */
  onRun?: TryoutPanelProps['onRun'];
  /** Pre-defined response entries shown in the ResponseBlock below the code. */
  sampleResponses?: ResponseEntry[];

  /* ── Environments ─── */
  environments?: EnvironmentDef[];
  /** Initially selected environment index. */
  defaultEnvironmentIndex?: number;

  /* ── Navigation ─── */
  navSections?: NavSectionDef[];

  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  APIReferencePage                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Full-page API reference layout combining:
 * - Left sticky **SideNav** for endpoint navigation
 * - Scrollable **content** area with collapsible parameter, schema, and response sections
 * - Right sticky **code panel** with host selector, code samples, and live tryout
 *
 * Toggle between **Schema** mode (read-only) and **Tryout** mode (editable inputs
 * + live run) using the Tabs control at the top of the content area.
 */
export function APIReferencePage({
  method,
  path,
  title,
  description,
  breadcrumb,
  headerParameters = [],
  queryParameters = [],
  requestBodySchema,
  requestBodyDefinitions,
  requestBodyContentType = 'application/json',
  responses = [],
  codeSamples,
  defaultLanguage,
  onRun,
  sampleResponses,
  environments = [],
  defaultEnvironmentIndex = 0,
  navSections = [],
  className,
}: APIReferencePageProps) {
  /* ── Mode (schema / tryout) ─── */
  const [mode, setMode] = useState<'schema' | 'tryout'>('schema');

  /* ── Parameter values for tryout mode ─── */
  const [headerValues, setHeaderValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues]   = useState<Record<string, string>>({});

  /* ── Selected environment ─── */
  const [envIndex, setEnvIndex] = useState(defaultEnvironmentIndex);
  const activeEnv = environments[envIndex];

  /* ── Schema tryout values (forwarded to onTryoutChange consumers) ─── */
  const [, setSchemaTryoutValues] = useState<Record<string, string>>({});

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')}>

      {/* ════════════════════════════════════════════════════════════════
          LEFT SIDEBAR
          ════════════════════════════════════════════════════════════════ */}
      {navSections.length > 0 && (
        <aside className={styles.sidebar}>
          <SideNav>
            {navSections.map((section, si) => (
              <React.Fragment key={si}>
                <SideNavSection label={section.label} variant={section.variant ?? 'category'} />

                {/* Flat items directly under section */}
                {section.items?.map((item, ii) => (
                  <SideNavItem
                    key={ii}
                    label={item.label}
                    type="endpoint"
                    method={item.method}
                    active={item.active}
                    onClick={item.onClick}
                  />
                ))}

                {/* Grouped items */}
                {section.groups?.map((group, gi) => (
                  <SideNavGroup
                    key={gi}
                    label={group.label}
                    defaultExpanded={group.defaultExpanded ?? false}
                  >
                    {group.items.map((item, ii) => (
                      <SideNavItem
                        key={ii}
                        label={item.label}
                        type="endpoint"
                        method={item.method}
                        active={item.active}
                        onClick={item.onClick}
                      />
                    ))}
                  </SideNavGroup>
                ))}

                {si < navSections.length - 1 && <SideNav.Divider />}
              </React.Fragment>
            ))}
          </SideNav>
        </aside>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MAIN AREA
          ════════════════════════════════════════════════════════════════ */}
      <div className={styles.main}>

        {/* ── Scrollable content column ── */}
        <div className={styles.content}>

          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
                  <span className={styles.breadcrumbItem}>{crumb}</span>
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Endpoint header */}
          <div className={styles.endpointHeader}>
            <h1 className={styles.endpointTitle}>{title}</h1>
            {description && (
              <p className={styles.endpointDescription}>{description}</p>
            )}
            <div className={styles.endpointPath}>
              <MethodBadge method={method} />
              <span className={styles.pathString}>{path}</span>
            </div>
          </div>

          {/* Mode toggle */}
          <div className={styles.modeRow}>
            <div className={styles.modeTabsWrap}>
              <Tabs
                variant="pill"
                tabs={[
                  { value: 'schema', label: 'Schema' },
                  { value: 'tryout', label: 'Try it out' },
                ]}
                value={mode}
                onChange={(v) => setMode(v as 'schema' | 'tryout')}
              />
            </div>
          </div>

          {/* ── Header Parameters ── */}
          {headerParameters.length > 0 && (
            <CollapsibleSection
              title="Header Parameters"
              badge={headerParameters.length}
              defaultOpen
            >
              <ParameterTable
                parameters={headerParameters}
                mode={mode}
                values={headerValues}
                onChange={(name, val) =>
                  setHeaderValues((prev) => ({ ...prev, [name]: val }))
                }
              />
            </CollapsibleSection>
          )}

          {/* ── Query Parameters ── */}
          {queryParameters.length > 0 && (
            <CollapsibleSection
              title="Query Parameters"
              badge={queryParameters.length}
              defaultOpen
            >
              <ParameterTable
                parameters={queryParameters}
                mode={mode}
                values={queryValues}
                onChange={(name, val) =>
                  setQueryValues((prev) => ({ ...prev, [name]: val }))
                }
              />
            </CollapsibleSection>
          )}

          {/* ── Request Body ── */}
          {requestBodySchema && (
            <CollapsibleSection
              title="Request Body"
              badge={requestBodyContentType}
              defaultOpen
            >
              <SchemaVisualizer
                schema={requestBodySchema}
                definitions={requestBodyDefinitions}
                mode={mode}
                onTryoutChange={setSchemaTryoutValues}
              />
            </CollapsibleSection>
          )}

          {/* ── Responses ── */}
          {responses.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Responses</h2>
              <ResponseList responses={responses} />
            </div>
          )}
        </div>

        {/* ── Sticky code panel ── */}
        <aside className={styles.codePanel}>

          {/* Environment / host selector */}
          {environments.length > 0 && (
            <div className={styles.hostRow}>
              <span className={styles.hostLabel}>Host</span>
              <Dropdown
                label={activeEnv?.label ?? 'Select environment'}
                variant="secondary"
                size="small"
                fullWidth
                popupWidth="trigger"
                iconLeftName="Globe"
              >
                {environments.map((env, i) => (
                  <DropdownItem
                    key={i}
                    label={env.label}
                    description={env.url}
                    selected={i === envIndex}
                    onClick={() => setEnvIndex(i)}
                  />
                ))}
              </Dropdown>
            </div>
          )}

          {/* TryoutPanel: EndpointBlock + ResponseBlock */}
          <TryoutPanel
            codeSamples={codeSamples}
            defaultLanguage={defaultLanguage}
            responses={sampleResponses}
            onRun={onRun}
          />
        </aside>
      </div>
    </div>
  );
}
