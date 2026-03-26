# SPECS FONCTIONNELLES — monde-clone
*Produit par le BA le 26/03/2026*
*Référence : REVERSE_ENGINEERING.md + lemonde.fr*

---

## Résumé des stories

| # | Story | Prio | Complexité | Dépendances |
|---|-------|------|-----------|-------------|
| 1 | Page d'accueil — Hero + grille + sections rubriques | P0 | L | — |
| 2 | Page article — Contenu complet + méta + partage | P0 | L | #1 |
| 3 | Page rubrique — Liste filtrée | P0 | M | #1 |
| 4 | Badge type article (REPORTAGE, ANALYSE, etc.) | P1 | S | #1, #2 |
| 5 | Authentification — Inscription + Login | P0 | L | — |
| 6 | Espace abonné + paywall | P0 | M | #5 |
| 7 | Newsletter — Inscription + gestion | P0 | M | — |
| 8 | Partage réseaux sociaux | P0 | S | #2 |
| 9 | Bandeau RGPD cookies | P0 | S | — |
| 10 | SEO — Métadonnées + sitemap + Open Graph | P0 | M | #1, #2, #3 |
| 11 | Temps de lecture estimé | P1 | S | #2 |
| 12 | Fil d'Ariane | P1 | S | #2, #3 |
| 13 | Les plus lus (sidebar) | P1 | M | #1 |
| 14 | Politique de confidentialité + Mentions légales | P1 | S | — |

---

## Stories détaillées

---

### Story #1 — Page d'accueil : Hero + grille + sections rubriques

**En tant que** lecteur non connecté
**Je veux** voir une page d'accueil avec les articles les plus récents, organisés par sections
**Pour** identifier rapidement l'actualité du jour et naviguer vers les articles qui m'intéressent

**Critères d'acceptation :**
- [ ] Un article Hero (le plus récent) est affiché en grand format avec image, rubrique, titre, chapeau, auteur, date
- [ ] 3-4 articles secondaires apparaissent dans une sidebar à droite du hero
- [ ] Une grille de 3 colonnes affiche les 3 articles suivants (format card : image + rubrique + titre + auteur)
- [ ] Des sections par rubrique (minimum 4 rubriques) affichent chacune 3 articles en grille
- [ ] Chaque section rubrique a un titre cliquable (→ page rubrique) et un lien "Tout voir →"
- [ ] Le bloc newsletter est visible entre la grille principale et les sections rubriques
- [ ] Le tout est responsive : 1 colonne sur mobile, 2 sur tablette, 3+ sur desktop

**Edge cases :**
- Si < 5 articles en DB → afficher sans erreur (hero seul si 1 article, pas de sidebar si < 4)
- Si une rubrique n'a pas d'article → ne pas afficher la section de cette rubrique
- Si image manquante → placeholder gris (aspect ratio 16:9 maintenu)
- Articles sans chapeau → ne pas afficher de zone chapeau vide

**Assets visuels :** REVERSE_ENGINEERING.md §D
**Complexité :** L
**Dépendances :** —

---

### Story #2 — Page article : Contenu complet

**En tant que** lecteur
**Je veux** lire un article dans son intégralité avec toutes les informations éditoriales
**Pour** m'informer et partager les contenus

**Critères d'acceptation :**
- [ ] URL au format `/article/[slug]`
- [ ] Rubrique (lien → page rubrique) + Badge type article (si applicable)
- [ ] Titre h1 (Playfair Display, jusqu'à 3 lignes)
- [ ] Badge "Abonné" (fond bleu) visible si article premium
- [ ] Chapeau (italic, bordure gauche bleue)
- [ ] Méta : auteur · date de publication · date de modification si différente
- [ ] Boutons de partage (X, Facebook, LinkedIn)
- [ ] Image principale + crédit photographe
- [ ] Contenu HTML rendu (paragraphes, sous-titres, citations)
- [ ] Si article premium et utilisateur non-abonné : paywall après 2 paragraphes (dégradé blanc + CTA)
- [ ] Si article premium et utilisateur abonné (subscriber/admin) : accès complet
- [ ] Section "À lire aussi" (3 articles de la même rubrique)
- [ ] Tags (mots-clés) en bas de page

**Edge cases :**
- Slug inexistant → page 404 Next.js
- Article sans image → pas d'espace vide, le titre remonte
- Article sans tags → pas de section tags vide
- Article sans "À lire aussi" (rubrique vide) → section masquée
- Utilisateur connecté mais role "user" (pas "subscriber") → paywall affiché quand même

**Assets visuels :** REVERSE_ENGINEERING.md §A (Page Article)
**Complexité :** L
**Dépendances :** Story #5 (auth pour vérifier le role)

---

### Story #3 — Page rubrique : Liste filtrée d'articles

**En tant que** lecteur
**Je veux** accéder à la liste de tous les articles d'une rubrique
**Pour** parcourir l'actualité d'un domaine spécifique

**Critères d'acceptation :**
- [ ] URL au format `/rubrique/[slug]` (ex: `/rubrique/économie`)
- [ ] Titre de la rubrique en grand format (bleu, serif)
- [ ] Nombre d'articles affiché
- [ ] Grille 3 colonnes d'articles (card : image + rubrique + titre + auteur + date)
- [ ] Articles ordonnés par date de publication desc
- [ ] Page 404 si rubrique inconnue

**Edge cases :**
- Rubrique sans article → message "Aucun article dans cette rubrique pour le moment."
- Rubrique avec accent dans l'URL → gérer la normalisation (économie → economie)
- Plus de 20 articles → afficher les 20 premiers (pagination V2)

**Assets visuels :** REVERSE_ENGINEERING.md §D
**Complexité :** M
**Dépendances :** Story #1

---

### Story #4 — Badge type d'article

**En tant que** lecteur
**Je veux** voir le type éditorial de chaque article (Reportage, Analyse, Chronique, etc.)
**Pour** identifier la nature du contenu avant de le lire

**Critères d'acceptation :**
- [ ] Champ `articleType` ajouté au modèle Article (enum : Article, Reportage, Analyse, Chronique, Décryptage, Enquête, Synthèse)
- [ ] Si type = "Article" → aucun badge affiché
- [ ] Si type != "Article" → badge coloré affiché (ex: "REPORTAGE" en petit caps)
- [ ] Badge visible sur la card en page accueil
- [ ] Badge visible sur la page article (avant le titre)
- [ ] Seed mis à jour avec des types variés

**Edge cases :**
- Type non reconnu → fallback "Article" (pas de badge)

**Complexité :** S
**Dépendances :** Story #1, #2

---

### Story #5 — Authentification : Inscription + Login + Déconnexion

**En tant que** visiteur
**Je veux** créer un compte et me connecter
**Pour** accéder à mon espace personnel et aux articles premium si abonné

**Critères d'acceptation :**
- [ ] Page `/register` : formulaire (nom optionnel, email, mot de passe min 8 chars)
- [ ] Validation email format côté client et serveur
- [ ] Validation mot de passe ≥ 8 caractères
- [ ] Si email déjà existant → message d'erreur "Un compte existe déjà avec cet email"
- [ ] Mot de passe hashé bcrypt (jamais stocké en clair)
- [ ] Page `/login` : formulaire (email + mot de passe)
- [ ] Si identifiants incorrects → message "Email ou mot de passe incorrect" (pas de précision laquelle)
- [ ] Après login réussi → redirection vers `/`
- [ ] Déconnexion accessible depuis le header (bouton visible si connecté)
- [ ] Header : affiche "Se connecter / S'abonner" si non connecté, "Mon espace / Déconnexion" si connecté
- [ ] Session persistante (JWT, 30 jours)

**Edge cases :**
- Email avec casse différente (Test@gmail.com vs test@gmail.com) → traiter en lowercase
- Formulaire soumis sans email → validation HTML5 + serveur
- Mot de passe avec espaces → autorisé
- Tentatives de brute force → pas de rate limiting en MVP (V2)

**Complexité :** L
**Dépendances :** —

---

### Story #6 — Espace abonné + Paywall

**En tant que** utilisateur connecté
**Je veux** accéder à mon espace personnel et aux articles premium si je suis abonné
**Pour** gérer mon profil et accéder à l'intégralité des contenus

**Critères d'acceptation :**
- [ ] Page `/abonne` protégée (redirect `/login` si non connecté)
- [ ] Affichage : nom, email, date d'inscription, rôle (user / subscriber / admin)
- [ ] Si rôle = subscriber ou admin → liste des articles premium accessibles
- [ ] Si rôle = user → bloc "Passez à l'abonnement" avec CTA (bouton, pas de paiement réel en MVP)
- [ ] Paywall sur page article (Story #2) : dégradé blanc après 2 paragraphes + message + CTA S'abonner/Se connecter
- [ ] Les abonnés (subscriber + admin) voient l'article complet sans paywall

**Edge cases :**
- Admin a toujours accès aux articles premium
- Utilisateur dont le role a changé → accès mis à jour immédiatement (JWT refresh)
- Page `/abonne` sans session → redirect, pas d'erreur 500

**Complexité :** M
**Dépendances :** Story #5

---

### Story #7 — Newsletter : Inscription et désinscription

**En tant que** visiteur
**Je veux** m'inscrire à la newsletter du site
**Pour** recevoir les actualités importantes par email

**Critères d'acceptation :**
- [ ] Formulaire newsletter visible sur la page d'accueil (bloc bleu) avec champ email + bouton "S'inscrire"
- [ ] Formulaire newsletter dans le footer
- [ ] Validation email côté client et serveur
- [ ] Si email déjà inscrit + actif → message "Vous êtes déjà inscrit à la newsletter"
- [ ] Si email déjà inscrit + inactif → réactivation automatique + message de confirmation
- [ ] Après inscription réussie → message de confirmation visible (sans rechargement de page)
- [ ] API POST `/api/newsletter` : enregistre en base (modèle NewsletterSubscription)
- [ ] Mention de la politique de confidentialité + lien sous le formulaire

**Edge cases :**
- Email invalide → message d'erreur explicite
- Soumission double rapide → idempotent (pas de doublons en DB)
- Utilisateur connecté → associer l'abonnement newsletter à son userId

**Complexité :** M
**Dépendances :** —

---

### Story #8 — Partage réseaux sociaux

**En tant que** lecteur
**Je veux** partager un article sur les réseaux sociaux ou copier son lien
**Pour** diffuser des contenus à mes contacts

**Critères d'acceptation :**
- [ ] Boutons de partage visibles sur chaque page article
- [ ] Bouton X/Twitter : ouvre `https://twitter.com/intent/tweet?url=...&text=[titre]`
- [ ] Bouton Facebook : ouvre `https://www.facebook.com/sharer/sharer.php?u=...`
- [ ] Bouton LinkedIn : ouvre `https://www.linkedin.com/sharing/share-offsite/?url=...`
- [ ] Tous les liens s'ouvrent dans un nouvel onglet (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] URL partagée = URL canonique de l'article (NEXT_PUBLIC_SITE_URL + slug)

**Edge cases :**
- NEXT_PUBLIC_SITE_URL non définie → fallback sur window.location.href

**Complexité :** S
**Dépendances :** Story #2

---

### Story #9 — Bandeau RGPD cookies

**En tant que** visiteur
**Je veux** être informé de l'utilisation des cookies
**Pour** exercer mon droit à la vie privée conforme au RGPD

**Critères d'acceptation :**
- [ ] Bandeau affiché en bas de page à la première visite
- [ ] Deux boutons : "Accepter" et "Refuser"
- [ ] Choix persisté dans localStorage ("cookie-consent" = "accepted" ou "refused")
- [ ] Bandeau non affiché aux visites suivantes si choix déjà fait
- [ ] Lien vers la politique de confidentialité dans le bandeau
- [ ] Le bandeau ne bloque pas le contenu (z-index mais pas modal bloquant)

**Edge cases :**
- Visite en navigation privée → bandeau réaffiché (localStorage vide)
- Suppression manuelle du localStorage → bandeau réaffiché

**Complexité :** S
**Dépendances :** —

---

### Story #10 — SEO : Métadonnées, sitemap, Open Graph

**En tant que** propriétaire du site
**Je veux** que chaque page soit optimisée pour les moteurs de recherche
**Pour** maximiser la visibilité organique du site

**Critères d'acceptation :**
- [ ] Page accueil : title, description, og:title, og:description, og:image configurés
- [ ] Page article : title = "[Titre] | Le Monde", description = excerpt, og:image = image article
- [ ] Page rubrique : title = "[Rubrique] — Actualités | Le Monde"
- [ ] Balises canonical sur chaque page
- [ ] sitemap.xml généré à `/sitemap.xml` listant toutes les pages
- [ ] robots.txt à `/robots.txt` (allow all)
- [ ] Balises article:published_time et article:author en Open Graph sur pages article
- [ ] Langue = fr dans `<html lang="fr">`

**Edge cases :**
- Article sans image → og:image = image par défaut du site
- Titre très long → troncature à 60 chars pour og:title

**Complexité :** M
**Dépendances :** Story #1, #2, #3

---

### Story #11 — Temps de lecture estimé

**En tant que** lecteur
**Je veux** voir une estimation du temps de lecture d'un article
**Pour** décider si j'ai le temps de le lire maintenant

**Critères d'acceptation :**
- [ ] Affiché sur la page article (ex: "5 min de lecture")
- [ ] Calculé sur le contenu HTML stripé des balises (200 mots/min, arrondi au supérieur)
- [ ] Minimum affiché : "1 min de lecture"

**Complexité :** S
**Dépendances :** Story #2

---

### Story #12 — Fil d'Ariane (breadcrumb)

**En tant que** lecteur
**Je veux** voir ma position dans la hiérarchie du site
**Pour** naviguer facilement vers la rubrique ou l'accueil

**Critères d'acceptation :**
- [ ] Affiché sur page article : Accueil > [Rubrique] > [Titre court (40 chars max)]
- [ ] Affiché sur page rubrique : Accueil > [Rubrique]
- [ ] "Accueil" est un lien vers `/`
- [ ] "[Rubrique]" est un lien vers `/rubrique/[slug]`
- [ ] Schema.org BreadcrumbList en JSON-LD pour SEO

**Complexité :** S
**Dépendances :** Story #2, #3

---

### Story #13 — Les plus lus (sidebar)

**En tant que** lecteur
**Je veux** voir les articles les plus consultés
**Pour** découvrir les sujets qui font l'actualité

**Critères d'acceptation :**
- [ ] Champ `viewCount` (Int, default 0) ajouté au modèle Article
- [ ] Incrémentation du viewCount à chaque visite d'un article (API POST `/api/article/[slug]/view`)
- [ ] Sidebar "Les plus lus" visible sur la page d'accueil (5 articles)
- [ ] Format : numéro + rubrique + titre (pas d'image)
- [ ] Tri par viewCount desc

**Edge cases :**
- Deux articles à égalité → tri par date desc en second critère
- viewCount peut être incrément en double si rafraîchissement rapide → acceptable en MVP

**Complexité :** M
**Dépendances :** Story #1

---

### Story #14 — Pages légales : Confidentialité + Mentions légales

**En tant que** visiteur
**Je veux** accéder aux informations légales du site
**Pour** connaître mes droits et les conditions d'utilisation

**Critères d'acceptation :**
- [ ] Page `/confidentialite` avec politique de confidentialité (texte RGPD standard)
- [ ] Page `/mentions-legales` avec mentions légales
- [ ] Liens dans le footer vers ces deux pages
- [ ] Lien vers `/confidentialite` dans le bandeau cookies et le formulaire newsletter

**Complexité :** S
**Dépendances :** —

---

## Suggestions du BA (non demandées explicitement)

Ces features sont recommandées pour la qualité du produit :

| Feature | Justification | Complexité |
|---------|--------------|-----------|
| Recherche full-text articles | Standard sur tout site de presse | M (V2) |
| Page auteur (`/auteur/[slug]`) | Fidèle à lemonde.fr, engagement lecteur | M (V2) |
| Pagination page rubrique | Au-delà de 20 articles, nécessaire | S (V2) |
| Dark mode | ~40% des utilisateurs le préfèrent | M (V2) |
| PWA / offline | Lecture hors connexion mobile | L (V2) |
| RSS feed | Standard presse, fidélise les lecteurs | S (V2) |
| Favoris / marque-pages | Engagement abonné | M (V2) |
| Notifications push | Breaking news | L (V3) |
