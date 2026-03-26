# monde-clone

Clone de [lemonde.fr](https://www.lemonde.fr) — site d'information complet avec articles, espace abonné, newsletter et partage réseaux sociaux.

🔗 **Repo :** https://github.com/cryptoradio7/monde-clone

---

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 16.x |
| Langage | TypeScript | 5.x |
| Style | Tailwind CSS | 4.x |
| ORM | Prisma | 7.x |
| Base de données | SQLite (dev) / PostgreSQL (prod) | — |
| Auth | NextAuth.js v5 | beta |
| Tests | Vitest | 4.x |
| Déploiement | Vercel | — |

---

## Prérequis

- Node.js ≥ 20
- npm ≥ 9
- Git

---

## Installation (clone frais)

```bash
# 1. Cloner le repo
git clone https://github.com/cryptoradio7/monde-clone.git
cd monde-clone

# 2. Installer les dépendances
npm install

# 3. Copier les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Créer la base de données et appliquer le schéma
npm run db:push

# 5. Seeder avec 30 articles de démonstration
npm run db:seed

# 6. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `DATABASE_URL` | URL SQLite (`file:./prisma/dev.db`) ou PostgreSQL | ✅ |
| `NEXTAUTH_SECRET` | Clé secrète JWT (générer avec `openssl rand -base64 32`) | ✅ |
| `NEXTAUTH_URL` | URL de base (ex: `http://localhost:3000`) | ✅ |
| `RESEND_API_KEY` | Clé API [Resend](https://resend.com) pour l'envoi d'emails | ❌ |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (pour le partage et le SEO) | ❌ |

---

## Commandes

```bash
npm run dev          # Serveur de développement (port 3000)
npm run build        # Build de production
npm run start        # Démarrer le serveur de production
npm run lint         # Linting ESLint
npm test             # Tests unitaires (Vitest)
npm run test:watch   # Tests en mode watch
npm run db:push      # Appliquer le schéma Prisma à la DB
npm run db:seed      # Seeder la base avec 30 articles de démo
npm run db:studio    # Ouvrir Prisma Studio (interface visuelle DB)
```

---

## Structure du projet

```
monde-clone/
├── src/
│   ├── app/
│   │   ├── (main)/          # Pages principales (layout avec header/footer)
│   │   │   ├── page.tsx     # Page d'accueil
│   │   │   ├── article/[slug]/  # Page article
│   │   │   └── rubrique/[slug]/ # Page rubrique
│   │   ├── (auth)/          # Pages d'authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── abonne/          # Espace abonné (protégé)
│   │   ├── api/             # API Routes
│   │   │   ├── auth/        # NextAuth + register
│   │   │   ├── newsletter/  # Inscription newsletter
│   │   │   └── article/[slug]/view/  # Compteur de vues
│   │   ├── sitemap.ts       # Sitemap dynamique
│   │   └── robots.ts        # Robots.txt
│   ├── components/          # Composants React réutilisables
│   ├── lib/
│   │   ├── db.ts            # Client Prisma singleton
│   │   ├── auth.ts          # Config NextAuth v5
│   │   ├── config.ts        # Constantes globales (SITE_URL, etc.)
│   │   └── utils.ts         # Fonctions utilitaires
│   └── types/               # Types TypeScript partagés
├── prisma/
│   ├── schema.prisma        # Schéma de base de données
│   └── seed.ts              # Script de seed (30 articles)
├── tests/
│   └── unit/                # Tests unitaires Vitest
├── references/
│   └── REVERSE_ENGINEERING.md  # Analyse lemonde.fr
├── ARCHITECTURE.md          # Documentation technique
├── SPECS_FONCTIONNELLES.md  # Stories et critères d'acceptation
└── BRIEF.md                 # Brief projet
```

---

## Comptes de test (après seed)

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@monde-clone.fr` | `admin2026!` | Admin (accès total) |
| `abonne@exemple.fr` | `password123` | Abonné (articles premium) |
| `lecteur@exemple.fr` | `password123` | Lecteur (articles libres) |

---

## Déploiement sur Vercel

### Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub (recommandé)

1. Connecter le repo GitHub à [vercel.com](https://vercel.com)
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Pour PostgreSQL en production : utiliser [Vercel Postgres](https://vercel.com/storage/postgres)
   - Mettre à jour `DATABASE_URL` avec l'URL PostgreSQL
   - Changer `provider = "sqlite"` → `provider = "postgresql"` dans `prisma/schema.prisma`
   - Lancer `npx prisma migrate deploy`

### Variables requises sur Vercel

```
DATABASE_URL=<url-postgresql-vercel>
NEXTAUTH_SECRET=<32-bytes-random>
NEXTAUTH_URL=<url-de-prod>
NEXT_PUBLIC_SITE_URL=<url-de-prod>
```

---

## Tests

```bash
# Lancer tous les tests
npm test

# Résultat attendu
# Test Files  5 passed (5)
# Tests      63 passed (63)
```

Les tests couvrent :
- Fonctions utilitaires (`formatDate`, `truncate`, `parseTags`, `estimateReadingTime`)
- Logique d'authentification (validation email, mot de passe, rôles)
- Logique articles (paywall, badges type, partage social, SEO)
- API newsletter (inscription, réactivation)
- Sécurité (XSS, injection SQL, path traversal, unicode)

---

## Sécurité

- Mots de passe hashés **bcrypt** (12 rounds)
- Sessions **JWT** via NextAuth v5
- **Security headers** HTTP (CSP, X-Frame-Options, X-XSS-Protection, etc.)
- **RGPD** : bandeau cookies, politique de confidentialité
- Inputs utilisateur validés côté client et serveur
- Aucun secret en clair dans le code ou l'historique Git

---

## Migration SQLite → PostgreSQL (production)

```bash
# 1. Modifier prisma/schema.prisma
#    provider = "sqlite" → provider = "postgresql"

# 2. Mettre à jour DATABASE_URL
#    DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# 3. Supprimer prisma.config.ts ou l'adapter

# 4. Appliquer les migrations
npx prisma migrate deploy

# 5. Seeder si base vide
npm run db:seed
```

---

## Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Committer (`git commit -m 'feat: ma feature'`)
4. Pusher (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

---

## Licence

MIT — voir [LICENSE](./LICENSE)
