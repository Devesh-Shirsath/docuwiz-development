import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SideNav } from './SideNav';
import { SideNavSection } from './SideNavSection';
import { SideNavGroup } from './SideNavGroup';
import { SideNavItem } from './SideNavItem';
import { MethodBadge } from './MethodBadge';
import type { HttpMethod } from './MethodBadge';

/* ── Meta ────────────────────────────────────────────────────────────────── */
const meta: Meta<typeof SideNav> = {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Sidebar navigation system composed of four building blocks.

| Component | Role |
|---|---|
| \`SideNav\` | Root \`<nav>\` container — wrap everything in this |
| \`SideNavSection\` | Non-interactive section divider: **label** (uppercase flat), **category** (Stack icon), or **product** (Cube icon) |
| \`SideNavGroup\` | Collapsible trigger row — caret toggles children visible/hidden |
| \`SideNavItem\` | Leaf row — **endpoint** ({} icon + HTTP badge), **guide** (BookOpen icon), or **item** (custom icon) |
| \`SideNav.Divider\` | Thin \`<hr>\` separator between sections |
| \`MethodBadge\` | Standalone HTTP method pill — also used internally by endpoint items |

**Active state** — pass \`active\` to a \`SideNavItem\` to show the 2px brand left-border indicator. Manage active state externally (URL matching, router hooks, etc.).

**Left indicator** — implemented with \`box-shadow: inset\` so it never shifts layout as it transitions between 1px (default) and 2px (active).
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof SideNav>;

/* ── Shared sidebar wrapper ──────────────────────────────────────────────── */
const NavWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: 280,
    background: 'var(--color-surface-ground)',
    borderRight: '1px solid var(--color-stroke-gray-primary)',
    minHeight: 400,
    borderRadius: 'var(--radius-card)',
    overflow: 'hidden',
  }}>
    {children}
  </div>
);

/* ── Stories ─────────────────────────────────────────────────────────────── */

/** Full DocuWiz-style API reference sidebar — mirrors the real product usage. */
export const DocuWizReference: Story = {
  name: 'DocuWiz API Sidebar (Full Demo)',
  parameters: {
    docs: {
      description: {
        story: 'Complete sidebar as it appears in the DocuWiz interface: section labels, collapsible API spec groups, endpoint items with HTTP method badges, guide items, and active state navigation.',
      },
    },
  },
  render: () => {
    const [active, setActive] = useState('cancel-payment');

    return (
      <NavWrapper>
        <SideNav>
          {/* ── Top-level flat label */}
          <SideNavSection label="References" variant="label" />

          {/* ── Standalone collapsible OAS specs */}
          <SideNavGroup label="Fetch Bill Request" />
          <SideNavGroup label="Fetch Bill Status" />
          <SideNavGroup label="Fetch Biller Info" />
          <SideNavGroup label="Fetch Categories" />

          <SideNav.Divider />

          {/* ── Payment section */}
          <SideNavSection label="Payment" variant="category" />

          <SideNavGroup label="Create Bill Payment" defaultExpanded>
            <SideNavItem
              label="Validate Payment"
              type="endpoint"
              method="POST"
              active={active === 'validate-payment'}
              onClick={() => setActive('validate-payment')}
            />
            <SideNavItem
              label="Check Payment Status"
              type="endpoint"
              method="POST"
              active={active === 'check-payment-status'}
              onClick={() => setActive('check-payment-status')}
            />
            <SideNavItem
              label="Cancel Payment"
              type="endpoint"
              method="POST"
              active={active === 'cancel-payment'}
              onClick={() => setActive('cancel-payment')}
            />
            <SideNavItem
              label="Transaction Report"
              type="endpoint"
              method="HEAD"
              active={active === 'transaction-report'}
              onClick={() => setActive('transaction-report')}
            />
            <SideNavItem
              label="Refund Payment"
              type="endpoint"
              method="POST"
              active={active === 'refund-payment'}
              onClick={() => setActive('refund-payment')}
            />
          </SideNavGroup>

          <SideNav.Divider />

          {/* ── Biller section */}
          <SideNavSection label="Biller" variant="category" />

          <SideNavGroup label="Biller Search" />
          <SideNavGroup label="Biller Details" />
          <SideNavGroup label="Biller Categories" />
          <SideNavGroup label="Biller Validation" />
          <SideNavGroup label="Biller Config" />
          <SideNavGroup label="Agent Biller Map" />

          <SideNav.Divider />

          {/* ── Report section */}
          <SideNavSection label="Report" variant="category" />
          <SideNavGroup label="Transaction History" />
          <SideNavGroup label="Payment Report" />
        </SideNav>
      </NavWrapper>
    );
  },
};

/** All item types side-by-side for a quick visual reference. */
export const AllItemTypes: Story = {
  name: 'All Item Types',
  parameters: {
    docs: {
      description: { story: 'Every variant of `SideNavItem` — endpoint with badge, guide, and generic item — in all three interaction states.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {/* Endpoint items */}
      <NavWrapper>
        <SideNav>
          <SideNavSection label="Endpoint items" variant="label" />
          <SideNavItem label="Get User"          type="endpoint" method="GET"    />
          <SideNavItem label="Create User"       type="endpoint" method="POST"   />
          <SideNavItem label="Update User"       type="endpoint" method="PUT"    />
          <SideNavItem label="Partial Update"    type="endpoint" method="PATCH"  />
          <SideNavItem label="Delete User"       type="endpoint" method="DELETE" />
          <SideNavItem label="Check Headers"     type="endpoint" method="HEAD"   />
          <SideNavItem label="Preflight"         type="endpoint" method="OPTIONS"/>
          <SideNavItem label="Trace"             type="endpoint" method="TRACE"  />
          <SideNavItem label="Active endpoint"   type="endpoint" method="POST" active />
          <SideNavItem label="Disabled endpoint" type="endpoint" method="GET"  disabled />
        </SideNav>
      </NavWrapper>

      {/* Guide items */}
      <NavWrapper>
        <SideNav>
          <SideNavSection label="Guide items" variant="label" />
          <SideNavItem label="Getting Started"   type="guide" />
          <SideNavItem label="Authentication"    type="guide" />
          <SideNavItem label="Rate Limiting"     type="guide" />
          <SideNavItem label="Error Handling"    type="guide" active />
          <SideNavItem label="Deprecated Guide"  type="guide" disabled />
        </SideNav>
      </NavWrapper>
    </div>
  ),
};

/** Section header and label variants. */
export const SectionVariants: Story = {
  name: 'Section Headers & Labels',
  parameters: {
    docs: {
      description: { story: '**label** — flat uppercase section divider with no icon. Use to mark top-level regions. **category** — Stack icon for API spec groups or feature areas. **product** — Cube icon for individual products or sub-systems.' },
    },
  },
  render: () => (
    <NavWrapper>
      <SideNav>
        <SideNavSection label="References" variant="label" />
        <SideNavItem label="Item under label" type="guide" />

        <SideNav.Divider />

        <SideNavSection label="Payment" variant="category" />
        <SideNavItem label="Create Payment" type="endpoint" method="POST" />
        <SideNavItem label="Get Payment"    type="endpoint" method="GET"  />

        <SideNav.Divider />

        <SideNavSection label="Subscription API" variant="product" />
        <SideNavItem label="Subscribe"   type="endpoint" method="POST"   />
        <SideNavItem label="Unsubscribe" type="endpoint" method="DELETE" />
      </SideNav>
    </NavWrapper>
  ),
};

/** Collapsible group states. */
export const GroupVariants: Story = {
  name: 'Group — Collapsed / Expanded / Warning',
  parameters: {
    docs: {
      description: { story: 'Groups default to collapsed. Pass `defaultExpanded` for groups that should open on load (e.g. the current active section). Use `hasWarning` when the group contains deprecated or invalid operations.' },
    },
  },
  render: () => (
    <NavWrapper>
      <SideNav>
        <SideNavGroup label="Collapsed group (default)" />
        <SideNavGroup label="Expanded group" defaultExpanded>
          <SideNavItem label="Child item one"  type="endpoint" method="GET"  />
          <SideNavItem label="Child item two"  type="endpoint" method="POST" />
          <SideNavItem label="Child item three" type="endpoint" method="PUT" active />
        </SideNavGroup>
        <SideNavGroup label="Has deprecation warning" hasWarning />
        <SideNavGroup label="With leading icon" leadingIconName="Database" defaultExpanded>
          <SideNavItem label="Query records"   type="endpoint" method="GET"    />
          <SideNavItem label="Insert record"   type="endpoint" method="POST"   />
          <SideNavItem label="Delete record"   type="endpoint" method="DELETE" />
        </SideNavGroup>
      </SideNav>
    </NavWrapper>
  ),
};

/** All HTTP method badges. */
export const MethodBadges: Story = {
  name: 'HTTP Method Badges',
  parameters: {
    docs: {
      description: { story: 'All 8 HTTP method badges. Each has a distinct solid color so engineers can identify the method type at a scan without reading the text. Used automatically by `SideNavItem type="endpoint"` — also exported standalone as `MethodBadge`.' },
    },
  },
  render: () => {
    const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'];
    return (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {methods.map((m) => <MethodBadge key={m} method={m} />)}
      </div>
    );
  },
};

/** Interactive controlled navigation demo. */
export const ControlledNavigation: Story = {
  name: 'Controlled — Active State Management',
  parameters: {
    docs: {
      description: { story: 'Manage active state externally (typically via router) by passing `active` and `onClick` to each item. Click any item to see the active indicator move.' },
    },
  },
  render: () => {
    const [active, setActive] = useState('auth-overview');

    const sections = [
      {
        label: 'Authentication',
        variant: 'category' as const,
        items: [
          { id: 'auth-overview',     label: 'Overview',         type: 'guide'    as const },
          { id: 'auth-api-keys',     label: 'API Keys',         type: 'guide'    as const },
          { id: 'auth-oauth',        label: 'OAuth 2.0',        type: 'guide'    as const },
        ],
      },
      {
        label: 'Endpoints',
        variant: 'category' as const,
        items: [
          { id: 'ep-token',          label: 'Issue Token',      type: 'endpoint' as const, method: 'POST'   as HttpMethod },
          { id: 'ep-refresh',        label: 'Refresh Token',    type: 'endpoint' as const, method: 'POST'   as HttpMethod },
          { id: 'ep-revoke',         label: 'Revoke Token',     type: 'endpoint' as const, method: 'DELETE' as HttpMethod },
          { id: 'ep-introspect',     label: 'Introspect Token', type: 'endpoint' as const, method: 'POST'   as HttpMethod },
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <NavWrapper>
          <SideNav>
            {sections.map((section, si) => (
              <React.Fragment key={section.label}>
                {si > 0 && <SideNav.Divider />}
                <SideNavSection label={section.label} variant={section.variant} />
                {section.items.map((item) => (
                  <SideNavItem
                    key={item.id}
                    label={item.label}
                    type={item.type}
                    method={'method' in item ? item.method : undefined}
                    active={active === item.id}
                    onClick={() => setActive(item.id)}
                  />
                ))}
              </React.Fragment>
            ))}
          </SideNav>
        </NavWrapper>
        <div style={{
          padding: 16,
          background: 'var(--color-surface-l2)',
          borderRadius: 'var(--radius-card)',
          font: 'var(--typography-body-s-regular)',
          color: 'var(--color-font-secondary)',
          minWidth: 180,
        }}>
          <span style={{ font: 'var(--typography-body-xs-medium)', color: 'var(--color-font-tertiary)', display: 'block', marginBottom: 4 }}>Active route</span>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-font-primary)' }}>{active}</code>
        </div>
      </div>
    );
  },
};

/** Guide-style sidebar (no method badges). */
export const GuidesSidebar: Story = {
  name: 'Guides Sidebar',
  parameters: {
    docs: {
      description: { story: 'Documentation-site pattern: no HTTP method badges, all items use the BookOpen guide type.' },
    },
  },
  render: () => {
    const [active, setActive] = useState('quickstart');
    return (
      <NavWrapper>
        <SideNav>
          <SideNavSection label="Getting Started" variant="category" />
          <SideNavItem label="Quickstart"       type="guide" active={active === 'quickstart'}   onClick={() => setActive('quickstart')}   />
          <SideNavItem label="Authentication"   type="guide" active={active === 'auth'}         onClick={() => setActive('auth')}         />
          <SideNavItem label="Errors"           type="guide" active={active === 'errors'}       onClick={() => setActive('errors')}       />
          <SideNavItem label="Rate Limits"      type="guide" active={active === 'rate-limits'}  onClick={() => setActive('rate-limits')}  />

          <SideNav.Divider />

          <SideNavSection label="Core Concepts" variant="category" />
          <SideNavItem label="Workspaces"       type="guide" active={active === 'workspaces'}   onClick={() => setActive('workspaces')}   />
          <SideNavItem label="Environments"     type="guide" active={active === 'environments'} onClick={() => setActive('environments')} />
          <SideNavItem label="Versioning"       type="guide" active={active === 'versioning'}   onClick={() => setActive('versioning')}   />

          <SideNav.Divider />

          <SideNavSection label="Guides" variant="label" />
          <SideNavGroup label="Webhooks" defaultExpanded>
            <SideNavItem label="Overview"        type="guide" active={active === 'wh-overview'}  onClick={() => setActive('wh-overview')}  />
            <SideNavItem label="Signing secrets" type="guide" active={active === 'wh-signing'}   onClick={() => setActive('wh-signing')}   />
            <SideNavItem label="Retries"         type="guide" active={active === 'wh-retries'}   onClick={() => setActive('wh-retries')}   />
          </SideNavGroup>
          <SideNavGroup label="SDKs">
            <SideNavItem label="JavaScript"      type="guide" />
            <SideNavItem label="Python"          type="guide" />
            <SideNavItem label="Go"              type="guide" />
          </SideNavGroup>
        </SideNav>
      </NavWrapper>
    );
  },
};

/** Long labels and overflow handling. */
export const EdgeCases: Story = {
  name: 'Edge — Long Labels & Overflow',
  parameters: {
    docs: {
      description: { story: 'Labels truncate with ellipsis. HTTP badges are pinned to the right edge and never wrap or get cut off.' },
    },
  },
  render: () => (
    <NavWrapper>
      <SideNav>
        <SideNavSection label="Long label section" variant="label" />
        <SideNavGroup label="A very long group name that will certainly overflow the sidebar container width" />
        <SideNavGroup label="Long group expanded" defaultExpanded>
          <SideNavItem
            label="This endpoint has a very long name that should truncate gracefully"
            type="endpoint"
            method="POST"
          />
          <SideNavItem
            label="Another long label here with DELETE method"
            type="endpoint"
            method="DELETE"
            active
          />
          <SideNavItem
            label="Short"
            type="endpoint"
            method="GET"
          />
        </SideNavGroup>
      </SideNav>
    </NavWrapper>
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => {
    const [active, setActive] = useState('cancel-payment');
    return (
      <div data-theme="dark">
        <div style={{
          width: 280,
          background: 'var(--color-gray-1200)',
          borderRight: '1px solid var(--color-gray-1000)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          minHeight: 400,
        }}>
          <SideNav>
            <SideNavSection label="References" variant="label" />
            <SideNavGroup label="Fetch Bill Request" />
            <SideNavGroup label="Fetch Biller Info" />
            <SideNav.Divider />
            <SideNavSection label="Payment" variant="category" />
            <SideNavGroup label="Create Bill Payment" defaultExpanded>
              <SideNavItem label="Validate Payment"   type="endpoint" method="POST" active={active === 'validate'}       onClick={() => setActive('validate')}       />
              <SideNavItem label="Cancel Payment"     type="endpoint" method="POST" active={active === 'cancel-payment'} onClick={() => setActive('cancel-payment')} />
              <SideNavItem label="Transaction Report" type="endpoint" method="HEAD" active={active === 'report'}         onClick={() => setActive('report')}         />
            </SideNavGroup>
            <SideNav.Divider />
            <SideNavSection label="Docs" variant="category" />
            <SideNavItem label="Getting Started" type="guide" active={active === 'guide'} onClick={() => setActive('guide')} />
            <SideNavItem label="Authentication"  type="guide" />
          </SideNav>
        </div>
      </div>
    );
  },
};
