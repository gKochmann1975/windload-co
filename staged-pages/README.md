# WindLoad.co Staged Pages Bank

This directory contains campaign pages queued for deployment to the live site.

## Current Inventory

| Category | Pages | Status |
|----------|-------|--------|
| miami-dade | 0 | Need more pages |
| broward | 0 | Pending |
| palm-beach | 0 | Pending |
| monroe | 0 | Pending |

## Pages Ready for Deployment

*No pages currently staged. Generate new pages to fill the pipeline.*

## Already Deployed

### Miami-Dade County
1. `window-replacement.html` - Window replacement wind load requirements (LIVE)
2. `hurricane-shutters.html` - Hurricane shutter selection guide (LIVE)

## Deployment Process

Once the GitHub Actions pipeline is configured:

1. Pages in this folder will be automatically deployed at scheduled intervals
2. After deployment, pages move to `deployed-pages/` archive
3. Deployment is logged in `deployment-log.json`

## Manual Deployment

Until automation is set up, manually copy pages to live location:

```bash
# Copy a page to live
cp staged-pages/miami-dade/window-replacement.html florida/miami-dade/

# Then commit and push
git add florida/miami-dade/window-replacement.html
git commit -m "Deploy: miami-dade/window-replacement campaign page"
git push
```

## Page Generation

New pages should follow the design system in `marketing-strategy/design-system.md`

### Planned Categories
- `/florida/miami-dade/` - HVHZ requirements (highest priority)
- `/florida/broward/` - HVHZ requirements
- `/florida/palm-beach/` - Standard requirements
- `/florida/monroe/` - Keys special requirements

### Page Types to Generate
- Window replacement
- Hurricane shutters
- Garage doors
- Impact doors
- Sliding glass doors
- Storefront windows
- Commercial glazing
- Roofing (metal, shingle, tile)
- NOA product guides
