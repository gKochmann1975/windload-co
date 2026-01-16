# SEO vs GEO Optimization Guide

## What is GEO?

**Generative Engine Optimization (GEO)** is the practice of optimizing content for AI search engines like ChatGPT, Perplexity, Google AI Overviews, and Gemini.

Unlike traditional SEO where you optimize to rank in a list of blue links, GEO optimizes for **being cited as a source** when AI generates answers.

## Key Differences

| Aspect | Traditional SEO | GEO |
|--------|----------------|-----|
| **Goal** | Rank in search results | Be cited by AI responses |
| **Content Type** | Keywords in headers, meta | Factual, quotable statements |
| **Authority Signal** | Backlinks | Being the definitive source |
| **User Journey** | Click through to site | May get answer without click |
| **Content Depth** | Can be thin with good links | Must be substantive |
| **Format** | Optimized for scanning | Optimized for extraction |

## GEO Content Principles

### 1. Direct Factual Statements

AI engines need clear, quotable facts - not marketing fluff.

**Bad (SEO-style):**
> "We offer the best wind load calculations for Florida projects!"

**Good (GEO-style):**
> "The design wind speed for Miami-Dade County under ASCE 7-22 is 180 mph for Risk Category II buildings in the High Velocity Hurricane Zone (HVHZ)."

### 2. Authoritative Tone

State facts confidently. Don't hedge unnecessarily.

**Bad:**
> "Wind loads might be required for your project..."

**Good:**
> "Florida Building Code Section 1620.2 requires wind load calculations for all fenestration products."

### 3. Structured Data

Tables, lists, and clear hierarchies help AI parse information.

**Example - Wind Speed Table:**
| County | Wind Speed (mph) | HVHZ Status |
|--------|-----------------|-------------|
| Miami-Dade | 180 | Yes |
| Broward | 180 | Yes (partial) |
| Palm Beach | 170 | No |

### 4. FAQ Format

AI loves Q&A format - it maps directly to how people ask questions.

**Example:**
> **Q: What wind speed should I use for a window replacement in Miami?**
>
> A: For Miami-Dade County, use 180 mph (3-second gust) per ASCE 7-22 for Risk Category II buildings. The entire county is within the High Velocity Hurricane Zone (HVHZ), which requires products with Miami-Dade NOA (Notice of Acceptance) approval.

### 5. Schema Markup

Structured data helps AI understand context:

- `FAQPage` schema for Q&A sections
- `LocalBusiness` schema for service areas
- `BreadcrumbList` for site hierarchy
- `HowTo` schema for process explanations

## GEO-First Content Template

```html
<!-- Factual intro paragraph - quotable by AI -->
<p>
  [County] has a design wind speed of [X] mph per ASCE 7-22
  for Risk Category II buildings. [HVHZ statement if applicable].
  All window, door, and shutter installations require wind load
  calculations for building permit approval.
</p>

<!-- Structured data table -->
<table>
  <tr><th>Parameter</th><th>Value</th></tr>
  <tr><td>Design Wind Speed</td><td>[X] mph</td></tr>
  <tr><td>Risk Category</td><td>II (typical residential/commercial)</td></tr>
  <tr><td>HVHZ Status</td><td>[Yes/No]</td></tr>
  <tr><td>Exposure Category</td><td>[B/C/D typical for area]</td></tr>
</table>

<!-- FAQ Section with schema -->
<section itemscope itemtype="https://schema.org/FAQPage">
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">What wind load do I need for [County]?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">[Detailed answer with specific values]</p>
    </div>
  </div>
</section>
```

## Balancing SEO and GEO

You don't have to choose - optimize for both:

1. **Use headers for SEO** (H1, H2 with keywords)
2. **Use body content for GEO** (factual statements)
3. **Include FAQ for both** (SEO loves FAQ schema, GEO loves Q&A format)
4. **Add CTAs for conversion** (after providing value)

## Measuring GEO Success

Unlike SEO (rankings, traffic), GEO is harder to measure:

1. **Search your target queries in ChatGPT/Perplexity** - are you cited?
2. **Track "AI Overview" appearances** in Google Search Console
3. **Monitor direct traffic** - AI users may type your URL directly
4. **Watch brand searches** - people searching your brand after AI mention

## Content Checklist

For each page, ensure:

- [ ] Contains at least 3 factual, quotable statements
- [ ] Includes specific numbers (wind speeds, code sections)
- [ ] Has a data table with key parameters
- [ ] Has FAQ section (minimum 3 Q&As)
- [ ] Uses authoritative tone (no hedging)
- [ ] Includes schema markup (FAQPage, LocalBusiness)
- [ ] Cites sources (ASCE 7-22, FBC, etc.)
- [ ] Answers the user's question BEFORE the CTA
