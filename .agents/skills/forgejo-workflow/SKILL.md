---
name: forgejo-workflow
brain: /home/apps2/Desktop/3. AGENTIC_BRAIN/PANPA_OBSIDIAN/
obsidian: 3. CONTEXT/skills/forgejo-workflow.md
description: "Use when: managing git branches (staging/releases/main), merging feature branches, pushing to Forgejo, understanding CI triggers, setting up hotfixes, or any gitflow-related task. Examples: merge frontend/backend to staging, create release branch, set up new staging/releases branches, understand mirror sync to GitHub."
---

# Forgejo Workflow — Gitflow & CI/CD

> **READ FIRST:** This skill covers the canonical gitflow used across all shared-stack apps (YALLY, INBOXEQ, AXOLOP, ROZ). RubyOutreach uses its own GitHub Actions flow.

---

## 1. Branch Architecture

All shared-stack apps use the same branch naming:

| Branch | Purpose | Who Creates | Auto-Deploy |
|--------|---------|-------------|-------------|
| `main` | Production | ops | app.axolop.tv |
| `releases` | Release candidate | ops | releases.axolop.tv |
| `staging` | Integration testing | ops | staging.axolop.tv |
| `feat/*` | Feature development | frontend/backend | None |
| `ops/*` | Infrastructure | ops | None |
| `hotfix/*` | Emergency fixes | ops | None |

---

## 2. The Canonical Gitflow

### Feature Development (frontend/backend execute)

```
1. Frontend: git checkout -b feat/my-feature origin/feat/frontend
   Backend:  git checkout -b feat/my-feature origin/feat/backend
2. Implement feature
3. git add . && git commit -m "feat: add my feature"
4. git push origin feat/my-feature
5. Create PR on Forgejo → merge to feat/frontend or feat/backend
```

### Ops Merge to Staging (ops executes)

```
1. Pull latest from all feature branches
   git fetch origin
   git checkout feat/frontend && git pull
   git checkout feat/backend && git pull

2. Merge each into staging (in order)
   git checkout staging
   git merge origin/feat/frontend --no-ff -m "merge: feat/frontend into staging"
   git merge origin/feat/backend  --no-ff -m "merge: feat/backend into staging"
   git push origin staging

3. CI auto-deploys → staging.axolop.tv
4. Manual QA on staging.axolop.tv
```

### Staging → Releases → Main (ops executes)

```
1. After QA passes on staging:
   git checkout releases
   git merge staging --no-ff -m "merge: staging into releases"
   git push origin releases

2. CI auto-deploys → releases.axolop.tv

3. After release QA:
   git checkout main
   git merge releases --no-ff -m "merge: releases into main"
   git push origin main

4. CI auto-deploys → app.axolop.tv
```

---

## 3. CI Pipeline Triggers

### Forgejo Actions (`.forgejo/workflows/` or `forgejo/ci.yml`)

Each app has a CI pipeline that triggers on push:

```yaml
on:
  push:
    branches:
      - main
      - staging
      - releases
      - 'feat/**'
      - 'ops/**'
      - 'hotfix/**'
  pull_request:
    branches:
      - main
      - staging
      - releases
```

### What Each Trigger Does

| Branch | Lint | Typecheck | Build | Deploy |
|--------|------|----------|-------|--------|
| `feat/*`, `ops/*` | ✅ | ✅ | ❌ | ❌ |
| `staging` | ✅ | ✅ | ✅ | ✅ → staging.axolop.tv |
| `releases` | ✅ | ✅ | ✅ | ✅ → releases.axolop.tv |
| `main` | ✅ | ✅ | ✅ | ✅ → app.axolop.tv |
| `hotfix/*` | ✅ | ✅ | ✅ | ✅ → app.axolop.tv |

---

## 4. Mirror Architecture

```
Forgejo (git.antieq.com) ←── canonical source of truth
    │
    ├── GitHub mirror (github.com) ←── read-only, auto-synced
    │
    └── GitHub Actions (for RubyOutreach only)
```

### Mirror Sync (Forgejo → GitHub)

Forgejo has a post-receive hook that auto-pushes to GitHub. **Never push to GitHub directly.**

### AXOLOP Exception

AXOLOP uses **GitHub as primary** (origin), Forgejo as secondary (forgejo). For AXOLOP, GitHub is the canonical source. Push to origin (GitHub) directly.

---

## 5. Ops Role: Git Manager

Ops is the **only agent that pushes to staging, releases, and main branches**. Frontend and backend never push directly to these branches.

### Ops Daily Workflow

```bash
# 1. Start: pull latest from all branches
git fetch origin
git pull origin staging
git pull origin releases
git pull origin main

# 2. Check for new feature branches
git branch -r --merged staging | grep feat/

# 3. Merge features to staging (after PR review)
git checkout staging
git merge --no-ff origin/feat/frontend -m "merge: feat/frontend → staging"
git merge --no-ff origin/feat/backend  -m "merge: feat/backend → staging"
git push origin staging

# 4. Promote to releases (after staging QA)
git checkout releases
git merge --no-ff origin/staging -m "merge: staging → releases"
git push origin releases

# 5. Promote to main (after release QA)
git checkout main
git merge --no-ff origin/releases -m "merge: releases → main"
git push origin main
```

---

## 6. Hotfix Process

For emergency production fixes:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/urgent-fix

# 2. Implement fix
git commit -m "fix: urgent fix description"

# 3. Push and merge
git push origin hotfix/urgent-fix

# 4. Merge to main → auto-deploys app.axolop.tv
git checkout main
git merge --no-ff hotfix/urgent-fix -m "merge: hotfix/urgent-fix → main"
git push origin main

# 5. Backport to staging
git checkout staging
git merge --no-ff main
git push origin staging

# 6. Clean up
git branch -d hotfix/urgent-fix
git push origin --delete hotfix/urgent-fix
```

---

## 7. Setting Up New Branches

### Creating `staging` for a New App

```bash
# 1. From main, create staging
git checkout main
git pull origin main
git checkout -b staging

# 2. Push to origin (triggers CI)
git push origin staging

# 3. Verify CI: Forgejo → Actions → check staging pipeline
```

### Creating `releases` for a New App

```bash
git checkout main
git pull origin main
git checkout -b releases
git push origin releases
```

---

## 8. CI Failure Response

If CI fails on a branch:

```bash
# 1. Check the error
git log origin/staging --oneline  # find the failing commit
git show <hash>                   # see what changed

# 2. Fix the issue in the feature branch
git checkout feat/my-feature
# ... fix code ...
git commit -m "fix: resolve CI failure"
git push origin feat/my-feature

# 3. Re-merge to staging
git checkout staging
git merge --no-ff origin/feat/my-feature -m "merge: feat/my-feature → staging"
git push origin staging
```

---

## 9. Key Paths

| App | Forgejo Repo | GitHub Mirror |
|-----|------------|-------------|
| YALLY.TV | git.antieq.com/juansbiz/yallytv | github.com/yallytv/app |
| INBOXEQ | git.antieq.com/juansbiz/inboxeq | github.com/juansbiz/inboxeq |
| AXOLOP | git.antieq.com/juansbiz/axolop | github.com/juansbiz/axolop |
| ROZ | git.antieq.com/juansbiz/roz | github.com/juansbiz/roz |

---

## See Also

- `worktrunk-guide.md` — git worktree basics, directory structure
- `worktrunk/ops/AGENTS.md` — ops agent role definition
