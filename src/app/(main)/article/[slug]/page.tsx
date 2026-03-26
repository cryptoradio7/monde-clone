import { Metadata } from "next";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { formatDate, parseTags, estimateReadingTime, truncate } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import Breadcrumb from "@/components/Breadcrumb";
import ViewTracker from "@/components/ViewTracker";
import Link from "next/link";
import { auth } from "@/lib/auth";
import Script from "next/script";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return { title: "Article non trouvé" };

  return {
    title: truncate(article.title, 60),
    description: article.excerpt,
    alternates: { canonical: `${BASE_URL}/article/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author],
      images: article.imageUrl
        ? [{ url: article.imageUrl }]
        : [{ url: `${BASE_URL}/og-default.jpg` }],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });

  if (!article) notFound();

  const session = await auth();
  const userRole = (session?.user as { role?: string })?.role ?? "user";
  const canRead =
    !article.isPremium ||
    userRole === "subscriber" ||
    userRole === "admin";

  const relatedArticles = await db.article.findMany({
    where: {
      rubrique: article.rubrique,
      slug: { not: article.slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const tags = parseTags(article.tags);
  const readingTime = estimateReadingTime(article.content);
  const showBadge = article.articleType && article.articleType !== "Article";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: article.rubrique, item: `${BASE_URL}/rubrique/${article.rubrique.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name: truncate(article.title, 40) },
    ],
  };

  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ViewTracker slug={slug} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <Breadcrumb
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: article.rubrique, href: `/rubrique/${article.rubrique.toLowerCase()}` },
            { label: truncate(article.title, 40) },
          ]}
        />

        {/* Rubrique + Badge type */}
        <div className="flex items-center gap-3 mb-3">
          <Link
            href={`/rubrique/${article.rubrique.toLowerCase()}`}
            className="rubrique-badge hover:underline"
          >
            {article.rubrique}
          </Link>
          {showBadge && (
            <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5">
              {article.articleType}
            </span>
          )}
        </div>

        {/* Titre */}
        <h1 className="article-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          {article.title}
          {article.isPremium && (
            <span className="premium-badge ml-3 align-middle">Abonné</span>
          )}
        </h1>

        {/* Chapeau */}
        <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed border-l-4 border-[#00209f] pl-4 italic">
          {article.excerpt}
        </p>

        {/* Méta */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 mb-8 flex-wrap gap-2">
          <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
            <span className="font-medium">{article.author}</span>
            <span className="text-gray-300">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">{readingTime} min de lecture</span>
          </div>
          <ShareButtons
            url={`${BASE_URL}/article/${article.slug}`}
            title={article.title}
          />
        </div>

        {/* Image */}
        {article.imageUrl && (
          <figure className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto"
            />
            {article.imageCredit && (
              <figcaption className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                {article.imageCredit}
              </figcaption>
            )}
          </figure>
        )}

        {/* Contenu */}
        {canRead ? (
          <div
            className="prose prose-lg max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="relative">
            <div
              className="prose prose-lg max-w-none article-content overflow-hidden"
              style={{ maxHeight: "150px" }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            <div className="border border-[#00209f] rounded p-8 text-center mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Il vous reste l&apos;essentiel de cet article à lire.
              </p>
              <p className="text-lg font-semibold text-[#00209f] mb-2">
                La suite est réservée aux abonnés
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                <Link
                  href="/register"
                  className="inline-block bg-[#00209f] text-white px-6 py-3 font-semibold hover:bg-[#001a80] transition-colors"
                >
                  S&apos;abonner
                </Link>
                <Link
                  href="/login"
                  className="inline-block border border-[#00209f] text-[#00209f] px-6 py-3 font-semibold hover:bg-[#00209f] hover:text-white transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* À lire aussi */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold font-playfair mb-6">
              À lire aussi dans {article.rubrique}
            </h2>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${related.slug}`}
                  className="flex gap-4 group"
                >
                  <div>
                    <p className="rubrique-badge">{related.rubrique}</p>
                    <h3 className="font-semibold group-hover:text-[#00209f] transition-colors leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(related.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
