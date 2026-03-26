import { Metadata } from "next";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import { RUBRIQUES } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rubrique = RUBRIQUES.find((r) => r.toLowerCase() === slug);
  if (!rubrique) return { title: "Rubrique introuvable" };
  return {
    title: `${rubrique} — Actualités`,
    description: `Toute l'actualité ${rubrique} sur Le Monde`,
  };
}

export default async function RubriquePage({ params }: Props) {
  const { slug } = await params;
  const rubrique = RUBRIQUES.find((r) => r.toLowerCase() === slug);

  if (!rubrique) notFound();

  const articles = await db.article.findMany({
    where: { rubrique },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#00209f] pb-4 mb-8">
        <h1 className="text-3xl font-bold font-playfair text-[#00209f]">
          {rubrique}
        </h1>
        <p className="text-gray-500 mt-1">{articles.length} article(s)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} size="medium" />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          Aucun article dans cette rubrique pour le moment.
        </p>
      )}
    </div>
  );
}
