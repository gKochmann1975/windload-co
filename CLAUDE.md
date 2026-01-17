# WindLoad.co Campaign Pages - Claude Instructions

## Overview
This document defines the quality standards and SEO rules for creating campaign landing pages. Every page must be unique, high-quality, and provide genuine value to users.

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
