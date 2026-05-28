# ao-backend-supabase

Use when: working with Supabase client, PostgreSQL schema, RLS policies, database migrations, Supabase Auth, or any Supabase integration. Examples: add new table, write RLS policy, create database migration, type Supabase queries.

Stack: Supabase (Postgres + Auth + Storage), `pg` driver (raw SQL), `supabase-js` client.

Key files:
- `supabase/supabase-schema.sql` — core schema (238 lines)
- `supabase/supabase-complete-setup.sql` — full schema (481 lines)
- `supabase/misc-sql/` — 11 SQL migration/fix files
- `supabase/seeds/` — 6 seed scripts
- `src/lib/api.js` → `src/lib/api.ts` — Supabase client + typed queries
- `src/types/supabase.ts` — auto-generated types

Key tables:
- `forms`, `form_responses`, `form_analytics` — form builder
- `leads`, `contacts`, `opportunities` — CRM core
- `campaigns`, `campaign_emails` — email campaigns
- `automation_executions` — automation history
- `emails`, `gmail_tokens` — Gmail inbox sync
- `lead_import_presets` — CSV import column mappings
- `identification_keywords` — lead/contact auto-detection

Auth: Custom `auth.users` table (not Supabase Auth) + JWT via `jsonwebtoken`. This is legacy — prefer Supabase Auth going forward.

Patterns:
- Generate types: `npx supabase gen types typescript --project-id <id> > src/types/supabase.ts`
- Use parameterized queries only
- RLS policies must be set for all tables
- Migrations: `supabase/migrate` script or direct `psql`
- NEVER expose database credentials in frontend code
