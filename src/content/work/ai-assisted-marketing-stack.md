---
title: "AI-Assisted Marketing Stack"
client: "Evolve ETFs"
role: "Marketing tools and infrastructure"
date: "2026, ongoing"
year: 2026
summary: "Most marketing functions run on several SaaS subscriptions. AI assist makes it possible to build equivalent tools in-house, so Evolve operates on one AI subscription instead of several recurring SaaS bills."
tags: ["Marketing tech", "Infrastructure", "AI-assisted"]
metrics:
  - value: "4"
    label: "Ad platforms unified"
  - value: "5+"
    label: "Tools in stack"
  - value: "1 AI sub"
    label: "Replacing SaaS lineup"
cover: "/images/work/evolve-logo-cover.svg"
featured: true
order: 0
accent: "#1B3D6E"
accentSecondary: "#e57725"
---

Most marketing functions pay for several SaaS subscriptions to cover reporting, competitive intel, analytics, and automation. The math adds up. AI assist makes it possible to build equivalent tools in-house, so the team operates on one AI subscription instead of several recurring SaaS bills.

The headliner is the monthly-update-tool. It consolidates ad-spend and performance data from Google Ads, Reddit Ads, Facebook, and LinkedIn into a single view, generates the monthly performance summary, and exposes scheduler-gated endpoints that other automations can hit. Cloud Run-deployed, touched a few times a week, replacing what would otherwise be manual data-pulling across four platforms every reporting cycle.

Other pieces in the stack:

- **A competitive-intel pipeline** that pulls SEMrush data on what other Canadian ETF firms are running in market, with month-by-month caching to control API costs
- **A LinkedIn post decoder** that recovers exact post timestamps from the URN, used to track the sales team's posting cadence as a KPI without manual logging
- **WordPress custom endpoints** that automate recurring content chores like TablePress fund-history writes, EOM distribution updates, and Yoast meta management
- **Funnel diagnostics** built ad-hoc when the GA4 setup is doing something I don't trust

The throughline is cost-efficiency through AI-assisted infrastructure. Each tool above would have meant a separate SaaS subscription, vendor onboarding, or engineering ticket. AI assist makes them buildable in days, on one subscription.
