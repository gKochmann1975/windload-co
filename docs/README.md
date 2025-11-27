# windload.co - Deployment Documentation

## 📚 Documentation Index

This folder contains everything you need to deploy your windload.co short URL redirect service to Vercel.

---

## Start Here

### 🚀 [QUICK_START.md](QUICK_START.md)
**Fast deployment guide - Get live in 20 minutes!**

- 4-step deployment
- Quick reference for redirects
- Testing checklist
- Perfect for getting started fast

### 📖 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
**Complete guide with all details**

- Step-by-step instructions
- How redirects work
- Adding new redirects
- Marketing use cases
- Analytics setup
- Troubleshooting

---

## Quick Reference

### What You're Deploying
- **Site:** windload.co
- **Purpose:** Short URL redirect service
- **Files:**
  - `index.html` - Landing page
  - `vercel.json` - 47 redirect rules
- **Size:** < 50KB total

### What It Does
- **47 smart redirects** for marketing
- **Landing page** when visited directly
- **Professional branded links** for all content

### Examples
- `windload.co/florida` → Florida wind load requirements
- `windload.co/calc` → WindLoadCalc.com
- `windload.co/free` → Free calculator demo
- `windload.co/topo` → Topography guide

---

## Total Cost

**Hosting:** $0 (FREE on Vercel)
**Domain:** ~$15-20/year (GoDaddy)
**Total:** ~$1.25/month

---

## Deployment Time

- **Setup:** 20 minutes
- **DNS wait:** 10-30 minutes
- **Total:** ~30-50 minutes

---

## Key Features

### Landing Page
When someone visits `windload.co` directly:
- Clean, professional design
- Two decision buttons:
  - 📚 Educational Resources → windload.solutions
  - 🧮 Calculators → windloadcalc.com
- 8 quick link shortcuts
- Wind-themed branding

### 47 Smart Redirects

**States (10 states with certification):**
- /florida, /fl → Florida requirements
- /texas, /tx → Texas requirements
- /california, /ca → California requirements
- (And 7 more states...)

**Tools & Calculators:**
- /calc, /calculator → windloadcalc.com
- /free, /demo → Free demo
- /excel → Excel calculator
- /bip → Building Intelligence Platform

**Topics & Guides:**
- /topo, /topography, /kzt → Topography guide
- /asce7, /asce-7 → ASCE 7 calculator
- /cc, /cladding → Components & Cladding
- /mwfrs → MWFRS guide

**Resources:**
- /videos → Instructional videos
- /contact, /quote → Contact form
- /pe, /engineer → PE services
- /faq → FAQ page

---

## Marketing Use Cases

### Print Materials
- **Business Cards:** "windload.co/contact"
- **Brochures:** "windload.co/free"
- **Flyers:** "windload.co/florida"

### Digital Marketing
- **Social Media:** windload.co/calc
- **Email:** windload.co/videos
- **YouTube:** windload.co/topo

### Verbal Communication
- "Just go to windload dot co slash florida"
- Much easier than full URLs!

### QR Codes
- Generate for: /free, /contact, /calc
- Use on marketing materials

---

## Files in This Folder

```
docs/
├── README.md              # This file
├── QUICK_START.md        # Fast 20-min deploy
└── DEPLOYMENT_GUIDE.md   # Complete guide
```

---

## After Deployment

### Test Your Redirects
Visit these to verify everything works:
- windload.co/florida
- windload.co/calc
- windload.co/free
- windload.co/topo
- windload.co/contact

### Enable Analytics
- Vercel Dashboard → Analytics → Enable
- Track which shortcuts are most popular
- See geographic distribution
- Monitor traffic sources

### Start Using Short URLs
Update your marketing materials:
- Business cards
- Email signatures
- Social media bios
- Print brochures
- Video descriptions

---

## Adding New Redirects

### Easy 3-Step Process

1. **Edit `vercel.json`:**
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
git commit -m "Add new redirect"
git push
```

3. **Auto-deploys in 30 seconds!**

---

## Benefits

### For Marketing
✅ Memorable URLs for print materials
✅ Easy to say verbally
✅ Professional branded links
✅ Track click-through rates
✅ Change destinations anytime

### For Users
✅ Quick access to content
✅ No typos with short URLs
✅ Works on mobile
✅ Fast redirects (< 100ms)

### For You
✅ Easy to manage
✅ No hosting costs
✅ Automatic scaling
✅ Built-in analytics
✅ Update in seconds

---

## Support Resources

### Vercel
- **Docs:** https://vercel.com/docs
- **Support:** https://vercel.com/support
- **Discord:** https://vercel.com/discord

### GoDaddy
- **Support:** 1-480-505-8877

---

## Project Stats

**Total Redirects:** 47
**Categories:**
- States: 10
- Tools: 4
- Topics: 8
- Resources: 10
- Shortcuts: 15

**Flexibility:** Add unlimited redirects anytime!

---

## Ready to Deploy?

1. Choose your guide:
   - **Fast:** [QUICK_START.md](QUICK_START.md)
   - **Detailed:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

2. Set aside 20-30 minutes

3. Follow the steps

4. Start using your short URLs!

---

**Questions?** Read the guides or contact Vercel support!

**Let's make your marketing easier!** 🚀
