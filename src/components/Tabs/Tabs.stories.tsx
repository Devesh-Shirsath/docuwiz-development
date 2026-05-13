import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';
import { iconNames } from '@/utils/iconMap';

/* ── Meta ───────────────────────────────────────────────────────────────── */
const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Tabs organise content into parallel, mutually exclusive views on the same surface.

| Use when | Avoid |
|---|---|
| You have 2–7 distinct views of the same context | You have 8+ tabs — consider a Dropdown or sidebar nav instead |
| Content categories are roughly equal in importance | One tab is visited far more than others — surface that content directly |
| Users need to switch quickly without leaving the page | The tabs represent sequential steps — use a Stepper instead |

**Line vs Pill variant**
- **Line** — default. Use for page-level or section-level navigation (sits on the page's background).
- **Pill** — use inside cards, panels, or dialogs where the ambient surface already has a border. The pill provides its own container.

**Count badge** — shows unread items, result counts, or pending actions inline. Use it to help users prioritise — not as decoration. Hide the badge when the count reaches zero rather than showing 0.

**Keyboard** — Arrow Left/Right navigate between tabs, Home/End jump to first/last.
        `,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'pill'] },
    fullWidth: { control: 'boolean' },
    iconWeight: {
      control: 'select',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    },
  },
  args: {
    variant: 'line',
    fullWidth: false,
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

/* ── Shared sample data ─────────────────────────────────────────────────── */
const basicTabs: TabItem[] = [
  { value: 'overview',  label: 'Overview'  },
  { value: 'endpoints', label: 'Endpoints' },
  { value: 'schemas',   label: 'Schemas'   },
  { value: 'changelog', label: 'Changelog' },
];

const countTabs: TabItem[] = [
  { value: 'all',      label: 'All',      count: 128 },
  { value: 'open',     label: 'Open',     count: 24  },
  { value: 'resolved', label: 'Resolved', count: 99  },
  { value: 'archived', label: 'Archived', count: 5   },
];

const iconTabs: TabItem[] = [
  { value: 'api',      label: 'API',      leadingIconName: 'Plugs'         },
  { value: 'schema',   label: 'Schema',   leadingIconName: 'Table'         },
  { value: 'webhooks', label: 'Webhooks', leadingIconName: 'Webhooks'      },
  { value: 'logs',     label: 'Logs',     leadingIconName: 'ListBullets'   },
];

/* ── Stories ─────────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    tabs: countTabs,
    defaultValue: 'open',
  },
  parameters: {
    docs: {
      description: { story: 'Interactive sandbox. Swap `variant` in the Controls panel to compare line and pill styles.' },
    },
  },
};

export const LineVariant: Story = {
  name: 'Line — Default',
  parameters: {
    docs: {
      description: { story: 'The default variant. The 2px brand underline on the active tab sits on top of the 1px strip border — no gap, no double-line.' },
    },
  },
  render: () => {
    const [active, setActive] = useState('endpoints');
    return (
      <Tabs
        tabs={basicTabs}
        value={active}
        onChange={setActive}
        variant="line"
      />
    );
  },
};

export const PillVariant: Story = {
  name: 'Pill — In-page Switching',
  parameters: {
    docs: {
      description: { story: 'Use inside cards, panels, or anywhere the background already has a container. The pill provides its own surface — do not place a pill Tabs directly on the page background.' },
    },
  },
  render: () => {
    const [active, setActive] = useState('api');
    return (
      <div style={{ maxWidth: 480 }}>
        <Tabs
          tabs={iconTabs}
          value={active}
          onChange={setActive}
          variant="pill"
        />
      </div>
    );
  },
};

export const WithCountBadges: Story = {
  name: 'With Count Badges',
  parameters: {
    docs: {
      description: { story: 'Count badges signal unread items, result totals, or pending actions. The active tab\'s badge takes a brand tint to stay readable. Counts cap at 999+ to avoid overflow.' },
    },
  },
  render: () => {
    const [active, setActive] = useState('open');
    return (
      <Tabs
        tabs={countTabs}
        value={active}
        onChange={setActive}
        variant="line"
      />
    );
  },
};

export const WithIcons: Story = {
  name: 'With Leading Icons',
  parameters: {
    docs: {
      description: { story: 'Icons reinforce the label — use them when the category has a clear, recognisable icon. Avoid icons that need to be learned; the label should carry the meaning on its own.' },
    },
  },
  render: () => {
    const [active, setActive] = useState('api');
    return (
      <Tabs
        tabs={iconTabs}
        value={active}
        onChange={setActive}
        variant="line"
      />
    );
  },
};

export const IconsAndCounts: Story = {
  name: 'Icons + Count Badges',
  parameters: {
    docs: {
      description: { story: 'Icons and counts can coexist. Keep labels short — a tab should not need more than 2 words.' },
    },
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'issues',   label: 'Issues',   leadingIconName: 'Warning',       count: 12 },
      { value: 'prs',      label: 'Pull Requests', leadingIconName: 'GitPullRequest', count: 4 },
      { value: 'actions',  label: 'Actions',  leadingIconName: 'Lightning',     count: 0  },
      { value: 'settings', label: 'Settings', leadingIconName: 'GearSix'                  },
    ];
    const [active, setActive] = useState('issues');
    return (
      <Tabs
        tabs={tabs}
        value={active}
        onChange={setActive}
        variant="line"
      />
    );
  },
};

export const WithPanels: Story = {
  name: 'With Content Panels',
  parameters: {
    docs: {
      description: { story: 'Pass children to render panels inline. Each child maps to the tab at the same index. For complex routing or lazy-loaded panels, manage the panels yourself and only use `value`/`onChange`.' },
    },
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'overview',  label: 'Overview',  count: undefined },
      { value: 'endpoints', label: 'Endpoints', count: 14        },
      { value: 'schemas',   label: 'Schemas',   count: 6         },
    ];

    const panelStyle: React.CSSProperties = {
      background: 'var(--color-surface-l2)',
      border: '1px solid var(--color-stroke-gray-primary)',
      borderRadius: 'var(--radius-card)',
      padding: 24,
      font: 'var(--typography-body-s-regular)',
      color: 'var(--color-font-secondary)',
      minHeight: 120,
    };

    return (
      <Tabs tabs={tabs} defaultValue="overview" variant="line">
        <div style={panelStyle}>
          <strong style={{ color: 'var(--color-font-primary)' }}>Overview</strong>
          <p style={{ marginTop: 8 }}>High-level summary of the API: description, version, contact, license, and servers.</p>
        </div>
        <div style={panelStyle}>
          <strong style={{ color: 'var(--color-font-primary)' }}>Endpoints <span style={{ color: 'var(--color-font-tertiary)', fontWeight: 400 }}>(14)</span></strong>
          <p style={{ marginTop: 8 }}>All paths, methods, parameters, request bodies, and responses.</p>
        </div>
        <div style={panelStyle}>
          <strong style={{ color: 'var(--color-font-primary)' }}>Schemas <span style={{ color: 'var(--color-font-tertiary)', fontWeight: 400 }}>(6)</span></strong>
          <p style={{ marginTop: 8 }}>Reusable data models defined in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>components/schemas</code>.</p>
        </div>
      </Tabs>
    );
  },
};

export const FullWidth: Story = {
  name: 'Full Width',
  parameters: {
    docs: {
      description: { story: 'Tabs stretch to fill the container. Works best when you have 3–5 short-label tabs and want them evenly distributed (e.g. mobile, modal tabs).' },
    },
  },
  render: () => {
    const [active, setActive] = useState('overview');
    return (
      <div style={{ maxWidth: 480 }}>
        <Tabs
          tabs={basicTabs}
          value={active}
          onChange={setActive}
          variant="line"
          fullWidth
        />
      </div>
    );
  },
};

export const PillFullWidth: Story = {
  name: 'Pill Full Width',
  render: () => {
    const tabs: TabItem[] = [
      { value: 'day',   label: 'Day'   },
      { value: 'week',  label: 'Week'  },
      { value: 'month', label: 'Month' },
    ];
    const [active, setActive] = useState('week');
    return (
      <div style={{ maxWidth: 320 }}>
        <Tabs
          tabs={tabs}
          value={active}
          onChange={setActive}
          variant="pill"
          fullWidth
        />
      </div>
    );
  },
};

export const WithDisabled: Story = {
  name: 'Disabled Tabs',
  parameters: {
    docs: {
      description: { story: 'Disabled tabs are visible but not interactive. Always explain nearby why a tab is disabled — do not leave users guessing. Prefer hiding unavailable tabs over disabling them if the count is low.' },
    },
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'overview',  label: 'Overview'             },
      { value: 'endpoints', label: 'Endpoints', count: 14 },
      { value: 'analytics', label: 'Analytics', disabled: true },
      { value: 'settings',  label: 'Settings',  disabled: true },
    ];
    const [active, setActive] = useState('overview');
    return (
      <>
        <Tabs tabs={tabs} value={active} onChange={setActive} variant="line" />
        <p style={{ marginTop: 12, font: 'var(--typography-body-xs-regular)', color: 'var(--color-font-tertiary)' }}>
          Analytics and Settings are disabled — upgrade your plan to unlock.
        </p>
      </>
    );
  },
};

export const LiveCountUpdate: Story = {
  name: 'Live Count Update',
  parameters: {
    docs: {
      description: { story: 'Count badges update live as data changes. The badge on the active tab stays in brand tint so it remains readable against the active indicator.' },
    },
  },
  render: () => {
    const [counts, setCounts] = useState({ pending: 3, approved: 7, rejected: 1 });
    const tabs: TabItem[] = [
      { value: 'pending',  label: 'Pending',  count: counts.pending  },
      { value: 'approved', label: 'Approved', count: counts.approved },
      { value: 'rejected', label: 'Rejected', count: counts.rejected },
    ];
    const [active, setActive] = useState('pending');

    const simulate = () => {
      setCounts({
        pending:  Math.floor(Math.random() * 20),
        approved: Math.floor(Math.random() * 50),
        rejected: Math.floor(Math.random() * 10),
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Tabs tabs={tabs} value={active} onChange={setActive} variant="line" />
        <button
          type="button"
          onClick={simulate}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 12px',
            fontSize: 13,
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            background: 'var(--color-surface-l2)',
            border: '1.5px solid var(--color-stroke-gray-secondary)',
            borderRadius: 'var(--radius-button)',
            cursor: 'pointer',
            color: 'var(--color-font-primary)',
          }}
        >
          Simulate update
        </button>
      </div>
    );
  },
};

export const ManyTabs: Story = {
  name: 'Edge — Many Tabs',
  parameters: {
    docs: {
      description: { story: 'Beyond 7 tabs the strip gets crowded. Consider splitting into groups, using a Dropdown for overflow, or rethinking the IA.' },
    },
  },
  render: () => {
    const tabs: TabItem[] = [
      { value: 'a', label: 'Overview'   },
      { value: 'b', label: 'Endpoints', count: 42 },
      { value: 'c', label: 'Schemas'   },
      { value: 'd', label: 'Webhooks'  },
      { value: 'e', label: 'Auth'      },
      { value: 'f', label: 'Analytics' },
      { value: 'g', label: 'Logs',     count: 1247 },
      { value: 'h', label: 'Settings'  },
    ];
    const [active, setActive] = useState('a');
    return <Tabs tabs={tabs} value={active} onChange={setActive} variant="line" />;
  },
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => {
    const [lineActive, setLineActive] = useState('open');
    const [pillActive, setPillActive] = useState('week');

    const pillTabs: TabItem[] = [
      { value: 'day',   label: 'Day'   },
      { value: 'week',  label: 'Week'  },
      { value: 'month', label: 'Month' },
    ];

    return (
      <div data-theme="dark" style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}>
        <Tabs
          tabs={countTabs}
          value={lineActive}
          onChange={setLineActive}
          variant="line"
        />
        <div style={{ maxWidth: 280 }}>
          <Tabs
            tabs={pillTabs}
            value={pillActive}
            onChange={setPillActive}
            variant="pill"
            fullWidth
          />
        </div>
      </div>
    );
  },
};
