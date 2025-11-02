import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { VenofyTheme } from '../../../utils/theme';

export const primeng = [
  provideAnimationsAsync(),
  providePrimeNG({
    theme: {
      preset: VenofyTheme,
      options: {
        darkModeSelector: '.dark'
      },
    },
  }),
];
