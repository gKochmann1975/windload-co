# WindLoad.co Campaign Pages - Claude Instructions

## Overview
This document defines the quality standards and SEO rules for creating campaign landing pages. Every page must be unique, high-quality, and provide genuine value to users.

---

## CRITICAL: TWO REPOSITORIES - READ THIS FIRST

### Repository Structure

There are TWO separate repositories. DO NOT confuse them:

| Repository | Domain | Location | Purpose |
|------------|--------|----------|---------|
| **windload-co** | windload.co | `c:\Dev\windload-co` | Campaign pages (Florida landing pages) |
| **windload-solutions** | windloadcalc.com | `c:\Dev\windload-solutions\website` | Main app + admin dashboard |

### Campaign Page Workflow

**ALL new campaign pages MUST go to `staged-pages/` folder ONLY:**

```
c:\Dev\windload-co\staged-pages\
  ├── miami-dade\
  │   └── *.html (staged pages)
  ├── broward\
  │   └── *.html (staged pages)
  ├── palm-beach\
  │   └── *.html (staged pages)
  └── monroe\
      └── *.html (staged pages)
```

**NEVER place new pages directly in `florida/` - that folder is for LIVE pages only.**

### Auto-Deploy System

GitHub Actions automatically deploys pages from `staged-pages/` to `florida/`:
- **Schedule:** Every 2 hours (1 page per run)
- **Workflow:** `.github/workflows/daily-deploy.yml`
- **Script:** `scripts/deploy-daily-pages.js`

This trains Google to check the site frequently for fresh content.

### Admin Dashboard

The Campaign Admin dashboard is located at:
- **URL:** https://windloadcalc.com/admin.html
- **File:** `c:\Dev\windload-solutions\website\admin.html`

When creating new staged pages, you MUST also update the admin dashboard's `staged:` array to show the new pages.

**DO NOT confuse with:** `c:\Dev\windload-co\campaign-admin.html` (this is a different file)

### Deployment Tracking

Update `deployment-log.json` to track:
- Pages deployed to live (`deployments` array)
- Pages waiting in staging (`staged` array)
- Total counts and progress toward goal

---

## CRITICAL SEO RULES - Avoid Blacklisting

### Google Violations That Will Get You Penalized

| Violation | Penalty |
|-----------|---------|
| **Scaled Content Abuse** | Site demoted or deindexed |
| **Thin Affiliate Content** | Pages removed from index |
| **Doorway Pages** | Manual action + site-wide ranking drop |
| **SpamBrain Detection** | Automatic deranking |
| **Duplicate Content** | Pages filtered from results |

### 1. NO Duplicate Content
- **NEVER copy/paste content between pages** - each page must be written fresh
- **NEVER use templates with placeholder text** - all content must be original
- **NEVER repeat the same paragraphs, lists, or sections** across pages
- **NEVER use spinner/synonym replacement** - Google detects this easily
- Each page must have unique:
  - Hero headline and subheadline
  - Introduction paragraph
  - All body content and explanations
  - FAQ questions AND answers
  - CTA text and messaging

### 2. NO "Mad Libs" Content (Scaled Content Abuse)
- Pages that only swap text but keep identical structure = **INSTANT PENALTY**
- Google's SpamBrain specifically targets this pattern
- **The Test:** Would a human immediately recognize two random pages as different?
- If you can swap location names and nothing else changes → REJECTED

### 3. NO Thin Content
- Minimum 1,500 words of substantive content per page
- Content must answer real user questions
- Include specific, actionable information (numbers, requirements, processes)
- No filler paragraphs or generic statements

### 3. NO Keyword Stuffing
- Use target keywords naturally (2-3% density max)
- Vary keyword phrases and use semantic variations
- Write for humans first, search engines second
- Avoid repeating exact phrases unnaturally

### 4. Unique Page Elements Required
Each campaign page MUST have unique:
```
- Title tag (under 60 characters)
- Meta description (under 160 characters)
- H1 heading (only ONE per page)
- URL slug
- Hero section content
- All body paragraphs
- FAQ content (questions AND answers)
- Image alt text
- Internal link anchor text
```

### 5. Content Differentiation Strategy
When creating pages for similar topics (e.g., shutters in different counties):
- Focus on LOCAL specifics (codes, inspectors, permit offices)
- Include different real-world scenarios
- Vary the angle/perspective of content
- Use different statistics, examples, case studies
- Change the structure and flow of information

### 6. MANDATORY Visual Template Variety

**Every campaign page MUST have a UNIQUE visual structure.** No two pages in any batch can share the same primary visualization type.

#### Required Visual Differentiation (minimum 3 elements must differ):
- Different primary chart/visualization types
- Different section layouts (2-col vs 3-col vs full-width vs staggered)
- Different card arrangements
- Different data presentation methods

#### Visual Template Rotation (use different ones for each page):

| Template | Primary Visualization | Use Case |
|----------|----------------------|----------|
| **A: Data Story** | Trend line charts + threshold markers | Historical comparisons |
| **B: Cost Analysis** | Stacked bar charts + margin erosion | Financial impact |
| **C: Hidden Truth** | Waterfall chart + comparison | Revealing hidden costs |
| **D: Executive Scorecard** | Gauge meters + traffic lights | Quick status overview |
| **E: Process Timeline** | Gantt-style + milestones | Permit/approval process |
| **F: Comparison Matrix** | Radar charts + feature tables | Product comparisons |
| **G: Funnel Analysis** | Conversion funnel + drop-off | Lead qualification |
| **H: Distribution View** | Heat maps + treemaps | Geographic/zone data |
| **I: Diverging Analysis** | Scissors/diverging line charts | Before/after scenarios |
| **J: Cumulative Impact** | Area charts with gap visualization | Accumulated costs/savings |
| **K: Burndown Progress** | Bar chart with backlog line | Project tracking |

#### Batch Rules:
- **NEVER** use the same primary visualization twice in a batch of pages
- **NEVER** create pages that look structurally identical
- Track which templates have been used in `deployment-log.json`

### 7. E-E-A-T Signals Required

Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trust) must be demonstrated:

**Experience:**
- Include real-world scenarios specific to the location/topic
- Reference actual permit processes, timelines, challenges
- Show understanding of local contractor/homeowner pain points

**Expertise:**
- Cite specific code sections (FBC, ASCE 7-22, local amendments)
- Include accurate technical specifications
- Use industry-standard terminology correctly

**Authoritativeness:**
- Link to official sources (building departments, code databases)
- Reference real NOA numbers, product approvals
- Include verifiable statistics

**Trust:**
- Clear company identification and contact info
- Accurate, up-to-date information
- No misleading claims or exaggerations

### 8. GEO (Generative Engine Optimization) for AI Search

AI search engines (ChatGPT, Perplexity, Google AI Overview, Bing Copilot) prioritize different signals than traditional SEO. Every campaign page must be optimized for BOTH.

#### GEO-Specific Requirements:

**Structured Answer Format:**
- Include clear, direct answers to questions (not just keywords)
- Use definition-style sentences: "Design pressure (DP) is..."
- Provide complete, citable responses that AI can extract

**Factual Density:**
- Pack pages with specific facts, numbers, and data points
- AI engines prefer quantifiable information over vague claims
- Example: "Miami-Dade requires 180 MPH design wind speed" vs "high wind requirements"

**Source Attribution:**
- Reference authoritative sources AI can verify
- Include code citations (ASCE 7-22, FBC 2023, local ordinances)
- Link to official government/industry sources

**Question-Answer Patterns:**
- Structure content around natural language questions
- Use FAQ schema markup
- Include "What is...", "How to...", "Why does..." patterns

**Semantic Completeness:**
- Cover topics comprehensively (AI penalizes thin content more harshly)
- Include related concepts and terminology
- Answer follow-up questions preemptively

**Citation-Worthy Content:**
- Create content that AI would want to cite as a source
- Include unique insights, calculations, or data not found elsewhere
- Provide clear, quotable statements

#### GEO Content Checklist:
- [ ] Direct answer to primary question in first 100 words
- [ ] At least 5 specific, verifiable facts per section
- [ ] Code/regulation citations with section numbers
- [ ] FAQ section with schema markup
- [ ] Unique data or calculations
- [ ] Clear definitions of technical terms
- [ ] Authoritative external links

---

## Quality Standards (Hurricane Shutters Page Reference)

### Visual Excellence
Every campaign page should include:

#### 1. Canvas Particle Animation System
```javascript
// Hurricane debris particles with glow effects
class Particle {
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 + 2;
        this.color = Math.random() > 0.7 ? '#00ff88' : '#00e5ff';
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
    }
}
```

#### 2. Radar Pulse Effect
- Expanding concentric rings
- Rotating sweep line
- Subtle background presence (opacity: 0.15)

#### 3. Scroll-Triggered Reveals
- `.reveal` - fade up from bottom
- `.reveal-left` - slide in from left
- `.reveal-right` - slide in from right
- `.reveal-scale` - scale up from center
- `.stagger-children` - sequential child animations

#### 4. Counter Animations
- Numbers count up when scrolled into view
- Use `data-target`, `data-prefix`, `data-suffix` attributes
- Pop animation on completion

#### 5. Magnetic Card Hover Effects
- 3D tilt toward cursor position
- Perspective transform on mousemove
- Smooth return on mouseleave

#### 6. Shimmer Text Effect
- Animated gradient on key headlines
- Background-clip: text technique
- Linear infinite animation

#### 7. Storm Intensity Indicator Widget
- Fixed position indicator
- Appears on scroll
- Animated progress bar

#### 8. Button Interactions
- Ripple effect on click
- Hover glow expansion
- Smooth transitions

---

## CSS Animation Reference

```css
/* Radar Pulse */
@keyframes radar-pulse {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(0.3); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
}

/* Shimmer Text */
@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Warning Flash */
@keyframes warning-flash {
    0%, 100% { border-left-color: #ff4757; }
    50% { border-left-color: #ff6b7a; box-shadow: inset 0 0 30px rgba(255, 71, 87, 0.1); }
}

/* Glow Pulse */
@keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(0, 229, 255, 0.1); }
    50% { box-shadow: 0 0 40px rgba(0, 229, 255, 0.5), 0 0 80px rgba(0, 229, 255, 0.2); }
}
```

---

## Color Palette

```css
/* Primary Background */
--bg-dark: #0c1220;
--bg-card: rgba(255, 255, 255, 0.03);

/* Accent Colors */
--cyan: #00e5ff;
--cyan-dark: #00b4d8;
--green: #00ff88;
--red: #ff4757;
--amber: #f59e0b;

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #94a3b8;
--text-muted: #64748b;
```

---

## Page Structure Template

```
1. Hurricane Animation Background (canvas + radar)
2. Storm Intensity Indicator (fixed widget)
3. Navigation
4. Breadcrumbs
5. Hero Section
   - Badge
   - H1 with shimmer effect
   - Intro paragraph
   - CTA buttons
   - Warning banner
6. Trust Badges with counters
7. Main Content Sections (each with reveal animations)
   - Comparison/Grid sections
   - Problem/Solution sections
   - Step-by-step guides
8. FAQ Section (accordion style)
9. Final CTA
10. Footer
11. Animation Scripts
```

---

## CRITICAL: CTA Button URLs

**ALL CTA buttons MUST link to the calculator shop page:**

```
https://windloadcalc.com/wind-load-calculator-shop.html
```

### NEVER use these URLs for CTAs:
- ❌ `/pricing.html` - WRONG
- ❌ `/pricing` - WRONG
- ❌ `/#calculator` - WRONG
- ❌ `#calculator` - WRONG
- ❌ `https://windload.co/pricing.html` - WRONG
- ❌ Any relative URL - WRONG

### ALWAYS use this exact URL:
```html
<a href="https://windloadcalc.com/wind-load-calculator-shop.html" class="btn-primary">Calculate Now</a>
<a href="https://windloadcalc.com/wind-load-calculator-shop.html" class="nav-cta">Get Wind Loads</a>
```

### CTA Button Labels (vary these):
- "Calculate Now"
- "Get Wind Loads"
- "Calculate Requirements"
- "Start Calculation"
- "Get Your Report"

---

## Content Uniqueness Checklist

Before publishing any campaign page, verify:

- [ ] Title tag is unique across all pages
- [ ] Meta description is unique and compelling
- [ ] H1 is unique and includes location/topic
- [ ] Hero intro paragraph is freshly written
- [ ] All body sections have original content
- [ ] Statistics and numbers are specific to the topic
- [ ] FAQ questions are unique (not copied from other pages)
- [ ] FAQ answers provide unique, detailed information
- [ ] Internal links use varied anchor text
- [ ] Images have unique, descriptive alt text
- [ ] CTA messaging varies from other pages

---

## Topic Differentiation Examples

### Same Product, Different Locations
Instead of duplicating "Hurricane Shutters" content:

**Miami-Dade Page Focus:**
- 180 MPH design wind speed
- Large missile impact requirement
- NOA (Notice of Acceptance) system
- Specific permit offices and contacts

**Broward Page Focus:**
- 170 MPH design wind speed (varies by zone)
- HVHZ vs non-HVHZ areas
- FBC product approval requirements
- Different permit process details

**Palm Beach Page Focus:**
- 150-170 MPH design wind speeds
- Coastal vs inland requirements
- Local amendment specifics
- Regional contractor considerations

### Same Location, Different Products
For Miami-Dade with different products:

**Windows Page:** Focus on DP ratings, glass types, frame materials, U-factor
**Shutters Page:** Focus on shutter types, deployment, storage, aesthetics
**Doors Page:** Focus on entry vs impact, hardware, thresholds, weatherstripping
**Garage Doors Page:** Focus on bracing, size requirements, wind-borne debris

---

## Grid Layout Rules - NO EMPTY SPACE

**CRITICAL:** Card grids must NEVER leave awkward empty space. The 3+1 layout (3 cards in a row, 1 orphan below) is FORBIDDEN.

### Allowed Grid Layouts:

| Card Count | Layout | CSS Grid |
|------------|--------|----------|
| 2 cards | 2 in a row | `grid-template-columns: repeat(2, 1fr)` |
| 3 cards | 3 in a row | `grid-template-columns: repeat(3, 1fr)` |
| 4 cards | **2x2 grid** OR 4 in a row | `repeat(2, 1fr)` or `repeat(4, 1fr)` |
| 5 cards | 3+2 staggered OR redesign | Avoid if possible |
| 6 cards | 3x2 grid OR 2x3 | `repeat(3, 1fr)` with 2 rows |

### FORBIDDEN Layouts:
- ❌ 3 cards + 1 orphan below (leaves 2/3 empty space)
- ❌ 4 cards + 1 orphan below
- ❌ Any layout with a single card on its own row (unless it's a featured/highlighted card with intentional full-width design)

### When You Have 4 Cards:
```css
/* CORRECT: 2x2 Grid */
.four-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

/* CORRECT: 4 in a row (for smaller cards) */
.four-cards-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

/* WRONG: 3+1 layout - NEVER DO THIS */
```

### Visual Balance Rule:
Every row in a card grid must be visually complete. If a design results in orphan cards, either:
1. Add more cards to complete the row
2. Remove cards to fit the previous row
3. Change the grid column count
4. Make the orphan card(s) full-width as a featured element

---

## Performance Requirements

- Lighthouse Performance Score: 90+
- First Contentful Paint: < 1.5s
- Animations should not cause layout shift
- Use `will-change` sparingly
- Debounce scroll event handlers
- Use RequestAnimationFrame for canvas

---

## File Naming Convention

```
/florida/
  /miami-dade/
    index.html (hub page)
    hurricane-shutters.html
    window-replacement.html
    impact-doors.html
    garage-doors.html
  /broward/
    index.html
    hurricane-shutters.html
    ...
  /palm-beach/
    ...
```

---

## Deployment Tracking

All deployed pages must be logged in `deployment-log.json`:
```json
{
  "path": "/florida/miami-dade/hurricane-shutters",
  "category": "miami-dade",
  "deployedAt": "2026-01-15T21:00:00.000Z"
}
```

---

## Quick Reference: What Makes a Page Unique

| Element | Must Be Unique |
|---------|---------------|
| URL/Slug | Yes |
| Title Tag | Yes |
| Meta Description | Yes |
| H1 Heading | Yes |
| Hero Content | Yes |
| Body Paragraphs | Yes |
| Statistics/Numbers | Yes (or contextualized) |
| FAQ Questions | Yes |
| FAQ Answers | Yes |
| CTA Text | Varied |
| Image Alt Text | Yes |

---

## Red Flags to Avoid

1. **Template smell** - If you could swap locations and content still makes sense, it's too generic
2. **Copy-paste detection** - Google's algorithms detect duplicate phrases across domains
3. **Boilerplate sections** - Avoid identical headers, footers, or sidebars with same text
4. **Thin pages** - Pages with little unique content get de-indexed
5. **Keyword cannibalization** - Don't target same keywords on multiple pages
6. **Over-optimization** - Exact match anchor text, keyword density > 3%

---

## Remember

Every campaign page should feel like it was **hand-crafted for that specific audience and location**. Users should find genuine value, and search engines should see completely original content.

Quality over quantity. 10 excellent unique pages > 100 templated duplicates.

---

## CONTINUOUS IMPROVEMENT MANDATE

### Every Page Must Be Same Quality or BETTER

**This is non-negotiable:** Each new campaign page must match or exceed the quality of ALL previous pages. This creates a virtuous cycle of improvement.

#### Quality Baseline (Set by Best Pages):
1. **Animation Quality:** Canvas particle systems, scroll reveals, counters, shimmer text, fixed widgets, magnetic cards
2. **Content Depth:** 1,500+ words, 5+ unique FAQs with detailed answers, multiple content sections
3. **SEO/GEO:** Full schema markup (FAQPage, BreadcrumbList, HowTo or ItemList), geo meta tags, authoritative links
4. **Visual Impact:** Unique visualization per template, smooth animations, professional polish
5. **User Value:** Actionable information, specific numbers, clear next steps

#### Before Creating Each Page, Ask:
- [ ] Does this page have AT LEAST as many animations as the hurricane-shutters page?
- [ ] Is the primary visualization (Gantt, gauge, radar, etc.) fully interactive and polished?
- [ ] Are there unique insights not found on other pages?
- [ ] Would a professional be impressed by this page?
- [ ] Does this page teach something new?

#### Learn From Every Page Created:
After completing each page, identify:
1. **What worked well** - add to this reference
2. **New techniques discovered** - document for future use
3. **Areas that could improve** - apply to next page

#### Innovation Requirements:
Each batch of pages should introduce AT LEAST one new:
- Animation technique or effect
- Content format or presentation style
- Interactive element
- Data visualization approach

### Quality Tracking

Track quality metrics in `deployment-log.json`:
```json
{
  "path": "/florida/miami-dade/impact-doors",
  "template": "E: Process Timeline",
  "animations": ["canvas-particles", "gantt-bars", "progress-widget", "counters", "reveal"],
  "qualityScore": "A",
  "innovations": ["Animated Gantt chart", "Permit progress widget"],
  "wordCount": 2100,
  "faqCount": 6
}
```

### The Standard

**Reference pages for quality baseline:**
1. `hurricane-shutters.html` - Full animation suite, radar effect, magnetic cards
2. `impact-doors.html` - Gantt timeline, progress widget, process visualization

**Every new page must compete with these for quality.**

---

## Animation Innovations Log

Track new animation techniques as they're developed:

| Page | Innovation | Code Reference |
|------|------------|----------------|
| hurricane-shutters | Canvas particle system | `class Particle` with glow effects |
| hurricane-shutters | Radar pulse rings | `.radar-ring` with staggered delays |
| hurricane-shutters | Magnetic card hover | 3D perspective transform on mousemove |
| impact-doors | Animated Gantt bars | `scaleX` transform with staggered activation |
| impact-doors | Progress phase widget | Fixed position with phase cycling |

**Add to this table after each page to build institutional knowledge.**
