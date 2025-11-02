import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private nextId = 1;
  private readonly seedPath: string;

  constructor() {
    this.seedPath = resolve(process.cwd(), 'seed', 'posts.json');
    this.loadSeed();
  }

  private loadSeed(): void {
    if (!existsSync(this.seedPath)) return;
    try {
      const raw = readFileSync(this.seedPath, 'utf-8');
      const data = JSON.parse(raw) as Array<Partial<Post>>;
      this.posts = (data || []).map((p, idx) => ({
        id: (p.id as string) ?? `post-${idx + 1}`,
        slug: (p.slug as string) ?? `post-${idx + 1}`,
        title: (p.title as string) ?? '',
        body: (p.body as string) ?? '',
        date: (p.date as string) ?? new Date().toISOString(),
        tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
        imageUrl: (p.imageUrl as string) ?? undefined,
      }));
      const maxNum = this.posts
        .map((p) => Number(String(p.id).replace('post-', ''))) 
        .filter((n) => Number.isFinite(n))
        .reduce((a, b) => Math.max(a, b), 0);
      this.nextId = Math.max(1, maxNum + 1);
    } catch {}
  }

  private saveSeed(): void {
    try {
      writeFileSync(this.seedPath, JSON.stringify(this.posts, null, 2), 'utf-8');
    } catch {}
  }

  create(createPostDto: CreatePostDto): Post {
    const id = `post-${this.nextId++}`;
    let imageUrl = createPostDto.imageUrl;
    if (!imageUrl && createPostDto.imageData) {
      try {
        const match = createPostDto.imageData.match(/^data:(.+);base64,(.*)$/);
        if (match) {
          const mime = match[1];
          const base64 = match[2];
          const ext = mime.includes('png')
            ? 'png'
            : mime.includes('jpeg') || mime.includes('jpg')
            ? 'jpg'
            : mime.includes('webp')
            ? 'webp'
            : 'bin';
          const uploadsDir = resolve(process.cwd(), 'seed', 'images');
          mkdirSync(uploadsDir, { recursive: true });
          // build filename from slug (first 15 safe chars)
          const baseFromSlug = String(createPostDto.slug || '')
            .toLowerCase()
            .slice(0, 15)
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '');
          const fallback = randomUUID().replace(/-/g, '').slice(0, 6);
          let candidate = `${baseFromSlug || 'post'}.${ext}`;
          let filepath = resolve(uploadsDir, candidate);
          if (existsSync(filepath)) {
            candidate = `${(baseFromSlug || 'post')}-${fallback}.${ext}`;
            filepath = resolve(uploadsDir, candidate);
          }
          writeFileSync(filepath, Buffer.from(base64, 'base64'));
          imageUrl = `/images/${candidate}`;
        }
      } catch {}
    }
    const post: Post = {
      id,
      slug: createPostDto.slug,
      title: createPostDto.title,
      body: createPostDto.body,
      imageUrl,
      date: createPostDto.date ?? new Date().toISOString(),
      tags: createPostDto.tags ?? [],
    };
    this.posts.push(post);
    this.saveSeed();
    return post;
  }

  findAll(): Post[] {
    return this.posts;
  }

  findBySlug(slug: string): Post | undefined {
    return this.posts.find((p) => p.slug === slug);
  }

  findOne(id: string): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }

  update(id: string, updatePostDto: UpdatePostDto): Post | undefined {
    const idx = this.posts.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const current = this.posts[idx];
    const updated: Post = {
      ...current,
      ...updatePostDto,
    } as Post;
    this.posts[idx] = updated;
    this.saveSeed();
    return updated;
  }

  remove(id: string): boolean {
    const lenBefore = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== id);
    this.saveSeed();
    return this.posts.length < lenBefore;
  }
}
