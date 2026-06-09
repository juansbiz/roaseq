# ROASEQ

**Open-source ecommerce attribution platform** — the FOSS alternative to Triple Whale.

> Every ad click, every checkout, every email open, every repeat purchase — a row in **your** Postgres. Multi-touch attribution, channel-level ROI, journey stitching. No percentage of ad spend. No black box. No lock-in.

---

## What is this, really?

**ROASEQ is the open-source ecommerce attribution platform that DTC brands run on their own infrastructure instead of paying Triple Whale $1K–$10K/mo.**

The destination is attribution. The codebase today is the v1 CRM — the foundation the attribution layer is built on. We are not hiding this; the roadmap below is public and the README tells you exactly where we are.

| Phase | What ships | Status |
|---|---|---|
| **v1 — CRM** | Contact / Company / Deal / Lead / Pipeline / Email / Calendar / Dashboard / Multi-tenant. The event store the attribution model will read. | **Shipped in this repo.** |
| **v2 — Marketing & event layer** | Ad-platform connectors (Meta, Google, TikTok, Klaviyo, Shopify). Customer-journey event store. Email/SMS send engine. Automations. | **Next.** Starts after INBOXEQ hits $100K MRR. |
| **v3 — Attribution** | Multi-touch models (first-touch, last-touch, linear, time-decay, position-based, data-driven). Channel-level ROAS. Journey visualization. Custom model runner (BYO Python / SQL). Export to Looker / Metabase / your own BI. | **The goal.** The Triple Whale replacement. |

We call it "attribution-first" because if we called it a CRM forever, we'd be competing with HubSpot. By leading with attribution, we compete with **one** closed-source vendor and we anchor to the problem every emerging brand cares about most: *where's my money going?*

---

## Why FOSS

Closed-source SaaS had its time in ecommerce attribution. The future is open. The future is self-hosted. The future is YOU owning your events, YOUR data, YOUR attribution models, YOUR business.

- **Take the code.** Modify it. Make it yours. Forever. (AGPL-3.0.)
- **Self-host.** Docker, Railway, Fly, your own VPS. Your events, your server, your rules.
- **No percentage of ad spend.** Flat or free. The events are yours.
- **Open API.** Full access. No paywalls. Build whatever model you want.

---

## Quick start

```bash
# Clone from Forgejo (canonical source)
git clone https://git.antieq.com/juansbiz/roaseq.git
cd roaseq

# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

Dev ports: backend `:3007`, frontend `:3012`.

See [`/docs`](./docs) for the full self-hosting guide, env setup, and migration recipes from Triple Whale / Northbeam / Polar / Avery.

---

## Repo rules

- This is the **only public repo** in the juansbiz portfolio besides the GitHub profile README.
- Every change is publicly auditable. No surprises.
- **GitHub is a read-only mirror.** Canonical source: `https://git.antieq.com/juansbiz/roaseq`. Push to `origin` (Forgejo); GitHub updates automatically via push-mirror.
- Issues and PRs are open. Community contributions are how v2 and v3 land.

See [`6. OPERATIONS/REPO-VISIBILITY-POLICY.md`](https://git.antieq.com/juansbiz/juansbiz-obsidian/src/branch/main/6.%20OPERATIONS/REPO-VISIBILITY-POLICY.md) (in the Obsidian vault) for the full policy.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite 5 + Tailwind CSS |
| Backend | Express 4 + TypeScript |
| Database | PostgreSQL 16 (self-hosted, raw `pg` driver) |
| ORM | Custom `compat.ts` wrapper |
| Cache | Redis 7 |
| Auth | JWT + bcrypt (httpOnly cookie) |
| Payments | Stripe |
| Deployment | Docker, Kubernetes, Forgejo CI |

---

## License

**AGPL-3.0** — see [`LICENSE`](./LICENSE).

You can use it, fork it, self-host it, modify it. If you run a modified version as a network service, you must publish your modifications. That's the deal. It's how the FOSS attribution layer stays open.

---

## Connect

- Discord: [Inbox EQ / ROASEQ community](#) (link coming)
- Twitter: [@juansbizz](https://twitter.com/juansbizz)
- Issues & PRs: open them here

---

<sub>The CRM is the foundation. Attribution is the destination. Open source, forever.</sub>
