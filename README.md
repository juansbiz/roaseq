<div align="center">

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-yellow?style=flat-square)](./LICENSE)
[![Status: Beta](https://img.shields.io/badge/Status-Beta-yellow?style=flat-square)]()
[![FOSS](https://img.shields.io/badge/FOSS-yes-yellow?style=flat-square)]()
[![Postgres](https://img.shields.io/badge/Postgres-14%2B-blue?style=flat-square)]()
[![Node](https://img.shields.io/badge/Node-20%2B-brightgreen?style=flat-square)]()

# ROASEQ

### Multi-touch attribution for ecommerce. In your own Postgres.

[roaseq.com](https://roaseq.com) is the marketing site.
This repo is the self-hostable software.

</div>

---

## What is ROASEQ?

Multi-touch attribution (first-touch, last-touch, linear, time-decay,
position-based, data-driven), channel ROI, and journey stitching for
Shopify, WooCommerce, and BigCommerce stores.

The events live in your Postgres. The models live in this repo.
The contract is the AGPL. Nothing to renew.

## Quick start (Docker)

Requires Docker 24+ and 4 GB RAM.

```bash
git clone https://github.com/juansbiz/roaseq.git
cd roaseq
docker compose -f docker/docker-compose.yml up
```

Frontend on `:5173`, backend on `:3001`, Postgres on `:5432`.

The first time the stack starts, the backend runs a setup wizard at
`http://localhost:5173/setup` to configure the database, your admin
account, your AI provider, and your first store connection.

For local development without Docker:

```bash
npm install
npm run dev          # frontend on :5173
npm run backend:local  # backend on :3001
```

## Configuration

Copy `config/example.env` to `config/.env` and set:

```
DATABASE_URL=postgres://roaseq:roaseq@localhost:5432/roaseq
REDIS_URL=redis://localhost:6379
SECRET_KEY=<32 char random string>
PORT=3001
NODE_ENV=production
```

## Connectors

| Store | Status | Docs |
|---|---|---|
| Shopify | Stable | [docs/SHOPIFY.md](./docs/SHOPIFY.md) |
| WooCommerce | Stable | [docs/WOOCOMMERCE.md](./docs/WOOCOMMERCE.md) |
| BigCommerce | Beta | [docs/BIGCOMMERCE.md](./docs/BIGCOMMERCE.md) |

| Ad platform | Status | Docs |
|---|---|---|
| Meta | Stable | [docs/META.md](./docs/META.md) |
| Google Ads | Stable | [docs/GOOGLE-ADS.md](./docs/GOOGLE-ADS.md) |
| TikTok | Beta | [docs/TIKTOK.md](./docs/TIKTOK.md) |
| Snap | Planned | (not yet) |
| Pinterest | Planned | (not yet) |

## Attribution models

ROASEQ ships with six attribution models out of the box. Each is a
SQL view in your database; you can audit, modify, or replace them.

- `attribution.first_touch`: first touchpoint gets 100% of the credit
- `attribution.last_touch`: last touchpoint gets 100% of the credit
- `attribution.linear`: equal credit across all touchpoints
- `attribution.time_decay`: exponential decay from conversion (7-day half-life)
- `attribution.position_based`: 40% first, 40% last, 20% middle
- `attribution.data_driven`: Shapley value approximation

Build a custom model: see [docs/CUSTOM-MODELS.md](./docs/CUSTOM-MODELS.md).

## First-run wizard

When you start ROASEQ for the first time, a 5-step setup wizard walks
you through:

1. Database (bundled Postgres or your own)
2. Admin user (email + password)
3. AI provider (OpenAI, Anthropic, AWS Bedrock, Ollama, or any OpenAI-compatible endpoint)
4. First store (Shopify, WooCommerce, or BigCommerce)
5. Done. You're at the dashboard.

The wizard works offline. It does not call home. It does not require
an account at the marketing site.

## System requirements

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Storage | 20 GB | 100 GB SSD |
| Postgres | 14 | 16 |
| Node | 20 LTS | 22 LTS |
| Redis | 6 | 7 |

## Deployment

- Docker Compose (single host): see [docker/](./docker/)
- Kubernetes (Helm): see [deploy/helm/](./deploy/helm/)
- Air-gapped: see [docs/AIRGAPPED.md](./docs/AIRGAPPED.md)
- Single binary: `npx roaseq` (evaluation only, not for production)

## Migration from closed-source tools

Importers for Triple Whale, Northbeam, Polar, Rockerbox, and Wicked
Reports are included. See [docs/MIGRATION.md](./docs/MIGRATION.md).

## API

REST API on `:3001/api`. OpenAPI spec at `/api/docs`. See
[docs/API.md](./docs/API.md).

## Telemetry

ROASEQ has zero telemetry. No outbound calls. No license check. No
usage reporting. The software runs entirely inside your perimeter.

## Architecture

- `backend/`: Node.js + Express + TypeScript
- `frontend/`: React + Vite + Tailwind
- `db/`: Postgres migrations
- `install/`: First-run wizard
- `docker/`: Docker Compose stack
- `deploy/`: Kubernetes manifests
- `docs/`: Documentation

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full design.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Pull requests welcome.

## Security

See [SECURITY.md](./SECURITY.md). 90-day disclosure timeline.

## License

**AGPL-3.0.** See [LICENSE](./LICENSE).

Use it, fork it, self-host it, modify it. If you run a modified version
as a network service, publish your changes. That's the deal. It's how
the FOSS attribution layer stays open.

---

<sub>Your events. Your models. Your database. Open source, forever.</sub>
