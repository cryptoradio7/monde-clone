# REVERSE ENGINEERING — lemonde.fr
*Audit réalisé le 26/03/2026 via web_fetch (navigateur indisponible)*

---

## A. Inventaire des composants visuels

### Page Accueil (/)

```
Header
├── Bandeau supérieur (bleu foncé #00209f, fond blanc)
│   ├── Gauche : date du jour (ex: "Jeudi 26 mars 2026")
│   ├── Centre : Logo "Le Monde" (serif, majuscules, taille ~40px)
│   └── Droite : boutons [S'abonner] [Se connecter] + icônes recherche/menu
├── Navigation principale (horizontale, scrollable mobile)
│   ├── Rubriques : Politique · International · Economie · Culture · Sport · Sciences
│   │               Idées · Planète · Société · Tech · M Le Mag · Blogs
│   └── Sur fond blanc, barre noire en bas au hover

Corps de page
├── Hero section (article principal)
│   ├── Image pleine largeur (~65% de la page, 16:9)
│   ├── Badge type article (REPORTAGE / ANALYSE / CHRONIQUE / DÉCRYPTAGE en overlay)
│   ├── Rubrique (lien bleu, uppercase, ~12px)
│   ├── Titre h1 (Playfair Display, ~36px, bold)
│   ├── Chapeau (italic, ~16px, gris foncé)
│   ├── Auteur + date (12px, gris clair)
│   └── Badge "Abonné" si premium (fond bleu)
├── Sidebar hero (droite, ~35%)
│   ├── 3-4 articles en format compact
│   │   ├── Petite image vignette
│   │   ├── Rubrique badge
│   │   └── Titre (~18px, 2 lignes max, serif)
│   └── Séparateurs horizontaux entre articles
├── Grille "À la une"
│   ├── 3 colonnes (desktop) / 1 colonne (mobile)
│   ├── Card : image + rubrique + titre + auteur + date
│   └── Hover : légère scale image, titre souligne
├── Sections par rubrique (ex: "Economie", "International")
│   ├── En-tête : nom rubrique (serif, bleu) + lien "Tout voir →"
│   ├── Bordure top 2px bleue
│   ├── 4 articles en ligne (desktop)
│   └── Card : image + type (Chronique/Analyse) + titre + extrait court
├── Bloc Newsletter
│   ├── Fond bleu foncé (#00209f)
│   ├── Titre + description
│   ├── Champ email + bouton S'inscrire (rouge)
│   └── Lien politique de confidentialité
├── "Les plus lus" sidebar (droite, apparaît sur desktop)
│   ├── Classement numéroté 1-5
│   └── Titre + rubrique seulement (pas d'image)
└── Footer
    ├── Fond noir (#1a1a1a)
    ├── Colonnes : Logo + tagline | Rubriques | Services | Légal
    ├── Newsletter footer
    └── Copyright

### Page Article (/rubrique/article/YYYY/MM/DD/...)

```
Header (identique)

Corps article
├── Fil d'Ariane : Accueil > [Rubrique] > [Sous-rubrique si applicable]
├── Badge type (REPORTAGE · ANALYSE · CHRONIQUE · DÉCRYPTAGE · ENQUÊTE · SYNTHÈSE)
├── Rubrique (lien, uppercase blue)
├── Titre h1 (Playfair Display, ~40-48px, bold, jusqu'à 3 lignes)
├── Badge "Abonné" si premium (inline après titre)
├── Chapeau (italic, 18px, séparé par bordure gauche bleue)
├── Méta : Auteur (lien) · Date publiée · Date modifiée (si différente) · Temps lecture
├── Barre partage : [X] [Facebook] [LinkedIn] [Copier lien] [Signaler]
├── Photo principale + crédit photo (ex: "RAFAEL YAGHOBZADEH POUR « LE MONDE »")
├── Contenu texte
│   ├── Paragraphes (16px, line-height 1.7, inter)
│   ├── Sous-titres h2 (Playfair Display, bold)
│   ├── Listes (ul/ol)
│   ├── Citations (blockquote, bordure gauche bleue épaisse)
│   └── Encadrés (fond gris clair)
├── Paywall (si premium + non abonné)
│   ├── Dégradé blanc sur le bas du texte après ~2 paragraphes
│   ├── "Il vous reste X% de cet article à lire"
│   ├── "La suite est réservée aux abonnés"
│   └── Boutons : [S'abonner] [Se connecter]
├── Tags / mots-clés (en bas)
├── Section "À lire aussi" (3 articles liés, même rubrique)
└── Section "Les plus lus"

### Page Rubrique (/economie/)

```
├── En-tête rubrique (titre + fil d'Ariane)
├── Premier article (format hero, image large)
├── Grille articles suivants (2-3 colonnes)
├── Bouton "Voir plus" (pagination infinie / load more)
└── Sidebar : Les plus lus + Newsletter
```

---

## B. Inventaire des features visibles

| Feature | Description | Priorité clone |
|---------|-------------|----------------|
| Navigation rubriques | Horizontale, scrollable, ~12 rubriques | MVP |
| Page accueil | Hero + grille + sections rubriques | MVP |
| Page article | Contenu complet + méta + partage | MVP |
| Page rubrique | Liste articles filtrés par rubrique | MVP |
| Authentification | Inscription + login | MVP |
| Espace abonné | Articles premium + profil | MVP |
| Paywall | Dégradé + CTA abonnement si non abonné | MVP |
| Newsletter | Formulaire + désinscription | MVP |
| Partage social | X, Facebook, LinkedIn, copier lien | MVP |
| Bandeau cookies RGPD | Accepter/Refuser + politique | MVP |
| Badge type article | REPORTAGE, ANALYSE, CHRONIQUE, DÉCRYPTAGE, ENQUÊTE, SYNTHÈSE | V1 |
| Fil d'Ariane | Accueil > Rubrique > Article | V1 |
| Temps de lecture | "5 min de lecture" | V1 |
| Les + lus | Classement sidebar | V1 |
| Recherche | Barre de recherche | V2 |
| Commentaires | Réservé abonnés | Hors scope |
| Live/Alertes | Breaking news ticker | Hors scope |
| Mode multi-appareil | Un seul appareil à la fois | Hors scope |
| Paiement abonnement | Stripe | Hors scope |

---

## C. Modèle de données (extrait du reverse engineering)

### Article
```
- id : cuid
- title : string (~100 chars)
- slug : string unique
- excerpt/chapeau : string (~200 chars, italic)
- content : HTML rich text
- author : string (lien vers page auteur)
- rubrique : enum (France, International, Economie, Culture, Sport, Sciences, Idées, Planète, Société)
- articleType : enum (Article, Reportage, Analyse, Chronique, Décryptage, Enquête, Synthèse)
- tags : string[] (mots-clés bas de page)
- imageUrl : string
- imageCredit : string (crédit photographe)
- isPremium : boolean
- readingTime : int (minutes)
- publishedAt : datetime (format "Publié le 26 mars à 11h04, modifié à 11h49")
- updatedAt : datetime
```

### User
```
- id, email, name, password (bcrypt)
- role : user | subscriber | admin
- createdAt, updatedAt
```

---

## D. Layout exact — Page Accueil

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER : Logo centré + nav rubriques                        │
│  Barre bleu foncé : date | "Le Monde" | Connect/Abonnement   │
├──────────────────────────────────────────────────────────────┤
│  HERO (65% largeur)          │  SIDEBAR (35%)               │
│  ┌────────────────────────┐  │  Article 2 (vignette + titre) │
│  │  Image 16:9 pleine     │  │  ──────────────────────────── │
│  │  Badge REPORTAGE       │  │  Article 3 (vignette + titre) │
│  │  Rubrique              │  │  ──────────────────────────── │
│  │  Titre h1 (3 lignes)   │  │  Article 4 (vignette + titre) │
│  │  Chapeau italic        │  │  ──────────────────────────── │
│  │  Auteur · Date         │  │  Article 5 (vignette + titre) │
│  └────────────────────────┘  │                               │
├──────────────────────────────────────────────────────────────┤
│  GRILLE "À LA UNE" — 3 colonnes                              │
│  [Article A]  [Article B]  [Article C]                       │
├──────────────────────────────────────────────────────────────┤
│  NEWSLETTER (fond bleu, pleine largeur)                      │
│  "Restez informé" + champ email + bouton S'inscrire          │
├──────────────────────────────────────────────────────────────┤
│  SECTION ECONOMIE                    │  LES + LUS            │
│  ════════════════ Tout voir →        │  1. Titre article     │
│  [Art1] [Art2] [Art3] (3 colonnes)   │  2. ...               │
├──────────────────────────────────────┤                       │
│  SECTION INTERNATIONAL               │                       │
│  ...                                 │                       │
├──────────────────────────────────────┴───────────────────────┤
│  FOOTER (fond noir)                                          │
│  Logo | Rubriques | Services | Légal                         │
└──────────────────────────────────────────────────────────────┘
```

---

## E. Règles de gestion

| Règle | Détail |
|-------|--------|
| Ordre articles | Par date publiée desc (le plus récent en premier) |
| Paywall | Dégrade après ~2 paragraphes si non abonné + badge "Abonné" sur titre |
| Format date | "Publié aujourd'hui à 11h04, modifié à 11h49" (jour J) sinon "26 mars 2026" |
| Troncature titre | 3 lignes max en hero, 2 lignes en card, 1 ligne en sidebar small |
| Hover card | Titre passe en bleu (#00209f), légère scale image (103%) |
| Badge type | Affiché seulement si != "Article" standard (Reportage, Analyse, etc.) |
| URL article | /[rubrique]/article/YYYY/MM/DD/[slug]_[id]_[rubrique-id].html |
| Temps lecture | Calculé côté serveur (~200 mots/min, arrondi à 1 min) |
| SEO | title = "[Titre article] | Le Monde", og:image = image article |
