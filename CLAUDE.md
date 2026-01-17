# WindLoad.co Campaign Pages - Claude Instructions

## Overview
This document defines the quality standards and SEO rules for creating campaign landing pages. Every page must be unique, high-quality, and provide genuine value to users.

---

## CRITICAL SEO RULES - Avoid Blacklisting

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

### 2. NO Thin Content
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
