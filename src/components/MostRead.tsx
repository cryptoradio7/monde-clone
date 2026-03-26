import Link from "next/link";
import { Article } from "@/types";

interface Props {
  articles: Article[];
}

export default function MostRead({ articles }: Props) {
  if (!articles.length) return null;

  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">
        Les plus lus
      </h2>
      <ol className="space-y-4">
        {articles.map((article, i) => (
          <li key={article.id} className="flex gap-3">
            <span className="text-2xl font-bold text-gray-200 leading-none shrink-0 w-6">
              {i + 1}
            </span>
            <div>
              <p className="rubrique-badge mb-0.5">{article.rubrique}</p>
              <Link
                href={`/article/${article.slug}`}
                className="text-sm font-semibold leading-snug hover:text-[#00209f] transition-colors"
              >
                {article.title}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
