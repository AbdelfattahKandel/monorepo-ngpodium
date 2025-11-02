import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  effect,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../core/services/theme.service';
import { RouterLink } from "@angular/router";
import { SearchService } from '../../core/services/search.service';
import { BlogPostService } from '../../core/services/blog-post.service';
import { toSignal as toSig } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngpodium-blog-header',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './blog-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class BlogHeaderComponent {
  private readonly fb = inject(FormBuilder);
  private readonly theme = inject(ThemeService);
  private readonly search = inject(SearchService);
  private readonly blogPosts = inject(BlogPostService);

  // 🔍 Search Control
  readonly searchControl = this.fb.nonNullable.control('');
  private readonly searchValue = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value
  });

  readonly placeholder = computed(() =>
    this.searchValue().trim().length > 0
      ? 'Refine your search'
      : 'Search posts, authors, or topics'
  );

  // Live sync to global search service on every keystroke
  constructor() {
    effect(() => {
      const term = this.searchValue();
      this.search.set(term);
      if (term && term.trim().length > 0) {
        this.isOpen.set(true);
      }
    });
  }

  // ⚡ Outputs
  readonly searchSubmitted = output<string>();
  readonly writePostRequested = output<void>();
  readonly menuToggleRequested = output<void>();

  // 🌗 Theme binding
  readonly isDarkMode = this.theme.isDarkMode;

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchSubmitted.emit(this.searchValue().trim());
    this.isOpen.set(false);
  }

  // Suggestions built from current posts and live query
  private readonly allPosts = toSig(this.blogPosts.getSummaries(), { initialValue: [] });
  readonly suggestions = computed(() => {
    const q = this.search.query().trim().toLowerCase();
    if (!q) return [] as { id: string; title: string }[];
    const tokens = q.split(/\s+/).filter(Boolean);
    const matches = this.allPosts().filter((p) => {
      const title = (p.title ?? '').toLowerCase();
      const snippet = (p.snippet ?? '').toLowerCase();
      const tags = (p.tags ?? []).map((t) => (t ?? '').toLowerCase());
      return tokens.every((t) => title.includes(t) || snippet.includes(t) || tags.some((x) => x.includes(t)));
    });
    return matches.slice(0, 5).map((m) => ({ id: m.id, title: m.title }));
  });

  // Dropdown open state and interactions
  readonly isOpen = signal(false);

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    // Close if click happens outside the search form container
    const inside = target.closest('[data-search="1"]');
    if (!inside) this.isOpen.set(false);
  }

  onSuggestionClick(): void {
    this.isOpen.set(false);
  }

  onWritePostClick(): void {
    this.writePostRequested.emit();
  }

  onThemeToggle(): void {
    this.theme.toggleTheme();
  }

  onMenuToggleClick(): void {
    this.menuToggleRequested.emit();
  }
}
