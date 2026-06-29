#!/usr/bin/env node
/**
 * seo-geo-florida.js — idempotent SEO/GEO head layer for the INDEXABLE Florida
 * campaign pages (the curated traffic-earners that are NOT noindexed).
 *
 * Adds a <!--SEO-GEO-v1--> block before </head> with Twitter cards, og:image,
 * and a JSON-LD @graph: Organization + WebSite + BreadcrumbList + TechArticle
 * (educational/explainer primary entity, per the GEO spec). The page's existing
 * page-specific FAQPage block is preserved; the stale legacy BreadcrumbList
 * (which pointed at 404 URLs) is removed and replaced by a correct one.
 *
 * Targets ONLY pages without a noindex tag (the ~13 indexable florida pages).
 * Re-runnable / idempotent. Does not touch visual design, copy, or funnel CTAs.
 *
 * Usage: node scripts/seo-geo-florida.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://windload.co';
const OG_IMAGE = SITE + '/assets/og-card.png';
const ORG_LOGO = SITE + '/assets/windload.co_0018ff.png';
const DATE_MODIFIED = '2026-06-29';

const MARK_OPEN = '<!--SEO-GEO-v1-->';
const MARK_CLOSE = '<!--/SEO-GEO-v1-->';

const ORG = {
  '@type': 'Organization', '@id': SITE + '/#organization', name: 'WindLoad.co', url: SITE,
  logo: { '@type': 'ImageObject', url: ORG_LOGO, width: 512, height: 512 },
  foundingDate: '2002', areaServed: { '@type': 'Country', name: 'United States' },
  knowsAbout: ['wind load calculation', 'ASCE 7', 'Components and Cladding (C&C)',
    'Main Wind Force Resisting System (MWFRS)', 'High-Velocity Hurricane Zone (HVHZ)'],
  sameAs: ['https://windloadcalc.com', 'https://windload.solutions']
};
const WEBSITE = {
  '@type': 'WebSite', '@id': SITE + '/#website', url: SITE, name: 'WindLoad.co',
  publisher: { '@id': SITE + '/#organization' }, inLanguage: 'en-US'
};
const orgRef = { '@id': SITE + '/#organization' };
const siteRef = { '@id': SITE + '/#website' };

// county -> { name, url } for the breadcrumb (canonical, non-404 mapping)
const COUNTY = {
  'miami-dade': { name: 'Miami-Dade County', url: 'https://windload.solutions/cities/miami-wind-load-requirements' },
  'broward': { name: 'Broward County', url: 'https://windload.solutions/florida-wind-load-requirements' },
  'palm-beach': { name: 'Palm Beach County', url: 'https://windload.solutions/cities/west-palm-beach-wind-load-requirements' }
};
const FLORIDA_CRUMB = { name: 'Florida', url: 'https://windload.solutions/florida-wind-load-requirements' };

// real first-commit (publish) dates from git history, keyed by county/slug
const PUBLISHED = {
  'broward/aluminum-storefront-mullion-wind': '2026-03-18',
  'broward/skylight-requirements': '2026-01-17',
  'broward/topographic-factor-kzt': '2026-01-22',
  'miami-dade/expansion-joint-covers': '2026-01-24',
  'miami-dade/exposure-category-d': '2026-01-24',
  'miami-dade/gfrc-panel-wind': '2026-03-02',
  'miami-dade/hvac-equipment-anchoring': '2026-01-25',
  'miami-dade/noa-expiration-tracker': '2026-02-15',
  'miami-dade/roof-waterproofing-membrane-wind': '2026-03-13',
  'miami-dade/wind-zone-map': '2026-01-17',
  'palm-beach/ballasted-solar-wind': '2026-02-11',
  'palm-beach/impact-windows': '2026-01-17',
  'palm-beach/sunroom-windows': '2026-02-12'
};

const LEGACY_TYPES = new Set(['BreadcrumbList', 'WebPage', 'Article', 'TechArticle', 'NewsArticle', 'Organization', 'WebSite']);
function stripLegacyLd(html) {
  return html.replace(
    /(?:[ \t]*<!--[^>]*?(?:Schema|Breadcrumb|Organization)[^>]*?-->\s*)?<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/gi,
    (full, body) => {
      try { const j = JSON.parse(body); if (j && !j['@graph'] && LEGACY_TYPES.has(j['@type'])) return ''; }
      catch (e) { /* keep */ }
      return full;
    }
  );
}

function attr(html, re) { const m = html.match(re); return m ? m[1].trim().replace(/\s+/g, ' ') : ''; }
function decode(s) { return s.replace(/&amp;/g, '&'); }
function escAttr(s) { return s.replace(/"/g, '&quot;'); }

function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r = r.concat(walk(p));
    else if (e.name.endsWith('.html')) r.push(p);
  }
  return r;
}

function process(file) {
  const html = fs.readFileSync(file, 'utf8');
  if (/noindex/i.test(html)) return { skipped: true };

  const rel = file.split(path.sep).join('/');
  const key = rel.slice(rel.indexOf('florida/') + 'florida/'.length).replace(/\.html$/, ''); // county/slug
  const county = key.split('/')[0];

  const title = decode(attr(html, /<title>([\s\S]*?)<\/title>/i));
  const desc = decode(attr(html, /name="description"\s+content="([^"]*)"/i));
  let h1 = decode(attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ''));
  let canon = attr(html, /rel="canonical"\s+href="([^"]*)"/i) || (SITE + '/florida/' + key);
  canon = canon.replace(/\.html$/, '');

  let headline = (h1 || title).slice(0, 110);

  const crumbs = [
    { name: 'Home', item: SITE + '/' },
    { name: FLORIDA_CRUMB.name, item: FLORIDA_CRUMB.url },
    COUNTY[county] ? { name: COUNTY[county].name, item: COUNTY[county].url } : null,
    { name: (h1 || title).split('|')[0].trim().slice(0, 70), item: canon }
  ].filter(Boolean);

  const graph = [
    ORG, WEBSITE,
    {
      '@type': 'BreadcrumbList', '@id': canon + '#breadcrumb',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item }))
    },
    {
      '@type': 'TechArticle', '@id': canon + '#article',
      headline, name: title, description: desc,
      datePublished: PUBLISHED[key] || DATE_MODIFIED,
      dateModified: DATE_MODIFIED,
      author: orgRef, publisher: orgRef, isPartOf: siteRef,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canon },
      image: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
      articleSection: COUNTY[county] ? COUNTY[county].name : 'Florida',
      about: orgRef, inLanguage: 'en-US', url: canon
    }
  ];
  const ld = { '@context': 'https://schema.org', '@graph': graph };

  let stripped = html.replace(new RegExp(MARK_OPEN + '[\\s\\S]*?' + MARK_CLOSE, 'g'), '');
  stripped = stripLegacyLd(stripped);
  // remove any pre-existing twitter card meta so we emit exactly one set (with image)
  stripped = stripped.replace(/[ \t]*<meta\s+name="twitter:[^>]*>\s*/gi, '');
  const hasOg = /property="og:image"/i.test(stripped);

  const lines = [MARK_OPEN];
  if (!hasOg) lines.push('<meta property="og:image" content="' + OG_IMAGE + '">');
  lines.push('<meta name="twitter:card" content="summary_large_image">');
  lines.push('<meta name="twitter:title" content="' + escAttr(title) + '">');
  lines.push('<meta name="twitter:description" content="' + escAttr(desc) + '">');
  lines.push('<meta name="twitter:image" content="' + OG_IMAGE + '">');
  lines.push('<script type="application/ld+json">');
  lines.push(JSON.stringify(ld));
  lines.push('</script>');
  lines.push(MARK_CLOSE);
  const block = lines.join('\n');

  if (!/<\/head>/i.test(stripped)) return { skipped: true, reason: 'no </head>' };
  JSON.parse(JSON.stringify(ld)); // sanity
  fs.writeFileSync(file, stripped.replace(/<\/head>/i, block + '\n</head>'));
  return { key, canon, published: PUBLISHED[key] || DATE_MODIFIED };
}

const files = walk(path.join(ROOT, 'florida'));
let done = 0, skipped = 0;
for (const f of files) {
  const r = process(f);
  if (r.skipped) { skipped++; continue; }
  done++;
  console.log('OK  ' + r.key.padEnd(45) + ' pub=' + r.published);
}
console.log('\nDone. ' + done + ' indexable florida page(s) processed, ' + skipped + ' noindexed/skipped.');
