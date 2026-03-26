import { Metadata } from "next";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { formatDate, parseTags } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import Link from "next/link";
import { auth } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return { title: "Article non trouvé" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
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

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Rubrique */}
      <div className="mb-4">
        <Link
          href={`/rubrique/${article.rubrique.toLowerCase()}`}
          className="rubrique-badge hover:underline"
        >
          {article.rubrique}
        </Link>
      </div>

      {/* Titre */}
      <h1 className="article-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
        {article.title}
        {article.isPremium && (
          <span className="premium-badge ml-3 align-middle">Abonné</span>
        )}
      </h1>

      {/* Chapeau */}
      <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed border-l-4 border-[#00209f] pl-4">
        {article.excerpt}
      </p>

      {/* Méta */}
      <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 mb-8">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{article.author}</span>
          <span className="mx-2">·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <ShareButtons
          url={`${process.env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}
          title={article.title}
        />
      </div>

      {/* Image */}
      {article.imageUrl && (
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-auto rounded"
          />
        </div>
      )}

      {/* Contenu */}
      {canRead ? (
        <div
          className="prose prose-lg max-w-none prose-headings:font-playfair prose-p:text-gray-800 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <div className="border border-[#00209f] rounded p-8 text-center mt-8">
          <p className="text-lg font-semibold text-[#00209f] mb-2">
            Article réservé aux abonnés
          </p>
          <p className="text-gray-600 mb-4">
            Abonnez-vous pour accéder à la totalité de cet article et à tous nos contenus premium.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#00209f] text-white px-6 py-3 font-semibold hover:bg-[#001a80] transition-colors"
          >
            S&apos;abonner
          </Link>
          <span className="mx-4 text-gray-400">ou</span>
          <Link
            href="/login"
            className="inline-block border border-[#00209f] text-[#00209f] px-6 py-3 font-semibold hover:bg-[#00209f] hover:text-white transition-colors"
          >
            Se connecter
          </Link>
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

      {/* Articles liés */}
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
