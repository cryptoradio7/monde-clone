import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  return format(new Date(date), "d MMMM yyyy", { locale: fr });
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: fr });
}

export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function truncate(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trimEnd() + "…";
}

export function parseTags(tagsJson: string): string[] {
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

export function estimateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const RUBRIQUES = [
  "France",
  "International",
  "Économie",
  "Culture",
  "Sport",
  "Sciences",
  "Politique",
  "Société",
];

export const ARTICLE_TYPES = [
  "Article",
  "Reportage",
  "Analyse",
  "Chronique",
  "Décryptage",
  "Enquête",
  "Synthèse",
] as const;

export type ArticleType = (typeof ARTICLE_TYPES)[number];
