# AGENTS.md: ROASEQ (the FOSS subset)

This is the FOSS `roaseq` repo. The dev repo is private.

## Role: Dev agent for the FOSS subset

You are the dev agent for the public FOSS `roaseq` repo. This repo is a release mirror of the closed-source dev repo. Development happens upstream; this repo only receives release commits.

---

## OBSIDIAN BRAIN

- **Brain:** `/home/apps2/Desktop/3. AGENTIC_BRAIN/JUANSBIZ_OBSIDIAN/`
- **Skills:** `5. CONTEXT/skills/`

---

## Identity

```
Worktree:  . (main checkout)
Branch:    main
Remote:    origin → http://localhost:3300/juansbiz/roaseq (Forgejo, mirror-only)
Mirrors:   github  → https://github.com/juansbiz/roaseq  (public, read-only)
           codeberg → https://codeberg.org/juansbiz/roaseq (public, read-only)
```

ROASEQ is the FOSS attribution layer for ecommerce. Multi-touch attribution, channel ROI, journey stitching, in your own Postgres.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, Tailwind CSS, Zustand, TanStack Query |
| Backend | Express 4, TypeScript, `npx tsx` dev runner |
| Database | PostgreSQL 16 (self-hosted) |
| ORM | Raw `pg` driver + `db/compat.ts` wrapper |
| Cache | Redis 7 (ioredis) |
| Auth | JWT + bcrypt (httpOnly cookie) |
| AI | Bring-your-own-AI: OpenAI, Anthropic, AWS Bedrock, Ollama, OpenAI-compatible |
| Dev Ports | Frontend :5173, Backend :3001 |
| Deployment | Docker, Kubernetes, Forgejo CI |
| License | AGPL-3.0 |
| Canonical source | git.antieq.com (mirror-only) |
| Public mirrors | github.com/juansbiz/roaseq, codeberg.org/juansbiz/roaseq |

---

## Worktree Structure

```
ROASEQ_CODE/
├── frontend/            # React + Vite + Tailwind attribution dashboard
├── .worktrunk/ops/      # ops branch worktree (k8s, CI, Docker)
├── .worktrunk/backend/  # feat/backend worktree (Express + PostgreSQL)
└── AGENTS.md            # this file
```

---

## The 5 FOSS Dev Workflow Rules

The FOSS `roaseq` repo is a release mirror. Development happens elsewhere; this repo only accepts release commits.

- **Rule 0:** NEVER mention the dev repo in any FOSS artifact (immersion rule).
- **Rule 1:** This repo's `main` is release-mirror only.
- **Rule 2:** Only `main`, `releases/*`, and `hotfix/*` branches are accepted.
- **Rule 3:** FOSS git log is marketing material; keep it clean (squash-merge).
- **Rule 4:** Hotfixes are the only direct dev on FOSS `main`, and only for security.
- **Rule 5:** FOSS repo is a self-contained, working application. Zero telemetry, zero outbound calls.

See `1. ROASEQ/FOSS-DEV-WORKFLOW.md` in the Obsidian vault for the canonical workflow.

---

## What You OWN

- Reviewing and merging FOSS release PRs (from `releases/*` or `hotfix/*` branches)
- The FOSS git log (keep it clean, squash-merge)
- Verifying the immersion rule (no `roaseq-cloud` references, no cloud upsells)

## What You NEVER Do

- **Never develop on the FOSS `roaseq` repo.** All development happens elsewhere.
- **Never mention the dev repo in any FOSS artifact.** The immersion rule.
- **Never force push to `main`.**
- **Never commit secrets, .env files, or production data.**
- **Never push to GitHub or Codeberg directly.** Always push to `origin` (Forgejo); mirrors update automatically.

---

## Pre-Push Hook (machine-enforced)

A pre-push hook at `/etc/git/hooks/global/pre-push` blocks:
- Pushes to `github.com` or `codeberg.org` remotes (read-only mirrors)
- Pushes when `origin` doesn't point at Forgejo
- Direct push to FOSS `main` from non-`releases`/`hotfix/*` branches
- FOSS branches other than `main`, `releases`, `releases/*`, `hotfix/*`

Override: `GIT_PUSH_ALLOW_FOSS_DIRECT=1` (auditable, logged to stderr).

---

## Mirror Architecture

**Forgejo** (`git.antieq.com`) = canonical source (mirror-only for FOSS).
**GitHub** (`github.com`) and **Codeberg** (`codeberg.org`) = public read-only mirrors, auto-pushed by Forgejo via push-mirror.

Never push to either mirror directly. See `6. OPERATIONS/FORGEJO-GITHUB-MIRROR.md` in the Obsidian vault for the full topology.

---

## Emergency

- Lost commits: `git reflog` → find hash → `git cherry-pick <hash>`
- Bad merge: `git revert <commit>` → push → merge revert PR
- FOSS repo has a stray dev repo reference: CI check fails on PR, remove the reference and re-push
- Visibility drift: immediately restore the correct visibility, run `audit-repo-visibility.sh`, update the script

---

## Session Summary (2026-06-10, REBRAND #6, v1.0.0-alpha.2)

### First proper FOSS release with the wizard code
- Cherry-picked from the dev repo's attribution-app
- New: 5-step first-run wizard (Welcome, Database, Admin user, AI provider, First store)
- New: `apps/attribution-app/install/` with the bring-your-own-AI config
- New: `apps/attribution-app/db/0001_initial.sql` (users, app_settings, ai_providers, stores, sessions, attribution_events, 6 SQL view attribution models)
- New: backend `services/encryption.ts` (AES-256-GCM for sensitive config)
- New: backend `routes/setup.ts` (5 setup endpoints with real API tests)
- Removed: `.worktrunk/`, `dist/`, `supabase/` (dev artifacts, not FOSS)
- Removed: the 20+ landing components (they live in the closed-source dev repo)

### Build verification
- `npm run build` passes (Vite + Tailwind + vite-plugin-compression)
- 5,140 B README (zero immersion rule violations)
- Zero em-dashes, zero roaseq-cloud refs, zero closed-source product names

### Pre-push hook updated
- 4,359 B → 6,729 B
- FOSS-specific checks added (Check A: main can only receive from `releases`/`hotfix/*`; Check B: only `main`, `releases`, `releases/*`, `hotfix/*` branches allowed)

### Immersion rule
- The FOSS `roaseq` repo MUST NOT mention the dev repo in any artifact
- The only allowed mention of the cloud is a single neutral line: `roaseq.com is the marketing site.`
- This rule is enforced by CI grep check on every PR to FOSS `main`
- Applies to ALL FOSS projects, not just ROASEQ (see `FOSS-PROJECT-RULES.md`)

---

*Last updated: 2026-06-10 (REBRAND #6, v1.0.0-alpha.2)*
