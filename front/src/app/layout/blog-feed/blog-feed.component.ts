import { DatePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../../core/services/blog-post.service';
import { BlogPostSummary } from '../../core/models/blog-post.model';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'ngpodium-blog-feed',
  imports: [DatePipe, SlicePipe, TitleCasePipe, RouterLink],
  templateUrl: './blog-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogFeedComponent {
  private readonly blogPostService = inject(BlogPostService);
  private readonly search = inject(SearchService);

  readonly allPosts = toSignal(this.blogPostService.getSummaries(), { initialValue: [] as BlogPostSummary[] });

  readonly filtered = computed(() => {
    const q = this.search.debouncedQuery().trim().toLowerCase();
    const items = this.allPosts();
    if (!q) return items;
    const tokens = q.split(/\s+/).filter(Boolean);
    return items.filter((p) => {
      const title = (p.title ?? '').toLowerCase();
      const snippet = (p.snippet ?? '').toLowerCase();
      const tags = (p.tags ?? []).map((t) => (t ?? '').toLowerCase());
      return tokens.every((t) => title.includes(t) || snippet.includes(t) || tags.some((x) => x.includes(t)));
    });
  });
}
