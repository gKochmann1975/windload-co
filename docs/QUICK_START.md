# Quick Start Guide - windload.co

## What You Have

✅ **Landing page** with decision buttons
✅ **47 smart redirects** for marketing
✅ **Short, memorable URLs** for all your content
✅ **Professional branding** for verbal communication

---

## Deploy in 4 Steps (20 minutes)

### 1. Push to GitHub (5 minutes)
```bash
cd C:\windload-co
git init
git add .
git commit -m "Initial commit - windload.co redirects"
# Create repo at github.com/new
git remote add origin https://github.com/YOUR-USERNAME/windload-co.git
git push -u origin main
```

### 2. Deploy to Vercel (2 minutes)
- Go to: https://vercel.com/new
- Click "Import" on your repository
- Click "Deploy"
- Test: Visit `windload-co-xyz.vercel.app/florida`
- Should redirect to Florida requirements page ✅

### 3. Add Custom Domain (3 minutes)
- In Vercel: Settings → Domains
- Add: `windload.co`
- Add: `www.windload.co`
- Copy DNS records

### 4. Update DNS in GoDaddy (5 minutes + wait)
- Go to: https://dcc.godaddy.com/domains
- Find `windload.co` → Manage DNS
- A record: `@` → `76.76.21.21`
- CNAME: `www` → `cname.vercel-dns.com`
- Wait 10-30 minutes

✅ **Done!** Test at https://windload.co/florida

---

## Test Your Redirects

Try these immediately after DNS propagates:

**States:**
- windload.co/florida
- windload.co/texas
- windload.co/california

**Tools:**
- windload.co/calc
- windload.co/free
- windload.co/videos

**Topics:**
- windload.co/topo
- windload.co/asce7
- windload.co/contact

---

## Monthly Costs

| Service | Cost |
|---------|------|
| **Vercel** | $0 (FREE) |
| **GitHub** | $0 (FREE) |
| **Domain** | ~$1.25/month |
| **Total** | **$1.25/month** |

---

## Adding New Redirects

1. Edit `vercel.json`
2. Add new redirect:
```json
{
  "source": "/new",
  "destination": "https://windload.solutions/new-page.html",
  "permanent": false
}
```
3. Commit and push
4. Auto-deploys in 30 seconds!

---

## Marketing Use Cases

**Print Materials:**
- Business cards: "windload.co/contact"
- Brochures: "windload.co/free"

**Digital:**
- Social media: windload.co/calc
- Email campaigns: windload.co/videos

**Verbal:**
- "Just go to windload dot co slash florida"

---

## Need Help?

📖 **Full Guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
💬 **Vercel Support:** https://vercel.com/support

---

**Easy, memorable, professional!** 🚀
