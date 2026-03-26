import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function AbonnePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
  });

  const premiumArticles = await db.article.findMany({
    where: { isPremium: true },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-[#00209f] text-white p-6 mb-8">
        <h1 className="text-2xl font-bold font-playfair mb-1">
          Bonjour, {user?.name || session.user.email}
        </h1>
        <p className="text-blue-200 text-sm">
          Membre depuis le {user ? formatDate(user.createdAt) : "—"}
          {" · "}
          <span className="capitalize font-medium">{user?.role}</span>
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold font-playfair mb-6 border-b-2 border-[#00209f] pb-2">
          Articles premium
        </h2>

        {user?.role === "subscriber" || user?.role === "admin" ? (
          <div className="space-y-4">
            {premiumArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="block border border-gray-200 p-4 hover:border-[#00209f] transition-colors"
              >
                <p className="rubrique-badge mb-1">{article.rubrique}</p>
                <h3 className="font-semibold leading-snug">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(article.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-[#00209f] p-8 text-center">
            <p className="text-lg font-semibold mb-2">
              Passez à l&apos;abonnement premium
            </p>
            <p className="text-gray-600 mb-4">
              Accédez à tous les articles réservés aux abonnés.
            </p>
            <button className="bg-[#00209f] text-white px-6 py-3 font-semibold hover:bg-[#001a80]">
              S&apos;abonner — 9,99€/mois
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
