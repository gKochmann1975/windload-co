# SEO Indexing Playbook

How to ensure Google discovers and indexes all pages across our sites. Follow this playbook for any new website or campaign.

## Essential Files

Every site needs these two files at the root:

### 1. robots.txt
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### 2. sitemap.xml
- List every page you want indexed
- Use canonical/clean URLs (no `.html` if using Vercel `cleanUrls: true`)
- Keep `lastmod` dates current — stale dates signal abandoned content
- Do NOT include pages that redirect to other domains
- Do NOT include pages with canonical tags pointing to other sites

## Google Search Console Setup

1. Add the domain as a **domain property** (covers all subdomains + http/https)
2. Submit the sitemap: Indexing → Sitemaps → enter full URL (e.g. `https://yourdomain.com/sitemap.xml`)
3. Check Pages → "Why pages aren't indexed" for issues

### Common Issues (and what to ignore)
| Issue | Action |
|-------|--------|
| Page with redirect (http→https, www→non-www) | **Ignore** — normal behavior |
| Not found 404 (spam/random URLs) | Click VALIDATE FIX, ignore |
| Alternate page with proper canonical tag (www→non-www) | **Ignore** — correct behavior |
| Page with redirect (your pages redirecting to other domains) | Remove from sitemap |
| Discovered - currently not indexed | Wait, or improve content quality |

## Vercel + cleanUrls Gotcha

When `cleanUrls: true` is set in `vercel.json`:
- Vercel serves `about.html` at `/about`
- Visiting `/about.html` → 301 redirect to `/about`
- If `vercel.json` also has a redirect for `/about` → that redirect wins over the file
- **Result**: the HTML file can never be served — don't include it in the sitemap

## Auto-Updating Sitemaps for Campaign Pages

For sites with programmatic/campaign pages that are deployed incrementally (like our Florida county pages), the sitemap MUST be regenerated on each deployment.

### How we implemented this on windload.co

The deploy script (`scripts/deploy-daily-pages.js`) automatically:
1. Deploys pages from `staged-pages/` to `florida/` (live)
2. Scans the entire `florida/` directory for all `.html` files
3. Rebuilds `sitemap.xml` with all main pages + all campaign pages
4. Includes `sitemap.xml` in the git commit
5. Vercel auto-deploys, Google picks up changes on next crawl

### Key implementation details
- The `regenerateSitemap()` function scans the live directory dynamically — no manual URL list to maintain
- `index.html` files are excluded (they typically have canonicals pointing elsewhere)
- Main/static pages are defined in an array at the top of the function for easy editing
- Today's date is used for all `lastmod` values

### Replicating for a new site
1. Add `robots.txt` with sitemap reference
2. Create initial `sitemap.xml` with all known pages
3. If the site has incremental deployments, add a `regenerateSitemap()` function to the deploy script that:
   - Scans the live pages directory
   - Combines with static/main pages
   - Writes `sitemap.xml`
   - Includes it in the git commit
4. Submit sitemap in Google Search Console

## DNS Recommendations

Vercel may show "DNS Change Recommended" on domain settings. This typically means switching from A records to CNAME for better edge routing. Worth doing for performance but not critical for indexing.
