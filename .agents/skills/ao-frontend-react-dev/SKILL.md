# ao-frontend-react-dev

Use when: working on React components, pages, routing, state management, React Router v7, TanStack Query, Zustand, or any React frontend development. Examples: add new dashboard page, fix React Query data fetching, add protected route, create new form with react-hook-form + zod.

Stack: React 18, TypeScript (strict), Vite, React Router v7, TanStack Query v5, Zustand, react-hook-form, zod.

Key files:
- `src/App.jsx` → `src/App.tsx` (root component, routing setup)
- `src/main.jsx` → `src/main.tsx` (entry point)
- `src/context/AuthContext.jsx` → `src/context/AuthContext.tsx`
- `src/context/BrandContext.jsx` → `src/context/BrandContext.tsx`
- `src/hooks/` — 11 custom hooks
- `src/pages/` — 9 pages (Landing, Dashboard, Login, Register, etc.)
- `src/components/ui/` — 84 UI components (debloat target: <30)
- `src/lib/api.js` → `src/lib/api.ts` (Supabase + API layer)
- `supabase/` — SQL schema files (source of truth for types)

Patterns:
- TypeScript strict: `@typescript-eslint/recommended` + strict null checks
- Supabase client: typed queries only — no `any`
- React Query: typed `useQuery` / `useMutation` with zod schemas
- Forms: react-hook-form + zod resolver
- State: Zustand for global state, React Query for server state
- Routing: React Router v7 with `createBrowserRouter` and typed loaders
- Supabase types: `npx supabase gen types typescript --project-id <id>` → `src/types/supabase.ts`
