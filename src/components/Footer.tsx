import Link from "next/link";
import { RUBRIQUES } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            <Link href="/" className="text-2xl font-bold font-playfair">
              Le Monde
            </Link>
            <p className="text-gray-400 text-sm mt-2">
              L&apos;actualité en France et dans le monde depuis 1944.
            </p>
          </div>

          {/* Rubriques */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">
              Rubriques
            </h3>
            <ul className="space-y-2">
              {RUBRIQUES.slice(0, 5).map((r) => (
                <li key={r}>
                  <Link
                    href={`/rubrique/${r.toLowerCase()}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/abonne" className="text-gray-400 hover:text-white text-sm">
                  Mon espace abonné
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white text-sm">
                  S&apos;abonner
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white text-sm">
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">
              Informations légales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-white text-sm">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-gray-400 hover:text-white text-sm">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                  Gestion des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Le Monde. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
