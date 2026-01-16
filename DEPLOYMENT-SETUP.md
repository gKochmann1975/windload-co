# WindLoad.co Campaign Deployment Setup

This document outlines how to set up the automated campaign page deployment pipeline.

## Overview

The system deploys campaign pages from `staged-pages/` to `florida/` (live) automatically:
- **Frequency:** 14 times per day (every 1.5 hours)
- **Pages per deploy:** 1 page
- **Daily total:** 14 pages/day
- **Goal:** 500 pages

## Required Secrets

You need to configure these secrets in your GitHub repository settings:

### 1. PAT_TOKEN (Required)

A GitHub Personal Access Token for git push operations.

**Steps to create:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure:
   - **Token name:** `WindLoad Auto-Deploy`
   - **Expiration:** 1 year (or custom)
   - **Repository access:** Only select repositories → `gKochmann1975/windload-co`
   - **Permissions:**
     - Contents: Read and write
     - Metadata: Read-only
     - Workflows: Read and write (if modifying workflows)
4. Generate token and copy it
5. Add to repository secrets:
   - Go to: `https://github.com/gKochmann1975/windload-co/settings/secrets/actions`
   - Click "New repository secret"
   - Name: `PAT_TOKEN`
   - Value: (paste your token)

### 2. VERCEL_DEPLOY_HOOK (Optional)

If using Vercel for hosting, create a deploy hook for automatic deployments.

**Steps to create:**
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Scroll to "Deploy Hooks"
3. Create a new hook:
   - Name: `GitHub Actions Deploy`
   - Branch: `main`
4. Copy the hook URL
5. Add to repository secrets:
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: (paste the hook URL)

## Repository Structure

```
windload-co/
├── .github/
│   └── workflows/
│       └── daily-deploy.yml      # Auto-deploy workflow
│
├── scripts/
│   └── deploy-daily-pages.js     # Deployment script
│
├── staged-pages/                  # Pages queued for deployment
│   ├── miami-dade/
│   │   ├── window-replacement.html
│   │   └── hurricane-shutters.html
│   └── [category]/
│       └── [page].html
│
├── florida/                       # Live deployed pages
│   ├── miami-dade/
│   │   ├── index.html
│   │   ├── window-replacement.html
│   │   └── hurricane-shutters.html
│   └── [category]/
│       └── [page].html
│
├── deployed-pages/                # Archive of deployed pages
│   └── [category]/
│       └── [page-name]/
│           ├── [page].html
│           └── deployment-info.json
│
├── deployment-log.json            # Deployment tracking
└── campaign-admin.html            # Admin dashboard
```

## Manual Commands

### Deploy pages manually:

```bash
# Deploy 1 page
node scripts/deploy-daily-pages.js

# Deploy 5 pages
node scripts/deploy-daily-pages.js --count 5

# Dry run (preview only)
node scripts/deploy-daily-pages.js --dry-run

# Dry run with count
node scripts/deploy-daily-pages.js --count 5 --dry-run
```

### Trigger GitHub Action manually:

1. Go to: `https://github.com/gKochmann1975/windload-co/actions`
2. Select "Daily Campaign Deploy"
3. Click "Run workflow"
4. Configure:
   - Page count (default: 1)
   - Dry run (default: false)
5. Click "Run workflow"

## Monitoring

### Campaign Admin Dashboard

Access at: `https://windload.co/campaign-admin.html`
- Default password: `windload2026`
- Shows deployment progress, staged pages, live pages
- Categories by location, audience, and product type

### GitHub Actions

Monitor deployments at:
`https://github.com/gKochmann1975/windload-co/actions`

### Deployment Log

Check `deployment-log.json` for:
- All deployments with timestamps
- Staged pages inventory
- Goal progress

## Hosting Options

### Option 1: GitHub Pages (Simplest)

1. Go to repository Settings → Pages
2. Source: Deploy from branch → `main` → `/ (root)`
3. Custom domain: `windload.co`
4. Enforce HTTPS: Yes

Git push automatically triggers deployment.

### Option 2: Vercel

1. Import repository in Vercel
2. Framework: Other (static)
3. Build command: (leave empty)
4. Output directory: `.`
5. Add deploy hook (see VERCEL_DEPLOY_HOOK above)

### Option 3: Netlify

1. Import repository in Netlify
2. Build command: (leave empty)
3. Publish directory: `.`
4. Add build hook for GitHub Actions

## Troubleshooting

### Workflow not running

- Check if GitHub Actions is enabled for the repository
- Verify PAT_TOKEN has correct permissions
- Check workflow syntax at: `https://github.com/gKochmann1975/windload-co/actions`

### Pages not deploying

- Run dry-run to check: `node scripts/deploy-daily-pages.js --dry-run`
- Verify staged-pages directory has .html files
- Check deployment-log.json for errors

### Git push failing

- Verify PAT_TOKEN is valid and not expired
- Check token has write access to repository
- Ensure branch protection rules allow bot pushes

## Page Generation

To generate new campaign pages:

1. Use the design system in `marketing-strategy/design-system.md`
2. Follow the template in existing pages (window-replacement.html)
3. Save to `staged-pages/[category]/[page-name].html`
4. Pages will auto-deploy at next scheduled run

### Categories

**By Location:**
- `miami-dade` - HVHZ requirements
- `broward` - HVHZ requirements
- `palm-beach` - Standard requirements
- `monroe` - Keys special requirements

**By Product:**
- Windows, Shutters, Doors, Garage Doors, Roofing

**By Audience:**
- Contractors, Architects, Engineers, Homeowners
