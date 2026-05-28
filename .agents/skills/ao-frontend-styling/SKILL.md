# ao-frontend-styling

Use when: styling components with Tailwind CSS, applying dark mode, working with the HIFICOPY brand theme, responsive layouts, class-variance-authority, tailwind-merge, clsx, or CSS patterns. Examples: add new button variant, apply dark mode to page, fix responsive layout, create card component.

Stack: Tailwind CSS 3, CSS variables, class-variance-authority (cva), tailwind-merge, clsx.

Brand: HIFICOPY yellow `#f2ff00` on dark `#0a0a0a` (check `tailwind.config.js` for actual values).

Key files:
- `tailwind.config.js` → `tailwind.config.ts`
- `postcss.config.js` → `postcss.config.ts`
- `index.css` — global styles + Tailwind directives
- `src/components/ui/` — shared UI components (target: <30 after debloat)
- `src/components/landing/` — landing page sections
- `src/components/layout/` — Header, Sidebar, MainLayout

Patterns:
- Use `cn()` (clsx + tailwind-merge) for conditional classes
- Brand colors via Tailwind theme tokens
- Radix UI primitives for accessible components (already in use)
- Dark mode: `dark:` variant on all color classes
- Responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Debloat: remove duplicate Alert, EmptyState, Loading variants — keep one canonical version
