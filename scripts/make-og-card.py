#!/usr/bin/env python3
"""Generate the 1200x630 branded social/OG card for windload.co.

Output: assets/og-card.png  (referenced as og:image / twitter:image)
Run:    python scripts/make-og-card.py
Deterministic — safe to re-run; overwrites the same file.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
CYAN = (0, 180, 216)        # #00b4d8
WHITE = (255, 255, 255)
SUB = (170, 184, 201)       # tagline gray
FONTS = "C:/Windows/Fonts/"

def font(name, size):
    return ImageFont.truetype(FONTS + name, size)

# --- background: vertical dark gradient ---
top = (14, 26, 51)          # #0e1a33
bot = (6, 9, 15)            # #06090f
bg = Image.new("RGB", (W, H))
px = bg.load()
for y in range(H):
    t = y / (H - 1)
    r = int(top[0] + (bot[0] - top[0]) * t)
    g = int(top[1] + (bot[1] - top[1]) * t)
    b = int(top[2] + (bot[2] - top[2]) * t)
    for x in range(W):
        px[x, y] = (r, g, b)

# --- soft cyan glow behind the wordmark ---
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([W // 2 - 380, 120, W // 2 + 380, 470], fill=(0, 180, 216, 60))
glow = glow.filter(ImageFilter.GaussianBlur(110))
bg = Image.alpha_composite(bg.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(bg)

# --- logo icon (cyan swirl), centered near top ---
try:
    logo = Image.open(os.path.join(ROOT, "assets", "windload.co_00b4d8.png")).convert("RGBA")
    lh = 150
    lw = int(logo.width * lh / logo.height)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    bg.paste(logo, ((W - lw) // 2, 70), logo)
except Exception as e:
    print("logo skipped:", e)

# --- wordmark: "WindLoad" white + ".co" cyan, centered ---
wf = font("segoeuib.ttf", 104)
part1, part2 = "WindLoad", ".co"
w1 = draw.textlength(part1, font=wf)
w2 = draw.textlength(part2, font=wf)
start = (W - (w1 + w2)) / 2
y_word = 250
draw.text((start, y_word), part1, font=wf, fill=WHITE)
draw.text((start + w1, y_word), part2, font=wf, fill=CYAN)

# --- tagline ---
tf = font("segoeui.ttf", 38)
tag = "ASCE 7-22 Wind Load Calculators & PE-Sealed Reports"
tw = draw.textlength(tag, font=tf)
draw.text(((W - tw) / 2, 400), tag, font=tf, fill=SUB)

# --- accent rule ---
draw.rectangle([W // 2 - 90, 470, W // 2 + 90, 474], fill=CYAN)

# --- footer trust line ---
ff = font("segoeui.ttf", 28)
foot = "Since 2002    •    All 50 States    •    Florida HVHZ"
fw = draw.textlength(foot, font=ff)
draw.text(((W - fw) / 2, 500), foot, font=ff, fill=CYAN)

out = os.path.join(ROOT, "assets", "og-card.png")
bg.save(out, "PNG", optimize=True)
print("wrote", out, bg.size)
