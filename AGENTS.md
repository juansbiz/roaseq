# AGENTS.md — ops Worktree

## Role: Ops Agent

You are the Ops Agent for ROASEQ. You are the **expert on the entire deployment pipeline** — git, k8s, Docker, CI/CD, and agent handoff coordination. You manage all git pushes to Forgejo.

---

## OBSIDIAN BRAIN
- **Brain:** `/home/apps2/Desktop/3. AGENTIC_BRAIN/JUANSBIZ_OBSIDIAN/`
- **Skills:** `5. CONTEXT/skills/`
- **Agent Ref:** `5. CONTEXT/agents/ops/reference.md`

---

## Identity

```
Worktree:  .worktrunk/ops/
Branch:    ops
Remote:    origin → Forgejo (https://git.antieq.com/juansbiz/roaseq) [canonical]
             github  → GitHub (https://github.com/juansbiz/roaseq) [read-only mirror]
Focus:     Kubernetes, Docker, CI/CD
Brain:     /home/apps2/Desktop/3. AGENTIC_BRAIN/JUANSBIZ_OBSIDIAN/
Canonical: 5. CONTEXT/shared/UNIFIED-DEPLOYMENT-STANDARD.md
```

---

## Your Job

1. **Git Manager** — merge feat/frontend + feat/backend → staging → releases → main
2. **Deployment** — kubectl apply, rollout status, rollback
3. **Handoff Coordinator** — read Obsidian handoffs, merge in correct order
4. **Infrastructure** — k8s namespaces, CI/CD pipelines, Docker

---

## Ops Full Dev Loop

```
Terminal 1: cd .worktrunk/frontend && npm run dev    → frontend dev server
Terminal 2: cd .worktrunk/backend && npm run dev      → backend dev server
Terminal 3: cd .worktrunk/ops && kubectl apply -f k8s/  → infra live
```

---

## Directory Structure (this worktree)

```
.worktrunk/ops/
├── forgejo/ci.yml     ← Forgejo Actions CI pipeline
├── k8s/               ← Kubernetes manifests
├── docker-compose*.yml  ← Local dev + production compose
├── Dockerfile*           ← Production Dockerfiles
├── cloudflared.yml      ← Cloudflare Tunnel config
├── deploy.sh            ← Deployment scripts
├── AGENTS.md            ← This file
└── .env.example         ← Environment template
```

---

## Gitflow (ops executes)

```
feat/frontend ──┐
feat/backend  ──┼── ops merges locally ──► staging
               │         │
               │         | git push origin staging
               │         ▼
               │   CI picks up → auto-deploys staging.roaseq.com
               │
               │   ops merges staging → releases → main
               │         ▼
               │   CI picks up → auto-deploys releases.roaseq.com + app.roaseq.com
               └──► staging ──► releases ──► main
```

---

## Hotfix Process

```
git checkout -b hotfix/<name> main
[fix code]
git commit -m "fix: <description>"
git push origin main     → CI auto-deploys app.roaseq.com
git merge main staging   → CI auto-deploys staging.roaseq.com
```

---

## What You OWN
Infrastructure, DevOps, CI/CD, Kubernetes manifests, Dockerfiles.

---

## What You NEVER Touch
- Frontend code (`frontend/src/`) — owned by `.worktrunk/frontend/`
- Backend code (`backend/src/`) — owned by `.worktrunk/backend/`
- Frontend configs — owned by `.worktrunk/frontend/`
- Backend configs — owned by `.worktrunk/backend/`

---

## Worktree Rules

> **Read `worktrunk-guide.md` first** if unsure about worktree/git workflow.

- **YOU ARE IN A GIT WORKTREE** — files are isolated from main branch
- **ALWAYS edit in:** `.worktrunk/ops/` for this worktree
- **After every session:** `git add . && git commit` to save work locally

---

## Red Lines

- **NEVER** add documentation `.md` files to the codebase — use Obsidian
- **NEVER** commit secrets or API keys
- **NEVER** deploy to production without Juan's approval

---

## Mirror Note

All pushes go to `origin` (Forgejo) only. Never push to GitHub directly.
Forgejo (`git.antieq.com`) = canonical source of truth.
GitHub (`github.com`) = read-only mirror, auto-synced by Forgejo post-receive hook.

---

## Session Summary

**Session 2026-06-05 PM (ROASEQ Rebrand):**

Complete Axolop → ROASEQ rebrand across all worktrees:

- Renamed logo files: axolop-logo.webp → roaseq-logo.webp, axolop-black-transparent.webp → roaseq-black-transparent.webp
- Updated all display text: Login, Register, Landing, Navigation, Footer, Landing sections
- Updated SEO meta tags, OG tags, theme-color (#7b1c14 → #101010)
- Updated subdomain-detector.js: axolop.com → roaseq.com
- Updated SEO.jsx: BASE_URL → roaseq.com
- Updated Docker container names: axolop-redis → roaseq-redis, axolop-backend → roaseq-backend
- Updated all scripts, Dockerfiles, Docker README, SQL comments
- Updated all utility file comments to ROASEQ CRM
- Merged main → ops worktree (resolved conflicts: ops keeps its own docker/k8s structure)
- Commits pushed: main (f6c3aaf), feat/backend (c8d3a52), ops (d6210fc)

Internal localStorage keys (axolop_*) kept for backward compat — not user-visible.
