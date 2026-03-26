import { Metadata } from "next";
import db from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import HeroArticle from "@/components/HeroArticle";
import NewsletterForm from "@/components/NewsletterForm";
import MostRead from "@/components/MostRead";
import { RUBRIQUES } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Le Monde — Actualités et Informations en France et dans le monde",
  description: "Toute l'actualité en France et dans le monde : politique, économie, culture, sport, sciences. Analyses et décryptages.",
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" },
  openGraph: {
    title: "Le Monde — Actualités et Informations en France et dans le monde",
    description: "Toute l'actualité en France et dans le monde.",
    type: "website",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [articles, mostRead] = await Promise.all([
    db.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 30,
    }),
    db.article.findMany({
      orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
      take: 5,
    }),
  ]);

  const heroArticle = articles[0];
  const sidebarArticles = articles.slice(1, 5);
  const featuredArticles = articles.slice(5, 8);
  const remainingArticles = articles.slice(8);

  const articlesByRubrique = RUBRIQUES.reduce(
    (acc, rubrique) => {
      acc[rubrique] = articles.filter((a) => a.rubrique === rubrique).slice(0, 3);
      return acc;
    },
    {} as Record<string, typeof articles>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero + Sidebar */}
      {heroArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="lg:col-span-2">
            <HeroArticle article={heroArticle} />
          </div>
          <div className="space-y-0 divide-y divide-gray-200">
            {sidebarArticles.map((article) => (
              <div key={article.id} className="py-3">
                <ArticleCard article={article} size="small" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grille principale + Les plus lus */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} size="medium" />
            ))}
          </div>
        </div>
        <div>
          <MostRead articles={mostRead} />
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-[#00209f] text-white p-8 mb-10">
        <NewsletterForm />
      </div>

      {/* Sections par rubrique */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
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
        <div>
          {/* Sidebar droite : articles récents compacts */}
          <div className="sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">
              Derniers articles
            </h3>
            <div className="space-y-0 divide-y divide-gray-100">
              {remainingArticles.slice(0, 8).map((article) => (
                <div key={article.id} className="py-3">
                  <ArticleCard article={article} size="small" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
