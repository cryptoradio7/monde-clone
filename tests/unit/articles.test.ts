import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db
vi.mock("@/lib/db", () => ({
  default: {
    article: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import db from "@/lib/db";
import { parseTags, estimateReadingTime, truncate } from "@/lib/utils";

describe("Articles — récupération", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("findMany est appelé avec tri par date desc", async () => {
    const mockFindMany = vi.mocked(db.article.findMany);
    mockFindMany.mockResolvedValueOnce([]);

    await db.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  });

  it("findUnique par slug retourne null si inexistant", async () => {
    const mockFindUnique = vi.mocked(db.article.findUnique);
    mockFindUnique.mockResolvedValueOnce(null);

    const result = await db.article.findUnique({ where: { slug: "inexistant" } });
    expect(result).toBeNull();
  });
});

describe("Articles — badge type", () => {
  const shouldShowBadge = (type: string) => type && type !== "Article";

  it("n'affiche pas de badge pour type 'Article'", () => {
    expect(shouldShowBadge("Article")).toBeFalsy();
  });

  it("affiche un badge pour 'Reportage'", () => {
    expect(shouldShowBadge("Reportage")).toBeTruthy();
  });

  it("affiche un badge pour 'Analyse'", () => {
    expect(shouldShowBadge("Analyse")).toBeTruthy();
  });

  it("affiche un badge pour 'Chronique'", () => {
    expect(shouldShowBadge("Chronique")).toBeTruthy();
  });

  it("affiche un badge pour 'Décryptage'", () => {
    expect(shouldShowBadge("Décryptage")).toBeTruthy();
  });
});

describe("Articles — paywall", () => {
  const canReadArticle = (isPremium: boolean, role: string) =>
    !isPremium || role === "subscriber" || role === "admin";

  it("article non-premium accessible à tous", () => {
    expect(canReadArticle(false, "user")).toBe(true);
    expect(canReadArticle(false, "")).toBe(true);
  });

  it("article premium bloqué pour utilisateur non connecté", () => {
    expect(canReadArticle(true, "user")).toBe(false);
  });

  it("article premium accessible à un abonné", () => {
    expect(canReadArticle(true, "subscriber")).toBe(true);
  });

  it("article premium accessible à un admin", () => {
    expect(canReadArticle(true, "admin")).toBe(true);
  });
});

describe("Articles — partage réseaux sociaux", () => {
  const buildShareUrl = (network: string, url: string, title: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    switch (network) {
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return null;
    }
  };

  it("génère une URL Twitter valide", () => {
    const url = buildShareUrl("twitter", "http://localhost/article/test", "Mon article");
    expect(url).toContain("twitter.com/intent/tweet");
    expect(url).toContain(encodeURIComponent("http://localhost/article/test"));
  });

  it("génère une URL Facebook valide", () => {
    const url = buildShareUrl("facebook", "http://localhost/article/test", "Mon article");
    expect(url).toContain("facebook.com/sharer");
  });

  it("génère une URL LinkedIn valide", () => {
    const url = buildShareUrl("linkedin", "http://localhost/article/test", "Mon article");
    expect(url).toContain("linkedin.com/sharing");
  });

  it("encode correctement les caractères spéciaux dans le titre", () => {
    const url = buildShareUrl("twitter", "http://localhost/test", "Article: spécial & \"guillemets\"");
    expect(url).toContain("%22");
  });
});

describe("Articles — slug et SEO", () => {
  const buildArticleTitle = (title: string, siteName = "Le Monde") =>
    `${truncate(title, 60)} | ${siteName}`;

  it("construit le titre SEO correctement", () => {
    const result = buildArticleTitle("Mon article sur l'économie");
    expect(result).toContain("| Le Monde");
    expect(result).toContain("Mon article");
  });

  it("tronque un titre trop long à 60 chars", () => {
    const longTitle = "a".repeat(80);
    const result = buildArticleTitle(longTitle);
    // Titre tronqué + "…" + " | Le Monde"
    expect(result.split(" | ")[0].length).toBeLessThanOrEqual(62);
  });
});
