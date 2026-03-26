export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  imageCredit: string | null;
  author: string;
  rubrique: string;
  articleType: string;
  tags: string;
  isPremium: boolean;
  viewCount: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

export type UserRole = "user" | "subscriber" | "admin";

export interface ArticleCardProps {
  article: Article;
  size?: "small" | "medium" | "large";
  showRubrique?: boolean;
}
