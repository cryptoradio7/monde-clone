import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gestion des cookies | Le Monde",
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-playfair mb-8">Gestion des cookies</h1>
        <p className="text-gray-600 mb-6">
          Ce site utilise des cookies pour améliorer votre expérience de navigation.
          Vous pouvez gérer vos préférences ci-dessous ou consulter notre{" "}
          <Link href="/confidentialite" className="text-[#00209f] underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="border border-gray-200 p-6 rounded">
          <h2 className="font-bold mb-3">Cookies techniques (obligatoires)</h2>
          <p className="text-sm text-gray-600">Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
