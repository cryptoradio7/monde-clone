import { describe, it, expect } from "vitest";
import {
  formatDate,
  truncate,
  parseTags,
  estimateReadingTime,
  RUBRIQUES,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formate une date correctement en français", () => {
    const date = new Date("2026-03-26T10:00:00Z");
    const result = formatDate(date);
    expect(result).toContain("26");
    expect(result).toContain("2026");
  });

  it("accepte une date en string ISO", () => {
    const result = formatDate("2026-01-15T00:00:00Z");
    expect(result).toContain("2026");
  });
});

describe("truncate", () => {
  it("ne tronque pas si le texte est plus court que la limite", () => {
    expect(truncate("Bonjour", 100)).toBe("Bonjour");
  });

  it("tronque avec ellipsis si trop long", () => {
    const long = "a".repeat(200);
    const result = truncate(long, 150);
    expect(result.length).toBeLessThanOrEqual(152); // 150 + ellipsis
    expect(result).toContain("…");
  });

  it("utilise la longueur par défaut (150)", () => {
    const long = "a".repeat(200);
    const result = truncate(long);
    expect(result.length).toBeLessThanOrEqual(152);
  });

  it("retourne le texte exact si longueur = limite", () => {
    const text = "a".repeat(150);
    expect(truncate(text, 150)).toBe(text);
  });
});

describe("parseTags", () => {
  it("parse un tableau JSON valide", () => {
    const result = parseTags('["économie", "france", "budget"]');
    expect(result).toEqual(["économie", "france", "budget"]);
  });

  it("retourne un tableau vide si JSON invalide", () => {
    expect(parseTags("not-json")).toEqual([]);
  });

  it("retourne un tableau vide pour une chaîne vide", () => {
    expect(parseTags("")).toEqual([]);
  });

  it("gère un tableau vide JSON", () => {
    expect(parseTags("[]")).toEqual([]);
  });

  it("gère les caractères spéciaux dans les tags", () => {
    const result = parseTags('["tag avec accents éàü", "tag-tiret"]');
    expect(result).toContain("tag avec accents éàü");
  });
});

describe("estimateReadingTime", () => {
  it("retourne au minimum 1 minute", () => {
    expect(estimateReadingTime("<p>Court</p>")).toBe(1);
  });

  it("calcule correctement pour ~400 mots", () => {
    const words = Array(400).fill("mot").join(" ");
    const html = `<p>${words}</p>`;
    expect(estimateReadingTime(html)).toBe(2); // 400/200 = 2 min
  });

  it("ignore les balises HTML dans le comptage", () => {
    const html = "<h1>Titre</h1><p>Contenu</p><strong>Gras</strong>";
    const result = estimateReadingTime(html);
    expect(result).toBe(1);
  });

  it("calcule pour 600 mots → 3 minutes", () => {
    const words = Array(600).fill("mot").join(" ");
    expect(estimateReadingTime(`<p>${words}</p>`)).toBe(3);
  });
});

describe("RUBRIQUES", () => {
  it("contient les rubriques attendues", () => {
    expect(RUBRIQUES).toContain("France");
    expect(RUBRIQUES).toContain("International");
    expect(RUBRIQUES).toContain("Économie");
    expect(RUBRIQUES).toContain("Culture");
    expect(RUBRIQUES).toContain("Sport");
    expect(RUBRIQUES).toContain("Sciences");
  });

  it("contient au moins 6 rubriques", () => {
    expect(RUBRIQUES.length).toBeGreaterThanOrEqual(6);
  });
});
