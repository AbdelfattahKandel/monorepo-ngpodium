export interface BlogPost {
  id: string;
  date: string;
  title: string;
  body: string;
  imageUrl?: string;
  tags?: string[];
  isLocal?: boolean;
}

export interface BlogPostSummary {
  id: string;
  date: string;
  title: string;
  snippet: string;
  imageUrl?: string;
  tags?: string[];
}
