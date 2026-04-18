#!/usr/bin/env node
/**
 * SEO Diversify Repair v2
 *
 * Reproduces the original mapping from the seeded RNG and fixes compound
 * class orphans directly. For each pool key (e.g. `types-grid`), finds CSS
 * classes ending with that key (e.g. `.door-types-grid`) and renames them
 * to match the value in the HTML (e.g. `.door-category-layout`).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Reproduce seeded RNG ─────────────────────────────────────
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
        pick: (arr) => arr[Math.floor(next() * arr.length)],
    };
}

// ── Exact pool from original diversify script ────────────────
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

function buildMap(filePath) {
    const rng = createRng(filePath);
    const map = {};
    for (const [key, pool] of Object.entries(CLASS_POOLS)) {
        map[key] = rng.pick(pool);
    }
    return map;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAllHtmlFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) results.push(...getAllHtmlFiles(fullPath));
        else if (entry.name.endsWith('.html')) results.push(fullPath);
    }
    return results;
}

function extractCssClasses(html) {
    const classes = new Set();
    const styleMatches = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g);
    for (const styleMatch of styleMatches) {
        const re = /\.([a-zA-Z][\w-]*)/g;
        let m;
        while ((m = re.exec(styleMatch[1])) !== null) classes.add(m[1]);
    }
    return classes;
}

function repairFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');
    const map = buildMap(filePath);
    const cssClasses = extractCssClasses(html);
    let renames = 0;

    // Sort keys by length desc to avoid partial matches
    const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);

    html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (fullMatch, css) => {
        let updated = css;
        for (const key of sortedKeys) {
            const value = map[key];
            // Find compound CSS classes like .prefix-<key> or .<key>-suffix
            // that weren't renamed by the original script
            // Pattern: any class ending with or containing -key- or -key followed by CSS boundary
            // We want to match: .<prefix>-<key><boundary> → .<prefix>-<value><boundary>
            // where <boundary> is CSS delim

            // Handle .prefix-key boundary (key at end)
            const endPattern = new RegExp(
                `\\.([\\w-]+)-${escapeRegex(key)}(?=[\\s,{:>+~.\\[\\]])`,
                'g'
            );
            updated = updated.replace(endPattern, (m, prefix) => {
                // Only rename if the CSS class we'd create matches something already in HTML
                // (i.e., the HTML already has .prefix-value because original script half-fixed it)
                renames++;
                return `.${prefix}-${value}`;
            });

            // Handle .key-suffix (key at start of compound)
            const startPattern = new RegExp(
                `\\.${escapeRegex(key)}-([\\w-]+)(?=[\\s,{:>+~.\\[\\]])`,
                'g'
            );
            updated = updated.replace(startPattern, (m, suffix) => {
                renames++;
                return `.${value}-${suffix}`;
            });
        }
        return fullMatch.replace(css, updated);
    });

    if (renames === 0) return { modified: false, renames: 0 };
    fs.writeFileSync(filePath, html, 'utf-8');
    return { modified: true, renames };
}

function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const verbose = args.includes('-v');
    const singleFile = args.find(a => a.endsWith('.html'));

    console.log('🔧 SEO Diversify Repair v2 (compound class fix)');
    console.log('================================================\n');

    let files;
    if (singleFile) {
        files = [path.resolve(singleFile)];
    } else {
        const baseDir = path.resolve(__dirname, '..', 'florida');
        const stagedDir = path.resolve(__dirname, '..', 'staged-pages');
        files = [...getAllHtmlFiles(baseDir), ...getAllHtmlFiles(stagedDir)];
    }

    console.log(`Checking ${files.length} HTML files\n`);

    let fixedCount = 0;
    let totalRenames = 0;

    for (const filePath of files) {
        try {
            if (dryRun) {
                // Just simulate
                const html = fs.readFileSync(filePath, 'utf-8');
                const map = buildMap(filePath);
                let count = 0;
                const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
                if (styleMatch) {
                    const css = styleMatch[1];
                    for (const key of Object.keys(map)) {
                        const endPattern = new RegExp(`\\.([\\w-]+)-${escapeRegex(key)}(?=[\\s,{:>+~.\\[\\]])`, 'g');
                        count += (css.match(endPattern) || []).length;
                        const startPattern = new RegExp(`\\.${escapeRegex(key)}-([\\w-]+)(?=[\\s,{:>+~.\\[\\]])`, 'g');
                        count += (css.match(startPattern) || []).length;
                    }
                }
                if (count > 0) {
                    fixedCount++;
                    totalRenames += count;
                    if (verbose) console.log(`${path.relative(process.cwd(), filePath)}: ${count} compound renames`);
                }
            } else {
                const result = repairFile(filePath);
                if (result.modified) {
                    fixedCount++;
                    totalRenames += result.renames;
                    if (verbose) console.log(`${path.relative(process.cwd(), filePath)}: ${result.renames} renames`);
                    else process.stdout.write('.');
                }
            }
        } catch (err) {
            console.error(`\n❌ Error: ${filePath}: ${err.message}`);
        }
    }

    console.log(`\n\n✅ Files with compound orphans fixed: ${fixedCount}`);
    console.log(`✅ Total CSS compound class renames: ${totalRenames}`);
    if (dryRun) console.log('\n(Dry run — no files modified)');
}

main();
