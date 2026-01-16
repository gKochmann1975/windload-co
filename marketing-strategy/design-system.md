# WindLoad.co Campaign Pages - Design System

## Color Palette

### Primary Colors (Electric)
```css
--electric-cyan: #00e5ff;      /* Primary accent - headlines, badges, CTAs */
--bright-cyan: #00b4d8;        /* Secondary accent */
--deep-blue: #0077b6;          /* Gradient endpoints */
--electric-green: #00ff88;     /* Success states, solution cards */
--electric-red: #ff4757;       /* Problem states, warnings */
```

### Background Colors
```css
--bg-primary: #0c1220;         /* Main background */
--bg-secondary: #0f1729;       /* Section alternates */
--bg-card: rgba(255, 255, 255, 0.03);  /* Card backgrounds */
--bg-card-border: rgba(255, 255, 255, 0.1);  /* Card borders */
```

### Text Colors
```css
--text-primary: #ffffff;       /* Headlines */
--text-secondary: #e2e8f0;     /* Body text */
--text-muted: #94a3b8;         /* Secondary text */
--text-subtle: #64748b;        /* Labels, captions */
```

## Gradient Styles

### Headline Gradient (Electric)
```css
background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 50%, #00ff88 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Button Gradient
```css
background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 50%, #0077b6 100%);
box-shadow: 0 4px 25px rgba(0, 229, 255, 0.5);
```

### Button Hover
```css
background: linear-gradient(135deg, #00ffff 0%, #00e5ff 50%, #00b4d8 100%);
box-shadow: 0 8px 40px rgba(0, 229, 255, 0.6);
transform: translateY(-3px);
```

### CTA Section Gradient
```css
background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 40%, #0077b6 100%);
```

## Glow Effects

### Text Glow (for stats, prices)
```css
text-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
```

### Badge Glow
```css
box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
```

### Step Number Glow
```css
box-shadow: 0 4px 15px rgba(0, 229, 255, 0.4);
```

## Component Patterns

### Hero Badge
```css
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 229, 255, 0.15);
    border: 1px solid rgba(0, 229, 255, 0.4);
    color: #00e5ff;
    padding: 0.5rem 1.25rem;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
}
```

### Primary Button
```css
.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 2rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 50%, #0077b6 100%);
    color: white;
    box-shadow: 0 4px 25px rgba(0, 229, 255, 0.5);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(0, 229, 255, 0.6);
    background: linear-gradient(135deg, #00ffff 0%, #00e5ff 50%, #00b4d8 100%);
}
```

### Problem Card (Red)
```css
.problem-card {
    background: rgba(255, 100, 100, 0.05);
    border: 1px solid rgba(255, 100, 100, 0.2);
    border-radius: 16px;
    padding: 2rem;
}
.problem-card h3 { color: #ff4757; font-size: 1.25rem; }
.problem-card li::before { content: '✗'; color: #ff4757; font-weight: bold; }
```

### Solution Card (Green)
```css
.solution-card {
    background: rgba(0, 230, 160, 0.05);
    border: 1px solid rgba(0, 230, 160, 0.2);
    border-radius: 16px;
    padding: 2rem;
}
.solution-card h3 { color: #00ff88; font-size: 1.25rem; }
.solution-card li::before { content: '✓'; color: #00ff88; font-weight: bold; }
```

### Step Card with Number
```css
.step-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
}

.step-number {
    position: absolute;
    top: -12px;
    left: 20px;
    background: linear-gradient(135deg, #00e5ff 0%, #00b4d8 100%);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    box-shadow: 0 4px 15px rgba(0, 229, 255, 0.4);
}
```

### FAQ Accordion
```css
.faq-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    margin-bottom: 1rem;
}

.faq-question::after {
    content: '+';
    font-size: 1.5rem;
    color: #00e5ff;
    transition: transform 0.3s ease;
}

.faq-item.open .faq-question::after {
    transform: rotate(45deg);
}
```

### Data Table
```css
.data-table th {
    background: rgba(0, 180, 216, 0.1);
    color: #00b4d8;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.data-table tr:hover td {
    background: rgba(0, 180, 216, 0.05);
}
```

### Note/Callout Box
```css
.note-box {
    background: rgba(0, 180, 216, 0.1);
    border: 1px solid rgba(0, 180, 216, 0.2);
    border-radius: 12px;
    padding: 1.25rem;
    color: #94a3b8;
}
.note-box strong { color: #00e5ff; }
```

## Grid Layouts

### 2-Column Grid (Problem/Solution, Steps)
```css
.two-col-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .two-col-grid { grid-template-columns: 1fr; }
}
```

### 3-Column Grid (Costs, Features)
```css
.three-col-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .three-col-grid { grid-template-columns: 1fr; }
}
```

## Page Structure Template

1. **Navigation** (fixed)
2. **Breadcrumb**
3. **Hero Section** - Badge, H1 with gradient, intro paragraph, CTA buttons
4. **Trust Badges** - 3 stats in a row
5. **Problem/Solution** - 2-column red/green cards
6. **Data Table** - Key facts/requirements
7. **How It Works** - 2x2 or 4-column steps
8. **Cost/Pricing** - 3-column cards
9. **FAQ Section** - Accordion with schema
10. **Final CTA** - Full-width gradient section
11. **Footer**

## Schema Markup Required

Every campaign page must include:
- `FAQPage` schema (minimum 5 questions)
- `BreadcrumbList` schema
- `HowTo` schema (if applicable)
- Open Graph meta tags
- Geo meta tags for location pages

## UTM Parameters

All windloadcalc.com links:
```
?utm_source=windload.co
&utm_medium=landing
&utm_campaign=florida-gc
&utm_content={page-type}-{location}
```

Example:
```
utm_content=window-replacement-miami-dade
utm_content=shutter-installation-broward
```
