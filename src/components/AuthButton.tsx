"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function AuthButton({ session }: Props) {
  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/abonne" className="hover:underline">
          Mon espace
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="hover:underline"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="hover:underline">
        Se connecter
      </Link>
      <Link
        href="/register"
        className="bg-white text-[#00209f] px-3 py-1 text-xs font-semibold hover:bg-gray-100 transition-colors"
      >
        S&apos;abonner
      </Link>
    </div>
  );
}
