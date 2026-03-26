import { Metadata } from "next";
import db from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import HeroArticle from "@/components/HeroArticle";
import NewsletterForm from "@/components/NewsletterForm";
import { RUBRIQUES } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Le Monde — Actualités et Informations en France et dans le monde",
};

export const revalidate = 60;

export default async function HomePage() {
  const articles = await db.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const heroArticle = articles[0];
  const featuredArticles = articles.slice(1, 4);
  const remainingArticles = articles.slice(4);

  const articlesByRubrique = RUBRIQUES.reduce(
    (acc, rubrique) => {
      acc[rubrique] = articles.filter((a) => a.rubrique === rubrique).slice(0, 3);
      return acc;
    },
    {} as Record<string, typeof articles>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero */}
      {heroArticle && (
        <div className="mb-8 border-b border-gray-200 pb-8">
          <HeroArticle article={heroArticle} />
        </div>
      )}

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} size="medium" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2">
            À la une
          </h2>
          {remainingArticles.slice(0, 5).map((article) => (
            <ArticleCard key={article.id} article={article} size="small" />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-[#00209f] text-white p-8 rounded-none mb-10">
        <NewsletterForm />
      </div>

      {/* Sections par rubrique */}
      {RUBRIQUES.filter((r) => articlesByRubrique[r]?.length > 0).map(
        (rubrique) => (
          <section key={rubrique} className="mb-10">
            <div className="flex items-center justify-between mb-4 border-b-2 border-[#00209f] pb-2">
              <h2 className="text-xl font-bold font-playfair text-[#00209f]">
                {rubrique}
              </h2>
              <Link
                href={`/rubrique/${rubrique.toLowerCase()}`}
                className="text-xs text-[#00209f] hover:underline uppercase tracking-wider"
              >
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articlesByRubrique[rubrique].map((article) => (
                <ArticleCard key={article.id} article={article} size="medium" />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
