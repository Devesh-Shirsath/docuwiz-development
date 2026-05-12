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
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dropdown trigger button (primary / secondary / ghost) with a popup overlay. ' +
          'Supports single-select, multi-select, icons, descriptions, destructive items, ' +
          'keyboard navigation (Arrow keys, Escape), and click-outside to close.',
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
