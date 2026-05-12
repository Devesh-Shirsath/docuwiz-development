import type { Meta, StoryObj } from '@storybook/react';
import styles from './Tokens.module.css';

const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <div className={styles.swatch}>
    <div className={styles.swatchColor} style={{ background: `var(${name})` }} />
    <div className={styles.swatchLabel}>
      <span className={styles.swatchName}>{name}</span>
      <span className={styles.swatchValue}>{value}</span>
    </div>
  </div>
);

const TokensPage = () => (
  <div className={styles.page}>
    <h1 className={styles.heading}>Design Tokens</h1>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Gray Scale</h2>
      <div className={styles.swatchGrid}>
        {[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300].map((n) => (
          <ColorSwatch key={n} name={`--color-gray-${n}`} value={`Gray ${n}`} />
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Brand & Accent</h2>
      <div className={styles.swatchGrid}>
        <ColorSwatch name="--color-brand" value="Brand" />
        <ColorSwatch name="--color-accent-blue-primary" value="Blue Primary" />
        <ColorSwatch name="--color-accent-blue-secondary" value="Blue Secondary" />
        <ColorSwatch name="--color-accent-blue-tertiary" value="Blue Tertiary" />
        <ColorSwatch name="--color-accent-green-primary" value="Green Primary" />
        <ColorSwatch name="--color-accent-green-secondary" value="Green Secondary" />
        <ColorSwatch name="--color-accent-green-tertiary" value="Green Tertiary" />
        <ColorSwatch name="--color-accent-red-primary" value="Red Primary" />
        <ColorSwatch name="--color-accent-red-secondary" value="Red Secondary" />
        <ColorSwatch name="--color-accent-red-tertiary" value="Red Tertiary" />
        <ColorSwatch name="--color-accent-orange-primary" value="Orange Primary" />
        <ColorSwatch name="--color-accent-orange-secondary" value="Orange Secondary" />
        <ColorSwatch name="--color-accent-orange-tertiary" value="Orange Tertiary" />
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Semantic: Font</h2>
      <div className={styles.swatchGrid}>
        {['primary','secondary','tertiary','disabled','link','inverse'].map((v) => (
          <ColorSwatch key={v} name={`--color-font-${v}`} value={`Font ${v}`} />
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Semantic: Surface</h2>
      <div className={styles.swatchGrid}>
        {['ground','step-up','l2','l3','step-down','invert','orange','red','blue','yellow','green'].map((v) => (
          <ColorSwatch key={v} name={`--color-surface-${v}`} value={`Surface ${v}`} />
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>HTTP Methods</h2>
      <div className={styles.swatchGrid}>
        {['get','post','put','patch','delete','options','head','trace'].map((m) => (
          <ColorSwatch key={m} name={`--color-method-${m}`} value={m.toUpperCase()} />
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Shadows</h2>
      <div className={styles.shadowGrid}>
        {[100,200,300,400,500].map((n) => (
          <div key={n} className={styles.shadowBox} style={{ boxShadow: `var(--shadow-${n})` }}>
            shadow-{n}
          </div>
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Border Radius</h2>
      <div className={styles.radiusGrid}>
        {[
          { name: 'none', val: '0px' },
          { name: 'xs', val: '4px' },
          { name: 's', val: '8px' },
          { name: 'm', val: '12px' },
          { name: 'l', val: '16px' },
          { name: 'xl', val: '20px' },
          { name: '2xl', val: '24px' },
          { name: 'full', val: '9999px' },
        ].map(({ name, val }) => (
          <div key={name} className={styles.radiusBox}>
            <div className={styles.radiusSample} style={{ borderRadius: `var(--radius-${name})` }} />
            <span>{name} ({val})</span>
          </div>
        ))}
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Typography</h2>
      <div className={styles.typeStack}>
        <div style={{ font: 'var(--typography-title)' }}>Title — Libre Baskerville 40/48</div>
        <div style={{ font: 'var(--typography-h1)' }}>H1 — Inter Bold 21/26</div>
        <div style={{ font: 'var(--typography-h2)' }}>H2 — Inter Bold 17/24</div>
        <div style={{ font: 'var(--typography-body-xl-regular)' }}>Body XL Regular — Inter 18/28</div>
        <div style={{ font: 'var(--typography-body-l-regular)' }}>Body L Regular — Inter 16/24</div>
        <div style={{ font: 'var(--typography-body-m-regular)' }}>Body M Regular — Inter 15/22.5</div>
        <div style={{ font: 'var(--typography-body-s-regular)' }}>Body S Regular — Inter 14/22</div>
        <div style={{ font: 'var(--typography-body-xs-regular)' }}>Body XS Regular — Inter 12/18</div>
        <div style={{ font: 'var(--typography-code-l-regular)', fontFamily: 'var(--font-mono)' }}>Code L Regular — Geist Mono 16/24</div>
        <div style={{ font: 'var(--typography-code-m-regular)', fontFamily: 'var(--font-mono)' }}>Code M Regular — Geist Mono 14/22</div>
        <div style={{ font: 'var(--typography-caption-m)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Caption M — Inter Medium 12/16</div>
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Foundation/Tokens',
  component: TokensPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const AllTokens: Story = {};
