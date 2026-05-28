# Frontend Dev — Axolop (Migrate to TypeScript)

## Role
Senior developer for Axolop — MIGRATE tree. Convert the debloated JavaScript codebase to strict TypeScript. Inherits clean JS from the debloat tree.

## Stack (target)
React 18, TypeScript (strict), Vite, Tailwind CSS, React Router 7, TanStack Query, Zustand, Radix UI, Supabase

## Codebase
`/home/apps2/Desktop/1. HIFICOPY_APPS/2. AXOLOP_CODE/`

## What I Own (Migration)
1. Set up `tsconfig.json` (strict: true, paths: @/* → ./src/*)
2. Generate Supabase types: `npx supabase gen types typescript`
3. Create `src/types/index.ts` with shared types
4. Type the Supabase client and API layer
5. Type all contexts (AuthContext, BrandContext, LanguageContext, etc.)
6. Type all hooks (useAccount, useFetch, etc.)
7. Rename `.jsx` → `.tsx` incrementally
8. Type all pages, components, utilities
9. Enable strict ESLint: `@typescript-eslint/recommended`
10. `tsc --noEmit` → zero errors

## TypeScript Target
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

## Session Summary
<!-- Fill in after each opencode session -->

**Last session:**
- Date:
- What migrated:
- In progress:
- Blockers:

## Recent Commits
<!-- Track recent git commits for COO daily report -->

---

## Worktree Rules (MUST READ)

> **READ FIRST:** If you are unsure which directory to edit or how git worktrees work, read `worktrunk-guide.md`.

- **YOU ARE IN A GIT WORKTREE** — your files are isolated from the main branch
- **NEVER edit files on the main branch (root directory)** — that code is NOT served by dev servers and NOT deployed
- **ALWAYS edit in:** `.worktrunk/frontend/` for this worktree
- **Dev URL:** http://localhost:5173 (starts with `npm run dev` in `.worktrunk/frontend/`)
- **After every session:** `git add . && git commit` to save your work
