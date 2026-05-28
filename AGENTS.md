# Backend Dev — Axolop (Debloat)

## Role
Senior developer for Axolop — DEBLOAT tree. Remove all bloat from the codebase: dead configs, unused dependencies, dead scripts, duplicate components, dead utility files.

## Stack (original)
React 18, Vite 5, Tailwind CSS 3, React Router 7, TanStack Query, Zustand, Radix UI, Supabase, Recharts, ReactFlow, DnD Kit, FullCalendar

## Codebase
`/home/apps2/Desktop/1. HIFICOPY_APPS/2. AXOLOP_CODE/`

## What I Own (Debloat)
1. Audit and reduce `package.json` from 142 packages to ~55
2. Delete `/config/` entirely (7 dead config files)
3. Delete duplicate configs: `vite.config.optimized.js`, `jest.config.js`, `playwright.config.js`
4. Delete dead utility files (~40 files in `frontend/utils/`)
5. Delete duplicate UI components (Alert, EmptyState, Loading variants)
6. Simplify `index.html` (301 lines → ~30 lines)
7. Reduce npm scripts from 82 to ~12
8. Verify: `npm install` clean, `npm run dev` starts, `npm run build` passes

## Scripts to KEEP
`dev`, `build`, `preview`, `lint`, `lint:fix`, `typecheck` (add this), `migrate`, `docker:up`, `docker:down`

## Scripts to DELETE
All debug scripts, all Stripe debug scripts, all migration debug scripts, all PM2 scripts, all test scripts (no tests exist)

## Deps to REMOVE
Backend packages in frontend: `express`, `body-parser`, `bull`, `node-cron`, `nodemailer`, `resend`, `openai`, `stripe`, `pm2`, `pg`, `bcrypt`, `jsonwebtoken`, `multer`, `express-rate-limit`, `ioredis`, `telnyx`, `twilio`

Duplicates (pick one): `sonner` OR `react-hot-toast`, `gsap` OR `framer-motion`, `date-fns` OR `luxon`, `sanitize-html` OR `dompurify`, `pino` OR `winston`, `posthog-*` (all 3)

## Session Summary
<!-- Fill in after each opencode session: what you debloated, what's in progress, blockers -->

**Last session:**
- Date:
- What debloated:
- In progress:
- Blockers:

## Recent Commits
<!-- Track recent git commits for COO daily report -->

---

## Worktree Rules (MUST READ)

> **READ FIRST:** If you are unsure which directory to edit or how git worktrees work, read `worktrunk-guide.md`.

- **YOU ARE IN A GIT WORKTREE** — your files are isolated from the main branch
- **NEVER edit files on the main branch (root directory)** — that code is NOT served by dev servers and NOT deployed
- **ALWAYS edit in:** `.worktrunk/backend/` for this worktree
- **After every session:** `git add . && git commit` to save your work
