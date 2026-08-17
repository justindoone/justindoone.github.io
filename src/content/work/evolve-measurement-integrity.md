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
    label: "Of 'organic social' was actually paid"
  - value: "5 months"
    label: "Of published figures re-audited"
  - value: "+49%"
    label: "Sessions, March to July"
cover: "/images/work/measurement/cover.png"
cardCover: "/images/work/measurement/cover.png"
featured: true
order: 3
accent: "#1B3D6E"
accentSecondary: "#e57725"
---

Traffic to evolveetfs.com grew from 93,852 sessions in March to 140,235 in July, and engagement rate went from 61.4% to 67.2%. Those are real, and they are also the least interesting part of this.

The more useful work was discovering that several of the numbers the marketing function reported on every month were wrong in ways nobody had caught, and that decisions were being made on them.

## The biggest paid channel was filed as organic

Reddit is Evolve's single largest paid session driver. In GA4 it was landing in Organic Social, because the campaign tagging used a custom medium the platform does not recognize as paid.

Measured across a three-week window in July, Organic Social showed 10,955 sessions. Of those, 10,560 were paid Reddit. Genuine organic social was running at roughly 395 sessions a month. The mislabelled paid traffic was about 14% of all site traffic, and it had been tagged that way for as long as the convention had existed, so every historical deck carried it too.

Session totals were never wrong. The paid-versus-organic mix was, which is worse in a way, because the totals looked trustworthy enough that nobody questioned the split. The read the team was getting was that organic social was performing extraordinarily and that the largest paid channel was invisible.

The fix went in at the source, so new campaigns tag correctly, plus a reclassification step in the reporting tool that moves legacy traffic to Paid Social without disturbing session totals. Historical snapshots back to January 2025 were rebuilt against it and verified lossless.

## The paid search line was mostly not search

The Paid Search channel carried a large block of Microsoft traffic that had been read as search all year. Roughly 97% of it was a single Microsoft Audience Network campaign, a native and display placement, sitting in Paid Search only because it was tagged with a search-style medium.

It also was not buying anything. Engagement rate 36%, 1.22 pages per session, and an average duration long enough against that page count to be the signature of background tabs and accidental taps on native inventory. Across the year the account produced 21 conversions at roughly $460 each.

Two false readings came out of that at once: paid search looked bigger than it was, and it looked worse than it was, because display performance was being averaged into it.

## Five months of published figures, checked one at a time

In August I audited every monthly marketing figure published from March to July against live GA4. Every month's headline session total was exactly right. Most things derived from those totals were not.

Six recurring causes came out of it, and they are the ordinary ones rather than anything exotic. Growth percentages computed on a partial window and never recomputed once the month settled. Comparison columns hand-carried between decks until they drifted onto three different bases, which produced sign flips: one fund published as down 31.7% for June had actually risen 11.2%. A GA4 `(not set)` row folded into a real page, making a table sum exceed the site total. A rounded planning target reported as a measurement. One fund's cost per click published against a different fund's campaign, which made a "lowest cost per click" claim false.

The audit was applied to my own published figures on the same terms as everyone else's, which is where one of the six causes surfaced: a dimensional query left on its default row limit had silently truncated, turning a 41% increase into a reported 134%. That one became a standing pre-publish check.

The output was not just corrections. It was a checklist that runs before anything is published, plus a documented set of date windows where the data is known to be unusable, so a future analyst does not quietly build on a month that cannot support it.

## Why this belongs in a marketing role

The instinct is to treat this as an analyst's job rather than a marketer's. It is the opposite. Every channel decision at Evolve, where to put the next dollar, which surface is working, what to tell the team is compounding, was being made against a paid-versus-organic split that was materially wrong and a paid search line that was mostly display.

Reporting that survives someone checking it is what makes the rest of the marketing arguable on the merits.
