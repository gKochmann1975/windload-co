# Page Templates Specification

## File Naming Convention

```
/florida/                           → florida/index.html (redirect from florida-pro.html)
/florida/miami-dade/                → florida/miami-dade/index.html
/florida/miami-dade/miami/          → florida/miami-dade/miami/index.html
```

## County Page Template

### Required Sections

1. **Hero Section**
   - County name + "Wind Load Calculator"
   - HVHZ badge (if applicable)
   - Primary wind speed callout
   - CTA button to calculator

2. **Quick Facts Box** (GEO-critical)
   - Design wind speed
   - HVHZ status
   - Code reference (FBC 2023 / ASCE 7-22)
   - Typical exposure category

3. **Requirements Section**
   - What needs wind load calculations
   - Permit process overview
   - Product approval requirements (NOA if HVHZ)

4. **Wind Speed Table**
   - By city within county
   - By exposure category (B, C, D)
   - By risk category (I, II, III, IV)

5. **FAQ Section** (minimum 5 questions)
   - Must use FAQPage schema
   - Questions should match actual search queries
   - Answers should be complete (not "click here to learn more")

6. **Building Department Info**
   - Address
   - Phone
   - Website
   - Hours

7. **Related Pages**
   - Cities within county
   - Adjacent counties
   - Back to Florida hub

8. **CTA Section**
   - Calculator link
   - PE services link

### Required Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "[County] Wind Load Calculator",
  "description": "...",
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [...]
  }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "WindLoad.co",
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "[County], Florida"
  }
}
```

### Required Meta Tags

```html
<title>[County] Wind Load Calculator | FL [Wind Speed] mph | HVHZ [if applicable]</title>
<meta name="description" content="Calculate wind loads for [County], Florida. [Wind speed] mph design wind speed per ASCE 7-22. [HVHZ compliant if applicable]. Free calculator.">
<meta name="geo.region" content="US-FL">
<meta name="geo.placename" content="[County], Florida">
```

## City Page Template

### Required Sections

1. **Hero Section**
   - City name + County + "Wind Load Calculator"
   - Specific wind speed for that location
   - CTA button

2. **Location-Specific Data** (GEO-critical)
   - Exact wind speed
   - Exposure category recommendation
   - Distance from coast (affects exposure)
   - Flood zone info (if relevant)

3. **Permit Requirements**
   - Local building department process
   - Required documents
   - Typical review time
   - Fees (if publicly available)

4. **FAQ Section** (minimum 3 questions)
   - City-specific queries
   - Local contractor questions

5. **Building Department Contact**
   - Full contact info
   - Link to permit portal

6. **Related Pages**
   - Other cities in county
   - County page
   - Calculator

## Contractor Directory Template (if applicable)

### Required Sections

1. **Search/Filter**
   - By city
   - By specialty (windows, doors, shutters)
   - By license type

2. **Contractor Listings**
   - Company name
   - License number (linked to state lookup)
   - Specialties
   - Service area

3. **CTA for Contractors**
   - "Need wind load calculations for your project?"
   - Link to calculator

## Template Variables

For programmatic generation, these variables need data:

### County Level
- `{{county_name}}`
- `{{wind_speed_mph}}`
- `{{hvhz_status}}` (true/false)
- `{{hvhz_areas}}` (if partial)
- `{{exposure_typical}}` (B, C, or D)
- `{{building_dept_address}}`
- `{{building_dept_phone}}`
- `{{building_dept_url}}`
- `{{cities_list}}` (array)
- `{{adjacent_counties}}` (array)

### City Level
- `{{city_name}}`
- `{{county_name}}`
- `{{wind_speed_mph}}`
- `{{exposure_category}}`
- `{{distance_from_coast_mi}}`
- `{{building_dept_address}}`
- `{{building_dept_phone}}`
- `{{building_dept_url}}`
- `{{permit_portal_url}}`

## Design Tokens

Match existing florida-pro.html:

```css
--bg-primary: #0c1220;
--bg-secondary: #0f1729;
--text-primary: #ffffff;
--text-secondary: #94a3b8;
--accent-primary: #00b4d8;
--accent-secondary: #00e6a0;
--hvhz-color: #ff6464;
--border-subtle: rgba(255, 255, 255, 0.1);
```

## UTM Parameters

All links to windloadcalc.com should include:

```
?utm_source=windload.co
&utm_medium=landing
&utm_campaign=florida-gc
&utm_content={{page_type}}-{{location}}
```

Example:
```
https://windloadcalc.com/wind-load-calculator-shop.html?utm_source=windload.co&utm_medium=landing&utm_campaign=florida-gc&utm_content=county-miami-dade
```
