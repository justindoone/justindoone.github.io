---
title: "Month-End Production Automation"
client: "Evolve ETFs"
role: "Marketing operations and production automation"
date: "2026, ongoing"
year: 2026
summary: "Every month a 40+ fund lineup regenerates the same stack of documents in English and French: overviews, fund summaries, covered-call one-pagers, the sales deck, the ad creatives. It used to take the first week of the month and it was done by hand, which meant transposed figures reached print. It now runs off one source file in a day or two."
tags: ["Marketing tech", "Infrastructure", "Compliance", "Financial services"]
metrics:
  - value: "5,068"
    label: "Merge fields per monthly build"
  - value: "45"
    label: "French overviews, generated"
  - value: "18"
    label: "Covered-call PDFs, code not InDesign"
cover: "/images/work/production/cover.png"
cardCover: "/images/work/production/cover.png"
featured: true
order: 5
accent: "#1B3D6E"
accentSecondary: "#e57725"
---

An ETF issuer republishes its whole document set every month. Performance changes, so the fund overview changes, and so does the fund summary, the covered-call commentary, the sales deck, and every ad creative carrying a yield figure. Multiply that by a lineup of more than forty funds in two languages and the first week of every month disappears into it.

That is the boring version of the problem. The real one is that documents assembled by hand at that volume develop errors, and in this business the errors are printed, filed, and distributed to advisors.

## One source file, every document

Everything downstream reads from the same monthly data merge file. Nothing is typed twice.

That file carries 5,068 fields in a single row, which rules out the obvious approach immediately: Word's mail merge data source caps at 255. So the fund summaries builder does direct substitution against `<<field>>` placeholders instead, with format specifiers for the cases where a raw value is not what should print, such as trimming a distribution figure to significant digits rather than rounding it to two.

The InDesign side runs as a batch: point every matching template at the one master data file, merge, export. A name filter scopes it to the current month's natives so re-running one fund's build does not re-merge the whole lineup and lock InDesign for seven minutes.

The covered-call one-pagers went further and left InDesign entirely. Eighteen two-page PDFs, one per covered-call fund, generated from the monthly data folder and the live product pages. There is no `.indd` in that path at all now.

## The gate that catches transpositions

The monthly ad-creative refresh is the step most likely to publish a wrong number, because it updates figures on dozens of individual design elements.

Targeting those elements by ID alone is not safe. A designer may have edited a card since last month, or a card may already be stale, and an ID-based write would overwrite either without noticing. So every write is gated on the element currently holding exactly the value last month's merge produced. Zero matches means the card disagrees with the data it was supposedly built from. More than one match means two figures are indistinguishable and the tool cannot tell which it is looking at. Both refuse rather than guess.

That gate is what caught a transposed figure on a 160x600 unit before it went out. A tool that had simply written by ID would have replaced the wrong number with a different wrong number and reported success.

The same instinct runs through the rest of it. The link audit that checks shared assets across the overview files opens every document, reads its link table, and writes nothing, because a read-only audit can be run against production files without a backup step first. It exists because one shared gradient asset had scattered across several source folders and broken, and the audit finds that pattern before it breaks something else.

## Reporting that refuses to flatter itself

Two of these tools exist specifically to stop a plausible number from being reported.

Month-to-date pacing is bounded to complete days only. Today is excluded, because GA4 is still collecting and Google keeps re-flagging clicks as invalid for a day or two afterward. Including a part-day inflates the elapsed-days denominator while under-reporting spend, which biases the pacing estimate low in both directions at once.

Spend on the largest paid channel is pulled in one report call broken down by campaign, not by looping over days. The per-day loop is the obvious implementation and it double-counts, inflating the total by roughly 1.87 times. That is written in the file, in the comment above the function, because it is exactly the kind of thing a future maintainer would helpfully "fix" back.

And month-end risk is measured as headroom rather than projection. A naive projection extrapolates the current daily spend rate and will happily predict an overspend. That misreads the configuration: the spend cap is a lifetime accumulating ceiling, so a campaign stops serving the moment lifetime spend reaches it. The failure mode in the history of this account is not overspending, it is campaigns going dark before month end. So the tool answers the question that matches the actual risk.

## What changed

Month-end went from consuming the first week to a day or two. That is the headline, and it is the less important half.

The more important half is that every figure on every document now traces to one source file, and the steps most likely to introduce an error refuse to proceed when their assumptions do not hold. In a regulated context the cost of a wrong number is not an embarrassing correction, it is a document that has already been filed and distributed.

Building the tools was the cheaper way to get there than checking the work harder.
