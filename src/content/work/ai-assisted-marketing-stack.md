---
title: "AI-Assisted Marketing Stack"
client: "Evolve ETFs"
role: "Marketing tools and infrastructure"
date: "2026, ongoing"
year: 2026
summary: "Most marketing functions run on several SaaS subscriptions. AI assist makes it possible to build equivalent tools in-house, so Evolve operates on one AI subscription instead of several recurring SaaS bills."
tags: ["Marketing tech", "Infrastructure", "AI-assisted"]
metrics:
  - value: "180+"
    label: "Reddit assets per refresh"
  - value: "4"
    label: "Ad platforms unified"
  - value: "5+"
    label: "Tools in stack"
cardCover: "/images/work/ai-stack/cover.png"
featured: true
order: 0
accent: "#1B3D6E"
accentSecondary: "#e57725"
---

Most marketing functions pay for several SaaS subscriptions to cover reporting, competitive intel, analytics, and automation. AI assist makes it possible to build equivalent tools in-house, so the team operates on one AI subscription instead of several recurring SaaS bills.

The headliner is the monthly-update-tool. It consolidates ad-spend and performance data from Google Ads, Reddit Ads, Facebook, and LinkedIn into a single view, generates the monthly performance summary, and exposes scheduler-gated endpoints that other automations can hit. Cloud Run-deployed, touched a few times a week, replacing what would otherwise be manual data-pulling across four platforms every reporting cycle.

![Performance dashboard: primary KPI tiles (total spend, website sessions, paid CTR, conversions, paid-vs-organic split), secondary row with top organic query and top landing page, and the charts panel below — 12-month sessions trend plus a donut of traffic mix by channel group](/images/work/ai-stack/dashboard.png)

Other pieces in the stack:

- **A competitive-intel pipeline** that pulls SEMrush data on what other Canadian ETF firms are running in market, with month-by-month caching to control API costs
- **A LinkedIn post decoder** that recovers exact post timestamps from the URN, used to track the sales team's posting cadence as a KPI without manual logging
- **WordPress custom endpoints** that automate recurring content chores like TablePress fund-history writes, EOM distribution updates, and Yoast meta management
- **AEO and schema audits** that identify FAQ-schema and structured-data gaps competitors aren't filling, so the fund pages get picked up by answer engines and AI search
- **Funnel diagnostics** built ad-hoc when the GA4 setup is doing something I don't trust

The clearest impact is on the recurring chores. Month-end updates that used to take the first week of the month (fund overviews, ad performance summaries, distribution data) now ship in a day or two. The PLU DIUO tab takes the two monthly source files (or a folder containing them) and outputs the InDesign-merge file directly. As-at dates auto-detect from the filenames. Trailing 12-month yields, current net yields, and the 1-, 3-, 5-year and since-inception returns flow through per fund without manual entry.

![PLU DIUO Update interface: drop zone for the two monthly source files, auto-filled as-at date, and InDesign / Illustrator export buttons](/images/work/ai-stack/plu-update.png)

The Reddit monthly-update flow follows the same shape. A refresh cycle touches around 180 creative assets. Six fund campaigns, two ad groups each (keyword and retargeting), three Reddit sizes per ad group, five or six images per size. Drop the month's ABMs folder, the tool groups creative by fund using the ticker convention in the filenames, and generates the per-fund refresh in one pass.

![Reddit Monthly Update interface: known-funds counter, drop zone for the month's ABMs folder, local-path option, and Auto split logic for CTR and impression thresholds](/images/work/ai-stack/reddit-monthly.png)

Each tool above would have meant a separate SaaS subscription, vendor onboarding, or engineering ticket. AI assist makes them buildable in days, on one subscription.
