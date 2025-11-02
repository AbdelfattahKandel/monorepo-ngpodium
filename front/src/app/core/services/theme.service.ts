import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = document.documentElement;
  private readonly darkSignal = signal<boolean>(this.getStoredTheme());
  readonly isDarkMode = computed(() => this.darkSignal());

  constructor() {
    this.applyTheme(this.darkSignal());
  }

  toggleTheme(): void {
    const newValue = !this.darkSignal();
    this.darkSignal.set(newValue);
    this.applyTheme(newValue);
    this.storeTheme(newValue);
  }

  // =============================
  // 🔽 Helpers
  // =============================

  private getStoredTheme(): boolean {
    const stored = localStorage.getItem('theme');
    if (stored === null) {
      return true;
    }
    return stored === 'dark';
  }

  private storeTheme(isDark: boolean): void {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    this.root.classList.toggle('dark', isDark);
    this.root.classList.toggle('light', !isDark);

    const gradient = isDark
      ? 'linear-gradient(135deg, #080808 0%, #0A0A0A 100%)'
      : 'linear-gradient(135deg, #f6f6f6 0%, #fff 100%)';

    const textColor = isDark ? '#f4f4f5' : '#1f1f1f';
    const secondaryText = isDark ? '#a1a1aa' : '#4a4a4a';

    this.root.style.setProperty('--app-background', gradient);
    this.root.style.setProperty('--text-primary', textColor);
    this.root.style.setProperty('--text-secondary', secondaryText);
  }
}
