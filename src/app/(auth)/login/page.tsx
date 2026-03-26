"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold font-playfair text-center mb-2">
        Se connecter
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Accédez à votre espace abonné
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#00209f]"
            placeholder="votre@email.fr"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#00209f]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00209f] text-white py-3 font-semibold hover:bg-[#001a80] transition-colors disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Pas encore abonné ?{" "}
          <Link href="/register" className="text-[#00209f] hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
