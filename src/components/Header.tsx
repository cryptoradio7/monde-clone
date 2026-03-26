import Link from "next/link";
import { auth } from "@/lib/auth";
import AuthButton from "./AuthButton";
import { RUBRIQUES } from "@/lib/utils";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Barre supérieure */}
      <div className="bg-[#00209f] text-white py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <span>Édition France</span>
          <div className="flex items-center gap-4">
            <AuthButton session={session} />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-center border-b border-gray-200">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl font-bold font-playfair text-[#00209f] tracking-tight">
            Le Monde
          </h1>
        </Link>
        <p className="text-xs text-gray-500 mt-1">L&apos;actualité en France et dans le monde</p>
      </div>

      {/* Navigation rubriques */}
      <nav className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center gap-0 overflow-x-auto">
          {RUBRIQUES.map((rubrique) => (
            <li key={rubrique}>
              <Link
                href={`/rubrique/${rubrique.toLowerCase()}`}
                className="block px-3 py-3 text-sm font-medium text-gray-700 hover:text-[#00209f] hover:border-b-2 hover:border-[#00209f] transition-all whitespace-nowrap"
              >
                {rubrique}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
