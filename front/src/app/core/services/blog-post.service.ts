import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay, Subject, startWith, switchMap, tap } from 'rxjs';
import { BlogPost, BlogPostSummary } from '../models/blog-post.model';

interface BlogPostIndexEntry {
  slug: string;
  title: string;
  body: string;
  date: string;
  tags: string[];
  isLocal: boolean;
}

@Injectable({ providedIn: 'root' })
export class BlogPostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/posts';
  private readonly reload$ = new Subject<void>();
  private readonly posts$ = this.reload$
    .pipe(
      startWith(void 0),
      switchMap(() => this.http.get<(BlogPost & { slug: string })[]>(this.apiUrl)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  getSummaries(): Observable<BlogPostSummary[]> {
    type PostWithSlug = BlogPost & { slug: string };
    return this.posts$.pipe(
      map((entries) =>
        entries
          .slice()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map<BlogPostSummary>((entry) => ({
            id: entry.slug,
            date: entry.date,
            title: entry.title,
            snippet: entry.body,
            imageUrl: (entry as any).imageUrl,
            tags: entry.tags
          }))
      )
    );
  }

  getPost(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/slug/${slug}`);
  }

  createPost(payload: {
    slug: string;
    title: string;
    body: string;
    imageUrl?: string;
    imageData?: string;
    date?: string;
    tags?: string[];
  }): Observable<BlogPost & { slug: string }> {
    return this.http
      .post<BlogPost & { slug: string }>(this.apiUrl, payload)
      .pipe(tap(() => this.refresh()));
  }

  refresh(): void {
    this.reload$.next();
  }

  updatePost(id: string, changes: Partial<{ title: string; body: string; code?: string; imageUrl?: string; date?: string; tags?: string[]; isLocal?: boolean }>): Observable<BlogPost & { slug: string }> {
    return this.http
      .patch<BlogPost & { slug: string }>(`${this.apiUrl}/${id}`, changes)
      .pipe(tap(() => this.refresh()));
  }

  deletePost(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.refresh()));
  }
}

