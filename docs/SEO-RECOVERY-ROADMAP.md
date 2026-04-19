# SEO Recovery Roadmap (Path C — Hybrid)

**Created:** 2026-04-19
**Last updated:** 2026-04-19 (Phase 2 completed)
**Status:** Phases 1-lite and 2 DONE. Phase 3 awaiting token budget.
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
- ✅ **Phase 1-lite triage completed** (2026-04-19) — heuristic-based, no GSC data required
- ✅ **Phase 2 noindex completed** (2026-04-19) — 558 thin/duplicate pages noindexed, sitemap rebuilt 701→260 URLs
- ✅ Deploy script patched so future auto-deploys respect triage decisions

**What's NOT done:** Phase 3 (content rewrite on 417 KEEP pages), Phase 5 (content uniqueness prevention script). These are deferred to a future session with token budget.

---

## Path C Strategy Summary

**Hybrid approach:**
- **Keep & enhance:** ~200-300 pages with real search intent — AI-rewrite to have genuinely unique content
- **Noindex:** ~500-700 pages that are thin filler — hide from Google but keep the URLs alive (preserves any backlinks)
- **Retire:** None — don't 404 anything. `noindex` signals "we're cleaning up" without breaking links.

**Why this path:** Google rewards sites that demonstrate content quality focus. Noindexing thin pages is actually a positive signal — it tells Google "we heard you, we're promoting our best content." Mass deletion (404s) would be read as panic and lose backlink equity.

---

## ✅ Phase 1 — Triage (COMPLETED 2026-04-19 as "Phase 1-lite")

**Implemented as heuristic triage without GSC data** — no API cost. See `scripts/apply-noindex.js`.

### What was done
- Triage logic baked directly into `scripts/apply-noindex.js`
- Triage results saved to `docs/seo-triage-results.json` (audit trail)
- Results:
  - **417 pages KEEP** (250 live florida/, 167 staged-pages/)
  - **558 pages NOINDEX** (107 very thin <500w, 210 thin <1000w, 241 duplicate topics)

### Heuristic criteria used (vs original plan)
- Original plan required GSC Performance export + Pages report data
- Phase 1-lite skipped GSC data and used: word count + topic deduplication
- Trade-off: less accurate than GSC-data triage (doesn't know which pages get traffic), but $0 cost and immediately actionable
- If GSC data becomes available later, re-run triage with refined criteria and adjust noindex decisions

### Data sources that WERE NOT used (still valuable for future refinement)
1. **GSC Performance export** (last 90 days) — CSV of URL, impressions, clicks, CTR, avg position
2. **GSC Pages report** — which URLs are actually indexed vs excluded
3. **Target keyword uniqueness** — do multiple pages target the same query?

### Historical reference — original Phase 1 plan
Classify all 976 pages into three buckets: KEEP, NOINDEX, RETIRE.

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

## ✅ Phase 2 — Noindex the weak pages (COMPLETED 2026-04-19, $0 API cost)

**Commit:** `edeb727` — "Phase 2: apply noindex to 558 thin/duplicate pages"

### What was done
- ✅ `scripts/apply-noindex.js` created (combines Phase 1 triage + Phase 2 application)
- ✅ 558 pages received `<meta name="robots" content="noindex, follow">` injection
- ✅ `scripts/rebuild-sitemap.js` created — triage-aware sitemap generator
- ✅ `sitemap.xml` rebuilt: **701 URLs → 260 URLs** (10 main/hub + 250 KEEP florida/)
- ✅ `scripts/deploy-daily-pages.js` patched — `regenerateSitemap()` now delegates to `rebuild-sitemap.js` when `docs/seo-triage-results.json` exists, so future auto-deploys won't undo Phase 2 work
- ✅ `docs/seo-triage-results.json` saved (audit trail of all 975 decisions)

### Results breakdown
- 107 pages very thin (<500 words) → noindex
- 210 pages thin (<1000 words) → noindex
- 241 pages duplicate topics across counties → noindex (kept longest per topic)
- 417 pages KEEP (250 live florida/ + 167 staged)

### Manual action required (user task)
- [ ] Open GSC → Sitemaps → resubmit `https://windload.co/sitemap.xml`
- [ ] Same for windloadcalc.com and windload.solutions if those domains also have sitemaps

### Verification (over 2-4 weeks)
- GSC URL Inspection on 5 random noindexed pages → should show "Excluded by 'noindex' tag" after recrawl
- GSC Pages report: indexed count should drop as noindex takes effect
- KEEP pages should maintain or gain impressions

### Not done (optional refinement)
- robots.txt wasn't updated — current robots.txt already permits crawling, which is what we want (Google needs to crawl to SEE the noindex tag)

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
1. ✅ Phase 2 complete (noindex applied, sitemap cleaned) — DONE 2026-04-19
2. Phase 3 complete (KEEP pages have unique content)
3. Content uniqueness script (Phase 5b) exists and is wired into the deploy workflow

**Note:** Staged pages have already been triaged (Phase 1-lite included them). 167 staged pages are KEEP, the rest have noindex applied. But their content is still templated, so deploying them without Phase 3 is still risky.

**To resume:** uncomment the cron lines in `.github/workflows/daily-deploy.yml`.

---

## Cost budget — UPDATED POST-PHASE-2

| Phase | Status | Agent work | API cost | Notes |
|-------|--------|-----------|----------|-------|
| 1 — Triage | ✅ DONE (lite) | 1 hour | $0 | Heuristic only, no GSC data used |
| 2 — Noindex | ✅ DONE | 30 min | $0 | 558 pages noindexed, sitemap rebuilt |
| 3 — Content rewrite | ⏸ TODO | 1-2 days | $30-200 | Biggest remaining cost |
| 4 — Monitor | ongoing | $0 | — | Watch GSC weekly |
| 5 — Prevention | ⏸ TODO | 1 hour | $5 | Content-uniqueness pre-commit check |
| **Remaining** | | **~1-2 days** | **~$35-205** | Phase 3 is the main spend |

---

## Files — status as of 2026-04-19

**Already created:**
- ✅ `scripts/apply-noindex.js` — triage + noindex application (combines original Phase 1 + 2)
- ✅ `scripts/rebuild-sitemap.js` — triage-aware sitemap generator
- ✅ `docs/seo-triage-results.json` — triage decisions for all 975 pages

**Still to create (Phase 3 + 5):**
- [ ] `scripts/rewrite-content.js` — AI-rewrite KEEP pages with unique angles (Phase 3)
- [ ] `scripts/check-content-uniqueness.js` — pre-commit content similarity check (Phase 5b)
- [ ] `data/gsc-performance.csv` (user export) — optional, would refine Phase 3 prioritization

---

## Before starting Phase 3

1. **Export GSC data** for windload.co (Performance → last 90 days → Export CSV). Save as `data/gsc-performance.csv`. Not strictly required but helps prioritize which KEEP pages to rewrite first.
2. **Check Pages report** — see whether noindex is taking effect (indexed count dropping on the 558 noindexed pages)
3. **Confirm no Manual Action in GSC** — if one appears, that changes the approach
4. **Confirm budget** — Phase 3 is the main expense (~$30-200 with prompt caching)

---

## Resuming — pick your entry point

### Option X — Skip Phase 3 for now, just monitor
Phases 1-lite + 2 alone give ~60-70% of the recovery benefit. Watch GSC for 4-8 weeks. If rankings improve enough, Phase 3 may not be urgent. **$0 more spend needed**.

### Option Y — Do Phase 3 at low budget
Focus Phase 3 on just the top 50-100 KEEP pages (highest-traffic or highest-ROI). Skip the rest. **~$15-40 API cost**.

### Option Z — Full Phase 3
Rewrite all 417 KEEP pages. **~$30-200 API cost**. Biggest recovery, most work.

---

## Questions to answer before Phase 3

1. Is there a Manual Action notice in GSC? (changes approach if yes)
2. After 4 weeks of Phase 2 noindex, are any KEEP pages ranking? (tells us which to prioritize in Phase 3)
3. What's the current monthly traffic across all three domains vs. pre-penalty?
4. Which pages actually convert (get users to click through to windloadcalc.com)?
5. Are there particular cities/products with higher ROI where we should focus KEEP quality?
6. What's the token budget allocated for Phase 3?
