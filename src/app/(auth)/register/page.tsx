"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription");
      setLoading(false);
    } else {
      router.push("/login?registered=1");
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold font-playfair text-center mb-2">
        Créer un compte
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Rejoignez la communauté des lecteurs
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#00209f]"
            placeholder="Jean Dupont"
          />
        </div>

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
            minLength={8}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-[#00209f]"
            placeholder="Minimum 8 caractères"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00209f] text-white py-3 font-semibold hover:bg-[#001a80] transition-colors disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Déjà abonné ?{" "}
          <Link href="/login" className="text-[#00209f] hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
