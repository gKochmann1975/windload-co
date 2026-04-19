#!/usr/bin/env node
/**
 * Rebuild sitemap.xml with only KEEP pages
 *
 * Reads docs/seo-triage-results.json for triage decisions.
 * Builds a fresh sitemap containing:
 *   - Main/hub pages (homepage, architects, contractors, etc.)
 *   - Only florida/ pages classified as KEEP (excludes NOINDEX)
 *
 * Staged pages are NOT in sitemap (not yet live).
 *
 * Uses today's date as <lastmod> for all URLs.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TRIAGE_FILE = path.join(ROOT, 'docs', 'seo-triage-results.json');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');

const TODAY = new Date().toISOString().split('T')[0];

// Main/hub pages always in sitemap (high priority)
const MAIN_PAGES = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/engineers', priority: '0.8', changefreq: 'monthly' },
    { loc: '/architects', priority: '0.8', changefreq: 'monthly' },
    { loc: '/contractors', priority: '0.8', changefreq: 'monthly' },
    { loc: '/florida-pro', priority: '0.8', changefreq: 'monthly' },
    { loc: '/hurricane', priority: '0.8', changefreq: 'monthly' },
    { loc: '/compare', priority: '0.7', changefreq: 'monthly' },
    { loc: '/vs-buildingsguide', priority: '0.7', changefreq: 'monthly' },
    { loc: '/vs-omni', priority: '0.7', changefreq: 'monthly' },
    { loc: '/states', priority: '0.7', changefreq: 'monthly' },
];

function main() {
    if (!fs.existsSync(TRIAGE_FILE)) {
        console.error(`❌ Triage file not found: ${TRIAGE_FILE}`);
        console.error('   Run scripts/apply-noindex.js first to generate it.');
        process.exit(1);
    }

    const triage = JSON.parse(fs.readFileSync(TRIAGE_FILE, 'utf-8'));

    // Keep only florida/ pages that are KEEP bucket
    const keepFloridaPages = triage.decisions
        .filter(d => d.bucket === 'KEEP' && d.path.startsWith('florida/'))
        .map(d => {
            // Convert florida/broward/entry-doors.html → /florida/broward/entry-doors
            return '/' + d.path.replace(/\.html$/, '');
        });

    console.log(`Building sitemap with:`);
    console.log(`  ${MAIN_PAGES.length} main/hub pages`);
    console.log(`  ${keepFloridaPages.length} KEEP florida/ pages`);
    console.log(`  (excluding ${triage.summary.noindex} noindexed pages)\n`);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of MAIN_PAGES) {
        xml += `  <url>\n`;
        xml += `    <loc>https://windload.co${page.loc}</loc>\n`;
        xml += `    <lastmod>${TODAY}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
    }

    for (const page of keepFloridaPages) {
        xml += `  <url>\n`;
        xml += `    <loc>https://windload.co${page}</loc>\n`;
        xml += `    <lastmod>${TODAY}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
    }

    xml += '</urlset>\n';

    fs.writeFileSync(SITEMAP_FILE, xml, 'utf-8');
    const total = MAIN_PAGES.length + keepFloridaPages.length;
    console.log(`✅ Sitemap written: ${total} URLs (was 701 before)`);
}

main();
