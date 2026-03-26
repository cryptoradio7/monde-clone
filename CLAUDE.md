# CLAUDE.md — monde-clone

## Stack
- **Next.js 16** — App Router, Server Components par défaut
- **TypeScript** — strict mode
- **Tailwind CSS v4** — classes utilitaires inline
- **Prisma 7** — ORM avec SQLite (dev), PostgreSQL (prod)
- **NextAuth.js v5** — JWT sessions, Credentials provider
- **date-fns** — formatage des dates en français

## Conventions

### Composants
- Préférer **Server Components** sauf si `useState`/`useEffect`/events → `"use client"`
- Nommer en PascalCase : `ArticleCard.tsx`, `Header.tsx`
- Props interface en tête de fichier

### DB
- **JAMAIS** de données hardcodées dans le code — tout passe par Prisma
- Singleton Prisma dans `src/lib/db.ts`
- Pour les requêtes : `await db.article.findMany(...)` directement dans les pages

### Auth
- Session via `auth()` dans les Server Components
- Hook `useSession()` dans les Client Components
- Vérifier `session.user.role` pour accès premium

### Couleurs du projet (lemonde.fr)
- Bleu principal : `#00209f`
- Rouge accent : `#c1001f`
- Texte principal : `#1a1a1a`
- Fond gris clair : `#f5f5f5`

### Typographie
- Titres : `font-playfair` (Playfair Display)
- Corps : `font-inter` (Inter)
- Rubriques : `rubrique-badge` (classe CSS custom)

## Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@monde-clone.fr | admin2026! | admin |
| abonne@exemple.fr | password123 | subscriber |
| lecteur@exemple.fr | password123 | user |

## Commandes

```bash
npm run dev          # Démarrage développement (port 3000)
npm run build        # Build production
npm run lint         # Linting ESLint
npm run db:push      # Appliquer schéma Prisma
npm run db:seed      # Seeder la base avec 30 articles
npm run db:studio    # Prisma Studio (interface visuelle)
```

## Structure clé

```
src/
├── app/
│   ├── (main)/page.tsx         # Page d'accueil
│   ├── (main)/article/[slug]/  # Page article
│   ├── (main)/rubrique/[slug]/ # Page rubrique
│   ├── (auth)/login/           # Connexion
│   ├── (auth)/register/        # Inscription
│   ├── abonne/                 # Espace abonné
│   └── api/                    # API Routes
├── components/                 # Composants React
├── lib/
│   ├── db.ts                   # Client Prisma
│   ├── auth.ts                 # Config NextAuth
│   └── utils.ts                # Helpers
└── types/index.ts              # Types TypeScript
```
