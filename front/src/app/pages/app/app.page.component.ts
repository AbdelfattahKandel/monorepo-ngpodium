import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogHeaderComponent } from '../../layout/blog-header/blog-header.component';
import { WritePostModalComponent } from '../../shared/ui/modal/write-post-modal.component';
import { BlogPostService } from '../../core/services/blog-post.service';
@Component({
  selector: 'ngpodium-app-page',
  imports: [RouterOutlet, BlogHeaderComponent, WritePostModalComponent],
  templateUrl: './app.page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPageComponent {
  private readonly posts = inject(BlogPostService);



  readonly searchQuery = signal<string>('');

  readonly showWriteModal = signal(false);




  onSearch(term: string): void {
    this.searchQuery.set(term);
  }

  onWritePost(): void {
    this.showWriteModal.set(true);
  }

  onModalClosed(): void {
    this.showWriteModal.set(false);
  }

  onModalSubmitted(payload: { title: string; body: string; code?: string }): void {
    const slug = payload.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const date = new Date().toISOString();
    this.posts
      .createPost({
        slug,
        title: payload.title,
        body: payload.body,
        imageData: (payload as any).imageData,
        date: (payload as any).date || date,
        tags: (payload as any).tags ?? []
      })
      .subscribe({
        next: () => {
          this.showWriteModal.set(false);
        },
        error: () => {
          this.showWriteModal.set(false);
        }
      });
  }
}
