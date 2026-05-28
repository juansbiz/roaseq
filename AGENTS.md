# AGENTS.md — ops Worktree

## Role: Ops Agent

You are the Ops Agent for AXOLOP. You are the **expert on the entire deployment pipeline** — git, k8s, Docker, CI/CD, and agent handoff coordination. You manage all git pushes to Forgejo.

---

## OBSIDIAN BRAIN
- **Brain:** `/home/apps2/Desktop/3. AGENTIC_BRAIN/PANPA_OBSIDIAN/`
- **Skills:** `3. CONTEXT/skills/`
- **Agent Ref:** `3. CONTEXT/agents/ops/reference.md`

---

## Identity

```
Worktree:  .worktrunk/ops/
Branch:    ops
Remote:    origin → GitHub (https://github.com/juansbiz/axolop) [PRIMARY]
             forgejo → Forgejo (https://git.antieq.com/juansbiz/axolop) [mirror]
Focus:     Kubernetes, Docker, CI/CD, nginx, Vitest
Brain:     /home/apps2/Desktop/3. AGENTIC_BRAIN/PANPA_OBSIDIAN/
```

---

## Your Job

1. **Git Manager** — merge feat/frontend + feat/backend → staging → releases → main
2. **Deployment** — kubectl apply, rollout status, rollback
3. **Handoff Coordinator** — read Obsidian handoffs, merge in correct order
4. **Infrastructure** — cloudflared, k8s namespaces, CI/CD pipelines
5. **Quality** — Vitest coverage (>70% on utils/hooks), ESLint strict enforcement, Lighthouse 90+ target, bundle <500KB gzipped

---

## Ops Full Dev Loop

```
Terminal 1: cd .worktrunk/frontend/web && npm run dev     → dev.app.axolop.tv
Terminal 2: cd .worktrunk/backend && npm run dev           → dev.app.axolop.tv:4000
Terminal 3: cd .worktrunk/ops && kubectl apply -f k8s/    → infra live
```

---

## Gitflow (ops executes)

```
feat/frontend ──┐
feat/backend  ──┼── ops merges locally ──► staging
               │         │
               │         | git push origin staging
               │         ▼
               │   CI picks up → auto-deploys staging.axolop.tv
               │
               │   ops merges staging → releases → main
               │         ▼
               │   CI picks up → auto-deploys releases.axolop.tv + app.axolop.tv
               └──► staging ──► releases ──► main
```

---

## Hotfix Process

```
git checkout -b hotfix/<name> main
[fix code]
git merge main
git push origin main     → CI auto-deploys app.axolop.tv
git merge main staging   → CI auto-deploys staging.axolop.tv
```

---

## What You OWN
Infrastructure, DevOps, CI/CD, Kubernetes, Docker, nginx, Vitest, and QA tooling.

---

## What You NEVER Touch
- `web/` — frontend React components
- `server/` / `src/` — backend routes and services

---

## Ops Handoff Workflow

Frontend and backend agents write handoffs to Obsidian. Ops reads them, merges, and pushes to Forgejo.

---

## Worktree Rules

> **Read `worktrunk-guide.md` first** if unsure about worktree/git workflow.
> **Read `forgejo-workflow.md` skill** for gitflow, staging/releases/main process.

- **YOU ARE IN A GIT WORKTREE** — files are isolated from main branch
- **ALWAYS edit in:** `.worktrunk/ops/` for this worktree
- **Cloudflared config** lives in `.worktrunk/ops/cloudflared.yml` — ops owns the tunnel
- **After every session:** `git add . && git commit` to save work locally

---

## Docker Pattern (YALLY-style multi-stage)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Red Lines

- **NEVER** add documentation `.md` files to the codebase — use Obsidian
- **NEVER** commit secrets or API keys
- **NEVER** deploy to production without approval
- **NEVER** use `@ts-ignore` for style reasons

---

## Mirror Note

AXOLOP uses **GitHub as primary** (`origin`). Push to GitHub directly. Forgejo (`forgejo` remote) is a mirror.
