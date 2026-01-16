# Data Requirements

## Wind Speed Data

### Source
- ASCE 7-22 wind speed maps
- Florida Building Code 2023
- ASCE Hazard Tool (https://asce7hazardtool.online/)

### Required Data Points

| Field | Description | Example |
|-------|-------------|---------|
| `county` | County name | Miami-Dade |
| `wind_speed_cat_ii` | Risk Category II wind speed (mph) | 180 |
| `wind_speed_cat_i` | Risk Category I wind speed (mph) | 165 |
| `wind_speed_cat_iii` | Risk Category III wind speed (mph) | 190 |
| `wind_speed_cat_iv` | Risk Category IV wind speed (mph) | 200 |
| `hvhz` | High Velocity Hurricane Zone | true |
| `hvhz_partial` | Only parts of county in HVHZ | false |
| `exposure_coastal` | Typical exposure at coast | D |
| `exposure_inland` | Typical exposure inland | C |

### HVHZ Counties (Complete List)

| County | HVHZ Status | Notes |
|--------|-------------|-------|
| Miami-Dade | Full | Entire county |
| Broward | Partial | East of I-95 |

### Priority Counties Data

```json
[
  {
    "county": "Miami-Dade",
    "wind_speed_cat_ii": 180,
    "hvhz": true,
    "hvhz_partial": false,
    "exposure_typical": "D",
    "noa_required": true
  },
  {
    "county": "Broward",
    "wind_speed_cat_ii": 180,
    "hvhz": true,
    "hvhz_partial": true,
    "hvhz_boundary": "East of I-95",
    "exposure_typical": "D",
    "noa_required": true
  },
  {
    "county": "Palm Beach",
    "wind_speed_cat_ii": 170,
    "hvhz": false,
    "exposure_typical": "C",
    "noa_required": false
  },
  {
    "county": "Monroe",
    "wind_speed_cat_ii": 180,
    "hvhz": false,
    "exposure_typical": "D",
    "noa_required": false,
    "notes": "Florida Keys - all Exposure D due to water on both sides"
  }
]
```

## City Data

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `city` | City name | Miami |
| `county` | Parent county | Miami-Dade |
| `population` | For prioritization | 442,241 |
| `wind_speed` | May vary within county | 180 |
| `exposure_typical` | Based on terrain | D |
| `coastal` | Within 1 mile of water | true |
| `building_dept_address` | Physical address | ... |
| `building_dept_phone` | Phone number | ... |
| `building_dept_url` | Website | ... |
| `permit_portal_url` | Online permit system | ... |

### Data Sources for City Info

1. **Population**: US Census Bureau
2. **Building Departments**: County/city government websites
3. **Permit Portals**: Usually linked from building dept site

## Contractor Data (If Available)

### Miami-Dade Contractor List Fields (Expected)

If we receive the Miami-Dade contractor list, expect fields like:

| Field | Description |
|-------|-------------|
| `license_number` | State contractor license |
| `business_name` | Company name |
| `owner_name` | Qualifier name |
| `license_type` | GC, Roofing, Glass, etc. |
| `address` | Business address |
| `city` | Business city |
| `phone` | Contact phone |
| `status` | Active/Inactive |
| `expiration_date` | License expiration |

### Filtering for Relevance

From contractor list, filter for:
- License types: General Contractor, Glass & Glazing, Specialty (shutters)
- Status: Active only
- Location: Miami-Dade County

### Verification URL

Florida DBPR license lookup:
`https://www.myfloridalicense.com/wl11.asp?mode=0&SID=&bession_id=`

## Building Department Data

### Priority Counties - Building Department Info

**Miami-Dade County** (Verified Jan 2025)
- Name: Miami-Dade Building Department
- Address: 11805 SW 26th Street, Miami, FL 33175
- Phone: 786-315-2000
- URL: https://www.miamidade.gov/permits/
- Permit Portal: https://www.miamidade.gov/permits/e-permit.asp
- NOA Search: https://www.miamidade.gov/building/pc-search_app.asp

**Broward County**
- Name: Broward County Building Division
- Address: 1 N University Dr, Plantation, FL 33324
- Phone: 954-765-4500
- URL: https://www.broward.org/Building/
- Permit Portal: https://epermits.broward.org/

**Palm Beach County**
- Name: Palm Beach County Building Division
- Address: 2300 N Jog Road, West Palm Beach, FL 33411
- Phone: 561-233-5100
- URL: https://discover.pbcgov.org/pzb/building/
- Permit Portal: https://pbcpermits.com/

**Monroe County**
- Name: Monroe County Building Department
- Address: 2798 Overseas Highway, Marathon, FL 33050
- Phone: 305-289-2501
- URL: https://www.monroecounty-fl.gov/155/Building
- Note: Has multiple offices for Upper/Middle/Lower Keys

## Data Update Schedule

- **Wind speeds**: Update when ASCE 7 or FBC updates (every 3-6 years)
- **Building depts**: Verify annually
- **Contractor lists**: Refresh quarterly if using
- **City populations**: Update with each census

## Data Storage

Store in `/data/` folder:
```
/data/
  florida-counties.json
  florida-cities.json
  florida-building-depts.json
  contractors/
    miami-dade-contractors.json
```

Or use a simple database/spreadsheet that exports to JSON for static site generation.
