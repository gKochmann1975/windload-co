# Miami-Dade County NOA (Notice of Acceptance) Data

## Data Source

**Source:** Miami-Dade County Building Department - Product Control Division
**URL:** https://www.miamidade.gov/building/pc-search_app.asp
**Retrieved:** January 15, 2026
**Classification:** High Velocity Hurricane Zone (HVHZ) Products Only

## What is this data?

This dataset contains all products with Miami-Dade County Notice of Acceptance (NOA) approval for use in the High Velocity Hurricane Zone (HVHZ). Products in the HVHZ must pass:
- Large missile impact testing (9 lb 2x4 lumber at 50 fps)
- Small missile impact testing (2g steel balls at 130 fps)
- Cyclic pressure testing

## Data Structure

Each NOA record contains:
| Field | Description |
|-------|-------------|
| NOA | Notice of Acceptance number (unique identifier) |
| Applicant | Manufacturer or company name |
| Category | Product category (Windows, Doors, Shutters, Roofing, etc.) |
| Subcategory | Specific product type |
| Material | Primary material (Aluminum, Steel, Vinyl, etc.) |
| Description | Product name and specifications |
| Impact | Impact rating (Large and Small Missile, None, Unselected) |
| MDP+ | Maximum Design Pressure - Positive (psf) |
| MDP- | Maximum Design Pressure - Negative (psf) |
| Class | Classification (High velocity hurricane zone) |
| Expires | NOA expiration date |

## Files in this folder

- `README.md` - This file
- `windows.md` - Windows and window wall systems
- `doors.md` - Doors (entry, garage, sectional)
- `shutters.md` - Hurricane shutters (accordion, rollup, panels)
- `roofing.md` - Roofing systems and materials
- `other-products.md` - Railings, vents, louvers, cladding, etc.
- `summary.md` - Analysis and key insights

## How to use this data

### For Contractors
1. Get wind load calculation → determines required Design Pressure (DP)
2. Find products in these files with MDP+/MDP- ratings that meet or exceed your required DP
3. Verify NOA is current (check expiration date)
4. Use NOA number for permit application

### For WindLoad.co
1. Product recommendation after calculation
2. SEO/GEO content (manufacturer counts, product types)
3. B2B outreach to manufacturers
4. Integration with windloadcalc.com

## Important Notes

- MDP values are in PSF (pounds per square foot)
- Products must meet BOTH positive (+) AND negative (-) pressure requirements
- Always verify NOA status on official Miami-Dade website before use
- NOA expiration dates require renewal - check current status

## Official Verification

To verify any NOA or search for updated products:
https://www.miamidade.gov/building/pc-search_app.asp
