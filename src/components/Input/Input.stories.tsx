import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { iconNames } from '@/utils/iconMap';
import type { IconWeight } from '@phosphor-icons/react';

/* ── Meta ───────────────────────────────────────────────────────────────── */
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Single-line text input with full state and slot coverage.

**States at a glance**

| State | When to use |
|---|---|
| **default** | Field is empty and ready |
| **hover** | Handled by CSS — no prop needed |
| **focus** | Handled by CSS — brand ring appears automatically |
| **disabled** | User cannot interact — add a tooltip or explanatory text nearby |
| **readOnly** | Value is visible and copyable but not editable (e.g. API key display) |
| **error** | Validation failed — always pair with a \`stateMessage\` |
| **success** | Field is confirmed valid (e.g. username availability check) |
| **warning** | Valid but needs attention — use sparingly or it becomes noise |

**Label rules** — always provide a \`label\`. Screen readers and password managers rely on it. Use \`aria-label\` only when a visible label is truly impossible (e.g. a search bar with a magnifying-glass icon and obvious context).

**Helper vs state message** — helper text is permanent guidance. State message replaces it when validation fires. Keep both under one line.
        `,
      },
    },
  },
  argTypes: {
    size:       { control: 'inline-radio', options: ['medium', 'small'] },
    inputState: { control: 'inline-radio', options: ['default', 'error', 'success', 'warning'] },
    leadingIconName:  { control: 'select', options: ['none', ...iconNames] },
    trailingIconName: { control: 'select', options: ['none', ...iconNames] },
    iconWeight: {
      control: 'select',
      options: ['thin','light','regular','bold','fill','duotone'] satisfies IconWeight[],
    },
  },
  args: {
    placeholder: 'Placeholder text',
    size: 'medium',
    inputState: 'default',
    fullWidth: false,
    disabled: false,
    readOnly: false,
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

/* ── Stories ─────────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email.",
    leadingIconName: 'Envelope',
  },
};

export const AllStates: Story = {
  name: 'All States',
  parameters: {
    docs: {
      description: { story: 'Every state in one view. Click into a field to see the focus ring. Note how `disabled` uses reduced opacity while `readOnly` keeps full opacity but signals non-editability through cursor and background.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
      <Input
        label="Default"
        placeholder="Placeholder text"
        helperText="This is a helper message"
      />
      <Input
        label="Focused (click into field)"
        placeholder="Focus me"
        helperText="Focus ring uses brand accent color"
        leadingIconName="MagnifyingGlass"
        defaultValue=""
        autoFocus
      />
      <Input
        label="With value"
        defaultValue="John Appleseed"
        helperText="Value entered by the user"
      />
      <Input
        label="Disabled"
        placeholder="Placeholder text"
        helperText="This field cannot be edited"
        disabled
        defaultValue="Cannot edit"
      />
      <Input
        label="Read-only"
        defaultValue="read-only-value"
        helperText="Value is visible but not editable"
        readOnly
      />
      <Input
        label="Error"
        defaultValue="invalid-email"
        inputState="error"
        stateMessage="Please enter a valid email address"
        leadingIconName="Envelope"
      />
      <Input
        label="Success"
        defaultValue="john@example.com"
        inputState="success"
        stateMessage="Email address is available"
        leadingIconName="Envelope"
      />
      <Input
        label="Warning"
        defaultValue="admin"
        inputState="warning"
        stateMessage="This username is reserved — choose another"
        leadingIconName="User"
      />
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — Medium / Small',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input
        label="Medium (default)"
        placeholder="Medium input"
        size="medium"
        leadingIconName="MagnifyingGlass"
      />
      <Input
        label="Small"
        placeholder="Small input"
        size="small"
        leadingIconName="MagnifyingGlass"
      />
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'Leading & Trailing Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input label="Search" placeholder="Search anything…" leadingIconName="MagnifyingGlass" />
      <Input label="Email" placeholder="you@example.com" leadingIconName="Envelope" trailingIconName="CheckCircle" />
      <Input label="Password" placeholder="••••••••" leadingIconName="Lock" type="password" />
      <Input label="URL" placeholder="https://example.com" leadingIconName="LinkSimple" trailingIconName="ArrowSquareOut" />
    </div>
  ),
};

export const PrefixSuffix: Story = {
  name: 'Prefix & Suffix Text',
  parameters: {
    docs: {
      description: { story: 'Use `prefix`/`suffix` for fixed context that is part of the format (units, protocol, domain). Do not use both a prefix and a suffix with a leading icon at the same time — the field becomes too busy.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input label="Website" placeholder="yoursite" prefix="https://" suffix=".com" />
      <Input label="Price" placeholder="0.00" prefix="$" inputState="default" type="number" />
      <Input label="Discount" placeholder="10" suffix="%" type="number" />
      <Input label="API key" placeholder="sk-…" prefix="Bearer" />
    </div>
  ),
};

export const LabelVariants: Story = {
  name: 'Label Variants — Required / Optional',
  parameters: {
    docs: {
      description: { story: 'Choose one convention per form — either mark required fields with `*` or mark optional ones with `(optional)`. Mixing both creates confusion. The `(optional)` pattern works best when most fields are required and only one or two are not.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input label="Username" placeholder="Pick a username" required helperText="3–20 characters" />
      <Input label="Display name" placeholder="How others see you" optionalLabel />
      <Input label="No label at all" placeholder="Label-free field" />
    </div>
  ),
};

export const ValidationStates: Story = {
  name: 'Validation States',
  parameters: {
    docs: {
      description: { story: '**Error** is the most common validation state — always explain what is wrong and how to fix it. **Success** is optional; only show it when confirmation genuinely reduces anxiety (e.g. checking username availability). **Warning** is for edge cases — valid but risky.' },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input
        label="Default"
        placeholder="Enter value"
        helperText="Neutral helper text"
        leadingIconName="User"
      />
      <Input
        label="Error"
        defaultValue="bad input"
        inputState="error"
        stateMessage="This field is required"
        leadingIconName="User"
      />
      <Input
        label="Success"
        defaultValue="valid input"
        inputState="success"
        stateMessage="Looks good!"
        leadingIconName="User"
      />
      <Input
        label="Warning"
        defaultValue="borderline"
        inputState="warning"
        stateMessage="This may cause issues"
        leadingIconName="User"
      />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Controlled — Live Character Count',
  parameters: {
    docs: {
      description: { story: 'Controlled pattern with live feedback. State transitions: default → warning at 85% of limit → error when over. The `stateMessage` and `helperText` swap automatically — only one shows at a time.' },
    },
  },
  render: () => {
    const [val, setVal] = useState('');
    const max = 60;
    const over = val.length > max;
    return (
      <div style={{ maxWidth: 360 }}>
        <Input
          label="Bio"
          placeholder="Tell us about yourself…"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          inputState={over ? 'error' : val.length > max * 0.85 ? 'warning' : 'default'}
          stateMessage={over ? `${val.length - max} characters over limit` : undefined}
          helperText={!over ? `${val.length} / ${max}` : undefined}
          fullWidth
        />
      </div>
    );
  },
};

export const SearchField: Story = {
  name: 'Search Field Pattern',
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Input
          placeholder="Search components, tokens, stories…"
          leadingIconName="MagnifyingGlass"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          aria-label="Search"
        />
        {query && (
          <p style={{ fontSize: 13, color: 'var(--color-font-tertiary)' }}>
            Searching for: <strong>{query}</strong>
          </p>
        )}
      </div>
    );
  },
};

export const InputTypes: Story = {
  name: 'Input Types',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input label="Text"     type="text"     placeholder="Plain text"     />
      <Input label="Email"    type="email"    placeholder="you@example.com" leadingIconName="Envelope" />
      <Input label="Password" type="password" placeholder="••••••••"        leadingIconName="Lock"     />
      <Input label="Number"   type="number"   placeholder="0"               prefix="$"                 />
      <Input label="Tel"      type="tel"      placeholder="+1 (555) 000-0000" leadingIconName="Phone"  />
      <Input label="URL"      type="url"      placeholder="https://"         leadingIconName="Globe"   />
      <Input label="Date"     type="date"                                    leadingIconName="CalendarBlank" />
    </div>
  ),
};

export const FullWidthGroup: Story = {
  name: 'Form Group — Full Width',
  render: () => (
    <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="First name" placeholder="John" required fullWidth />
        <Input label="Last name"  placeholder="Appleseed" required fullWidth />
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leadingIconName="Envelope"
        required
        fullWidth
      />
      <Input
        label="Company website"
        placeholder="example.com"
        prefix="https://"
        suffix=".com"
        fullWidth
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        leadingIconName="Lock"
        required
        helperText="Use a mix of letters, numbers, and symbols"
        fullWidth
      />
    </div>
  ),
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <div data-theme="dark" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <Input label="Default"   placeholder="Placeholder text"    leadingIconName="MagnifyingGlass" />
      <Input label="With value" defaultValue="John Appleseed"    leadingIconName="User" />
      <Input label="Disabled"  placeholder="Cannot edit"         disabled defaultValue="Disabled" />
      <Input label="Read-only" defaultValue="read-only-value"    readOnly />
      <Input label="Error"     defaultValue="bad value"          inputState="error"   stateMessage="Invalid value" leadingIconName="WarningCircle" />
      <Input label="Success"   defaultValue="valid value"        inputState="success" stateMessage="All good!"     leadingIconName="CheckCircle"   />
    </div>
  ),
};
