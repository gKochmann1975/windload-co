#!/usr/bin/env node
/**
 * Apply noindex to thin/duplicate campaign pages
 *
 * Phase 2 of SEO Recovery Roadmap (Path C). Zero-API-cost step.
 *
 * Triage logic (Option A — aggressive):
 *   Bucket 1: word count < 500  → NOINDEX
 *   Bucket 2: word count < 1000 → NOINDEX
 *   Bucket 3: topic appears in multiple counties → keep longest, NOINDEX rest
 *
 * Pages not in any bucket stay indexed.
 *
 * For NOINDEX pages:
 *   - Adds <meta name="robots" content="noindex, follow"> to <head>
 *   - `follow` preserves link equity through the page
 *   - URL stays live (no 404s, backlinks keep working)
 *
 * Outputs triage report to docs/seo-triage-results.json
 *
 * Usage:
 *   node scripts/apply-noindex.js --dry-run  # preview
 *   node scripts/apply-noindex.js            # apply
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LIVE_DIR = path.join(ROOT, 'florida');
const STAGED_DIR = path.join(ROOT, 'staged-pages');
const RESULTS_FILE = path.join(ROOT, 'docs', 'seo-triage-results.json');

const NOINDEX_META = '<meta name="robots" content="noindex, follow">';

// ── Thresholds ───────────────────────────────────────────────
const VERY_THIN_THRESHOLD = 500;
const THIN_THRESHOLD = 1000;

// ── File walk ────────────────────────────────────────────────
function getAllHtmlFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) results.push(...getAllHtmlFiles(fullPath));
        else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
            results.push(fullPath);
        }
    }
    return results;
}

// ── Word count of visible content ────────────────────────────
function countWords(html) {
    let text = html;
    text = text.replace(/<script[\s\S]*?<\/script>/g, '');
    text = text.replace(/<style[\s\S]*?<\/style>/g, '');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&[a-z]+;/gi, ' ');
    return text.trim().split(/\s+/).filter(w => w.length > 1).length;
}

// ── Check if noindex already applied ─────────────────────────
function hasNoindex(html) {
    return /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
}

// ── Inject noindex into <head> ───────────────────────────────
function injectNoindex(html) {
    if (hasNoindex(html)) return html;

    // Insert after <meta charset> or <meta viewport>, or at start of <head>
    const metaViewportMatch = html.match(/(<meta\s+name=["']viewport["'][^>]*>)/i);
    if (metaViewportMatch) {
        return html.replace(
            metaViewportMatch[0],
            `${metaViewportMatch[0]}\n    ${NOINDEX_META}`
        );
    }

    const metaCharsetMatch = html.match(/(<meta\s+charset=[^>]*>)/i);
    if (metaCharsetMatch) {
        return html.replace(
            metaCharsetMatch[0],
            `${metaCharsetMatch[0]}\n    ${NOINDEX_META}`
        );
    }

    // Fallback: insert after opening <head>
    return html.replace(/<head[^>]*>/i, (m) => `${m}\n    ${NOINDEX_META}`);
}

// ── Build triage decisions ───────────────────────────────────
function triage() {
    const allFiles = [
        ...getAllHtmlFiles(LIVE_DIR),
        ...getAllHtmlFiles(STAGED_DIR),
    ];

    // First pass: compute word counts, group by topic (filename)
    const byFile = {};
    const byTopic = {};

    for (const f of allFiles) {
        const html = fs.readFileSync(f, 'utf-8');
        const wc = countWords(html);
        const filename = path.basename(f);

        byFile[f] = { wordCount: wc, topic: filename, area: f.includes('staged-pages') ? 'staged' : 'live' };

        if (!byTopic[filename]) byTopic[filename] = [];
        byTopic[filename].push({ path: f, wordCount: wc });
    }

    // Second pass: make decisions
    const decisions = {}; // path → { bucket, reason }

    for (const f of allFiles) {
        const info = byFile[f];
        const relPath = path.relative(ROOT, f).replace(/\\/g, '/');

        // Bucket 1: very thin
        if (info.wordCount < VERY_THIN_THRESHOLD) {
            decisions[f] = {
                path: relPath,
                bucket: 'NOINDEX',
                reason: `very_thin_${info.wordCount}w`,
                wordCount: info.wordCount,
            };
            continue;
        }

        // Bucket 2: thin
        if (info.wordCount < THIN_THRESHOLD) {
            decisions[f] = {
                path: relPath,
                bucket: 'NOINDEX',
                reason: `thin_${info.wordCount}w`,
                wordCount: info.wordCount,
            };
            continue;
        }

        // Bucket 3: duplicate topic across counties — keep longest, noindex rest
        const dupes = byTopic[info.topic];
        if (dupes.length > 1) {
            const longest = dupes.reduce((a, b) => a.wordCount > b.wordCount ? a : b);
            if (f !== longest.path) {
                decisions[f] = {
                    path: relPath,
                    bucket: 'NOINDEX',
                    reason: `duplicate_topic_kept_${path.relative(ROOT, longest.path).replace(/\\/g, '/')}`,
                    wordCount: info.wordCount,
                };
                continue;
            }
        }

        // Otherwise: KEEP
        decisions[f] = {
            path: relPath,
            bucket: 'KEEP',
            reason: `kept_${info.wordCount}w`,
            wordCount: info.wordCount,
        };
    }

    return decisions;
}

// ── Main ─────────────────────────────────────────────────────
function main() {
    const dryRun = process.argv.includes('--dry-run');

    console.log('🎯 Apply noindex to thin/duplicate pages');
    console.log('==========================================\n');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);

    console.log('Analyzing pages...');
    const decisions = triage();

    // Stats
    const allDecisions = Object.values(decisions);
    const noindex = allDecisions.filter(d => d.bucket === 'NOINDEX');
    const keep = allDecisions.filter(d => d.bucket === 'KEEP');
    const byReason = {};
    for (const d of noindex) {
        const reasonKey = d.reason.split('_')[0] + (d.reason.startsWith('duplicate_') ? '_topic' : d.reason.startsWith('very_') ? '_very_thin' : '');
        const key = d.reason.startsWith('duplicate') ? 'duplicate_topic'
                  : d.reason.startsWith('very_thin') ? 'very_thin_<500w'
                  : 'thin_<1000w';
        byReason[key] = (byReason[key] || 0) + 1;
    }

    console.log(`\nDecisions:`);
    console.log(`  KEEP:    ${keep.length} pages`);
    console.log(`  NOINDEX: ${noindex.length} pages`);
    for (const [reason, count] of Object.entries(byReason)) {
        console.log(`    ${reason}: ${count}`);
    }

    // Apply (or not)
    let applied = 0;
    let skipped = 0;

    if (!dryRun) {
        console.log('\nApplying noindex...');
        for (const [filePath, decision] of Object.entries(decisions)) {
            if (decision.bucket !== 'NOINDEX') continue;
            const html = fs.readFileSync(filePath, 'utf-8');
            if (hasNoindex(html)) {
                skipped++;
                continue;
            }
            const updated = injectNoindex(html);
            fs.writeFileSync(filePath, updated, 'utf-8');
            applied++;
            if (applied % 50 === 0) process.stdout.write('.');
        }
        console.log(`\n\nApplied noindex to ${applied} pages`);
        if (skipped > 0) console.log(`Skipped ${skipped} pages (already had noindex)`);
    }

    // Save triage report
    if (!fs.existsSync(path.dirname(RESULTS_FILE))) {
        fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
    }
    const report = {
        generated: new Date().toISOString(),
        mode: dryRun ? 'dry-run' : 'applied',
        thresholds: {
            very_thin: VERY_THIN_THRESHOLD,
            thin: THIN_THRESHOLD,
        },
        summary: {
            total: allDecisions.length,
            keep: keep.length,
            noindex: noindex.length,
            byReason,
        },
        decisions: allDecisions,
    };
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\nTriage report saved: ${path.relative(ROOT, RESULTS_FILE)}`);

    if (dryRun) {
        console.log('\n(Dry run — no files modified)');
    }
}

main();
