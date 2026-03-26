"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error);
    }
  }

  return (
    <div className="text-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold font-playfair mb-2">
        Restez informé
      </h2>
      <p className="text-blue-200 mb-6 text-sm">
        Recevez chaque matin la sélection des articles essentiels du Monde.
      </p>

      {status === "success" ? (
        <p className="bg-white text-[#00209f] px-6 py-3 font-semibold">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.fr"
            className="flex-1 px-4 py-3 text-gray-800 focus:outline-none bg-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#c1001f] text-white px-6 py-3 font-semibold hover:bg-[#a0001a] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "..." : "S'inscrire"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-300 text-sm mt-2">{message}</p>
      )}

      <p className="text-blue-300 text-xs mt-4">
        En vous inscrivant, vous acceptez notre{" "}
        <a href="/confidentialite" className="underline hover:text-white">
          politique de confidentialité
        </a>
        . Désinscription possible à tout moment.
      </p>
    </div>
  );
}
