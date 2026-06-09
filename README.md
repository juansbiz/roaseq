<div align="center">

# 🐳 ROASEQ

**The open-source attribution platform for ecommerce.**
**Run it on your hardware. Own the events.**

[⭐ Star on GitHub](https://github.com/juansbiz/roaseq) &nbsp;·&nbsp; [📖 Docs](./docs) &nbsp;·&nbsp; [🐛 Report a bug](https://github.com/juansbiz/roaseq/issues) &nbsp;·&nbsp; [🐦 @juansbizz](https://twitter.com/juansbizz)

</div>

---

## What is ROASEQ?

The FOSS alternative to Triple Whale. Multi-touch attribution, channel ROI, journey stitching, in your own Postgres. No percentage of ad spend. No annual contract. No lock-in.

> The dream: an emerging brand runs real attribution on its own infrastructure for free, instead of paying a vendor a percentage of ad spend to know which Facebook ad is profitable.

---

## The problem

Triple Whale, Northbeam, Polar, Rockerbox, Wicked Reports. They all do the same thing. They hold your attribution data in their warehouse, charge you a flat fee (or worse) to see it, and lock you into a 12-month contract.

A 2025 audit by Wicked Reports and Tier 11 across 2,000+ brands found third-party attribution tools misreport up to 30% of revenue. Bottom-funnel channels get over-credited. Prospecting looks broken even when it's working. Brands scale the wrong campaigns and kill the ones actually creating customers.

None of them are open source. None of them self-host. None of them put the events in your database where you can run your own models.

ROASEQ does.

---

## What you get

🧠 **Multi-touch attribution.** First-touch, last-touch, linear, time-decay, position-based, data-driven. Pick the model that fits your business, or build your own.

💵 **No percentage of ad spend. No annual contract.** Free, self-hosted. Or flat-rate cloud. Forever.

🔓 **The events are yours.** Every ad click, every checkout, every email open, every repeat purchase: a row in your own Postgres. Export anytime. Run any model you want.

---

## What you replace

| Closed source | What it charges | ROASEQ |
|---|---|---|
| **Triple Whale** | $179 to $749/mo, enterprise custom, 12-month lock-in | Free self-host, or flat cloud |
| **Northbeam** | $1,500/mo starter, custom above that, demo-gated | Free self-host, or flat cloud |
| **Polar Analytics** | Quote-based, "Core" bundle discount, your own Snowflake (but theirs) | Free self-host, YOUR Postgres |
| **Rockerbox** | No public pricing, $250K+ media spend to qualify | Free self-host, no qualification |
| **Wicked Reports** | $499 to $999/mo, $4,999/mo enterprise | Free self-host, or flat cloud |

The same answers to "which ad is profitable" and "where did this customer come from," in your own database, without the vendor markup.

---

## Quick start

Self-host with Docker:

```bash
git clone https://github.com/juansbiz/roaseq.git
cd roaseq
cd docker && docker compose up
```

Or run the dev stack:

```bash
git clone https://github.com/juansbiz/roaseq.git
cd roaseq
npm install
npm run dev          # frontend on :5173
npm run backend:local  # backend on :3001
```

Then connect your store (Shopify, WooCommerce, BigCommerce), connect your ad accounts (Meta, Google, TikTok, Snap, Pinterest), and the events start flowing. Your data, your Postgres, your machine.

---

## License

**AGPL-3.0.** Use it, fork it, self-host it, modify it. If you run a modified version as a network service, publish your changes. That's the deal. It's how the FOSS attribution layer stays open.

---

<sub>Your events. Your models. Your database. Open source, forever.</sub>
