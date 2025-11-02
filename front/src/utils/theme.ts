import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const VenofyTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',  // main titanium
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#0f172a'   // deep carbon
    },
    secondary: {
      50:  '#fefefe',
      100: '#f7f7f7',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',  // main secondary gray
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0f0f0f'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        surface: {
          0: '#ffffff',
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#c0c0c0',
          500: '#b0b0b0'
        }
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '#0a0a0a',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}'
        },
        surface: {
          0: '#121212',
          50: '#1a1a1a',
          100: '#1f1f1f',
          200: '#262626',
          300: '#303030',
          400: '#3a3a3a',
          500: '#444444',
          600: '#555555',
          700: '#666666',
          800: '#7a7a7a',
          900: '#8f8f8f',
          950: '#a3a3a3'
        }
      }
    }
  }
});
