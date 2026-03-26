"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    const timer = setTimeout(() => {
      if (!consent) setVisible(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">
          Nous utilisons des cookies pour améliorer votre expérience, mesurer notre audience et vous proposer des contenus personnalisés. En continuant à naviguer, vous acceptez notre{" "}
          <Link href="/confidentialite" className="text-[#00209f] underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={refuse}
            className="border border-gray-400 text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="bg-[#00209f] text-white px-4 py-2 text-sm hover:bg-[#001a80]"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
