#!/usr/bin/env node
/**
 * seo-geo.js — idempotent SEO/GEO head-layer injector for windload.co marketing pages.
 *
 * Injects a single <!--SEO-GEO-v1--> ... <!--/SEO-GEO-v1--> block before </head>:
 *   - Twitter Card meta (summary_large_image)
 *   - og:image (only if the page has none outside the marker block)
 *   - JSON-LD @graph: Organization, WebSite, BreadcrumbList, page-type primary entity
 *   - FAQPage / HowTo on designated landing/explainer pages
 *
 * Re-running strips the previous marker block and re-injects, so it is safe to run
 * repeatedly. It does NOT touch visual design, copy, or existing funnel CTAs/links.
 *
 * Usage:
 *   node scripts/seo-geo.js            # process all configured pages
 *   node scripts/seo-geo.js index.html # process a single page
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://windload.co';
const OG_IMAGE = SITE + '/assets/og-card.png'; // 1200x630 branded social card (scripts/make-og-card.py)
const ORG_LOGO = SITE + '/assets/windload.co_0018ff.png';
const SHOP = 'https://windloadcalc.com/wind-load-calculator-shop.html';

const MARK_OPEN = '<!--SEO-GEO-v1-->';
const MARK_CLOSE = '<!--/SEO-GEO-v1-->';

// ---- shared graph nodes -----------------------------------------------------
const ORG = {
  '@type': 'Organization',
  '@id': SITE + '/#organization',
  name: 'WindLoad.co',
  url: SITE,
  logo: { '@type': 'ImageObject', url: ORG_LOGO, width: 512, height: 512 },
  foundingDate: '2002',
  areaServed: { '@type': 'Country', name: 'United States' },
  knowsAbout: [
    'wind load calculation', 'ASCE 7', 'Components and Cladding (C&C)',
    'Main Wind Force Resisting System (MWFRS)', 'High-Velocity Hurricane Zone (HVHZ)'
  ],
  sameAs: ['https://windloadcalc.com', 'https://windload.solutions']
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': SITE + '/#website',
  url: SITE,
  name: 'WindLoad.co',
  description: 'Wind load resource hub connecting architects, engineers, and contractors to ASCE 7-16/7-22 wind load calculators and PE-sealed reports.',
  publisher: { '@id': SITE + '/#organization' },
  inLanguage: 'en-US'
};

const orgRef = { '@id': SITE + '/#organization' };
const siteRef = { '@id': SITE + '/#website' };

// ---- FAQ content (answer-first, ASCE-accurate) ------------------------------
const FAQ = {
  index: [
    ['What is windload.co?', 'WindLoad.co is a free resource hub that connects architects, engineers, and contractors to ASCE 7-16 and 7-22 wind load calculators and PE-sealed reports on windloadcalc.com. It explains design pressures, state requirements, and HVHZ rules, then routes you to the right calculator for windows, doors, shutters, roofs, or MWFRS.'],
    ['Is the wind load calculator ASCE 7-22 compliant?', 'Yes. The calculators on windloadcalc.com follow ASCE 7-16 and 7-22, computing velocity pressure as qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared with the wind directionality factor Kd = 0.85 for buildings. Mapped wind speeds are ultimate 3-second gusts, and ASD wind load equals 0.6W.'],
    ['How much does a wind load calculation cost?', 'A single ASCE 7-22 wind load calculation with a downloadable PDF report is $25, with no subscription required. Adding a Florida-licensed Professional Engineer stamp costs $75 for standard turnaround (24 to 48 hours) or $150 for same-day rush service.'],
    ['Do I need to be an engineer to use it?', 'No. The calculator lets contractors and architects produce permit-ready ASCE 7-22 wind pressures without an engineering degree. You enter location and building details and it applies the correct Kz, Kzt, Kd, Ke, GCp, and GCpi values. Where a jurisdiction requires a stamp, PE seal services are available.'],
    ['What is the High-Velocity Hurricane Zone (HVHZ)?', 'The HVHZ is a Florida Building Code designation covering only Miami-Dade and Broward counties. It requires impact-rated assemblies with a Notice of Acceptance (NOA) or Florida Product Approval and TAS 201/202/203 testing. Our Florida calculators apply the correct HVHZ wind speeds and product-approval pathways.']
  ],
  engineers: [
    ['Is this wind load calculator suitable for licensed engineers?', 'Yes. It runs the full ASCE 7-16/7-22 procedure, computing velocity pressure qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared with Kd = 0.85, plus Components and Cladding and MWFRS pressures, and exports a PE-stampable PDF with every coefficient cited to its ASCE 7 section so you can review and seal in minutes.'],
    ['Does the calculator output ultimate or ASD wind loads?', 'Both. Mapped basic wind speeds have been ultimate, strength-level 3-second gusts since ASCE 7-10, so qz and pressures are computed at strength level. For allowable stress design, apply the 0.6 load factor (ASD wind = 0.6W). There is no wind importance factor; risk category selects the MRI wind-speed map.'],
    ['Can I get calculations sealed by a Professional Engineer?', 'Yes. A Florida-licensed PE can review and stamp single-calculation reports for $75 (standard, 24 to 48 hours) or $150 (same-day rush). Multi-building projects of five or more calculations are quoted individually. The seal applies to Florida residential and light-commercial structures up to three stories.'],
    ['Which ASCE 7 procedures are supported?', 'The calculator covers Components and Cladding (Chapter 30) for windows, doors, shutters, and all roof shapes, plus MWFRS by the Directional (Chapter 27) and Envelope (Chapter 28) procedures. Internal pressure uses GCpi of plus or minus 0.18 for enclosed and plus or minus 0.55 for partially enclosed buildings.'],
    ['How much time does it save per project?', 'The tool auto-applies Kz, Kzt, Kd, Ke, GCp, and GCpi, handles multi-opening schedules, and generates a formatted report, so you verify inputs and seal rather than rebuilding spreadsheets. Engineers report saving roughly ten hours per project versus hand calculations.']
  ],
  contractors: [
    ['Do I need an engineering background to use the calculator?', 'No. The calculator is designed for contractors: you enter the project location and building details and it applies the correct ASCE 7-22 coefficients (Kz, Kzt, Kd = 0.85, Ke, GCp, GCpi) automatically, returning permit-ready design pressures and a PDF report with no manual code lookups.'],
    ['Will these calculations pass permit review?', 'Yes. Reports follow ASCE 7-16/7-22 and the applicable building code, list every coefficient and its source, and present pressures in the format plan reviewers expect. Where a jurisdiction requires a sealed calculation, a Florida-licensed PE can stamp it for $75 standard or $150 same-day.'],
    ['How fast can I get a wind load report?', 'Most calculations take a few minutes: enter the address and opening details and download the PDF immediately at $25 per calculation. If a PE stamp is needed, standard turnaround is 24 to 48 hours and rush service is same day.'],
    ['What information do I need to run a calculation?', 'You need the project address (for the mapped wind speed), the building risk category, the exposure category (B, C, or D), roof and wall dimensions, and the openings you are specifying. The tool handles the ASCE 7-22 math, including velocity pressure and Components and Cladding zone pressures.'],
    ['Does it work for Florida HVHZ permits?', 'Yes. For Miami-Dade and Broward, the only two HVHZ counties, the Florida calculator applies the correct HVHZ wind speeds and flags the Notice of Acceptance (NOA) or Florida Product Approval and TAS 201/202/203 testing your products must carry for permit approval.']
  ],
  architects: [
    ['Can I run wind loads during early design?', 'Yes. The calculator gives architects preliminary ASCE 7-22 design pressures in the schematic and design-development phases, so you can size and specify windows, doors, shutters, and roof assemblies before construction documents and avoid costly product substitutions late in the project.'],
    ['What design pressures will I get for window and door specs?', 'You get Components and Cladding pressures (ASCE 7-22 Chapter 30) for each opening by zone, computed from velocity pressure qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared with Kd = 0.85 and GCp/GCpi per the standard. These are the DP values manufacturers list, so you can match products to required ratings.'],
    ['Do I need to understand ASCE 7 to use it?', 'No. The tool applies the code for you, including exposure category, Kz, Kzt, directionality, and internal pressure (GCpi plus or minus 0.18 enclosed, plus or minus 0.55 partially enclosed). You provide building geometry and location and it returns the pressures and a report you can hand to engineers or include in specs.'],
    ['Does it cover Florida and HVHZ projects?', 'Yes. For Miami-Dade and Broward, the HVHZ counties, it applies the Florida Building Code wind speeds and identifies the Notice of Acceptance (NOA) or Florida Product Approval pathway, so specified assemblies will clear HVHZ product-approval review.'],
    ['Can calculations be sealed for permit?', 'Yes. When a project needs a sealed calculation, a Florida-licensed Professional Engineer can stamp single-calculation reports for $75 (24 to 48 hours) or $150 (same day), for Florida residential and light-commercial structures up to three stories.']
  ],
  hurricane: [
    ['How are hurricane wind loads calculated under ASCE 7?', 'Hurricane wind loads use the same ASCE 7-22 procedure as all wind design: velocity pressure qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared with Kd = 0.85, where V is the mapped ultimate 3-second-gust wind speed for the site. Coastal hurricane-prone regions simply map to higher V and often Exposure C or D.'],
    ['What wind speed should coastal Florida buildings use?', 'Use the mapped basic wind speed for the exact site and risk category from the ASCE 7-22 maps as adopted by the Florida Building Code. Higher risk categories read from longer-return-period maps, from the 700-year map for Category II up to the 3,000-year map for Category IV. Never substitute a reported sustained hurricane speed.'],
    ['What is the difference between a 3-second gust and sustained wind?', 'ASCE 7 design wind speed is a 3-second gust at 33 ft in open Exposure C, while reported hurricane sustained winds average over about a minute and read lower. They are different averaging windows, so you cannot convert with a fixed ratio; always design to the mapped 3-second gust.'],
    ['Do coastal buildings need impact protection?', 'In wind-borne debris regions, ASCE 7 and the building code require glazed openings to be impact-rated or protected. In Florida HVHZ (Miami-Dade and Broward), assemblies must carry a Notice of Acceptance or Florida Product Approval with TAS 201/202/203 testing.'],
    ['Can I get a hurricane-zone calculation stamped?', 'Yes. A Florida-licensed Professional Engineer can seal coastal and hurricane-zone wind load calculations for residential and light-commercial structures up to three stories: $75 standard (24 to 48 hours) or $150 same-day rush.']
  ],
  'florida-pro': [
    ['What wind speeds does the Florida Building Code require?', 'The Florida Building Code adopts the ASCE 7-22 wind-speed maps, read by risk category for each site. For the HVHZ counties the code applies elevated values: Miami-Dade uses 175 mph and Broward 170 mph for Risk Category II, which our Florida calculator applies automatically.'],
    ['Which counties are in the HVHZ?', 'Only two: Miami-Dade and Broward. The High-Velocity Hurricane Zone requires impact-rated assemblies with a Miami-Dade Notice of Acceptance (NOA) or statewide Florida Product Approval, validated by TAS 201 (large missile), TAS 202 (uniform static air pressure), and TAS 203 (cyclic) testing.'],
    ['What is a Notice of Acceptance (NOA)?', 'A NOA is Miami-Dade County product approval confirming a window, door, shutter, or roofing assembly has passed HVHZ impact and pressure testing. Permit submittals must reference a current NOA or Florida Product Approval whose design pressures meet or exceed the ASCE 7-22 pressures your calculation produces.'],
    ['Does the calculator support FBC 2023 and Miami-Dade NOA?', 'Yes. The Florida calculator is built for the current Florida Building Code, computes ASCE 7-22 Components and Cladding and MWFRS pressures, and outputs the design pressures you match against NOA-listed product ratings for Miami-Dade, Broward, and the rest of the state.'],
    ['Can a Florida PE stamp my calculation?', 'Yes. A Florida-licensed Professional Engineer can sign and seal wind load calculations for Florida residential and light-commercial structures up to three stories: $75 for standard 24 to 48-hour turnaround or $150 for same-day rush.']
  ],
  pe: [
    ['What does the Florida PE seal service cover?', 'A Florida-licensed Professional Engineer reviews and stamps ASCE 7-22 wind load calculations for Florida residential and light-commercial structures up to three stories. The sealed report is suitable for permit submittal and includes the design pressures, coefficients, and code references reviewers require.'],
    ['How much does a PE seal cost and how long does it take?', 'A standard PE seal on a single calculation is $75 with 24 to 48-hour turnaround; same-day rush is $150. Multi-building projects of five or more calculations are quoted individually. You receive a stamped, signed PDF ready for permit submission.'],
    ['What structures can be sealed?', 'The service covers Florida residential and light-commercial buildings up to three stories, including single-family homes, townhomes, small commercial, additions, and accessory structures. It applies ASCE 7-22 wind loads, including HVHZ requirements for Miami-Dade and Broward projects.'],
    ['Is the seal valid for HVHZ permits?', 'Yes. Calculations for Miami-Dade and Broward apply the HVHZ wind speeds and reference the Notice of Acceptance (NOA) or Florida Product Approval and TAS 201/202/203 testing your products carry, so the sealed report aligns with HVHZ plan-review requirements.'],
    ['What do I get with a sealed calculation?', 'You receive a PDF showing velocity pressure (qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared, Kd = 0.85), Components and Cladding and/or MWFRS design pressures by zone, internal pressure GCpi (plus or minus 0.18 enclosed, plus or minus 0.55 partially enclosed), all code citations, and the Florida PE stamp and signature.']
  ],
  states: [
    ['Do all U.S. states require wind load calculations?', 'Most do, because nearly all adopt the International Building Code or International Residential Code, which reference ASCE 7 for wind loads. The mapped wind speed and adopted ASCE 7 edition vary by state and local amendment, but the qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared procedure is nationwide.'],
    ['Which ASCE 7 edition does my state use?', 'It depends on the building-code edition your state and jurisdiction have adopted, commonly ASCE 7-16 or ASCE 7-22. Coastal and hurricane-prone states often amend further; Florida adds the HVHZ for Miami-Dade and Broward. Check your state page for the adopted edition and wind-speed range.'],
    ['What are special wind regions?', 'Special wind regions are areas the ASCE 7 maps shade where terrain such as mountains, gorges, or channeling can locally raise wind speeds beyond the mapped value. In those areas the authority having jurisdiction may require a site-specific wind speed rather than the standard mapped value.'],
    ['Does risk category change the required wind speed?', 'Yes. Since ASCE 7-10 there is no wind importance factor; instead the risk category selects which wind-speed map you read. Risk Category II uses the 700-year map, III the 1,700-year, IV the 3,000-year, and I the 300-year, so higher categories give higher design speeds.'],
    ['Can one calculator handle every state?', 'Yes. The calculator on windloadcalc.com applies the correct ASCE 7-16/7-22 mapped wind speed for any U.S. location and risk category, then computes Components and Cladding and MWFRS pressures, so the same tool produces permit-ready loads in all 50 states.']
  ],
  pricing: [
    ['How much does a wind load calculation cost?', 'A single ASCE 7-22 wind load calculation is $25 and includes a downloadable PDF report for any U.S. location, with no subscription required. The report contains the full analysis: velocity pressure, external and internal pressure coefficients, and design pressures by zone.'],
    ['How much does a PE seal cost?', 'Adding a Florida Professional Engineer stamp to a single calculation is $75 with standard 24 to 48-hour turnaround, or $150 for same-day rush. Multi-building projects of five or more calculations (48 to 72 hours) are quoted individually, so contact us for a price.'],
    ['Is there a subscription or can I pay per calculation?', 'You can pay per calculation at $25 with no commitment, which suits occasional projects. Subscription options for unlimited access are available on windloadcalc.com for high-volume users. A free demo lets you try the calculator before purchasing.'],
    ['What is included in each calculation?', 'Each calculation includes a complete ASCE 7-22 wind load analysis: velocity pressure (qz = 0.00256 x Kz x Kzt x Kd x Ke x V squared, Kd = 0.85), external pressure coefficients (GCp), internal pressure (GCpi plus or minus 0.18 enclosed, plus or minus 0.55 partially enclosed), and design pressures by Components and Cladding zone, in a PDF report.'],
    ['Do you offer PE seals outside Florida?', 'The in-house PE seal service covers Florida residential and light-commercial structures up to three stories. For other states the calculator still produces ASCE 7-22 permit-ready pressures, but sealing would require a PE licensed in that state.']
  ]
};

// ---- HowTo content ----------------------------------------------------------
const HOWTO = {
  contractors: {
    name: 'How to get a permit-ready wind load report',
    description: 'Produce an ASCE 7-22 wind load report that passes permit review, without an engineering degree.',
    steps: [
      ['Enter your project location', 'Provide the project address so the calculator reads the correct mapped basic wind speed for the site and risk category.'],
      ['Set risk and exposure categories', 'Select the building risk category and the exposure category (B, C, or D) for the surrounding terrain.'],
      ['Specify openings and run the calculation', 'Enter wall and roof dimensions and the windows, doors, or shutters you are installing, then run the ASCE 7-22 Components and Cladding analysis.'],
      ['Download the report (add a PE seal if required)', 'Download the PDF report at $25 per calculation. If the jurisdiction requires a sealed calculation, add a Florida PE stamp for $75 standard or $150 same-day.']
    ]
  },
  pe: {
    name: 'How to get your wind load calculations PE-stamped in Florida',
    description: 'Generate an ASCE 7-22 wind load calculation and have it sealed by a Florida-licensed Professional Engineer for permit submittal.',
    steps: [
      ['Run your ASCE 7-22 wind load calculation', 'Enter the project location, risk category, exposure category, and openings in the calculator to generate design pressures and a PDF report.'],
      ['Submit the report for PE review', 'Send the completed calculation and project details to the Florida-licensed Professional Engineer for review.'],
      ['Choose your turnaround', 'Select standard service at $75 (24 to 48 hours) or same-day rush at $150.'],
      ['Receive your sealed report', 'Get a stamped, signed PDF wind load report ready for permit submittal.']
    ]
  }
};

// ---- per-page config --------------------------------------------------------
// kind: 'webpage' | 'about' | 'service' | 'collection'
// crumb: array of [name, urlSuffix] AFTER Home (Home is auto-prepended)
// NOTE: /about, /pe, /states, /pricing are intentionally 302-redirected to the
// sister sites in vercel.json (content consolidated there), so their HTML is never
// served at a windload.co URL. They are deliberately excluded — injecting head
// metadata into a page that always redirects has no effect. The FAQ/HowTo data for
// those slugs is retained above but unused unless a slug is re-added here.
const PAGES = {
  'index':             { kind: 'webpage', software: true, crumb: [] },
  'architects':        { kind: 'service', serviceName: 'Wind Load Calculations for Architects', crumb: [['For Architects', '/architects']] },
  'contractors':       { kind: 'service', serviceName: 'Wind Load Calculations for Contractors', crumb: [['For Contractors', '/contractors']] },
  'engineers':         { kind: 'service', serviceName: 'Wind Load Calculations for Engineers', crumb: [['For Engineers', '/engineers']] },
  'hurricane':         { kind: 'service', serviceName: 'Hurricane & Coastal Wind Load Calculations', crumb: [['Hurricane Wind Loads', '/hurricane']] },
  'florida-pro':       { kind: 'service', serviceName: 'Florida Wind Load Calculations (HVHZ / FBC)', areaState: true, crumb: [['Florida Wind Loads', '/florida-pro']] },
  'compare':           { kind: 'webpage', crumb: [['Compare', '/compare']] },
  'vs-buildingsguide': { kind: 'webpage', crumb: [['Compare', '/compare'], ['vs BuildingsGuide', '/vs-buildingsguide']] },
  'vs-omni':           { kind: 'webpage', crumb: [['Compare', '/compare'], ['vs Omni Calculator', '/vs-omni']] }
};

// ---- helpers ----------------------------------------------------------------
function read(file) { return fs.readFileSync(file, 'utf8'); }
function attr(html, re) { const m = html.match(re); return m ? m[1].trim() : ''; }
function decode(s) { return s.replace(/&amp;/g, '&'); }

// Legacy single-type JSON-LD blocks now superseded by our @graph. Removed so the
// page carries exactly one canonical Organization / BreadcrumbList / page node.
const LEGACY_TYPES = new Set([
  'ProfessionalService', 'LocalBusiness', 'Organization', 'WebSite',
  'BreadcrumbList', 'WebPage', 'AboutPage', 'CollectionPage'
]);
function stripLegacyLd(html) {
  // remove ld+json scripts (with an optional immediately-preceding HTML comment)
  // whose top-level @type is a legacy type we now own. Never touches @graph blocks.
  return html.replace(
    /(?:[ \t]*<!--[^>]*?(?:Schema|Breadcrumb|LocalBusiness|Organization)[^>]*?-->\s*)?<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/gi,
    (full, body) => {
      try {
        const j = JSON.parse(body);
        if (j && !j['@graph'] && LEGACY_TYPES.has(j['@type'])) return '';
      } catch (e) { /* keep unparseable as-is */ }
      return full;
    }
  );
}

function buildGraph(slug, cfg, title, desc, canon) {
  const graph = [ORG, WEBSITE];

  // BreadcrumbList
  const crumbs = [['Home', SITE + '/']].concat(cfg.crumb.map(([n, s]) => [n, SITE + s]));
  graph.push({
    '@type': 'BreadcrumbList',
    '@id': canon + '#breadcrumb',
    itemListElement: crumbs.map(([name, item], i) => ({
      '@type': 'ListItem', position: i + 1, name, item
    }))
  });

  // Primary entity
  const pageTypeMap = { webpage: 'WebPage', about: 'AboutPage', service: 'WebPage', collection: 'CollectionPage' };
  const page = {
    '@type': pageTypeMap[cfg.kind] || 'WebPage',
    '@id': canon + '#webpage',
    url: canon,
    name: title,
    description: desc,
    isPartOf: siteRef,
    about: orgRef,
    breadcrumb: { '@id': canon + '#breadcrumb' },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE },
    inLanguage: 'en-US'
  };
  if (FAQ[slug]) page.mainEntity = { '@id': canon + '#faq' };
  graph.push(page);

  // Service node (with optional offers)
  if (cfg.kind === 'service') {
    const svc = {
      '@type': 'Service',
      '@id': canon + '#service',
      name: cfg.serviceName,
      serviceType: 'ASCE 7 wind load calculation and reports',
      description: desc,
      provider: orgRef,
      areaServed: cfg.areaState
        ? { '@type': 'State', name: 'Florida' }
        : { '@type': 'Country', name: 'United States' }
    };
    if (cfg.offers) svc.offers = cfg.offers.map(([n, p]) => ({
      '@type': 'Offer', name: n, price: p, priceCurrency: 'USD', url: SHOP,
      availability: 'https://schema.org/InStock'
    }));
    graph.push(svc);
  } else if (cfg.offers) {
    // non-service page with offers (pricing) -> attach as OfferCatalog-style Offers on an Offer list
    cfg.offers.forEach(([n, p], i) => graph.push({
      '@type': 'Offer', '@id': canon + '#offer-' + (i + 1), name: n,
      price: p, priceCurrency: 'USD', url: SHOP, availability: 'https://schema.org/InStock',
      offeredBy: orgRef
    }));
  }

  // SoftwareApplication (home promotes the calculator product)
  if (cfg.software) {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': 'https://windloadcalc.com/#software',
      name: 'WindLoadCalc',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SHOP,
      description: 'ASCE 7-16/7-22 Components and Cladding and MWFRS wind load calculator with PE-stampable PDF reports.',
      publisher: orgRef,
      offers: { '@type': 'Offer', price: '25', priceCurrency: 'USD', url: SHOP, availability: 'https://schema.org/InStock' }
    });
  }

  // FAQPage
  if (FAQ[slug]) {
    graph.push({
      '@type': 'FAQPage',
      '@id': canon + '#faq',
      mainEntity: FAQ[slug].map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    });
  }

  // HowTo
  if (HOWTO[slug]) {
    const h = HOWTO[slug];
    graph.push({
      '@type': 'HowTo',
      '@id': canon + '#howto',
      name: h.name,
      description: h.description,
      step: h.steps.map(([name, text], i) => ({
        '@type': 'HowToStep', position: i + 1, name, text, url: canon + '#step-' + (i + 1)
      }))
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function buildBlock(slug, cfg, html) {
  const title = decode(attr(html, /<title>([\s\S]*?)<\/title>/i));
  const desc = decode(attr(html, /name="description"\s+content="([^"]*)"/i));
  let canon = attr(html, /rel="canonical"\s+href="([^"]*)"/i) || (SITE + '/' + (slug === 'index' ? '' : slug));
  canon = canon.replace(/\/$/, slug === 'index' ? '/' : ''); // keep root slash, strip trailing on others

  let stripped = html.replace(new RegExp(MARK_OPEN + '[\\s\\S]*?' + MARK_CLOSE, 'g'), '');
  stripped = stripLegacyLd(stripped);
  // remove any pre-existing twitter card meta so we emit exactly one set (with image)
  stripped = stripped.replace(/[ \t]*<meta\s+name="twitter:[^>]*>\s*/gi, '');
  const hasOgImage = /property="og:image"/i.test(stripped);

  const lines = [MARK_OPEN];
  if (!hasOgImage) lines.push('<meta property="og:image" content="' + OG_IMAGE + '">');
  lines.push('<meta name="twitter:card" content="summary_large_image">');
  lines.push('<meta name="twitter:title" content="' + escAttr(title) + '">');
  lines.push('<meta name="twitter:description" content="' + escAttr(desc) + '">');
  lines.push('<meta name="twitter:image" content="' + OG_IMAGE + '">');
  lines.push('<script type="application/ld+json">');
  lines.push(JSON.stringify(buildGraph(slug, cfg, title, desc, canon)));
  lines.push('</script>');
  lines.push(MARK_CLOSE);
  return { block: lines.join('\n'), stripped, title, canon };
}

function escAttr(s) { return s.replace(/"/g, '&quot;'); }

function processPage(slug) {
  const file = path.join(ROOT, slug + '.html');
  if (!fs.existsSync(file)) { console.log('SKIP (missing): ' + slug); return; }
  const cfg = PAGES[slug];
  const html = read(file);
  const { block, stripped, canon } = buildBlock(slug, cfg, html);
  if (!/<\/head>/i.test(stripped)) { console.log('SKIP (no </head>): ' + slug); return; }
  const out = stripped.replace(/<\/head>/i, block + '\n</head>');
  fs.writeFileSync(file, out);
  // validate JSON-LD we just wrote
  JSON.parse(buildGraphJson(block));
  const extras = [FAQ[slug] ? 'FAQ' : '', HOWTO[slug] ? 'HowTo' : '', cfg.software ? 'SoftwareApp' : '', cfg.offers ? 'Offers' : '']
    .filter(Boolean).join('+') || '-';
  console.log('OK  ' + slug.padEnd(20) + ' canon=' + canon.padEnd(40) + ' [' + extras + ']');
}

function buildGraphJson(block) {
  const m = block.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/);
  return m[1];
}

const arg = process.argv[2];
let slugs;
if (arg) {
  slugs = [arg.replace(/\.html$/, '')];
} else {
  slugs = Object.keys(PAGES);
}
let n = 0;
for (const s of slugs) { if (PAGES[s]) { processPage(s); n++; } else { console.log('SKIP (not configured): ' + s); } }
console.log('\nDone. ' + n + ' page(s) processed.');
