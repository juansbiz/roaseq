# Contributing to ROASEQ

Thanks for your interest in ROASEQ, the open-source ecommerce attribution platform. This document explains how to file issues, submit pull requests, set up a dev environment, and ship code.

---

## Quick links

- **Issues:** https://github.com/juansbiz/roaseq/issues
- **Discussions:** https://github.com/juansbiz/roaseq/discussions
- **Roadmap / v2 / v3 plan:** see [README.md](README.md) and the `#why-foss` section
- **Security vulnerabilities:** see [SECURITY.md](SECURITY.md) — **do not** file these as public issues
- **Code of Conduct:** [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Mirror on Codeberg:** https://codeberg.org/juansbiz/roaseq
- **Canonical source (Forgejo):** https://git.antieq.com/juansbiz/roaseq

---

## What we're building

ROASEQ is the FOSS alternative to Triple Whale. The destination is **attribution**: multi-touch, channel ROI, journey stitching, ad-spend ROI. The codebase today (v1) is a CRM, the foundation the attribution layer is built on. v2 adds the marketing/event layer. v3 is the actual Triple Whale replacement.

When you contribute, **lead with attribution**. The CRM exists because attribution without events is just guessing. v2 and v3 are the public-facing product; the CRM is the data substrate.

---

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Report unacceptable behavior to `juan@hificopy.com`.

---

## How to file an issue

Before opening a new issue:
1. **Search existing issues.** Use the search bar. Your question may be answered.
2. **Check the docs.** The [README.md](README.md) has the quick-start, the architecture overview, and the roadmap.

When you do open an issue, pick a template:
- **🐛 Bug report** — something broke. Include reproduction steps, expected vs actual, screenshots if relevant.
- **✨ Feature request** — something missing. Describe the use case, not just the solution. "I need to compare Meta vs Google ROAS at the touchpoint level" is better than "Add a comparison widget."
- **📖 Documentation issue** — README, inline docs, or anything else unclear.
- **🔒 Security** — see [SECURITY.md](SECURITY.md). Don't file security issues publicly.

For attribution-specific feature requests, include:
- What attribution model you're using today (last-touch, multi-touch, MMM, data-driven, etc.)
- What event sources you have (Meta Ads, Google Ads, TikTok, Shopify, Klaviyo, etc.)
- What question you want answered (channel ROI, customer journey, attribution model comparison, etc.)

---

## How to submit a pull request

### Before you start
- **Open an issue first** for non-trivial changes. PRs without a corresponding issue often get rejected because the change doesn't fit the roadmap.
- **Comment on the issue** saying "I'd like to work on this." Wait for a maintainer to confirm before starting, to avoid duplicate work.
- **Small fixes** (typos, broken links, doc improvements) can go straight to PR without an issue.

### Branch naming
- `fix/<short-description>` for bug fixes
- `feat/<short-description>` for new features
- `docs/<short-description>` for documentation-only changes
- `chore/<short-description>` for tooling, CI, refactors

### Commit messages
We follow Conventional Commits loosely:
```
<type>(<scope>): <short summary>

<optional body explaining the why>
```
Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`. Keep the summary under 72 chars. No em-dashes, no emoji.

Examples:
- `feat(attribution): add first-touch model`
- `fix(auth): handle expired JWT refresh`
- `docs: add migration guide from Triple Whale`

### Code style
- TypeScript everywhere on backend. React JSX on frontend.
- 2-space indent. No tabs. No semicolons missing.
- Prefer explicit over clever. Readable code > clever code.
- Comments only when the code is non-obvious. No commented-out code in commits.
- No AI-generated comments, no `@ts-nocheck`, no `any` unless absolutely necessary with a comment explaining why.

### Before opening the PR
- [ ] Tests pass locally (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Type-check passes (`npm run ts:check` on backend, Vite handles it on frontend)
- [ ] No new warnings in the build
- [ ] The change is documented if user-facing (README, inline JSdoc, or commit body)
- [ ] No secrets, API keys, or production env values in the diff

### PR review process
1. **Open the PR** against `main`. Use a clear title and a body that explains the **why**, not just the **what**.
2. **CI runs automatically** (lint, build, test). All checks must pass before review.
3. **Maintainer reviews** within ~3 business days. Be patient — ROASEQ is a small project.
4. **Address feedback** by pushing new commits to the same branch. Don't force-push after review starts (it makes review harder).
5. **Squash on merge** — your commits will be squashed into one with a clean message.

---

## Dev setup

ROASEQ is a 3-worktree monorepo. The default `main` branch is the integration trunk; the worktrees hold `feat/backend`, `feat/frontend`, and `ops`.

```bash
# Clone
git clone https://git.antieq.com/juansbiz/roaseq.git
cd roaseq

# Three terminals:
# Terminal 1 — backend
cd .worktrunk/backend
npm install
cp .env.example .env
npm run dev
# → backend on http://localhost:3007

# Terminal 2 — frontend
cd .worktrunk/frontend
npm install
cp .env.example .env
npm run dev
# → frontend on http://localhost:3012

# Terminal 3 — ops (only needed for k8s/docker work)
cd .worktrunk/ops
```

See [AGENTS.md](AGENTS.md) for the full worktree structure, the gitflow, and what each worktree owns.

### Required tools
- Node 20+
- npm 10+
- Docker + docker-compose (for the local Postgres + Redis stack)
- PostgreSQL 16 (or use the docker-compose)
- Redis 7 (or use the docker-compose)

### First-time setup checklist
- [ ] Node version matches `.nvmrc` if present
- [ ] Docker is running (`docker ps` should not error)
- [ ] The local Postgres + Redis stack is up (`npm run docker:up` from frontend worktree)
- [ ] The backend can connect to Postgres (visit `http://localhost:3007/health`)
- [ ] The frontend can reach the backend (visit `http://localhost:3012` and check the network tab)

---

## Project structure

```
roaseq/
├── AGENTS.md                  # The integration agent's instructions (trunk/main)
├── README.md                  # The product README (attribution-first, AIDA, no em-dashes)
├── LICENSE                    # AGPL-3.0
├── CONTRIBUTING.md            # You are here
├── CODE_OF_CONDUCT.md         # Contributor Covenant 2.1
├── SECURITY.md                # Vuln disclosure policy
├── .github/CODEOWNERS         # Auto-assigns PRs to @juansbiz
├── package.json               # Root: `roaseq`, license AGPL-3.0
├── docker/backend/            # Local docker-compose for Postgres + Redis + backend
├── .worktrunk/
│   ├── backend/              # feat/backend branch — Express + TypeScript
│   ├── frontend/             # feat/frontend branch — React + Vite + Tailwind
│   └── ops/                  # ops branch — k8s, CI, Docker
└── config/                   # Tailwind + PostCSS config
```

---

## What you can contribute right now

### Good first issues
Look for issues tagged `good first issue` on GitHub. Common starters:
- Documentation fixes (typos, broken links, clearer examples)
- TypeScript `any` removal (replace with proper types)
- Test coverage in the backend (`server.ts`, `routes/`, `db/`)
- New ad-platform connector in `routes/integrations/` (Meta, Google, TikTok, Snap, Pinterest, Klaviyo, Shopify)
- Attribution model implementation in `services/attribution/` (currently a stub for v1)

### Bigger projects (v2 / v3 roadmap)
- **v2 marketing layer:** customer-journey event store, ad-platform connectors, automations
- **v3 attribution models:** first-touch, last-touch, linear, time-decay, position-based, data-driven
- **v3 custom model runner:** BYO Python or SQL for the BYO model feature
- **Export pipelines:** Looker, Metabase, your-own-BI integrations

For v2 and v3 work, **open an issue first** so we can scope before you spend time.

---

## Reporting a vulnerability

See [SECURITY.md](SECURITY.md). Report to `juan@hificopy.com`. **Do not** open a public issue for security bugs. We follow a 90-day disclosure timeline.

---

## License

ROASEQ is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. By contributing, you agree that your contributions will be licensed under AGPL-3.0. See [LICENSE](LICENSE) for the full text.

In short: your code stays FOSS, including for hosted/network use (that's the AGPL's "network use" clause). If you build a hosted service using ROASEQ, you must publish the source of any modifications you make.

---

## Maintainer

**Juan (juansbiz)** — juan@hificopy.com

ROASEQ is a one-founder project. Response time on issues and PRs is **best-effort**, usually within a week, sometimes faster.
