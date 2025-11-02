import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ngpodium-write-post-modal',
  imports: [ReactiveFormsModule],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 grid place-items-center" (click)="onBackdropClick()">
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="relative z-10 w-[min(600px,92vw)] rounded-2xl border border-white/10 bg-[#0c0c0f] p-5 shadow-2xl" (click)="$event.stopPropagation()">
          <header class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white">Write a new post</h2>
            <button type="button" class="rounded-full px-2 py-1 text-zinc-400 hover:text-white" (click)="onClose()">✕</button>
          </header>

          <form [formGroup]="form" class="space-y-4" (submit)="onSubmit()">
            <div>
              <label class="mb-1 block text-sm text-zinc-300">Title</label>
              <input formControlName="title" class="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/30" placeholder="Post title" />
            </div>
            <div>
              <label class="mb-1 block text-sm text-zinc-300">Body</label>
              <textarea formControlName="body" rows="6" class="w-full resize-y rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/30" placeholder="Write something..."></textarea>
            </div>
            
            <div>
              <label class="mb-1 block text-sm font-medium text-zinc-200">Cover Image (optional)</label>
              <div class="rounded-lg border border-white/10 bg-zinc-950/60 p-3">
                <div class="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    class="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border file:border-white/10 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:text-zinc-200 hover:file:border-white/30"
                  />
                  @if (previewUrl) {
                    <button type="button" (click)="clearImage()" class="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5">Remove</button>
                  }
                </div>
                <div class="mt-2 text-xs text-zinc-400">PNG, JPG, or WEBP. Max ~15MB.</div>
                @if (previewUrl) {
                  <div class="mt-3 overflow-hidden rounded-md border border-white/10">
                    <img [src]="previewUrl" alt="Selected image preview" class="max-h-44 w-full object-cover" />
                  </div>
                }
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm text-zinc-300">Date (optional)</label>
              <input type="datetime-local" formControlName="date" class="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/30" />
            </div>
            <div>
              <label class="mb-1 block text-sm text-zinc-300">Tags (comma separated)</label>
              <input formControlName="tags" class="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/30" placeholder="angular, signals" />
            </div>
            <footer class="mt-2 flex items-center justify-end gap-3">
              <button type="button" class="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5" (click)="onClose()">Cancel</button>
              <button type="submit" class="rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black hover:bg-white" >Publish</button>
            </footer>
          </form>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents'
  }
})
export class WritePostModalComponent {
  private readonly fb = inject(FormBuilder);

  readonly open = input(false);
  readonly closed = output<void>();
  readonly submitted = output<{ title: string; body: string; code?: string; imageData?: string; date?: string; tags: string[] }>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    imageData: [''],
    date: [''],
    tags: ['']
  });

  onBackdropClick() {
    this.onClose();
  }

  onClose() {
    this.resetForm();
    this.closed.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const tags = raw.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      this.submitted.emit({
        title: raw.title,
        body: raw.body,
        imageData: raw.imageData || undefined,
        date: raw.date || undefined,
        tags
      });
      this.resetForm();
    }
  }

  previewUrl: string | null = null;
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      this.form.controls.imageData.setValue(dataUrl);
      this.previewUrl = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.form.controls.imageData.setValue('');
    this.previewUrl = null;
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      body: '',
      imageData: '',
      date: '',
      tags: ''
    });
    this.previewUrl = null;
  }
}
