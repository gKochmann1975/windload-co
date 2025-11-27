# windload.co

> Short URL redirect service and landing page for Wind Load Solutions properties

## Overview

windload.co serves as a branded short link service connecting users to:
- **windload.solutions** - Educational resources, state requirements, guides
- **windloadcalc.com** - ASCE 7 calculator software and Building Intelligence Platform

## Deployment

This site is deployed on Vercel:

```bash
cd C:\windload-co
vercel
```

## URL Structure

### States (10 states with certification requirements)
- `/florida` or `/fl` → Florida requirements
- `/texas` or `/tx` → Texas requirements
- `/california` or `/ca` → California requirements
- `/louisiana` or `/la` → Louisiana requirements
- `/north-carolina` or `/nc` → North Carolina requirements
- `/south-carolina` or `/sc` → South Carolina requirements
- `/hawaii` or `/hi` → Hawaii requirements
- `/new-york` or `/ny` → New York requirements
- `/virginia` or `/va` → Virginia requirements
- `/georgia` or `/ga` → Georgia requirements

### Tools & Calculators
- `/calc` or `/calculator` → windloadcalc.com
- `/free` or `/demo` → Free calculator demo
- `/excel` → Excel calculator download
- `/bip` → Building Intelligence Platform
- `/pricing` → Pricing page

### Topics & Guides
- `/asce7` or `/asce-7` → ASCE 7 calculator info
- `/topo` or `/topography` or `/kzt` → Topographic effects guide
- `/cc` or `/cladding` → Components & Cladding
- `/mwfrs` → MWFRS guide
- `/windows` → Window selection guide
- `/velocity` or `/zip` → Wind speed by zip code

### Resources
- `/videos` → Instructional videos
- `/states` → State requirements index
- `/pe` or `/engineer` → PE sign & seal services
- `/contact` or `/quote` → Contact form
- `/faq` → Frequently asked questions
- `/about` → About Wind Load Solutions

## Files

- `index.html` - Landing page with quick decision buttons
- `vercel.json` - Redirect configuration (47 redirects)
- `README.md` - This file

## Marketing Use Cases

**Print Materials:**
- Business cards: "Visit windload.co/contact"
- Brochures: "Free calculator at windload.co/free"

**Digital Marketing:**
- Social media: windload.co/florida
- Email campaigns: windload.co/calc
- YouTube descriptions: windload.co/videos

**Verbal Communication:**
- "Just go to windload dot co slash florida"
- Much easier than full URLs

## Analytics

All redirects use 302 (temporary) redirects to allow:
- URL destination changes without breaking links
- Click tracking and analytics
- A/B testing different landing pages

## Maintenance

To add new redirects, edit `vercel.json` and redeploy:

```json
{
  "source": "/new-shortcut",
  "destination": "https://windload.solutions/page.html",
  "permanent": false
}
```

---

**Built with Claude Code** - AI-powered short URL service
