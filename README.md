# 🐳 ROASEQ

**Open-source ecommerce attribution.** The FOSS alternative to Triple Whale.

Every ad click, every checkout, every email open, every repeat purchase: a row in your own Postgres. Multi-touch attribution, channel ROI, journey stitching. No percentage of ad spend. No black box. No lock-in.

## Why attribution

ROASEQ is the open-source ecommerce attribution platform that DTC brands run on their own infrastructure instead of paying Triple Whale $1K to $10K a month.

The destination is attribution. The codebase today is the v1 CRM, the foundation the attribution layer is built on. We are not hiding this. The roadmap below is public.

| Phase | What ships | Status |
|---|---|---|
| **v1** | CRM: contacts, deals, pipelines, email, calendar, dashboard, multi-tenant. The event store the attribution model will read. | Shipped in this repo. |
| **v2** | Marketing and event layer: ad-platform connectors (Meta, Google, TikTok, Klaviyo, Shopify), customer-journey event store, email/SMS send engine, automations. | Next. |
| **v3** | Attribution: multi-touch models (first-touch, last-touch, linear, time-decay, position-based, data-driven), channel-level ROAS, journey visualization, custom model runner (BYO Python or SQL), export to Looker, Metabase, or your own BI. | The goal. The Triple Whale replacement. |

## Why FOSS

Closed-source SaaS had its time in ecommerce attribution. The future is open. The future is self-hosted. The future is you owning your events, your data, your attribution models, your business.

🧠 **The events are yours.** Run your own models. Export anytime.
💵 **No percentage of ad spend.** Flat or free.
🔓 **Self-host anywhere.** Docker, Railway, Fly, your own VPS. AGPL-3.0.

## Quick start

```bash
git clone https://github.com/juansbiz/roaseq.git
cd roaseq

# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

Dev ports: backend `3007`, frontend `3012`.

See the [docs](./docs) for the full self-hosting guide, env setup, and migration recipes from Triple Whale, Northbeam, Polar, and Avery.

## Repo rules

- This is the **only public repo** in the portfolio besides the GitHub profile README.
- Every change is publicly auditable. No surprises.
- GitHub is a read-only mirror of the source repo. Issues and PRs are open.

## Tech stack

React 18, TypeScript, Vite 5, Tailwind. Express 4, PostgreSQL 16 (raw `pg` driver, custom `compat.ts` wrapper). Redis 7. JWT + bcrypt. Stripe. Docker, Kubernetes, CI.

## License

**AGPL-3.0**. You can use it, fork it, self-host it, modify it. If you run a modified version as a network service, you must publish your modifications. That's the deal. It's how the FOSS attribution layer stays open.

## Connect

⭐ Star the repo · 🐛 Open an issue · 💬 Join the community (Discord link coming) · 🐦 [@juansbizz](https://twitter.com/juansbizz)

---

<sub>The CRM is the foundation. Attribution is the destination. Open source, forever.</sub>
