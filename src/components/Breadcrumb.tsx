import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-xs text-gray-500 mb-4">
      <ol className="flex items-center gap-1 flex-wrap">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300">›</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-[#00209f] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-700">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
