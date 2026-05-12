import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';

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
        {
          name: 'light',
          value: '#fafafa',
        },
        {
          name: 'dark',
          value: '#141414',
        },
        {
          name: 'white',
          value: '#ffffff',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (375)',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        mobileLarge: {
          name: 'Mobile L (428)',
          styles: { width: '428px', height: '926px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        tabletLarge: {
          name: 'Tablet L (1024)',
          styles: { width: '1024px', height: '768px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1280)',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
        desktopLarge: {
          name: 'Desktop L (1440)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
        widescreen: {
          name: 'Widescreen (1920)',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    radius: {
      description: 'Radius mode',
      defaultValue: 'smooth',
      toolbar: {
        title: 'Radius',
        icon: 'component',
        items: [
          { value: 'sharp',   title: 'Sharp (2px)' },
          { value: 'smooth',  title: 'Smooth (default)' },
          { value: 'rounded', title: 'Rounded (pill)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      const radius = context.globals.radius || 'smooth';
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-radius', radius);
      return Story();
    },
  ],
};

export default preview;
