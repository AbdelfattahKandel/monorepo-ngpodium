import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, switchMap } from 'rxjs';
import { BlogPost } from '../../core/models/blog-post.model';
import { BlogPostService } from '../../core/services/blog-post.service';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

@Component({
  selector: 'ngpodium-post-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, TitleCasePipe],
  templateUrl: './post-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogPosts = inject(BlogPostService);
  private readonly router = inject(Router);

  readonly post$: Observable<BlogPost | null> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((slug): slug is string => !!slug && slug.trim().length > 0),
    switchMap((slug) =>
      this.blogPosts.getPost(slug)
    )
  );

  readonly postHtml$: Observable<string> = this.post$.pipe(
    filter((p): p is BlogPost => !!p),
    map((post) => {
      // Configure marked with syntax highlighting once
      marked.use(
        markedHighlight({
          langPrefix: 'hljs language-',
          highlight(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return hljs.highlight(code, { language: lang }).value;
              } catch {}
            }
            try {
              return hljs.highlightAuto(code).value;
            } catch {}
            return code;
          }
        })
      );
      const raw = post.body || '';
      const rendered = marked.parse(raw) as string;
      return DOMPurify.sanitize(rendered);
    })
  );

  onEdit(post: BlogPost): void {
    const nextTitle = prompt('Update title', post.title)?.trim();
    if (!nextTitle || nextTitle === post.title) return;
    this.blogPosts.updatePost(post.id, { title: nextTitle }).subscribe();
  }

  onDelete(id: string): void {
    if (!confirm('Are you sure you want to delete this post?')) return;
    this.blogPosts.deletePost(id).subscribe({
      next: () => this.router.navigateByUrl('/'),
    });
  }
}
