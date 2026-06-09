# Security Policy

ROASEQ is a FOSS attribution platform with AGPL-3.0 license. We take security seriously. This document explains how to report vulnerabilities, our disclosure timeline, and the versions of ROASEQ that currently receive security updates.

---

## Reporting a vulnerability

**Please do not file security vulnerabilities as public GitHub issues.** Public issues are indexed by search engines and discovered by attackers before we can fix them.

Instead, report security issues by **email**:

**`juan@hificopy.com`**

Use a descriptive subject line (e.g. "ROASEQ: SQL injection in attribution query"). Include:

- A clear description of the issue and its impact
- Steps to reproduce (proof-of-concept code or commands are welcome)
- The version of ROASEQ affected (commit SHA, release tag, or "main")
- The component (backend, frontend, docker, etc.) and any relevant config
- Whether you discovered it during normal use, a security audit, or a fuzz test

You can also report via **GitHub Security Advisories** if you prefer the private disclosure flow: https://github.com/juansbiz/roaseq/security/advisories/new

---

## What to expect

### Initial response (within 72 hours)
We will acknowledge your report and give you a tracking ID. If your report is missing critical information, we'll ask for it. We will **not** contact law enforcement or pursue legal action against you for reporting a vulnerability in good faith.

### Triage (within 7 days)
We will assess the severity (using CVSS 3.1 or similar), assign a fix priority, and let you know the timeline. For critical issues, we may ask you to coordinate the public disclosure date.

### Fix and disclosure
We follow a **90-day disclosure timeline** by default. That means:

| Severity | Fix target | Disclosure |
|---|---|---|
| **Critical** (RCE, auth bypass, data exfiltration) | 7 days | 14 days (coordinated with reporter) |
| **High** (privilege escalation, SQL injection, XSS-to-account-takeover) | 30 days | 60 days |
| **Medium** (CSRF on sensitive endpoints, stored XSS) | 60 days | 90 days |
| **Low** (info disclosure, missing security headers) | 90 days | 120 days |

These are targets, not guarantees. Complex fixes (database migrations, breaking API changes) may take longer, and we'll keep you updated.

### Credit
If you'd like, we'll credit you as the reporter in:
- The release notes for the fix
- The GitHub Security Advisory (public post-fix)
- The ROASEQ README's "Security Hall of Fame" (added once we have multiple reporters)

If you'd rather stay anonymous, just say so and we will.

---

## Scope

### In scope
The following are in scope for security reports:
- `git.antieq.com/juansbiz/roaseq` (canonical source)
- `github.com/juansbiz/roaseq` (mirror, treated as the same project)
- `codeberg.org/juansbiz/roaseq` (mirror, treated as the same project)
- The default Docker Compose stack (`docker/backend/docker-compose.yml`)
- The default Kubernetes manifests (`.worktrunk/ops/k8s/`)
- The Vite dev server and Express backend (default configs)
- Production deployment at `roaseq.antieq.com` (and any subdomains)

### Out of scope
- Third-party dependencies. If you find a vulnerability in a library we use (e.g. `express`, `react`, `vite`), please report it upstream to that project's security team.
- User-specific deployment issues (custom configs, custom infra). We can help debug, but those are your deployment, your problem.
- Denial-of-service attacks. ROASEQ is a self-hosted app; if your infra can't handle the load, that's an infra issue, not a code issue.
- The README, docs, and issue tracker (these are not attack surfaces).

### Specifically NOT in scope (and we won't fix)
- Anything that requires a malicious user to have write access to the server
- Anything that requires a malicious user to be an authenticated admin
- Self-XSS (you can only XSS yourself in our app)
- Rate limiting on auth endpoints (we use Cloudflare / a reverse proxy in production; rate limiting is deployment-config, not app-config)

---

## Security architecture notes

For reviewers and contributors:

- **Authentication:** JWT (HS256) + bcrypt password hashing. JWTs are httpOnly cookies. No long-lived tokens; refresh token rotation is on the v2 roadmap.
- **Authorization:** Per-tenant data isolation via `tenant_id` in every query. The compat layer in `db/compat.ts` requires a tenant_id on every read/write.
- **SQL injection prevention:** All database access goes through the `db/compat.ts` wrapper, which uses parameterized queries exclusively. Raw SQL is not allowed outside that wrapper.
- **CORS:** Strict allowlist in production. Default dev config allows `localhost:3012` and `localhost:3007` only.
- **Rate limiting:** Cloudflare / reverse-proxy level in production. App-level rate limiting is on the v2 roadmap.
- **Secret management:** All secrets via `process.env.X` with `throw new Error()` at boot if unset. No defaults, no fallback to empty string. See `AGENTS.md` for the full pattern.

---

## Security update policy

- The `main` branch on Forgejo receives security updates immediately after a fix is merged.
- GitHub and Codeberg mirrors are auto-synced from Forgejo (`sync_on_commit: true`, `interval: 10m`).
- We do not maintain separate LTS branches. The latest commit on `main` is always the most secure.
- We do not publish Docker images with security tags. Run `docker pull` against `registry.antieq.com/juansbiz/roaseq:latest` (or the digest-pinned image) to get fixes.

---

## Historical security issues

None reported as of 2026-06-09.

This is the first release of the security policy. The "Security Hall of Fame" will appear here once we have reporters to credit.

---

## Contact

- **Email:** `juan@hificopy.com` (PGP key: TBD, will be added once we set up a keyserver)
- **GitHub Security Advisories:** https://github.com/juansbiz/roaseq/security/advisories/new
- **Maintainer:** Juan (juansbiz) — best-effort response within 72 hours

For anything that's not a security issue, please use the regular [issue tracker](https://github.com/juansbiz/roaseq/issues) or [Discussions](https://github.com/juansbiz/roaseq/discussions) instead.
