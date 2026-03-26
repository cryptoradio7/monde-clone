import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Article } from "@/types";

interface Props {
  article: Article;
}

export default function HeroArticle({ article }: Props) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {article.imageUrl && (
        <div className="order-2 lg:order-1">
          <Link href={`/article/${article.slug}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-72 lg:h-96 object-cover"
            />
          </Link>
        </div>
      )}
      <div className={article.imageUrl ? "order-1 lg:order-2" : ""}>
        <p className="rubrique-badge mb-2">{article.rubrique}</p>
        <Link href={`/article/${article.slug}`} className="group">
          <h1 className="article-title text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-[#00209f] transition-colors">
            {article.title}
            {article.isPremium && (
              <span className="premium-badge ml-3 align-middle">Abonné</span>
            )}
          </h1>
        </Link>
        <p className="text-lg text-gray-600 leading-relaxed mb-4">
          {article.excerpt}
        </p>
        <p className="text-sm text-gray-500">
          {article.author} · {formatDate(article.publishedAt)}
        </p>
      </div>
    </article>
  );
}
