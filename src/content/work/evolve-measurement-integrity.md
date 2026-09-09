---
title: "Measurement Integrity"
client: "Evolve ETFs"
role: "Analytics and reporting lead"
date: "2026, ongoing"
year: 2026
summary: "Evolve's marketing reporting was built on numbers that were quietly wrong. The biggest paid channel was filed as organic, the paid search line was mostly display, and five months of published growth figures did not survive an audit. Fixing the measurement changed what the team could act on."
tags: ["Analytics", "GA4", "Reporting", "Financial services"]
metrics:
  - value: "96%"
    label: "Of a channel line was misattributed"
  - value: "5 months"
    label: "Of reporting re-audited"
  - value: "+29%"
    label: "Users vs the equal window prior"
cover: "/images/work/measurement/cover.png"
cardCover: "/images/work/measurement/cover.png"
featured: true
order: 9
accent: "#1B3D6E"
accentSecondary: "#e57725"
---

Across my first 162 days at Evolve the site's users were up 29% against the equal window before I started, and August 2026 became the highest-traffic month in the site's recorded history. Those are real, and they are the least interesting part of this. They are stated against a matched prior window, not against my first calendar month for a reason that is the whole subject of this case study. I started on 23 March, so nine of that month's thirty-one days were mine. Measuring from the March total would produce a much larger number describing mostly someone else's work.

The more useful work was finding that some of the numbers the function ran on every month could not support the weight being put on them, and rebuilding the reporting so they could.

## The biggest paid channel was filed as organic

Reddit is the single largest paid session driver. In GA4 it was landing in Organic Social, because the campaign tagging used a custom medium the platform does not recognise as paid.

Measured across a three-week window, about 96% of everything in the Organic Social line was in fact paid Reddit. Genuine organic social was a rounding error beside it. The mislabelled traffic was a meaningful share of all site sessions, and it had been tagged that way for as long as the convention had existed, so the historical series carried it too.

Session totals were never wrong. The paid-versus-organic mix was. That is the worse failure. The totals looked trustworthy, so nobody had reason to question the split. The read coming out of it was that organic social was performing extraordinarily and that the largest paid channel was invisible.

The fix went in at the source so new campaigns tag correctly, plus a reclassification step in the reporting tool that moves legacy traffic to Paid Social without disturbing session totals. Historical snapshots were rebuilt against it and verified lossless.

## The paid search line was mostly not search

The Paid Search channel carried a large block of Microsoft traffic that had been read as search. Almost all of it was a single Microsoft Audience Network campaign, a native and display placement, sitting in Paid Search only because it was tagged with a search-style medium. It also was not buying anything. Engagement rate 36%, 1.22 pages per session, and an average duration long enough against that page count to be the signature of background tabs and accidental taps on native inventory.

Two false readings came out of that at once: paid search looked bigger than it was, and it looked worse than it was, because display performance was being averaged into it.

## Five months of reporting, checked one at a time

I audited every monthly marketing figure from March to July against live GA4. Every month's headline session total was exactly right. Several things derived from those totals were not.

Six recurring causes came out of it, and they are ordinary. Growth percentages computed on a partial window and never recomputed once the month settled. Comparison columns hand-carried between decks until they drifted onto different bases. That is how a decline gets reported where there was a rise. A GA4 `(not set)` row folded into a real page, making a table sum exceed the site total. A rounded planning target reported as a measurement. A per-fund cost figure lined up against the wrong campaign.

The audit was applied to my own figures on the same terms as everyone else's. That is where one of the six surfaced: a dimensional query left on its default row limit had silently truncated, overstating a genuine increase by a wide margin. That one became a standing pre-publish check. The output was not just corrections. It was a checklist that runs before anything is published, plus a documented set of date windows where the data is known to be unusable, so a future analyst does not quietly build on a month that cannot support it.

## Why this belongs in a marketing role

The instinct is to treat this as an analyst's job. It is the opposite. Every channel decision was being made against a paid-versus-organic split that was materially wrong and a paid search line that was mostly display. That covers where the next dollar goes, which surface is working, and what the team is told is compounding.
