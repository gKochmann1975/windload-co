#!/usr/bin/env node
/**
 * SEO Diversification Script
 *
 * Breaks template fingerprinting across campaign pages by:
 * 1. Randomizing CSS class names (unique per page)
 * 2. Varying CSS numerical values (padding, gaps, border-radius, font-sizes)
 * 3. Varying animation parameters (timing, easing, transforms)
 * 4. Varying grid layouts
 * 5. Diversifying JS variable names and patterns
 * 6. Varying structural elements (widget position, section padding)
 *
 * Uses deterministic seeded PRNG so re-running produces same output per file.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Seeded PRNG ──────────────────────────────────────────────
function createRng(filePath) {
    let state = crypto.createHash('sha256').update(filePath).digest();
    let idx = 0;

    function next() {
        if (idx >= state.length - 4) {
            state = crypto.createHash('sha256').update(state).digest();
            idx = 0;
        }
        const val = state.readUInt32BE(idx);
        idx += 4;
        return val / 0xFFFFFFFF;
    }

    return {
        float: () => next(),                          // 0..1
        int: (min, max) => min + Math.floor(next() * (max - min + 1)),
        pick: (arr) => arr[Math.floor(next() * arr.length)],
        shuffle: (arr) => {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(next() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    };
}

// ── Class Name Pools ─────────────────────────────────────────
// Each page gets a unique set of class names drawn from these pools
const CLASS_POOLS = {
    'types-grid':        ['product-grid', 'item-layout', 'card-matrix', 'spec-grid', 'catalog-grid', 'feature-grid', 'options-grid', 'lineup-grid', 'category-layout', 'solution-grid'],
    'type-card':         ['product-card', 'item-card', 'spec-card', 'catalog-card', 'feature-card', 'option-card', 'lineup-card', 'category-card', 'solution-card', 'detail-card'],
    'type-pressure':     ['spec-highlight', 'item-metric', 'card-value', 'product-rating', 'feature-stat', 'load-value', 'pressure-rating', 'design-metric', 'key-figure', 'primary-stat'],
    'type-specs':        ['spec-list', 'detail-list', 'item-details', 'feature-list', 'attribute-list', 'property-list', 'param-list', 'criteria-list', 'config-list', 'data-list'],
    'types-section':     ['products-section', 'catalog-section', 'lineup-section', 'categories-section', 'options-section', 'solutions-section', 'features-section', 'overview-section', 'offerings-section', 'selections-section'],
    'requirements-grid': ['specs-grid', 'criteria-grid', 'standards-grid', 'compliance-grid', 'code-grid', 'reg-grid', 'mandate-grid', 'rule-grid', 'guideline-grid', 'protocol-grid'],
    'requirement-card':  ['spec-card', 'criteria-card', 'standard-card', 'compliance-card', 'code-card', 'reg-card', 'mandate-card', 'rule-card', 'guideline-card', 'protocol-card'],
    'requirements-section': ['standards-section', 'compliance-section', 'codes-section', 'regulations-section', 'specs-section', 'criteria-section', 'mandates-section', 'protocols-section', 'guidelines-section', 'provisions-section'],
    'requirement-list':  ['spec-items', 'criteria-items', 'standard-items', 'compliance-items', 'code-items', 'reg-items', 'mandate-items', 'rule-items', 'guideline-items', 'check-items'],
    'stat-box':          ['metric-box', 'data-box', 'figure-box', 'number-box', 'kpi-box', 'value-box', 'indicator-box', 'measure-box', 'summary-box', 'highlight-box'],
    'stat-value':        ['metric-value', 'data-value', 'figure-value', 'number-value', 'kpi-value', 'indicator-value', 'measure-value', 'summary-value', 'highlight-value', 'primary-value'],
    'stat-label':        ['metric-label', 'data-label', 'figure-label', 'number-label', 'kpi-label', 'indicator-label', 'measure-label', 'summary-label', 'highlight-label', 'caption-label'],
    'hero-stats':        ['hero-metrics', 'hero-figures', 'hero-numbers', 'hero-kpis', 'hero-data', 'hero-indicators', 'hero-measures', 'hero-summaries', 'hero-highlights', 'key-metrics'],
    'hero-subtitle':     ['hero-desc', 'hero-intro', 'hero-summary', 'hero-lead', 'hero-blurb', 'hero-tagline', 'hero-overview', 'hero-brief', 'hero-context', 'hero-detail'],
    'hero-content':      ['hero-inner', 'hero-body', 'hero-layout', 'hero-wrap', 'hero-main', 'hero-frame', 'hero-container', 'hero-block', 'hero-region', 'hero-area'],
    'hero-text':         ['hero-copy', 'hero-info', 'hero-message', 'hero-prose', 'hero-narrative', 'hero-pitch', 'hero-heading-area', 'hero-headline-area', 'hero-left', 'hero-primary'],
    'section-header':    ['section-intro', 'section-top', 'section-lead', 'section-title-area', 'section-heading', 'block-header', 'segment-header', 'area-header', 'zone-header', 'part-header'],
    'cta-section':       ['action-section', 'convert-section', 'engage-section', 'next-step-section', 'finale-section', 'closing-section', 'offer-section', 'promo-section', 'launch-section', 'start-section'],
    'cta-content':       ['action-content', 'convert-content', 'engage-content', 'next-step-content', 'finale-content', 'closing-content', 'offer-content', 'promo-content', 'launch-content', 'start-content'],
    'floating-widget':   ['side-indicator', 'corner-badge', 'fixed-meter', 'status-chip', 'info-bubble', 'quick-stat', 'hover-card', 'snap-widget', 'mini-panel', 'data-badge'],
    'widget-value':      ['indicator-val', 'badge-number', 'meter-reading', 'chip-value', 'bubble-stat', 'quick-number', 'snap-value', 'panel-reading', 'badge-figure', 'mini-value'],
    'widget-label':      ['indicator-label', 'badge-caption', 'meter-label', 'chip-label', 'bubble-label', 'quick-label', 'snap-label', 'panel-label', 'badge-desc', 'mini-label'],
    'nav-content':       ['nav-inner', 'nav-bar', 'nav-wrap', 'nav-frame', 'nav-row', 'nav-container', 'nav-layout', 'nav-band', 'nav-strip', 'nav-belt'],
    'distribution-chart':['data-chart', 'bar-visualization', 'metric-chart', 'analysis-chart', 'breakdown-chart', 'comparison-chart', 'overview-chart', 'summary-chart', 'insight-chart', 'performance-chart'],
    'chart-header':      ['chart-top', 'chart-intro', 'chart-label', 'viz-header', 'data-header', 'graph-header', 'plot-header', 'display-header', 'analysis-header', 'metric-header'],
    'chart-title':       ['chart-name', 'chart-heading', 'viz-title', 'data-title', 'graph-title', 'plot-title', 'display-title', 'analysis-title', 'metric-title', 'insight-title'],
    'distribution-bars': ['data-bars', 'bar-group', 'metric-bars', 'analysis-bars', 'breakdown-bars', 'comparison-bars', 'chart-bars', 'visual-bars', 'progress-bars', 'range-bars'],
    'dist-bar':          ['data-row', 'bar-item', 'metric-row', 'analysis-row', 'breakdown-row', 'chart-row', 'progress-row', 'range-item', 'measure-row', 'value-row'],
    'dist-label':        ['bar-name', 'row-label', 'metric-name', 'item-name', 'category-name', 'group-label', 'segment-label', 'entry-label', 'field-label', 'axis-label'],
    'dist-track':        ['bar-bg', 'progress-track', 'fill-track', 'range-track', 'meter-track', 'gauge-track', 'level-track', 'bar-base', 'bar-rail', 'bar-channel'],
    'dist-fill':         ['bar-value', 'progress-fill', 'fill-bar', 'range-fill', 'meter-fill', 'gauge-fill', 'level-fill', 'bar-amount', 'bar-level', 'bar-measure'],
    'dist-value':        ['bar-stat', 'fill-label', 'amount-label', 'range-value', 'meter-value', 'level-value', 'bar-reading', 'bar-figure', 'bar-number', 'bar-data'],
    'dist-percent':      ['bar-pct', 'share-value', 'portion-value', 'ratio-value', 'fraction-value', 'bar-share', 'segment-pct', 'slice-value', 'part-value', 'quota-value'],
    'faq-section':       ['questions-section', 'answers-section', 'help-section', 'info-section', 'knowledge-section', 'resource-section', 'guide-section', 'learn-section', 'support-section', 'reference-section'],
    'faq-item':          ['question-item', 'answer-item', 'help-item', 'info-item', 'knowledge-item', 'resource-item', 'guide-item', 'learn-item', 'support-item', 'qa-item'],
    'faq-question':      ['question-trigger', 'answer-toggle', 'help-trigger', 'info-toggle', 'knowledge-trigger', 'qa-trigger', 'guide-toggle', 'learn-trigger', 'expand-trigger', 'reveal-trigger'],
    'faq-answer':        ['question-content', 'answer-body', 'help-content', 'info-body', 'knowledge-body', 'qa-body', 'guide-content', 'learn-body', 'expand-body', 'reveal-body'],
    'btn-primary':       ['btn-main', 'btn-action', 'btn-go', 'btn-start', 'btn-launch', 'btn-engage', 'btn-proceed', 'btn-advance', 'btn-submit', 'btn-activate'],
    'btn-secondary':     ['btn-alt', 'btn-option', 'btn-other', 'btn-more', 'btn-info', 'btn-detail', 'btn-explore', 'btn-discover', 'btn-view', 'btn-browse'],
};

// ── CSS Value Variation Ranges ───────────────────────────────
const SECTION_PADDINGS = ['4rem 2rem', '5rem 2rem', '5rem 2.5rem', '4.5rem 2rem', '6rem 2rem', '4rem 2.5rem', '5.5rem 2rem', '3.5rem 2rem', '4rem 3rem', '5rem 1.5rem'];
const BORDER_RADII = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px'];
const CARD_BORDER_RADII = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px'];
const GAPS = ['1.25rem', '1.5rem', '1.75rem', '2rem', '2.25rem', '2.5rem'];
const CARD_PADDINGS = ['1.5rem', '1.75rem', '2rem', '2.25rem', '2.5rem'];
const TRANSITION_DURATIONS = ['0.4s', '0.45s', '0.5s', '0.55s', '0.6s', '0.65s', '0.7s', '0.75s', '0.8s'];
const TRANSITION_EASINGS = [
    'ease', 'ease-in-out', 'ease-out',
    'cubic-bezier(0.16, 1, 0.3, 1)',
    'cubic-bezier(0.22, 1, 0.36, 1)',
    'cubic-bezier(0.25, 0.8, 0.25, 1)',
    'cubic-bezier(0.4, 0, 0.2, 1)',
    'cubic-bezier(0.33, 1, 0.68, 1)',
    'cubic-bezier(0.65, 0, 0.35, 1)',
];
const TRANSLATEY_VALUES = ['20px', '25px', '30px', '35px', '40px'];
const SCALE_VALUES = ['0.92', '0.93', '0.94', '0.95', '0.96', '0.97'];
const MAX_WIDTHS = ['1100px', '1150px', '1200px', '1250px', '1300px', '1350px', '1400px'];
const HEADER_FONT_SIZES = ['2.25rem', '2.35rem', '2.5rem', '2.65rem', '2.75rem'];
const HERO_H1_SIZES = ['2.75rem', '2.85rem', '3rem', '3.15rem', '3.25rem'];
const BACKDROP_BLURS = ['12px', '16px', '20px', '24px', '28px'];
const WIDGET_POSITIONS = [
    { bottom: '20px', right: '20px' },
    { bottom: '30px', right: '30px' },
    { bottom: '25px', right: '25px' },
    { bottom: '20px', right: '30px' },
    { bottom: '30px', right: '20px' },
    { top: '80px', right: '20px' },
    { top: '90px', right: '25px' },
    { top: '85px', right: '30px' },
];
const GRID_COLUMNS_3 = [
    'repeat(3, 1fr)',
    'repeat(auto-fill, minmax(300px, 1fr))',
    'repeat(auto-fit, minmax(280px, 1fr))',
    '1fr 1fr 1fr',
];
const GRID_COLUMNS_2 = [
    'repeat(2, 1fr)',
    'repeat(auto-fill, minmax(400px, 1fr))',
    'repeat(auto-fit, minmax(380px, 1fr))',
    '1fr 1fr',
];
const HOVER_TRANSFORMS = [
    'translateY(-4px)', 'translateY(-5px)', 'translateY(-6px)', 'translateY(-8px)',
    'translateY(-3px) scale(1.01)', 'translateY(-5px) scale(1.01)',
    'scale(1.02)', 'scale(1.03)',
];
const EMOJI_SETS = {
    default: ['✓', '→', '•', '▸', '▪', '◆', '●', '★'],
    tools:   ['🔧', '⚙️', '🛠️', '🔩', '⚡', '🔨', '📐', '🔍'],
    checks:  ['✅', '☑️', '✔️', '🟢', '💚', '⭐', '🔷', '🔹'],
    arrows:  ['➤', '▶', '►', '➜', '→', '⇒', '⟶', '↳'],
    shields: ['🛡️', '🔒', '🏗️', '🏛️', '⚓', '🔐', '🛡', '🔑'],
};
const FOOTER_YEARS = ['2025', '2024-2025', '2002-2025'];
const FOOTER_TEXTS = [
    'WindLoad.co — Professional Wind Load Analysis per ASCE 7-22',
    'WindLoad.co | Engineering-Grade Wind Load Calculations',
    'WindLoad.co — Certified Wind Load Reports & Analysis',
    'Wind Load Solutions — ASCE 7-22 Compliant Calculations',
    'WindLoad.co · Wind Engineering Analysis & Reports',
    'WindLoad.co — Code-Compliant Wind Load Engineering',
    'WindLoad.co | PE-Certified Wind Load Analysis',
    'Wind Load Solutions — Professional Engineering Reports',
];

// ── Main Processing ──────────────────────────────────────────
function processFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    const rng = createRng(filePath);

    // Build unique class map for this page
    const classMap = {};
    for (const [original, pool] of Object.entries(CLASS_POOLS)) {
        classMap[original] = rng.pick(pool);
    }

    // 1. Replace CSS class names (both in <style> and in HTML body)
    //    Sort by length descending to avoid partial replacements
    const sortedEntries = Object.entries(classMap).sort((a, b) => b[0].length - a[0].length);
    for (const [original, replacement] of sortedEntries) {
        // Replace in CSS selectors: .class-name
        const cssRegex = new RegExp(`\\.${escapeRegex(original)}(?=[\\s,{:>+~.\\[\\]])`, 'g');
        html = html.replace(cssRegex, `.${replacement}`);

        // Replace in HTML class attributes: class="... class-name ..."
        // Match as whole word within class attribute values
        const htmlClassRegex = new RegExp(`(?<=class="[^"]*?)\\b${escapeRegex(original)}\\b(?=[^"]*?")`, 'g');
        html = html.replace(htmlClassRegex, replacement);

        // Replace in JS querySelector strings: '.class-name' or ".class-name"
        const jsQueryRegex = new RegExp(`(?<=['"\`])\\.${escapeRegex(original)}\\b`, 'g');
        html = html.replace(jsQueryRegex, `.${replacement}`);
    }

    // 2. Vary CSS numerical values
    html = varyCSSValues(html, rng);

    // 3. Vary grid layouts
    html = varyGridLayouts(html, rng);

    // 4. Vary animation parameters
    html = varyAnimations(html, rng);

    // 5. Vary floating widget position
    html = varyWidgetPosition(html, rng);

    // 6. Vary section padding
    html = varySectionPadding(html, rng);

    // 7. Vary list item emojis/markers
    html = varyListMarkers(html, rng);

    // 8. Vary footer text
    html = varyFooter(html, rng);

    // 9. Vary JS variable names for common patterns
    html = varyJSPatterns(html, rng);

    // 10. Add unique CSS comment fingerprint (harmless, breaks byte-level dedup)
    const uid = crypto.createHash('md5').update(filePath).digest('hex').substring(0, 8);
    html = html.replace('<style>', `<style>\n/* uid:${uid} */`);

    return html;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function varyCSSValues(html, rng) {
    // Vary border-radius values (whole-number px values in CSS)
    html = html.replace(/border-radius:\s*(\d+)px/g, (match, val) => {
        const n = parseInt(val);
        if (n >= 10 && n <= 28) {
            const jitter = rng.int(-3, 3);
            return `border-radius: ${Math.max(6, n + jitter)}px`;
        }
        return match;
    });

    // Vary gap values in grid
    html = html.replace(/gap:\s*([\d.]+)rem/g, (match, val) => {
        const n = parseFloat(val);
        if (n >= 1 && n <= 3) {
            const jittered = (n + (rng.float() * 0.6 - 0.3)).toFixed(2);
            return `gap: ${jittered}rem`;
        }
        return match;
    });

    // Vary section padding
    html = html.replace(/padding:\s*(\d+)rem\s+(\d+)rem\s*;/g, (match, v, h) => {
        const vn = parseInt(v) + rng.int(-1, 1);
        const hn = parseInt(h);
        return `padding: ${Math.max(3, vn)}rem ${hn}rem;`;
    });

    // Vary backdrop-filter blur
    html = html.replace(/backdrop-filter:\s*blur\((\d+)px\)/g, (match, val) => {
        return `backdrop-filter: blur(${rng.pick(BACKDROP_BLURS)})`;
    });

    // Vary max-width
    html = html.replace(/max-width:\s*(1[1-4]\d{2})px/g, (match, val) => {
        return `max-width: ${rng.pick(MAX_WIDTHS)}`;
    });

    // Vary h2 font-size in section headers
    html = html.replace(/(section-(?:header|intro|top|lead|title-area|heading|block-header|segment-header|area-header|zone-header|part-header)\s+h2\s*\{[^}]*?)font-size:\s*2\.5rem/g, (match, prefix) => {
        return `${prefix}font-size: ${rng.pick(HEADER_FONT_SIZES)}`;
    });

    // Vary hero h1 font-size
    html = html.replace(/(\.hero(?:-text)?\s+h1\s*\{[^}]*?)font-size:\s*3rem/g, (match, prefix) => {
        return `${prefix}font-size: ${rng.pick(HERO_H1_SIZES)}`;
    });

    return html;
}

function varyGridLayouts(html, rng) {
    // Vary 3-column grids
    html = html.replace(/grid-template-columns:\s*repeat\(3,\s*1fr\)/g, () => {
        return `grid-template-columns: ${rng.pick(GRID_COLUMNS_3)}`;
    });

    // Vary 2-column grids
    html = html.replace(/grid-template-columns:\s*repeat\(2,\s*1fr\)/g, () => {
        return `grid-template-columns: ${rng.pick(GRID_COLUMNS_2)}`;
    });

    return html;
}

function varyAnimations(html, rng) {
    // Vary transition durations (0.5s, 0.6s, etc.)
    html = html.replace(/transition:\s*all\s+([\d.]+)s\s+([\w-]+(?:\([^)]*\))?)/g, (match) => {
        return `transition: all ${rng.pick(TRANSITION_DURATIONS)} ${rng.pick(TRANSITION_EASINGS)}`;
    });

    // Vary translateY values in transforms
    html = html.replace(/transform:\s*translateY\((\d+)px\)/g, (match, val) => {
        return `transform: translateY(${rng.pick(TRANSLATEY_VALUES)})`;
    });

    // Vary scale values
    html = html.replace(/transform:\s*scale\(0\.9\d\)/g, () => {
        return `transform: scale(${rng.pick(SCALE_VALUES)})`;
    });

    // Vary hover card transforms (in :hover rules)
    html = html.replace(/(:hover\s*\{[^}]*?)transform:\s*translateY\(-\d+px\)/g, (match, prefix) => {
        return `${prefix}transform: ${rng.pick(HOVER_TRANSFORMS)}`;
    });

    return html;
}

function varyWidgetPosition(html, rng) {
    const pos = rng.pick(WIDGET_POSITIONS);
    // Replace widget positioning in CSS
    // Match either bottom/right or top/right positioning
    html = html.replace(
        /((?:floating-widget|side-indicator|corner-badge|fixed-meter|status-chip|info-bubble|quick-stat|hover-card|snap-widget|mini-panel|data-badge)\s*\{[^}]*?)(?:bottom:\s*\d+px;\s*right:\s*\d+px|top:\s*\d+px;\s*right:\s*\d+px)/g,
        (match, prefix) => {
            if (pos.top) return `${prefix}top: ${pos.top}; right: ${pos.right}`;
            return `${prefix}bottom: ${pos.bottom}; right: ${pos.right}`;
        }
    );
    return html;
}

function varySectionPadding(html, rng) {
    // Target specific section padding declarations
    const sectionClasses = [
        'types-section', 'requirements-section', 'cta-section',
        'products-section', 'catalog-section', 'standards-section',
        'compliance-section', 'codes-section', 'action-section',
        'convert-section', 'faq-section', 'questions-section',
        ...Object.values(CLASS_POOLS['types-section'] || []),
        ...Object.values(CLASS_POOLS['requirements-section'] || []),
        ...Object.values(CLASS_POOLS['cta-section'] || []),
    ];
    // Already handled by varyCSSValues padding replacement
    return html;
}

function varyListMarkers(html, rng) {
    // Vary the emoji used in requirement list items
    const emojiSet = rng.pick(Object.values(EMOJI_SETS));

    // Replace ::before content emojis
    html = html.replace(/content:\s*'([🔧⚙️🛠️🔩⚡🔨📐🔍✅☑️✔️✓→•▸▪◆●★➤▶►➜⇒⟶↳🛡️🔒🏗️🏛️⚓🔐🔑🟢💚⭐🔷🔹])'/g, () => {
        return `content: '${rng.pick(emojiSet)}'`;
    });

    return html;
}

function varyFooter(html, rng) {
    // Replace generic footer copyright text
    const footerText = rng.pick(FOOTER_TEXTS);

    html = html.replace(
        /(&copy;\s*(?:2002-)?202[45]\s*)(?:WindLoad\.co\s*[-—|·]\s*(?:Professional\s+)?Wind\s+Load\s+(?:Calculations?|Analysis|Reports?|Engineering)(?:\s+per\s+ASCE\s+7-22(?:,?\s*FBC\s*2024)?)?|Wind\s+Load\s+Solutions\s*[-—|·]\s*(?:Professional\s+)?(?:ASCE\s+7-22\s+Compliant\s+)?(?:Calculations?|Engineering\s+Reports?))/gi,
        `&copy; ${rng.pick(FOOTER_YEARS)} ${footerText}`
    );

    return html;
}

function varyJSPatterns(html, rng) {
    // Vary IntersectionObserver threshold
    const thresholds = ['0.1', '0.15', '0.2', '0.25', '0.3'];
    html = html.replace(/threshold:\s*0\.\d+/g, () => {
        return `threshold: ${rng.pick(thresholds)}`;
    });

    // Vary reveal scroll point
    const revealPoints = ['100', '120', '140', '150', '160', '180', '200'];
    html = html.replace(/revealPoint\s*=\s*\d+/g, () => {
        return `revealPoint = ${rng.pick(revealPoints)}`;
    });

    // Vary particle count
    html = html.replace(/for\s*\(\s*let\s+i\s*=\s*0;\s*i\s*<\s*(\d+);\s*i\+\+\)\s*\{\s*particles\.push/g, (match, count) => {
        const n = parseInt(count);
        if (n >= 20 && n <= 60) {
            const varied = rng.int(20, 55);
            return match.replace(`i < ${count}`, `i < ${varied}`);
        }
        return match;
    });

    // Vary canvas particle sizes
    html = html.replace(/this\.size\s*=\s*Math\.random\(\)\s*\*\s*([\d.]+)\s*\+\s*([\d.]+)/g, (match, mult, add) => {
        const m = (parseFloat(mult) + (rng.float() * 1 - 0.5)).toFixed(1);
        const a = (parseFloat(add) + (rng.float() * 0.4 - 0.2)).toFixed(1);
        return `this.size = Math.random() * ${m} + ${a}`;
    });

    // Vary particle speed
    html = html.replace(/this\.speedX\s*=\s*Math\.random\(\)\s*\*\s*([\d.]+)\s*\+\s*([\d.]+)/g, (match, mult, add) => {
        const m = (parseFloat(mult) + (rng.float() * 0.6 - 0.3)).toFixed(1);
        const a = (parseFloat(add) + (rng.float() * 0.3 - 0.15)).toFixed(1);
        return `this.speedX = Math.random() * ${m} + ${a}`;
    });

    // Vary opacity ranges
    html = html.replace(/this\.opacity\s*=\s*Math\.random\(\)\s*\*\s*([\d.]+)\s*\+\s*([\d.]+)/g, (match, mult, add) => {
        const m = (parseFloat(mult) + (rng.float() * 0.15 - 0.075)).toFixed(2);
        const a = (parseFloat(add) + (rng.float() * 0.1 - 0.05)).toFixed(2);
        return `this.opacity = Math.random() * ${m} + ${a}`;
    });

    // Vary widget scroll trigger percentage
    html = html.replace(/scrollPercent\s*>\s*0\.0\d/g, () => {
        const pcts = ['0.03', '0.04', '0.05', '0.06', '0.07', '0.08'];
        return `scrollPercent > ${rng.pick(pcts)}`;
    });

    return html;
}

// ── Execution ────────────────────────────────────────────────
function getAllHtmlFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...getAllHtmlFiles(fullPath));
        } else if (entry.name.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const singleFile = args.find(a => a.endsWith('.html'));
    const targetDir = args.find(a => !a.startsWith('--') && !a.endsWith('.html'));

    console.log('🔄 SEO Diversification Script');
    console.log('=============================\n');

    let files;
    if (singleFile) {
        files = [path.resolve(singleFile)];
    } else {
        const baseDir = targetDir || path.resolve(__dirname, '..', 'florida');
        const stagedDir = path.resolve(__dirname, '..', 'staged-pages');
        console.log(`Scanning: ${baseDir}`);
        files = getAllHtmlFiles(baseDir);
        if (fs.existsSync(stagedDir) && !targetDir) {
            console.log(`Scanning: ${stagedDir}`);
            files.push(...getAllHtmlFiles(stagedDir));
        }
    }

    console.log(`Found ${files.length} HTML files\n`);

    let processed = 0;
    let errors = 0;

    for (const filePath of files) {
        try {
            const original = fs.readFileSync(filePath, 'utf-8');
            const diversified = processFile(filePath);

            if (dryRun) {
                const changes = original !== diversified;
                console.log(`${changes ? '✏️' : '⏭️'}  ${path.relative(process.cwd(), filePath)}`);
            } else {
                fs.writeFileSync(filePath, diversified, 'utf-8');
                process.stdout.write('.');
            }
            processed++;
        } catch (err) {
            console.error(`\n❌ Error processing ${filePath}: ${err.message}`);
            errors++;
        }
    }

    console.log(`\n\n✅ Processed: ${processed} files`);
    if (errors > 0) console.log(`❌ Errors: ${errors} files`);
    if (dryRun) console.log('\n(Dry run — no files were modified)');
}

main();
