import { Metadata } from "next";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumb from "@/components/Breadcrumb";
import { RUBRIQUES } from "@/lib/utils";
import Script from "next/script";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rubrique = RUBRIQUES.find((r) => r.toLowerCase() === decodeURIComponent(slug).toLowerCase());
  if (!rubrique) return { title: "Rubrique introuvable" };
  return {
    title: `${rubrique} — Actualités | Le Monde`,
    description: `Toute l'actualité ${rubrique} sur Le Monde`,
    alternates: { canonical: `${BASE_URL}/rubrique/${slug}` },
  };
}

export default async function RubriquePage({ params }: Props) {
  const { slug } = await params;
  const rubrique = RUBRIQUES.find((r) => r.toLowerCase() === decodeURIComponent(slug).toLowerCase());

  if (!rubrique) notFound();

  const articles = await db.article.findMany({
    where: { rubrique },
    orderBy: { publishedAt: "desc" },
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: rubrique },
    ],
  };

  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: rubrique },
          ]}
        />

        <div className="border-b-2 border-[#00209f] pb-4 mb-8">
          <h1 className="text-3xl font-bold font-playfair text-[#00209f]">
            {rubrique}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{articles.length} article(s)</p>
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
    </>
  );
}
