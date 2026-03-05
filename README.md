# blog-thing

Somewhat vibecoded blog app with mdsvex/markdown rendering, built on SvelteKit and SQLite.

## Overview

- SvelteKit app using mdsvex for markdown+Svelte posts, styled with shadcn-svelte.
- SQLite via drizzle-orm; current demo schema lives in [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts).
- Bun-based tooling (can use pnpm/npm if you prefer).

## Prerequisites

- Node 20+ (or Bun 1.1+). If using Node, install deps with your package manager instead of Bun.

## Setup

1) Install dependencies (Bun shown):

```bash
bun install
```

2) Copy environment template and fill values:

```bash
cp .env.example .env
```

3) Start the dev server:

```bash
bun run dev
```

Then open the printed URL (default http://localhost:5173).

4) (Optional) Create the data dirs used by defaults:

```bash
mkdir -p data uploads posts
```

## Docker

Build and run with Docker Compose (uses [Dockerfile](Dockerfile) + [docker-compose.yml](docker-compose.yml)). The container runs the built SvelteKit server (`node build/index.js`).

```bash
docker compose up --build
```

The app listens on port 3000. Data volumes:

- `./data` -> `/data` (for SQLite db, etc.)
- `./uploads` -> `/uploads` (for uploaded assets)
- `./posts` -> `/posts` (for mdsvex/markdown sources)

Stop and clean containers/images/volumes with:

```bash
docker compose down
```

## Scripts (see [package.json](package.json))

- Dev server: `bun run dev`
- Build: `bun run build`
- Preview built app: `bun run preview`
- Type/check Svelte: `bun run check`
- Lint: `bun run lint`
- Format: `bun run format`
- Drizzle: `bun run db:push | db:generate | db:migrate | db:studio`
- Bootstrap admin: `bun run bootstrap:admin` (see below)

### Bootstrap admin user

1) Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `DATABASE_PATH` in your environment (or `.env`).
2) Run the script:

```bash
bun run bootstrap:admin
```

This inserts an admin row if it does not exist (no-op on conflict) using [`scripts/bootstrap-admin.ts`](scripts/bootstrap-admin.ts). Passwords are hashed with bcrypt and stored in the DB defined by `DATABASE_PATH`.

## Environment

Env keys used by the app live in [.env.example](.env.example). Common ones:

- `DATABASE_PATH` — SQLite connection string. Default dev uses a relative path `./data/dev.sqlite` so files stay in-repo.
- `SESSION_SECRET` — long random string for session encryption.
- `UPLOADS_DIR` — relative path for uploaded assets (default `./uploads`).
- `POSTS_DIR` — relative path for stored post files (default `./posts`).

For in-memory testing, use `DATABASE_PATH=sqlite::memory:` (data lasts only for the process lifetime).

## Project structure (selected)

- [src/routes/+page.svelte](src/routes/+page.svelte) — landing page.
- [src/lib/server/db/schema.ts](src/lib/server/db/schema.ts) — drizzle schema.
- [src/routes/layout.css](src/routes/layout.css) — global styles.
- [plans/plan.md](plans/plan.md) — architecture/backlog notes.

Content files live under the directory pointed to `POSTS_DIR` (default `./posts`) and are rendered with mdsvex/markdown.

## Database & migrations

- Configure drizzle in [drizzle.config.ts](drizzle.config.ts).
- Apply schema to the database with `bun run db:push` (development convenience) or generate/apply SQL migrations with `bun run db:generate` + `bun run db:migrate`.
- Explore the DB with `bun run db:studio`.

## Development workflow

1) Update env, install deps.
2) Run `bun run dev` and iterate.
3) Run `bun run check` and `bun run lint` before committing.
4) Keep schema changes in drizzle and commit migrations.

## Formatting & linting

- Prettier + ESLint are configured; run `bun run format` to autoformat and `bun run lint` to validate.

## Notes

- Uses SvelteKit adapter-node (see [svelte.config.js](svelte.config.js)).
- Tailwind v4 via `@tailwindcss/vite` is wired in [vite.config.ts](vite.config.ts).
