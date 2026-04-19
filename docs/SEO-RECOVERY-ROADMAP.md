# SEO Recovery Roadmap (Path C — Hybrid)

**Created:** 2026-04-19
**Status:** PAUSED — auto-deploy stopped, awaiting token budget to execute
**Target:** Full recovery from Google Scaled Content Abuse violation

---

## Context — how we got here

976 campaign pages were built with identical HTML structure, class names, CSS values, and content templates. Google's Scaled Content Abuse filter penalized the site, dragging down windload.co, windloadcalc.com, and windload.solutions rankings (all three domains are interlinked).

**What's already done (2026-04-17 to 2026-04-19):**
- ✅ Structural diversification: unique CSS class names, jittered values, varied animations, unique DOM fingerprint per page (100% uniqueness verified)
- ✅ Sitemap refreshed with today's `<lastmod>` dates
- ✅ Resubmitted to Google Search Console (under `windloadsolutions@gmail.com`)
- ✅ CLAUDE.md updated with diversification mandate for future pages
- ✅ Auto-deploy paused (`.github/workflows/daily-deploy.yml` cron commented out)

**What's NOT done:** Content templating. Every page still has formulaic headlines, identical section order, formulaic FAQs, and mad-lib copy. That's the remaining violation.

---

## Path C Strategy Summary

**Hybrid approach:**
- **Keep & enhance:** ~200-300 pages with real search intent — AI-rewrite to have genuinely unique content
- **Noindex:** ~500-700 pages that are thin filler — hide from Google but keep the URLs alive (preserves any backlinks)
- **Retire:** None — don't 404 anything. `noindex` signals "we're cleaning up" without breaking links.

**Why this path:** Google rewards sites that demonstrate content quality focus. Noindexing thin pages is actually a positive signal — it tells Google "we heard you, we're promoting our best content." Mass deletion (404s) would be read as panic and lose backlink equity.

---

## Phase 1 — Triage (estimated effort: 2-4 hours agent work, ~$5-15 API)

### Goal
Classify all 976 pages into three buckets: KEEP, NOINDEX, RETIRE.

### Data sources needed
1. **GSC Performance export** (last 90 days) — CSV of URL, impressions, clicks, CTR, avg position
2. **GSC Pages report** — which URLs are actually indexed vs excluded
3. **Page word count + content depth** — compute from files directly
4. **Target keyword uniqueness** — do multiple pages target the same query?

### Triage criteria

| Bucket | Criteria | Action |
|--------|----------|--------|
| **KEEP (200-300 pages)** | Any of: gets >10 impressions/month in GSC, unique search intent (no duplicate targeting), >1500 words of substance, location-specific data (NOA #s, inspector contacts, real permit process), natural backlinks | AI content rewrite in Phase 3 |
| **NOINDEX (500-700 pages)** | Thin content, duplicate topic of a KEEP page, low search intent, no GSC impressions in 90 days, templated filler | Add `<meta name="robots" content="noindex, follow">` in Phase 2 |
| **RETIRE (0 pages)** | Don't retire anything — preserve URL structure and backlinks | No 404s |

### Deliverable
`docs/seo-triage-results.json` — array of `{ path, bucket, reason, impressions_90d, word_count, target_keyword }`

### Script to build
`scripts/seo-triage.js` — reads GSC export, scans pages, outputs classification JSON.

---

## Phase 2 — Noindex the weak pages (estimated effort: 30 min, no API cost)

### Goal
Prevent Google from indexing the 500-700 thin pages while keeping URLs alive.

### Implementation

**2a. Create `scripts/apply-noindex.js`** that:
- Reads `seo-triage-results.json`
- For each page in NOINDEX bucket, injects `<meta name="robots" content="noindex, follow">` into `<head>`
- Idempotent (skip if already present)

**2b. Update `robots.txt`** to disallow scripts/private paths, but NOT the noindexed pages (Google needs to crawl them to see the noindex tag).

**2c. Update `sitemap.xml`** to REMOVE noindexed URLs (they shouldn't be in sitemap if they're noindexed). Only KEEP pages go in sitemap.

**2d. Commit + push.** Resubmit sitemap in GSC.

### Verification
- GSC URL Inspection on 5 random noindexed pages → should show "Excluded by 'noindex' tag" after recrawl (2-4 weeks)
- Sitemap should now have ~250 URLs instead of 701

---

## Phase 3 — Content rewrite for KEEP pages (estimated effort: 1-2 days agent work, ~$50-150 API)

### Goal
Give each of the 200-300 KEEP pages genuinely unique content — not just rephrased templates.

### What "unique" means here
For each KEEP page, these must differ from every other page:
- **Headline angle:** one page leads with cost, another with safety, another with compliance deadline, another with damage photos
- **Section order:** some pages lead with case study, some with code reference, some with FAQ
- **Intro paragraph:** written from a specific angle (homeowner pain, contractor workflow, permit office perspective, historical disaster)
- **FAQ questions:** at least 3 questions genuinely unique to that page's topic+location
- **Primary data point:** one specific number/fact not found on other pages (real NOA #, specific inspector name, specific address of relevant code office)
- **Local specificity:** actual neighborhoods, actual permit offices, actual storm damage incidents

### Implementation approach

**3a. Build content matrix per page**
For each KEEP page, generate an "angle + data + voice" spec using Claude API:
```
{
  "path": "/florida/miami-dade/hurricane-shutters",
  "angle": "post-Irma retrofit homeowner",
  "primary_data": "NOA 21-0304.03 panel shutter, 55 PSF, approved 2024-11-15",
  "voice": "first-person homeowner experience, pragmatic tone",
  "unique_FAQs": [...5 questions no other page has...],
  "structural_template": "J: Cumulative Impact" // from CLAUDE.md template list
}
```

**3b. Build `scripts/rewrite-content.js`**
Takes the content matrix, calls Claude API to rewrite each page. Uses prompt caching for shared context. Target ~1500-2500 words per page with the specified angle.

**3c. Enforce structural variety**
Use the 11 templates listed in CLAUDE.md (A: Data Story, B: Cost Analysis, etc.) — rotate so no two adjacent pages use the same one.

**3d. Cost estimate**
~200 pages × ~4000 input tokens (context + instructions) + ~3000 output tokens = ~1.4M input + 600K output = **~$30-80 with prompt caching**, **~$100-200 without.**

### Quality gate
Before committing, sample 10 random rewritten pages and review manually:
- Can you tell them apart reading only the first paragraph? ✅
- Do FAQs repeat across pages? ❌ none
- Does the "primary data" feel specific and verifiable? ✅
- Would a contractor/homeowner find value beyond what's on 50 competitor sites? ✅

### Re-run diversification
After content rewrite, re-run `scripts/seo-diversify.js` on the rewritten pages to keep the structural fingerprint unique.

---

## Phase 4 — Resubmit and monitor (estimated effort: 30 min, ongoing)

### 4a. Commit and push
Single commit per phase so it's easy to rollback if something breaks.

### 4b. GSC actions
- Resubmit sitemap (now ~250 URLs, all KEEP pages with fresh content)
- URL Inspection → Request Indexing for top 20 KEEP pages (daily quota ~10-12, so this takes 2 days)
- Check Security & Manual Actions weekly

### 4c. Monitor (4-8 weeks)
Watch for:
- **Indexed count recovering** on KEEP pages (currently suppressed)
- **Impressions growing** on KEEP pages
- **Position improving** on target queries
- **Noindexed pages dropping out of index** (expected, this is the goal)

### Success metrics
- Zero Manual Action notices
- KEEP page index rate >80% within 6 weeks
- Total impressions across all three domains recovering to pre-penalty levels within 3 months
- windloadcalc.com and windload.solutions also recover (they're linked)

---

## Phase 5 — Prevent recurrence (estimated effort: 1 hour)

### 5a. Update CLAUDE.md (already partially done)
- ✅ Mandate `seo-diversify.js` on new pages
- ❌ TODO: Add content uniqueness requirements — each new page MUST have unique headline angle, unique FAQs, unique primary data point
- ❌ TODO: Add a content-check script that fails if a new page is >X% similar to any existing page (cosine similarity on text content)

### 5b. Content uniqueness script
`scripts/check-content-uniqueness.js` — pre-commit hook style:
- Hashes text content of all pages
- On new page add, computes similarity to existing pages
- Fails if similarity > 60%

### 5c. Cap future campaigns
Add to CLAUDE.md: "No campaign batch may exceed 10 new pages per week. Every page must pass the content-uniqueness check."

---

## Resume auto-deploy — WHEN?

**Do NOT resume auto-deploy until:**
1. Phase 2 complete (noindex applied, sitemap cleaned)
2. Phase 3 complete (KEEP pages have unique content)
3. Staged pages in `staged-pages/` have been triaged — some will need NOINDEX, some need content rewrite before they deploy
4. Content uniqueness script (Phase 5b) exists and is wired into the deploy workflow

**To resume:** uncomment the cron lines in `.github/workflows/daily-deploy.yml`.

---

## Cost budget (total, if executed in one pass)

| Phase | Agent work | API cost | Notes |
|-------|-----------|----------|-------|
| 1 — Triage | 2-4 hours | $5-15 | Depends on how much data analysis is needed |
| 2 — Noindex | 30 min | $0 | Pure code, no API calls |
| 3 — Content rewrite | 1-2 days | $30-200 | With prompt caching on the low end |
| 4 — Monitor | ongoing | $0 | Just watching GSC |
| 5 — Prevention | 1 hour | $5 | Small script work |
| **Total** | **~2-3 days** | **~$40-220** | Range depends on token efficiency |

---

## Files to create (checklist for future session)

- [ ] `scripts/seo-triage.js` — classify pages into KEEP/NOINDEX buckets
- [ ] `scripts/apply-noindex.js` — inject noindex meta on NOINDEX pages
- [ ] `scripts/rewrite-content.js` — AI-rewrite KEEP pages with unique angles
- [ ] `scripts/check-content-uniqueness.js` — pre-commit content similarity check
- [ ] `scripts/regenerate-sitemap-keep-only.js` — rebuild sitemap with only KEEP pages
- [ ] `docs/seo-triage-results.json` — triage output (generated by seo-triage.js)

---

## Before starting any of this

1. **Export GSC data** for windload.co (Performance → last 90 days → Export CSV). Save as `data/gsc-performance.csv`.
2. **Export GSC Pages report** (Coverage → Export). Save as `data/gsc-pages-status.csv`.
3. **Confirm rankings haven't already tanked more** — if Manual Action has appeared, that changes the urgency and may need different tactics.
4. **Confirm budget** — how many tokens/dollars are available. If <$50 budget, skip Phase 3 and just do Phases 1-2 (triage + noindex). That alone gets ~70% of the recovery benefit.

---

## If budget is very limited — Minimum Viable Recovery

If you can only do ONE thing: **Phase 2 (noindex)** is the cheapest, fastest, highest-impact move. Costs ~$0 API, removes the thin-content signal from Google's view, lets the KEEP pages breathe.

Order of priority if incremental:
1. **Phase 2 first** (cheap, fast, big impact) — ~$5 agent work
2. **Phase 1 before Phase 2** (need triage to know WHAT to noindex) — ~$10
3. **Phase 5b after** (prevent future abuse) — ~$5
4. **Phase 3 last** (content rewrite) — most expensive, do when budget allows

Realistic minimum to start: **~$20-30 in agent tokens + a few hours of your review time.**

---

## Questions to answer before Phase 1 starts

1. Is there a Manual Action notice in GSC? (changes approach if yes)
2. What's the current monthly traffic across all three domains?
3. Which pages actually convert (get users to click through to windloadcalc.com)?
4. Are there particular cities/products with higher ROI where we should focus KEEP quality?
5. What's the token budget allocated for SEO recovery specifically?
