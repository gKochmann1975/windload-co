# Deploying windload.co to Vercel

## Overview

This guide will walk you through deploying **windload.co** (your short URL redirect service) to Vercel.

---

## What You Need

### Required Services
1. **Vercel Account** (Free tier is sufficient)
   - Same account you use for windload.solutions
   - Sign up at: https://vercel.com/signup

2. **GoDaddy Account** (You already have this)
   - Domain registered: `windload.co`
   - You'll configure DNS to point to Vercel

### Optional Services
- **Git Repository** (Recommended)
  - GitHub, GitLab, or Bitbucket

---

## Files in This Project

**Current Location:** `C:\windload-co\`

```
windload-co/
├── index.html          # Landing page with decision buttons
├── vercel.json         # 47 redirect rules
├── README.md           # Documentation
└── docs/
    └── DEPLOYMENT_GUIDE.md  # This file
```

**What Each File Does:**

- **index.html** - Landing page when someone visits `windload.co` directly
- **vercel.json** - Configuration file with all redirect rules
  - `/florida` → Florida requirements page
  - `/calc` → WindLoadCalc.com
  - `/topo` → Topography guide
  - (44+ more redirects)

---

## Step-by-Step Deployment

### Step 1: Prepare Files

**Remove these files before deploying:**
- `docs/` folder (not needed in production)

Everything else should be deployed.

---

### Step 2: Set Up Git Repository (Recommended)

#### Option A: GitHub Desktop (Easiest)

1. **Download GitHub Desktop**
   - https://desktop.github.com/

2. **Create Repository**
   - Open GitHub Desktop
   - File → New Repository
   - Name: `windload-co`
   - Local Path: `C:\windload-co`
   - Click "Create Repository"

3. **Publish to GitHub**
   - Click "Publish repository"
   - Choose "Private" (recommended)
   - Click "Publish repository"

#### Option B: Git Command Line

```bash
cd C:\windload-co

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - windload.co redirect service"

# Create GitHub repo at github.com/new
# Then add remote and push
git remote add origin https://github.com/YOUR-USERNAME/windload-co.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Project"
   - Select `windload-co` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name:** `windload-co`
   - **Framework Preset:** Other (static site)
   - **Root Directory:** `./`
   - **Build Command:** Leave empty
   - **Output Directory:** `./`
   - Click "Deploy"

4. **Deployment**
   - Vercel will deploy in ~30 seconds
   - You'll get a URL like: `windload-co-xyz.vercel.app`
   - **Test redirects immediately:**
     - Visit: `windload-co-xyz.vercel.app/florida`
     - Should redirect to Florida requirements page

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Navigate to project
cd C:\windload-co

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: windload-co
# - Directory: ./
# - Override settings: No

# Test the deployment URL
```

---

### Step 4: Add Custom Domain (windload.co)

#### In Vercel Dashboard:

1. **Go to Project Settings**
   - Open `windload-co` project
   - Click "Settings" → "Domains"

2. **Add Domains**
   - Add: `windload.co`
   - Add: `www.windload.co`
   - Click "Add" for each

3. **Copy DNS Records**
   - Vercel shows you the DNS settings needed:

   **For apex domain (windload.co):**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`

   **For www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

---

### Step 5: Configure DNS in GoDaddy

1. **Login to GoDaddy**
   - Go to: https://dcc.godaddy.com/domains
   - Find `windload.co`
   - Click "DNS" or "Manage DNS"

2. **Add/Update A Record**
   - Type: `A`
   - Host: `@`
   - Points to: `76.76.21.21`
   - TTL: `600` seconds
   - Save

3. **Add/Update CNAME Record**
   - Type: `CNAME`
   - Host: `www`
   - Points to: `cname.vercel-dns.com`
   - TTL: `1 Hour`
   - Save

4. **Remove Old Records**
   - Delete any old A records
   - Keep only the new Vercel records

5. **Wait for Propagation**
   - Usually 10-30 minutes
   - Can take up to 48 hours
   - Check: https://dnschecker.org

---

### Step 6: Test All Redirects

Once DNS has propagated, test your short URLs:

#### State Shortcuts
- ✅ `windload.co/florida` → Florida requirements
- ✅ `windload.co/fl` → Florida requirements
- ✅ `windload.co/texas` → Texas requirements
- ✅ `windload.co/tx` → Texas requirements
- ✅ `windload.co/california` → California requirements
- ✅ `windload.co/ca` → California requirements

#### Tool Shortcuts
- ✅ `windload.co/calc` → WindLoadCalc.com
- ✅ `windload.co/calculator` → WindLoadCalc.com
- ✅ `windload.co/free` → Free calculator demo
- ✅ `windload.co/excel` → Excel calculator

#### Topic Shortcuts
- ✅ `windload.co/topo` → Topography guide
- ✅ `windload.co/asce7` → ASCE 7 guide
- ✅ `windload.co/cc` → Components & Cladding
- ✅ `windload.co/mwfrs` → MWFRS guide
- ✅ `windload.co/windows` → Window selection

#### Resource Shortcuts
- ✅ `windload.co/videos` → Instructional videos
- ✅ `windload.co/contact` → Contact form
- ✅ `windload.co/pe` → PE services
- ✅ `windload.co/velocity` → Wind speed by zip

**Full list:** See [README.md](../README.md) for all 47 redirects

---

## Landing Page

When users visit `windload.co` directly (without a path), they see:

**Landing Page Features:**
- Clean, professional design
- Two main decision buttons:
  - 📚 Educational Resources → windload.solutions
  - 🧮 Wind Load Calculators → windloadcalc.com
- Quick links section with 8 popular shortcuts
- Wind-themed branding (💨)

**Use Case:**
- Business cards: "Visit windload.co"
- Social media bios
- Email signatures
- Print materials

---

## How Redirects Work

### vercel.json Configuration

The `vercel.json` file contains all redirect rules:

```json
{
  "redirects": [
    {
      "source": "/florida",
      "destination": "https://windload.solutions/states/florida-wind-load-requirements.html",
      "permanent": false
    }
  ]
}
```

**Key Points:**
- `"permanent": false` = 302 redirect (temporary)
- Allows changing destinations later
- Enables click tracking/analytics
- Better for A/B testing

---

## Adding New Redirects

### Method 1: Edit vercel.json

1. **Edit the file locally:**

```json
{
  "source": "/new-shortcut",
  "destination": "https://windload.solutions/new-page.html",
  "permanent": false
}
```

2. **Commit and push:**

```bash
git add vercel.json
git commit -m "Add new redirect for /new-shortcut"
git push
```

3. **Automatic deployment:**
   - Vercel auto-deploys in ~30 seconds
   - New redirect immediately active

### Method 2: Vercel Dashboard

1. Go to Project Settings → Redirects
2. Add new redirect rule
3. Save (takes effect immediately)

---

## Marketing Use Cases

### Print Materials
- **Business Cards:** "Visit windload.co/contact"
- **Brochures:** "Free calculator at windload.co/free"
- **Flyers:** "windload.co/florida"

### Digital Marketing
- **Social Media Posts:** windload.co/calc
- **Email Campaigns:** windload.co/videos
- **YouTube Descriptions:** windload.co/topo
- **LinkedIn:** windload.co/about

### Verbal Communication
- "Just go to windload dot co slash florida"
- Much easier than saying full URLs
- Memorable and professional

### QR Codes
Generate QR codes for:
- `windload.co/free` - On marketing materials
- `windload.co/contact` - On business cards
- `windload.co/calc` - In presentations

---

## Analytics & Tracking

### Vercel Analytics (Built-in)

1. **Enable in Dashboard:**
   - Go to windload-co project
   - Click "Analytics" tab
   - Click "Enable Analytics"
   - Free for up to 100k events/month

2. **What You Can Track:**
   - Most popular redirects
   - Geographic location of visitors
   - Referrer sources
   - Device types (mobile/desktop)

### Google Analytics (Optional)

If you want more detailed tracking:

1. **Add GA4 Code to index.html:**

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

2. **Track Redirects:**
   - Won't capture redirect clicks (they happen server-side)
   - Only tracks landing page visits
   - Use Vercel Analytics for redirect tracking

---

## Costs

### Vercel
- **Free Tier:** Perfect for this use case
- **Bandwidth:** 100GB/month (more than enough)
- **No credit card required**

### GoDaddy
- **Domain Registration:** ~$15-20/year for windload.co
- **No hosting needed** - Vercel handles it all

**Total Cost:** $15-20/year (domain only)

---

## Maintenance

### Update Redirects
- Edit `vercel.json` locally
- Push to GitHub
- Auto-deploys in 30 seconds

### Change Landing Page
- Edit `index.html`
- Push to GitHub
- Auto-deploys immediately

### Monitor Usage
- Check Vercel Analytics dashboard
- See which shortcuts are most popular
- Adjust marketing based on data

---

## Troubleshooting

### Redirect Not Working

**Problem:** Short URL shows 404 or doesn't redirect

**Solution:**
1. Check `vercel.json` syntax (must be valid JSON)
2. Verify source path starts with `/`
3. Check destination URL is complete (includes `https://`)
4. Re-deploy: `vercel --prod`

### Landing Page Not Loading

**Problem:** `windload.co` shows error

**Solution:**
1. Verify `index.html` exists in root
2. Check browser console for errors
3. Clear browser cache
4. Wait for DNS propagation

### SSL Certificate Issues

**Problem:** "Not Secure" warning

**Solution:**
- Wait 24 hours for auto-provisioning
- Refresh SSL in Vercel Dashboard
- Check domain is properly verified

---

## Updating in the Future

### Via GitHub (Automatic)

1. Make changes to files locally
2. Commit and push to GitHub
3. Vercel auto-deploys in 30 seconds

### Via Vercel CLI

```bash
cd C:\windload-co

# Make changes

# Deploy
vercel --prod
```

---

## Post-Deployment Checklist

- [ ] `windload.co` loads landing page
- [ ] Test 5-10 random redirects
- [ ] Verify SSL (green padlock)
- [ ] Test on mobile device
- [ ] Enable Vercel Analytics
- [ ] Update marketing materials with short URLs
- [ ] Add QR codes to business cards
- [ ] Share short URLs on social media

---

## Need Help?

### Resources
- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord

### Support
- **Vercel Support:** https://vercel.com/support
- **GoDaddy Support:** 1-480-505-8877

---

## Summary

1. ✅ Push code to GitHub
2. ✅ Connect GitHub to Vercel
3. ✅ Deploy to Vercel
4. ✅ Add custom domain
5. ✅ Update DNS in GoDaddy
6. ✅ Wait for DNS propagation
7. ✅ Test all redirects
8. ✅ Enable analytics
9. ✅ Start using short URLs in marketing

**Total Time:** 20-30 minutes (plus DNS wait)

**Benefits:**
- Memorable, short URLs for marketing
- Easy to update redirects
- Free hosting on Vercel
- Built-in analytics
- Professional branded links

---

**Built with Claude Code** - Short URL redirect service for Wind Load Solutions
