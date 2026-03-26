/**
 * Configuration globale du site.
 * Toutes les constantes d'environnement centralisées ici.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Le Monde";

export const SITE_DESCRIPTION =
  "Toute l'actualité en France et dans le monde : politique, économie, culture, sport, sciences.";
