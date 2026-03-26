# ARCHITECTURE — monde-clone

## Stack technique

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| Framework | Next.js | 16.x | SSR/SSG natif, App Router, Vercel-natif, SEO optimal |
| Langage | TypeScript | 5.x | Type-safety, autocomplétion, moins de bugs runtime |
| Style | Tailwind CSS | 4.x | Rapid styling, cohérence, responsive out-of-the-box |
| ORM | Prisma | 7.x | Type-safe, migrations, CLI intuitif |
| Base de données | SQLite (dev) / PostgreSQL (prod) | — | Zero config en dev, migration triviale vers prod |
| Auth | NextAuth.js v5 (beta) | 5.0.0-beta | Auth moderne, JWT sessions, Prisma adapter |
| Email | Resend | 6.x | API simple, fiable, bonne délivrabilité |
| Dates | date-fns | 4.x | Légère, tree-shakeable, locale fr |
| Déploiement | Vercel | — | Intégration native Next.js, edge network mondial |

## Grille de décision — Stack

| Critère | Poids | Next.js+Prisma | Express+MongoDB | Nuxt+Supabase |
|---------|-------|-----------------|-----------------|----------------|
| Adéquation | Fort | 9/10 | 7/10 | 8/10 |
| Maturité | Fort | 9/10 | 9/10 | 7/10 |
| Ecosystème | Moyen | 9/10 | 8/10 | 7/10 |
| Performance/SEO | Moyen | 9/10 | 6/10 | 8/10 |
| Vercel natif | Fort | 10/10 | 5/10 | 6/10 |
| **Score pondéré** | | **91** | **70** | **72** |

→ **Next.js + Prisma** sélectionné.

## Architecture

```
Pattern: Next.js App Router (Server Components + Client Components)
         Server-side rendering pour le SEO
         Client-side pour l'interactivité (forms, auth buttons)

┌─────────────────────────────────────────────────────────┐
│                     Vercel Edge                          │
├─────────────────────────────────────────────────────────┤
│                   Next.js 16 App Router                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ (main)/      │  │ (auth)/      │  │ /api/        │  │
│  │ page.tsx     │  │ login/       │  │ auth/        │  │
│  │ article/     │  │ register/    │  │ newsletter/  │  │
│  │ rubrique/    │  │              │  │ register/    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│              src/lib/                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  db.ts   │  │  auth.ts │  │  utils.ts            │  │
│  │ (Prisma) │  │(NextAuth)│  │  (helpers)           │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│              Prisma ORM                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  User | Article | NewsletterSubscription         │   │
│  │  Account | Session | VerificationToken           │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  SQLite (dev)  │  PostgreSQL (prod, Vercel Postgres)     │
└─────────────────────────────────────────────────────────┘
```

## Modèle de données

### Article
- `id`, `title`, `slug` (unique), `excerpt`, `content` (HTML)
- `author`, `rubrique`, `tags` (JSON string), `isPremium`
- `publishedAt`, `createdAt`, `updatedAt`

### User
- `id`, `email` (unique), `name`, `password` (bcrypt hash)
- `role`: `user` | `subscriber` | `admin`

### NewsletterSubscription
- `id`, `email` (unique), `active`, `userId?`

## Décisions d'architecture

1. **Server Components par défaut** — réduit le JS côté client, améliore le SEO
2. **Client Components** uniquement pour les formulaires et boutons interactifs
3. **Route Groups** `(main)` et `(auth)` — layouts séparés sans impact sur l'URL
4. **JWT sessions** — sans base de données pour les sessions, plus performant
5. **Seed automatique** — 30 articles réalistes + 3 users de test
6. **Tailwind CSS v4** — configuration inline, plus besoin de `tailwind.config.ts` séparé

## Commandes

```bash
# Développement
npm run dev

# Base de données
npm run db:push    # Créer/mettre à jour le schéma
npm run db:seed    # Seeder avec données de test
npm run db:studio  # Interface visuelle Prisma

# Production
npm run build
npm run start
```

## Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `DATABASE_URL` | URL SQLite ou PostgreSQL | Oui |
| `NEXTAUTH_SECRET` | Clé secrète JWT | Oui |
| `NEXTAUTH_URL` | URL de base du site | Oui |
| `RESEND_API_KEY` | Clé API Resend pour emails | Non (newsletter) |
| `NEXT_PUBLIC_SITE_URL` | URL publique (partage) | Non |

## Migration dev → prod

1. Changer `DATABASE_URL` vers PostgreSQL (Vercel Postgres ou Neon)
2. Changer `provider = "postgresql"` dans `prisma/schema.prisma`
3. Lancer `npx prisma migrate deploy`
4. Le reste du code est inchangé (Prisma abstrait le provider)
