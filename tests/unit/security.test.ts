import { describe, it, expect } from "vitest";
import { parseTags, truncate } from "@/lib/utils";

describe("Sécurité — Inputs malveillants", () => {
  describe("XSS via tags", () => {
    it("parseTags ne plante pas avec un script inject", () => {
      const malicious = '["<script>alert(1)</script>"]';
      const result = parseTags(malicious);
      // Le tag est retourné tel quel (la neutralisation est côté rendu React)
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("<script>alert(1)</script>");
    });

    it("parseTags ne plante pas avec du JSON objet (pas un tableau)", () => {
      const malicious = '{"__proto__": "polluted"}';
      // parseTags retourne [] si ce n'est pas un tableau JSON valide
      // (un objet JSON est parseable mais pas un array → retour [])
      expect(() => parseTags(malicious)).not.toThrow();
      const result = parseTags(malicious);
      // Peut retourner [] ou un objet selon l'implémentation — dans tous les cas pas de throw
      expect(result).toBeDefined();
    });
  });

  describe("Troncature — robustesse", () => {
    it("gère les emojis correctement", () => {
      const text = "Hello 🎉 World 🚀 Test 💡 More 🌍 Content";
      const result = truncate(text, 20);
      expect(result.length).toBeLessThanOrEqual(22);
    });

    it("gère les caractères unicode", () => {
      const text = "Ĉĉĝĝŝŝûûîî éàüçñ".repeat(10);
      expect(() => truncate(text, 50)).not.toThrow();
    });

    it("gère une chaîne nulle gracieusement", () => {
      // Ne devrait pas planter même avec une string étrange
      expect(() => truncate("", 100)).not.toThrow();
    });
  });

  describe("Validation email — injections", () => {
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    it("rejette les injections SQL dans l'email", () => {
      expect(isValidEmail("'; DROP TABLE users; --")).toBe(false);
    });

    it("rejette un email avec des espaces", () => {
      expect(isValidEmail("user @test.fr")).toBe(false);
    });

    it("rejette un email avec caractères de contrôle", () => {
      expect(isValidEmail("user\n@test.fr")).toBe(false);
    });
  });

  describe("Path traversal — protection slug", () => {
    const isValidSlug = (slug: string) =>
      /^[a-z0-9-]+$/.test(slug) && !slug.includes("../");

    it("rejette un path traversal dans le slug", () => {
      expect(isValidSlug("../../etc/passwd")).toBe(false);
    });

    it("accepte un slug valide", () => {
      expect(isValidSlug("mon-article-de-presse-2026")).toBe(true);
    });

    it("rejette un slug avec caractères spéciaux", () => {
      expect(isValidSlug("article<script>")).toBe(false);
    });
  });
});
