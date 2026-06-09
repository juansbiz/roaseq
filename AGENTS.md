# AGENTS.md — ROASEQ Trunk Worktree

## Role: Integration Agent

You are the integration agent for ROASEQ. You work on the `main` branch (trunk).

---

## OBSIDIAN BRAIN

- **Brain:** `/home/apps2/Desktop/3. AGENTIC_BRAIN/JUANSBIZ_OBSIDIAN/`
- **Skills:** `5. CONTEXT/skills/`
- **Agent Ref:** `5. CONTEXT/agents/reference.md`

---

## Identity

```
Worktree:  . (main checkout)
Branch:    main
Remote:    origin → https://git.antieq.com/juansbiz/roaseq (Forgejo - canonical)
Mirrors:   github  → https://github.com/juansbiz/roaseq  (read-only mirror, sync_on_commit + 10m cron)
           codeberg → https://codeberg.org/juansbiz/roaseq (read-only mirror, sync_on_commit + 10m cron)
```

ROASEQ is the **open-source ecommerce attribution platform** (FOSS Triple Whale alternative). The codebase today is a CRM (v1 foundation); v2 is the marketing/event layer; v3 is the actual attribution. See [README.md](README.md) for the public-facing positioning.

---

## Tech Stack (2026-06-09 refresh)

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS, Zustand, TanStack Query |
| Backend | Express 4, TypeScript, `npx tsx` dev runner |
| Database | PostgreSQL 16 (self-hosted) |
| ORM | Raw `pg` driver + `db/compat.ts` wrapper |
| Cache | Redis 7 (ioredis) |
| Auth | JWT + bcrypt (httpOnly cookie) |
| Payments | Stripe webhooks |
| Dev Ports | Frontend :3012, Backend :3007 |
| Deployment | Docker, Kubernetes, Forgejo CI |
| Registry | registry.antieq.com |
| License | AGPL-3.0 |
| Canonical source | git.antieq.com |
| Public mirrors | github.com/juansbiz/roaseq, codeberg.org/juansbiz/roaseq |

---

## Worktree Structure

```
ROASEQ_CODE/
├── AGENTS.md              ← You are here (trunk/main)
├── .worktrunk/
│   ├── backend/          ← feat/backend branch (Express + PostgreSQL)
│   ├── frontend/          ← feat/frontend branch (React + TypeScript)
│   └── ops/               ← ops branch (Docker, k8s, CI/CD)
```

---

## Gitflow

```
feat/frontend ──┐
feat/backend  ──┼── ops merges locally ──► staging
               │         │
               │         | git push origin staging
               │         ▼
               │   CI → auto-deploys staging.roaseq.com (k8s staging pods)
               │
               │   ops merges staging → releases → main
               │         ▼
               │   CI → auto-deploys roaseq.antieq.com (k8s production)
               └──► staging ──► releases ──► main
```

---

## Hotfix Process

```
git checkout -b hotfix/<name> main
[fix code]
git commit -m "fix: <description>"
git push origin main     → CI auto-deploys roaseq.antieq.com
git merge main staging   → CI auto-deploys staging.roaseq.com
```

---

## Daily Workflow

```bash
# Start
cd ~/Desktop/1.\ HIFICOPY_APPS/2.\ ROASEQ_CODE

# Worktrees are separate terminals:
Terminal 1: cd .worktrunk/frontend && npm run dev    # → :3012
Terminal 2: cd .worktrunk/backend && npm run dev      # → :3007
Terminal 3: cd .worktrunk/ops && kubectl apply -f k8s/

# After session - each worktree commits separately:
cd .worktrunk/backend && git add . && git commit -m "feat: ..."
cd .worktrunk/frontend && git add . && git commit -m "feat: ..."
cd .worktrunk/ops && git add . && git commit -m "chore: ..."
```

---

## What You OWN

- `main` branch — single source of truth for deployable code
- PR review and merge decisions
- Obsidian context updates (ACTIVE_SPRINT.md, MASTER_PLAN.md)

---

## What You NEVER Do

- Never commit feature code directly to `main`
- Never force push to `main`
- Never close or merge PRs without review
- Never deploy untested code

---

## Critical Files

| File | Purpose |
|------|---------|
| `.worktrunk/backend/server.ts` | Express entry (port 3007) |
| `.worktrunk/frontend/vite.config.js` | Vite config (port 3012, proxy to :3007) |
| `.worktrunk/ops/k8s/roaseq/` | Kubernetes manifests (roaseq-dev + roaseq-prod) |
| `.worktrunk/ops/forgejo/ci.yml` | CI pipeline |

---

## Mirror Architecture

**Forgejo** (`git.antieq.com`) = canonical source. **GitHub** (`github.com`) and **Codeberg** (`codeberg.org`) = read-only public mirrors, auto-pushed by Forgejo via push-mirror. Never push to either mirror directly. See `6. OPERATIONS/FORGEJO-GITHUB-MIRROR.md` in the Obsidian vault for the full topology.

The mirrors exist for public discoverability (FOSS positioning) and backup-by-redundancy. The pre-push hook at `/etc/git/hooks/global/pre-push` enforces this — pushing to a `github` or `codeberg` remote is blocked with a clear error.

---

## Emergency

- Lost commits: `git reflog` → find hash → `git cherry-pick <hash>`
- Bad merge: `git revert <commit>` → push → merge revert PR
- Downstream issue from feature: disable merge, contact that worktree's agent

---

## Session Summary (2026-06-09 — Attribution-first refresh + Codeberg mirror)

### Rebrand v3: Attribution-first, package rename, AGPL license, FOSS community docs
- **package.json rename:** `roaseq-crm` → `roaseq` at the root; `roaseq-crm` → `roaseq-frontend` in the frontend worktree; backend was already `roaseq-backend`. All `pm2:*` scripts updated. Sentry project + release names updated across all 3 vite configs.
- **License:** `PROPRIETARY` → `AGPL-3.0` in all 3 package.json + 3 package-lock.json. Added `LICENSE` file (full AGPL-3.0 text, ~700 lines, with a non-binding summary at the end).
- **Description rewrite:** "The New Age CRM with Local AI Second Brain. Replaces GoHighLevel, ClickUp, Notion, Miro, iClosed, and 10+ tools for agency owners." → "Open-source ecommerce attribution platform. The FOSS alternative to Triple Whale. Multi-touch attribution, channel ROI, journey stitching. Your events, your models, your database."
- **FOSS community docs added:** `CONTRIBUTING.md` (attribution-platform-specific contribution guide), `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), `SECURITY.md` (90-day disclosure timeline), `.github/CODEOWNERS` (auto-assigns @juansbiz to all PRs).
- **Repository metadata:** added `homepage`, `repository`, `bugs`, structured `author`, and `keywords` to all 3 package.json files.
- **AGENTS.md (this file):** refreshed the Tech Stack section to attribution-first, updated the Mirror Architecture section to mention both GitHub and Codeberg, replaced the "Still TODO" CRM-era list with the v2/v3 attribution roadmap.

### Codeberg mirror added
- ROASEQ is now mirrored to **3 platforms**: Forgejo (canonical, private), GitHub (public, read-only), Codeberg (public, read-only). Codeberg is a non-profit, FOSS-first alternative to GitHub — aligns with the positioning.
- Push-mirror configured on all 9 repos from Forgejo → Codeberg, `sync_on_commit: true` + `interval: 10m`. Same setup as the GitHub mirror.
- See `6. OPERATIONS/FORGEJO-GITHUB-MIRROR.md` in the Obsidian vault for the full topology.

### Pre-push hook (machine-enforced)
- A pre-push hook at `/etc/git/hooks/global/pre-push` blocks pushes to `github.com` or `codeberg.org` remotes (the two public mirrors). Push to `origin` (Forgejo); mirrors update automatically.
- Override env var: `GIT_PUSH_ALLOW_PUBLIC_MIRROR=1 git push` (auditable, logs a warning to stderr).
- The hook would have caught the 8 stray `github` remotes that were manually cleaned up on 2026-06-08.

### Reaffirmed positioning (no code change)
- **ROASEQ is the FOSS alternative to Triple Whale**, not "the new GoHighLevel for agency owners." The codebase is a CRM today, but that's the v1 foundation; v2 is the marketing layer; v3 is the actual Triple Whale replacement.
- No INBOXEQ, YALLY, or other closed-source product references in the public surface. Cross-references in the in-repo AGENTS.md vault-doc pointer list are intentional (they help agents navigate to the right Obsidian doc) and are not a public-surface leak.

---

## Session Summary (2026-06-05)

### Rebrand: Axolop → ROASEQ
- Complete codebase rebrand: 0 axolop references remaining
- Logo: `public/logo.png` (replace axolop-logo.webp)
- Domain: roaseq.com, dev subdomain: dev.roaseq.antieq.com

### Tech Stack Migration
- **REMOVED**: Supabase (was used directly by frontend for auth + DB)
- **REMOVED**: Vercel (was hosting frontend)
- **REMOVED**: Railway (was hosting backend)
- **ADDED**: Express + TypeScript backend (`.worktrunk/backend/src/backend/`)
- **ADDED**: PostgreSQL 16 self-hosted (no more Supabase)
- **ADDED**: Redis 7 caching
- **ADDED**: JWT + bcrypt auth
- **ADDED**: Docker + k8s deployment

### Backend Structure (new)
```
.worktrunk/backend/src/backend/
├── server.ts           # Express entry point (port 3007)
├── db/index.ts         # pg Pool connection
├── db/compat.ts        # Prisma-like ORM wrapper
├── routes/auth.ts      # POST /auth/register, /login, /logout, /me
├── routes/crm.ts       # CRUD: companies, contacts, leads, deals, activities
└── services/cache.ts  # Redis cache (ioredis + Upstash fallback)
```

### Frontend Changes
- AuthContext.tsx: replaced Supabase with authApi calls
- ProtectedRoute.tsx: replaced SupabaseContext with useAuth hook
- services/api.ts: new API client (authApi + crmApi)
- tsconfig.json: added TypeScript support
- vite.config.js: proxy /api → localhost:3007, dev subdomain allowed

### Ops Setup
```
.worktrunk/ops/
├── Dockerfile           # Multi-stage (Vite build + Express runtime)
├── docker-compose.yml    # Local: postgres:16 + redis:7 + app
├── k8s/roaseq/         # roaseq-dev + roaseq-prod namespaces
├── forgejo/ci.yml       # CI: lint → build → push → deploy
└── cloudflared.yml     # dev.roaseq.antieq.com + roaseq.antieq.com
```

### Dev URLs
- **Frontend**: http://localhost:3012
- **Backend API**: http://localhost:3007
- **Dev deployed**: dev.roaseq.antieq.com
- **Prod deployed**: roaseq.antieq.com

### Dev Start Command
```bash
# Terminal 1 - backend
cd .worktrunk/backend && npm install && npm run dev

# Terminal 2 - frontend  
cd .worktrunk/frontend && npm install && npm run dev
```

### Still TODO
- v2 marketing layer: ad-platform connectors (Meta, Google, TikTok, Klaviyo, Shopify), customer-journey event store, email/SMS send engine, automations
- v3 attribution models: first-touch, last-touch, linear, time-decay, position-based, data-driven
- v3 custom model runner (BYO Python or SQL)
- v3 export pipelines: Looker, Metabase, your-own-BI integrations
- App-level rate limiting (currently Cloudflare / reverse-proxy level in production)
- Refresh token rotation in JWT auth (currently long-lived; rotating refresh tokens is on v2)

---

## Secrets & Credentials (1Password pattern — enforced 2026-06-08)

**NEVER commit plaintext secrets, default passwords, or env values with real production data.** All secrets are stored in **1Password**. Vault docs reference them with placeholders like `<<see 1Password — Cloudflare API Token>>`.

**Required pattern in code/secrets yml:**
- `process.env.X` (no default `|| ''` — use `if (!X) throw` to fail fast at boot)
- `<<see 1Password — Service Name>>` placeholders in skill docs and Obsidian
- `REPLACE_ME_*` placeholders in committed `02-secrets.yml` templates (force env injection)

**Canonical vault docs:**
- `6. OPERATIONS/API-KEYS.md` — HIFICOPY ops credentials (1Password pointers)
- `6. OPERATIONS/FORGEJO-API-KEYS.md` — Forgejo admin access
- `1. NAVENA/API-KEYS.md` — NAVENA WooCommerce + Mailgun
- `2. INBOXEQ/API-KEYS.md` — INBOXEQ Stripe + Klaviyo + Google OAuth
- `1. ROASEQ/API-KEYS.md` — ROASEQ credentials (Supabase removed, Stripe merged)
- `PANPA_OBSIDIAN/4. OPERATIONS/API-KEYS.md` — YALLY.TV

**Recently added enforcement (2026-06-08):**
- Owncast admin password: `process.env.OWNCAST_ADMIN_PASSWORD` is now `throw new Error()` if unset (was `|| ''` with no fail-safe)
- `02-secrets.yml` placeholders: `REPLACE_ME_OWNCAST_PASSWORD_FROM_1PASSWORD`

**Audit log:** See `6. OPERATIONS/OBSIDIAN-AUDIT-2026-06-08.md` for the full 80+ redactions applied this session.

