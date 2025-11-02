export class Post {
  id!: string; // e.g., "post-1"
  slug!: string; // e.g., "sample-post"
  title!: string;
  body!: string;
  imageUrl?: string;
  date!: string; // ISO string
  tags!: string[];
}
