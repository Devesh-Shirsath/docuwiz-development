import React, { useState } from 'react';
import {
  CaretDown,
  CaretRight,
  Copy,
  DownloadSimple,
  Sparkle,
  CaretDown as ChevronDown,
  Code,
  ListBullets,
  ArrowSquareOut,
} from '@phosphor-icons/react';

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
import { Input } from '../Input/Input';

import styles from './APIReferencePage.module.css';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TopNav sub-component                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface TopNavItem {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

interface TopNavProps {
  logoSrc?: string;
  logoAlt?: string;
  items?: TopNavItem[];
  onLogin?: () => void;
  onGetStarted?: () => void;
  loginLabel?: string;
  getStartedLabel?: string;
}

function TopNav({
  logoSrc,
  logoAlt = 'Logo',
  items = [],
  onLogin,
  onGetStarted,
  loginLabel = 'Login',
  getStartedLabel = 'Get Started',
}: TopNavProps) {
  return (
    <nav className={styles.topNav} aria-label="Site navigation">
      {/* Logo */}
      <div className={styles.navLogo}>
        {logoSrc
          ? <img src={logoSrc} alt={logoAlt} className={styles.navLogoImg} />
          : <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-font-primary)' }}>⬡</span>
        }
      </div>

      {/* Center tabs */}
      <div className={styles.navTabs}>
        {items.map((item, i) =>
          item.href ? (
            <a
              key={i}
              href={item.href}
              className={[styles.navTab, item.active ? styles.navTabActive : ''].filter(Boolean).join(' ')}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </a>
          ) : (
            <button
              key={i}
              type="button"
              className={[styles.navTab, item.active ? styles.navTabActive : ''].filter(Boolean).join(' ')}
              onClick={item.onClick}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </button>
          )
        )}
      </div>

      {/* Right actions */}
      <div className={styles.navActions}>
        <button type="button" className={styles.navLoginBtn} onClick={onLogin}>
          {loginLabel}
        </button>
        <button type="button" className={styles.navGetStartedBtn} onClick={onGetStarted}>
          {getStartedLabel}
        </button>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Data types                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface ParameterDef {
  name: string;
  in: 'header' | 'query' | 'path';
  required?: boolean;
  type?: string;
  description?: string;
  example?: string;
}

export interface ResponseDef {
  statusCode: string;
  description?: string;
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
/*  CollapsibleSection                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

interface CollapsibleSectionProps {
  title: string;
  /** Icon rendered next to the title. */
  icon?: React.ReactNode;
  badge?: string | number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
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
          {open
            ? <CaretDown size={14} weight="bold" />
            : <CaretRight size={14} weight="bold" />}
        </span>
        {icon && <span className={styles.collapsibleIcon}>{icon}</span>}
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
/*  ParameterTable                                                               */
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
          {/* Left: name + type + required tag */}
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
/*  ResponseList                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

function ResponseList({ responses }: { responses: ResponseDef[] }) {
  return (
    <>
      {responses.map((res) => {
        const code = parseInt(res.statusCode, 10);
        const isError    = code >= 400;
        const isRedirect = code >= 300 && code < 400;

        return (
          <div key={res.statusCode} className={styles.responseEntry}>
            <div className={styles.responseHeader}>
              <span
                className={styles.statusCode}
                data-error={isError ? 'true' : undefined}
                data-redirect={isRedirect ? 'true' : undefined}
              >
                {res.statusCode}
              </span>
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
  breadcrumb?: string[];

  /* ── Parameters ─── */
  headerParameters?: ParameterDef[];
  queryParameters?: ParameterDef[];

  /* ── Request body ─── */
  requestBodySchema?: JSONSchema;
  requestBodyDefinitions?: SchemaDefinitions;
  requestBodyContentType?: string;

  /* ── Responses ─── */
  responses?: ResponseDef[];

  /* ── Code panel ─── */
  codeSamples: TryoutPanelProps['codeSamples'];
  defaultLanguage?: TryoutPanelProps['defaultLanguage'];
  onRun?: TryoutPanelProps['onRun'];
  sampleResponses?: ResponseEntry[];

  /* ── Environments ─── */
  environments?: EnvironmentDef[];
  defaultEnvironmentIndex?: number;

  /* ── Path bar actions (all optional) ─── */
  /** Called when "Copy Page" is pressed. Defaults to copying the current URL. */
  onCopyPage?: () => void;
  /** Called when "Open in Claude" is pressed. */
  onOpenInClaude?: () => void;
  /** Called when "Download" is pressed. */
  onDownload?: () => void;

  /* ── Sidebar navigation ─── */
  navSections?: NavSectionDef[];

  /* ── Top navigation bar ─── */
  /** Source URL of the logo image shown in the top nav. */
  logoSrc?: string;
  logoAlt?: string;
  /** Top-level navigation items (Guides, API Reference, Recipes, Packages, etc.) */
  topNavItems?: TopNavItem[];
  onLogin?: () => void;
  onGetStarted?: () => void;
  loginLabel?: string;
  getStartedLabel?: string;

  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  APIReferencePage                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Full-page API reference layout.
 *
 * Structure:
 * - **Sidebar** — sticky `SideNav` with endpoint navigation
 * - **Card header** — breadcrumb, title, description, and the path bar with
 *   Copy / Open in Claude / Download actions and the **View ↔ Tryout** mode toggle
 * - **Two-column body**:
 *   - *Left* — scrollable: host selector, header params, request body schema, responses
 *   - *Right* — independently-scrolling dark code panel with `TryoutPanel`
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
  onCopyPage,
  onOpenInClaude,
  onDownload,
  navSections = [],
  logoSrc,
  logoAlt,
  topNavItems,
  onLogin,
  onGetStarted,
  loginLabel,
  getStartedLabel,
  className,
}: APIReferencePageProps) {
  /* Mode: schema (read-only) or tryout (editable + runnable) */
  const [mode, setMode] = useState<'schema' | 'tryout'>('schema');

  /* Parameter values for tryout mode */
  const [headerValues, setHeaderValues] = useState<Record<string, string>>({});
  const [queryValues,  setQueryValues]  = useState<Record<string, string>>({});

  /* Active environment */
  const [envIndex, setEnvIndex] = useState(defaultEnvironmentIndex);
  const activeEnv = environments[envIndex];

  /* Copy page default handler */
  const handleCopyPage = () => {
    if (onCopyPage) { onCopyPage(); return; }
    try { navigator.clipboard.writeText(window.location.href); } catch { /* silent */ }
  };

  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')}>

      {/* ════════════════ TOP NAV ════════════════ */}
      <TopNav
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        items={topNavItems}
        onLogin={onLogin}
        onGetStarted={onGetStarted}
        loginLabel={loginLabel}
        getStartedLabel={getStartedLabel}
      />

      {/* ════════════════ PAGE BODY ════════════════ */}
      <div className={styles.pageBody}>

      {/* ════════════════ SIDEBAR ════════════════ */}
      {navSections.length > 0 && (
        <aside className={styles.sidebar}>
          <SideNav>
            {navSections.map((section, si) => (
              <React.Fragment key={si}>
                <SideNavSection label={section.label} variant={section.variant ?? 'category'} />

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

      {/* ════════════════ MAIN CARD ════════════════ */}
      <div className={styles.mainCard}>

        {/* ── Card header (never scrolls) ── */}
        <header className={styles.cardHeader}>
          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className={styles.breadcrumbSep}>&gt;</span>}
                  <span className={styles.breadcrumbItem}>{crumb}</span>
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title */}
          <h1 className={styles.endpointTitle}>{title}</h1>

          {/* Description */}
          {description && (
            <p className={styles.endpointDescription}>{description}</p>
          )}

          {/* Path bar */}
          <div className={styles.pathBar}>
            {/* Left: method badge + path */}
            <div className={styles.pathLeft}>
              <MethodBadge method={method} />
              <span className={styles.pathString}>{path}</span>
            </div>

            {/* Right: action buttons + mode toggle */}
            <div className={styles.pathActions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleCopyPage}
                title="Copy page URL"
              >
                <Copy size={13} />
                Copy Page
              </button>

              <button
                type="button"
                className={styles.actionBtn}
                onClick={onOpenInClaude}
                title="Open in Claude"
              >
                <Sparkle size={13} weight="fill" />
                Open in Claude
                <ChevronDown size={11} weight="bold" />
              </button>

              <button
                type="button"
                className={styles.actionBtn}
                onClick={onDownload}
                title="Download spec"
              >
                <DownloadSimple size={13} />
                Download
              </button>

              {/* View / Tryout toggle */}
              <div className={styles.modeToggle} role="group" aria-label="View mode">
                <button
                  type="button"
                  className={[styles.modeBtn, mode === 'schema' ? styles.modeBtnActive : ''].filter(Boolean).join(' ')}
                  onClick={() => setMode('schema')}
                  aria-pressed={mode === 'schema'}
                >
                  View
                </button>
                <button
                  type="button"
                  className={[styles.modeBtn, mode === 'tryout' ? styles.modeBtnActive : ''].filter(Boolean).join(' ')}
                  onClick={() => setMode('tryout')}
                  aria-pressed={mode === 'tryout'}
                >
                  Tryout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ── Two-column body ── */}
        <div className={styles.cardBody}>

          {/* Left: scrollable content */}
          <main className={styles.contentCol}>

            {/* Host / Environment selector */}
            {environments.length > 0 && (
              <div className={styles.hostSection}>
                <span className={styles.hostIcon}>
                  <Code size={20} />
                </span>
                <div className={styles.hostTextGroup}>
                  <div className={styles.hostSectionLabel}>Host</div>
                  {activeEnv && (
                    <div className={styles.hostSectionSub}>{activeEnv.url}</div>
                  )}
                </div>
                <div className={styles.hostDropdownWrap}>
                  <Dropdown
                    label={activeEnv?.label ?? 'Select environment'}
                    variant="secondary"
                    size="small"
                    fullWidth
                    popupWidth="trigger"
                    align="end"
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
              </div>
            )}

            {/* Header Parameters */}
            {headerParameters.length > 0 && (
              <CollapsibleSection
                title="Header Parameters"
                icon={<ListBullets size={16} />}
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

            {/* Query Parameters */}
            {queryParameters.length > 0 && (
              <CollapsibleSection
                title="Query Parameters"
                icon={<ListBullets size={16} />}
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

            {/* Request Body */}
            {requestBodySchema && (
              <CollapsibleSection
                title="Request Body"
                icon={<ArrowSquareOut size={16} />}
                badge={requestBodyContentType}
                defaultOpen
              >
                <SchemaVisualizer
                  schema={requestBodySchema}
                  definitions={requestBodyDefinitions}
                  mode={mode}
                />
              </CollapsibleSection>
            )}

            {/* Responses */}
            {responses.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>Response</h2>
                <ResponseList responses={responses} />
              </div>
            )}
          </main>

          {/* Right: sticky dark code panel */}
          <aside className={styles.codeCol}>
            <TryoutPanel
              codeSamples={codeSamples}
              defaultLanguage={defaultLanguage}
              responses={sampleResponses}
              onRun={onRun}
            />
          </aside>
        </div>
      </div>

      </div>{/* end .pageBody */}
    </div>
  );
}
