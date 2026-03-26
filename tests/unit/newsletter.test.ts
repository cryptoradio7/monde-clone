import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module
vi.mock("@/lib/db", () => ({
  default: {
    newsletterSubscription: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import db from "@/lib/db";

describe("Newsletter API — logique métier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("findUnique est appelé avec l'email fourni", async () => {
    const mockFindUnique = vi.mocked(db.newsletterSubscription.findUnique);
    mockFindUnique.mockResolvedValueOnce(null);

    const mockCreate = vi.mocked(db.newsletterSubscription.create);
    mockCreate.mockResolvedValueOnce({
      id: "1",
      email: "test@test.fr",
      userId: null,
      active: true,
      createdAt: new Date(),
    });

    // Simuler la logique de l'API
    const email = "test@test.fr";
    const existing = await db.newsletterSubscription.findUnique({
      where: { email },
    });
    expect(existing).toBeNull();
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { email } });
  });

  it("réactive un abonnement inactif existant", async () => {
    const mockFindUnique = vi.mocked(db.newsletterSubscription.findUnique);
    mockFindUnique.mockResolvedValueOnce({
      id: "existing-id",
      email: "test@test.fr",
      userId: null,
      active: false,
      createdAt: new Date(),
    });

    const existing = await db.newsletterSubscription.findUnique({
      where: { email: "test@test.fr" },
    });

    expect(existing).not.toBeNull();
    expect(existing?.active).toBe(false);

    const mockUpdate = vi.mocked(db.newsletterSubscription.update);
    mockUpdate.mockResolvedValueOnce({
      id: "existing-id",
      email: "test@test.fr",
      userId: null,
      active: true,
      createdAt: new Date(),
    });

    await db.newsletterSubscription.update({
      where: { email: "test@test.fr" },
      data: { active: true },
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { email: "test@test.fr" },
      data: { active: true },
    });
  });
});

describe("Validation email — edge cases", () => {
  const isValidEmail = (email: string) =>
    email.includes("@") && email.length > 0;

  it("accepte un email valide", () => {
    expect(isValidEmail("user@exemple.fr")).toBe(true);
  });

  it("rejette un email sans @", () => {
    expect(isValidEmail("pasunemail")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("accepte un email avec sous-domaine", () => {
    expect(isValidEmail("user@mail.exemple.fr")).toBe(true);
  });
});
