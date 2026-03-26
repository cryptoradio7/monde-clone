import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Article } from "@/types";

interface Props {
  article: Article;
  size?: "small" | "medium" | "large";
  showRubrique?: boolean;
}

export default function ArticleCard({
  article,
  size = "medium",
  showRubrique = true,
}: Props) {
  if (size === "small") {
    return (
      <article className="border-b border-gray-200 pb-3">
        <Link href={`/article/${article.slug}`} className="group">
          {showRubrique && (
            <p className="rubrique-badge mb-1">{article.rubrique}</p>
          )}
          <h3 className="text-sm font-semibold leading-snug group-hover:text-[#00209f] transition-colors">
            {article.title}
            {article.isPremium && (
              <span className="premium-badge ml-2 text-[0.55rem]">Abonné</span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(article.publishedAt)}
          </p>
        </Link>
      </article>
    );
  }

  if (size === "large") {
    return (
      <article className="group">
        {article.imageUrl && (
          <Link href={`/article/${article.slug}`} className="block mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          </Link>
        )}
        {showRubrique && (
          <p className="rubrique-badge mb-2">{article.rubrique}</p>
        )}
        <Link href={`/article/${article.slug}`}>
          <h2 className="article-title text-2xl font-bold mb-2 leading-tight group-hover:text-[#00209f] transition-colors">
            {article.title}
            {article.isPremium && (
              <span className="premium-badge ml-2">Abonné</span>
            )}
          </h2>
        </Link>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          {article.excerpt}
        </p>
        <p className="text-xs text-gray-500">
          {article.author} · {formatDate(article.publishedAt)}
        </p>
      </article>
    );
  }

  // medium (default)
  return (
    <article className="group border-b border-gray-100 pb-4">
      {showRubrique && (
        <p className="rubrique-badge mb-1">{article.rubrique}</p>
      )}
      <Link href={`/article/${article.slug}`}>
        <h2 className="article-title text-lg font-bold mb-2 leading-snug group-hover:text-[#00209f] transition-colors">
          {article.title}
          {article.isPremium && (
            <span className="premium-badge ml-2 text-[0.6rem]">Abonné</span>
          )}
        </h2>
      </Link>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">
        {article.excerpt.length > 120
          ? article.excerpt.substring(0, 120) + "…"
          : article.excerpt}
      </p>
      <p className="text-xs text-gray-500">
        {article.author} · {formatDate(article.publishedAt)}
      </p>
    </article>
  );
}
