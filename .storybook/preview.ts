import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';

const RADIUS_OPTIONS = ['sharp', 'smooth', 'rounded'] as const;
const THEME_OPTIONS  = ['light', 'dark'] as const;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#fafafa' },
        { name: 'dark',  value: '#141414' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    viewport: {
      viewports: {
        mobile:      { name: 'Mobile (375)',      styles: { width: '375px',  height: '812px'  }, type: 'mobile'  },
        mobileLarge: { name: 'Mobile L (428)',    styles: { width: '428px',  height: '926px'  }, type: 'mobile'  },
        tablet:      { name: 'Tablet (768)',      styles: { width: '768px',  height: '1024px' }, type: 'tablet'  },
        tabletLarge: { name: 'Tablet L (1024)',   styles: { width: '1024px', height: '768px'  }, type: 'tablet'  },
        desktop:     { name: 'Desktop (1280)',    styles: { width: '1280px', height: '800px'  }, type: 'desktop' },
        desktopLarge:{ name: 'Desktop L (1440)', styles: { width: '1440px', height: '900px'  }, type: 'desktop' },
        widescreen:  { name: 'Widescreen (1920)',styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
      },
    },
  },

  /* ─── Global toolbar toggles ─────────────────────────────────────────────── */
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark',  title: 'Dark'  },
        ],
        dynamicTitle: true,
      },
    },
    radius: {
      description: 'Radius mode (toolbar)',
      defaultValue: 'smooth',
      toolbar: {
        title: 'Radius',
        icon: 'component',
        items: [
          { value: 'sharp',   title: 'Sharp (2px)'       },
          { value: 'smooth',  title: 'Smooth (default)'  },
          { value: 'rounded', title: 'Rounded (pill)'    },
        ],
        dynamicTitle: true,
      },
    },
  },

  /* ─── Global argTypes — appear in Controls panel of EVERY story ───────────
     radiusMode in Controls lets you test per-story without touching the
     global toolbar. It takes priority over the toolbar when set.          */
  argTypes: {
    radiusMode: {
      name: 'Radius mode',
      control: 'inline-radio',
      options: RADIUS_OPTIONS,
      description:
        'Override border-radius tokens for this story. Applies `data-radius` on `<html>`.',
      table: {
        category: 'Theme',
        defaultValue: { summary: 'smooth' },
      },
    },
    colorTheme: {
      name: 'Color theme',
      control: 'inline-radio',
      options: THEME_OPTIONS,
      description:
        'Override light/dark theme for this story. Applies `data-theme` on `<html>`.',
      table: {
        category: 'Theme',
        defaultValue: { summary: 'light' },
      },
    },
  },

  args: {
    radiusMode: 'smooth',
    colorTheme: 'light',
  },

  /* ─── Decorator ───────────────────────────────────────────────────────────
     Priority: story Controls (args) > global toolbar (globals)
     radiusMode / colorTheme are stripped from args before Story() renders
     so they never leak as HTML attributes on components.                  */
  decorators: [
    (Story, context) => {
      // Read from story-level controls first, fall back to toolbar globals
      const radiusMode = (context.args.radiusMode as string) || context.globals.radius  || 'smooth';
      const colorTheme = (context.args.colorTheme as string) || context.globals.theme   || 'light';

      // Apply to <html> so CSS [data-*] selectors pick it up
      document.documentElement.setAttribute('data-radius', radiusMode);
      document.documentElement.setAttribute('data-theme',  colorTheme);

      // Strip theme controls from args so they don't get spread onto components
      delete (context.args as Record<string, unknown>).radiusMode;
      delete (context.args as Record<string, unknown>).colorTheme;

      return Story();
    },
  ],
};

export default preview;
