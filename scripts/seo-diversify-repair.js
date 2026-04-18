#!/usr/bin/env node
/**
 * SEO Diversify Repair Script
 *
 * Fixes compound-class orphans created by the initial diversify script.
 * The initial script's HTML regex matched partial class names (e.g. `stat-value`
 * inside `comp-stat-value`), replacing them in HTML but leaving CSS definitions
 * intact. This script detects those orphans and renames the CSS classes to match.
 *
 * Strategy:
 *   1. Parse CSS-defined class names
 *   2. Parse HTML-used class names
 *   3. Find pairs where a CSS class and an HTML class share a common prefix
 *      AND a common suffix (indicating they're a compound class that was
 *      partially renamed)
 *   4. Rename the CSS class to match the HTML class
 */

const fs = require('fs');
const path = require('path');

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
        const cssContent = styleMatch[1];
        // Match class selectors but exclude inside @keyframes, etc.
        const re = /\.([a-zA-Z][\w-]*)/g;
        let m;
        while ((m = re.exec(cssContent)) !== null) {
            classes.add(m[1]);
        }
    }
    return classes;
}

function extractHtmlClasses(html) {
    const classes = new Set();
    // Remove <style> blocks first
    const withoutStyle = html.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
    // Remove <script> blocks too
    const withoutScript = withoutStyle.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
    const re = /class="([^"]+)"/g;
    let m;
    while ((m = re.exec(withoutScript)) !== null) {
        m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
    }
    return classes;
}

function findBestMatch(orphanHtml, orphanCssArr) {
    // Find CSS class that shares both a prefix and a suffix with orphanHtml
    // A compound class split by `-` shares most tokens
    const htmlParts = orphanHtml.split('-');

    let bestMatch = null;
    let bestScore = 0;

    for (const cssClass of orphanCssArr) {
        const cssParts = cssClass.split('-');

        // Count matching parts at start (prefix) and end (suffix)
        let prefixMatch = 0;
        for (let i = 0; i < Math.min(htmlParts.length, cssParts.length); i++) {
            if (htmlParts[i] === cssParts[i]) prefixMatch++;
            else break;
        }
        let suffixMatch = 0;
        for (let i = 0; i < Math.min(htmlParts.length, cssParts.length); i++) {
            const h = htmlParts[htmlParts.length - 1 - i];
            const c = cssParts[cssParts.length - 1 - i];
            if (h === c) suffixMatch++;
            else break;
        }

        // Must share at least 1 prefix AND 1 suffix token (otherwise it's not a compound)
        if (prefixMatch < 1 || suffixMatch < 1) continue;

        // Score: prefix + suffix length, but penalize total length difference
        const score = prefixMatch + suffixMatch - Math.abs(htmlParts.length - cssParts.length);

        if (score > bestScore) {
            bestScore = score;
            bestMatch = cssClass;
        }
    }

    return bestScore >= 2 ? bestMatch : null;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function repairFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf-8');

    const cssClasses = extractCssClasses(html);
    const htmlClasses = extractHtmlClasses(html);

    // Filter to actual class selectors (exclude keyframe animation names, etc.)
    // A CSS class that doesn't appear in HTML but looks like it was renamed
    const orphanedInCss = [...cssClasses].filter(c => !htmlClasses.has(c));
    const orphanedInHtml = [...htmlClasses].filter(c => !cssClasses.has(c));

    // For each HTML orphan, find best CSS compound match
    const renames = []; // {from: cssClass, to: htmlClass}
    const usedCss = new Set();

    for (const htmlOrphan of orphanedInHtml) {
        const candidates = orphanedInCss.filter(c => !usedCss.has(c));
        const match = findBestMatch(htmlOrphan, candidates);
        if (match) {
            renames.push({ from: match, to: htmlOrphan });
            usedCss.add(match);
        }
    }

    if (renames.length === 0) return { modified: false, renames: [] };

    // Apply renames in CSS only (HTML already has the correct class)
    // Sort by length desc to prevent partial matches
    renames.sort((a, b) => b.from.length - a.from.length);

    // Only replace inside <style> blocks
    html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (match, css) => {
        let updated = css;
        for (const { from, to } of renames) {
            // Replace .from with .to, only as complete class token in selectors
            const re = new RegExp(`\\.${escapeRegex(from)}(?=[\\s,{:>+~.\\[\\]])`, 'g');
            updated = updated.replace(re, `.${to}`);
        }
        return match.replace(css, updated);
    });

    fs.writeFileSync(filePath, html, 'utf-8');
    return { modified: true, renames };
}

function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const verbose = args.includes('-v');
    const singleFile = args.find(a => a.endsWith('.html'));

    console.log('🔧 SEO Diversify Repair');
    console.log('=======================\n');

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
                const html = fs.readFileSync(filePath, 'utf-8');
                const css = extractCssClasses(html);
                const htmlCls = extractHtmlClasses(html);
                const orphanHtml = [...htmlCls].filter(c => !css.has(c));
                const orphanCss = [...css].filter(c => !htmlCls.has(c));
                const renames = [];
                const usedCss = new Set();
                for (const h of orphanHtml) {
                    const m = findBestMatch(h, orphanCss.filter(c => !usedCss.has(c)));
                    if (m) { renames.push({from: m, to: h}); usedCss.add(m); }
                }
                if (renames.length > 0) {
                    fixedCount++;
                    totalRenames += renames.length;
                    if (verbose) {
                        console.log(`${path.relative(process.cwd(), filePath)}: ${renames.length} renames`);
                        for (const r of renames) console.log(`  .${r.from} → .${r.to}`);
                    }
                }
            } else {
                const result = repairFile(filePath);
                if (result.modified) {
                    fixedCount++;
                    totalRenames += result.renames.length;
                    if (verbose) {
                        console.log(`${path.relative(process.cwd(), filePath)}: ${result.renames.length} renames`);
                    } else {
                        process.stdout.write('.');
                    }
                }
            }
        } catch (err) {
            console.error(`\n❌ Error: ${filePath}: ${err.message}`);
        }
    }

    console.log(`\n\n✅ Files with orphans fixed: ${fixedCount}`);
    console.log(`✅ Total CSS class renames: ${totalRenames}`);
    if (dryRun) console.log('\n(Dry run — no files modified)');
}

main();
