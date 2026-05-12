import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';
import { iconNames } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';

/* ── Meta ───────────────────────────────────────────────────────────────── */
const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A trigger button that reveals a contextual popup menu of \`DropdownItem\` options.

| Use when | Avoid |
|---|---|
| You have 3+ related actions to surface without cluttering the layout | You have 1–2 actions — show them as plain Buttons instead |
| The action set is contextual (changes per row, per selection) | The list never changes — a static nav link is clearer |
| Space is constrained and actions are secondary | The primary call-to-action — keep that as a visible Button |

**Single-select vs multi-select** — for single-select, clicking an item should close the popup and update the trigger label. For multi-select, use \`checkbox\` on each item and keep the popup open until the user dismisses it.

**Keyboard** — Arrow keys navigate items, Enter/Space activates, Escape closes and returns focus to the trigger.
        `,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    size:    { control: 'inline-radio', options: ['medium', 'small'] },
    align:   { control: 'inline-radio', options: ['start', 'end'] },
    popupWidth: { control: 'inline-radio', options: ['trigger', 'auto'] },
    iconLeftName: { control: 'select', options: ['none', ...iconNames] },
    iconWeight:   { control: 'select', options: ['thin','light','regular','bold','fill','duotone'] satisfies IconWeight[] },
  },
  args: {
    variant: 'secondary',
    size: 'medium',
    label: 'Options',
    align: 'start',
    popupWidth: 'trigger',
    disabled: false,
    fullWidth: false,
  },
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

/* ── Helper: sample items ───────────────────────────────────────────────── */
const BasicItems = ({ onSelect }: { onSelect?: (v: string) => void }) => (
  <>
    <DropdownItem label="Edit"   leadingIconName="PencilSimple" onClick={() => onSelect?.('edit')}   />
    <DropdownItem label="Duplicate" leadingIconName="CopySimple" onClick={() => onSelect?.('dupe')} />
    <DropdownItem label="Share"  leadingIconName="ShareNetwork" onClick={() => onSelect?.('share')}  />
    <hr />
    <DropdownItem label="Delete" leadingIconName="Trash" destructive onClick={() => onSelect?.('delete')} />
  </>
);

/* ── Stories ─────────────────────────────────────────────────────────────── */

export const Playground: Story = {
  render: (args) => (
    <div style={{ paddingBottom: 220 }}>
      <Dropdown {...args}>
        <DropdownItem label="View details"   leadingIconName="Eye"           />
        <DropdownItem label="Edit"           leadingIconName="PencilSimple"  />
        <DropdownItem label="Duplicate"      leadingIconName="CopySimple"    />
        <DropdownItem label="Export as PDF"  leadingIconName="FilePdf"       />
        <hr />
        <DropdownItem label="Archive"        leadingIconName="Archive"       />
        <DropdownItem label="Delete"         leadingIconName="Trash"         destructive />
      </Dropdown>
    </div>
  ),
};

export const Variants: Story = {
  name: 'Variants — Primary / Secondary / Ghost',
  parameters: {
    docs: {
      description: { story: '**Primary** when the dropdown is the headline action. **Secondary** alongside other controls (most common). **Ghost** in toolbars, table rows, or card headers where a border would be too loud.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 200 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((v) => (
        <Dropdown key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v}>
          <BasicItems />
        </Dropdown>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — Medium / Small',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 200 }}>
      {(['medium', 'small'] as const).map((s) => (
        <Dropdown key={s} label={s === 'medium' ? 'Medium' : 'Small'} size={s} variant="secondary">
          <BasicItems />
        </Dropdown>
      ))}
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  name: 'Trigger With Leading Icon',
  render: () => (
    <div style={{ display: 'flex', gap: 12, paddingBottom: 200 }}>
      <Dropdown label="Export" iconLeftName="Export" variant="primary">
        <DropdownItem label="Export as CSV"  leadingIconName="FileCsv"   />
        <DropdownItem label="Export as PDF"  leadingIconName="FilePdf"   />
        <DropdownItem label="Export as JSON" leadingIconName="FileJs"    />
      </Dropdown>
      <Dropdown label="Sort by" iconLeftName="SortAscending" variant="secondary">
        <DropdownItem label="Name A → Z"      leadingIconName="SortAscending"  />
        <DropdownItem label="Name Z → A"      leadingIconName="SortDescending" />
        <DropdownItem label="Date modified"   leadingIconName="CalendarBlank"  />
        <DropdownItem label="Date created"    leadingIconName="Clock"          />
      </Dropdown>
    </div>
  ),
};

export const WithDescriptions: Story = {
  name: 'Items With Descriptions',
  parameters: {
    docs: {
      description: { story: 'Add `description` only when the label alone is genuinely ambiguous. Avoid restating the label in different words — that adds noise without value. Set `popupWidth="auto"` so descriptions are not truncated.' },
    },
  },
  render: () => (
    <div style={{ paddingBottom: 280 }}>
      <Dropdown label="Create new" iconLeftName="Plus" variant="primary" popupWidth="auto">
        <DropdownItem
          label="API Endpoint"
          description="Add a new REST or GraphQL endpoint"
          leadingIconName="Plugs"
        />
        <DropdownItem
          label="Data Model"
          description="Define a new schema or entity type"
          leadingIconName="Table"
        />
        <DropdownItem
          label="Webhook"
          description="Configure an outbound webhook trigger"
          leadingIconName="Webhooks"
        />
        <hr />
        <DropdownItem
          label="From template"
          description="Start from a pre-built template"
          leadingIconName="Blueprint"
        />
      </Dropdown>
    </div>
  ),
};

export const WithTrailingIcons: Story = {
  name: 'Items With Trailing Icons',
  render: () => (
    <div style={{ paddingBottom: 200 }}>
      <Dropdown label="View" variant="secondary" iconLeftName="Eye">
        <DropdownItem label="Open in tab"   leadingIconName="Eye"         trailingIconName="ArrowSquareOut" />
        <DropdownItem label="Copy link"     leadingIconName="Link"        trailingIconName="CopySimple"     />
        <DropdownItem label="Download"      leadingIconName="DownloadSimple" trailingIconName="ArrowLineDown" />
      </Dropdown>
    </div>
  ),
};

export const SingleSelect: Story = {
  name: 'Single Select',
  parameters: {
    docs: {
      description: { story: 'Clicking an item updates the trigger label and closes the popup. The selected item shows a checkmark. Update the trigger label to reflect the current value so the user always knows what is selected without opening the menu.' },
    },
  },
  render: () => {
    const [selected, setSelected] = useState('monthly');
    const options = [
      { value: 'daily',   label: 'Daily',   icon: 'Sun'          },
      { value: 'weekly',  label: 'Weekly',  icon: 'CalendarBlank' },
      { value: 'monthly', label: 'Monthly', icon: 'CalendarCheck' },
      { value: 'yearly',  label: 'Yearly',  icon: 'Star'          },
    ];
    const current = options.find((o) => o.value === selected);
    return (
      <div style={{ paddingBottom: 220 }}>
        <Dropdown
          label={current?.label ?? 'Select period'}
          variant="secondary"
          iconLeftName={current?.icon}
        >
          {options.map((o) => (
            <DropdownItem
              key={o.value}
              label={o.label}
              leadingIconName={o.icon}
              selected={selected === o.value}
              onClick={() => setSelected(o.value)}
            />
          ))}
        </Dropdown>
      </div>
    );
  },
};

export const MultiSelect: Story = {
  name: 'Multi Select (Checkboxes)',
  parameters: {
    docs: {
      description: { story: 'Use `checkbox` on each `DropdownItem` when multiple selections are valid at once. The popup stays open — let the user close it with Escape or a click outside. Reflect the count or a summary in the trigger label.' },
    },
  },
  render: () => {
    const options = [
      { value: 'read',    label: 'Read',    icon: 'Eye'          },
      { value: 'write',   label: 'Write',   icon: 'PencilSimple' },
      { value: 'delete',  label: 'Delete',  icon: 'Trash'        },
      { value: 'admin',   label: 'Admin',   icon: 'ShieldCheck'  },
      { value: 'publish', label: 'Publish', icon: 'Upload'       },
    ];
    const [selected, setSelected] = useState<Set<string>>(new Set(['read', 'write']));

    const toggle = (val: string) =>
      setSelected((prev) => {
        const next = new Set(prev);
        next.has(val) ? next.delete(val) : next.add(val);
        return next;
      });

    const label = selected.size === 0
      ? 'No permissions'
      : selected.size === options.length
      ? 'All permissions'
      : `${selected.size} permission${selected.size > 1 ? 's' : ''}`;

    return (
      <div style={{ paddingBottom: 240 }}>
        <Dropdown label={label} variant="secondary" iconLeftName="ShieldCheck">
          {options.map((o) => (
            <DropdownItem
              key={o.value}
              label={o.label}
              leadingIconName={o.icon}
              checkbox
              selected={selected.has(o.value)}
              onClick={() => toggle(o.value)}
            />
          ))}
        </Dropdown>
      </div>
    );
  },
};

export const SectionedMenu: Story = {
  name: 'Sectioned / Grouped Items',
  render: () => (
    <div style={{ paddingBottom: 360 }}>
      <Dropdown label="Account" variant="ghost" iconLeftName="UserCircle" popupWidth="auto">
        <DropdownItem label="Profile"        leadingIconName="User"          description="Manage your account" />
        <DropdownItem label="Settings"       leadingIconName="GearSix"       />
        <DropdownItem label="Notifications"  leadingIconName="Bell"          />
        <hr />
        <DropdownItem label="Invite team"    leadingIconName="UserPlus"      />
        <DropdownItem label="Billing"        leadingIconName="CreditCard"    />
        <hr />
        <DropdownItem label="Help &amp; docs" leadingIconName="Question"     />
        <DropdownItem label="Sign out"       leadingIconName="SignOut"       destructive />
      </Dropdown>
    </div>
  ),
};

export const Disabled: Story = {
  name: 'Disabled State',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'ghost'] as const).map((v) => (
        <Dropdown key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} disabled>
          <BasicItems />
        </Dropdown>
      ))}
    </div>
  ),
};

export const DisabledItems: Story = {
  name: 'Items With Disabled State',
  render: () => (
    <div style={{ paddingBottom: 220 }}>
      <Dropdown label="Actions" variant="secondary">
        <DropdownItem label="Edit"       leadingIconName="PencilSimple" />
        <DropdownItem label="Publish"    leadingIconName="Upload"       disabled />
        <DropdownItem label="Duplicate"  leadingIconName="CopySimple"  />
        <DropdownItem label="Archive"    leadingIconName="Archive"      disabled />
        <hr />
        <DropdownItem label="Delete"     leadingIconName="Trash"        destructive />
      </Dropdown>
    </div>
  ),
};

export const AlignEnd: Story = {
  name: 'Popup Aligned to End',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 200 }}>
      <Dropdown label="More" variant="ghost" iconLeftName="DotsThree" align="end">
        <BasicItems />
      </Dropdown>
    </div>
  ),
};

export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <div style={{ width: 320, paddingBottom: 220 }}>
      <Dropdown label="Select a workspace" variant="secondary" fullWidth iconLeftName="Buildings">
        <DropdownItem label="DocuWiz HQ"      leadingIconName="Buildings"   />
        <DropdownItem label="Staging"          leadingIconName="Flask"       />
        <DropdownItem label="Client Alpha"     leadingIconName="Briefcase"   />
        <DropdownItem label="Personal"         leadingIconName="House"       />
      </Dropdown>
    </div>
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <div data-theme="dark" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingBottom: 220 }}>
      {(['primary', 'secondary', 'ghost'] as const).map((v) => (
        <Dropdown key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v}>
          <DropdownItem label="Edit"     leadingIconName="PencilSimple" />
          <DropdownItem label="Share"    leadingIconName="ShareNetwork" />
          <DropdownItem label="Archive"  leadingIconName="Archive"      />
          <hr />
          <DropdownItem label="Delete"   leadingIconName="Trash"        destructive />
        </Dropdown>
      ))}
    </div>
  ),
};
