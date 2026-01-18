const fs = require('fs');
const path = require('path');

const stagedDir = path.join(__dirname, '..', 'staged-pages');
const pages = [];

// Function to title-case a slug
function toTitle(slug) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Function to determine type
function getType(slug) {
    if (/window|glass|glazing|casement|fixed|louvered|clerestory|jalousie|bay|picture|corner|storefront|curtain|skylight|high-rise|mullion/.test(slug)) return 'Windows';
    if (/door|pivot|bi-fold|entry|french|patio|folding|sliding/.test(slug)) return 'Doors';
    if (/shutter|accordion|roll-down|bahama|colonial|panel/.test(slug)) return 'Shutters';
    if (/garage/.test(slug)) return 'Garage';
    if (/enclosure|pool|lanai|atrium|railing|island|boat|coastal|marine|waterfront|elevated|flood|stilt|key-west|marathon|islamorada|big-pine/.test(slug)) return 'HVHZ';
    if (/contractor|inspector|permit|bid|checklist|mistake|coordinate|subcontract/.test(slug)) return 'Contractor';
    if (/roof|anchor|truss|brace|beam|stud|strap|tie|connection|nail|shear|diaphragm|clip/.test(slug)) return 'Structural';
    return 'Wind Load';
}

// Scan directories
const counties = fs.readdirSync(stagedDir).filter(f => fs.statSync(path.join(stagedDir, f)).isDirectory());
const byCounty = {};

for (const county of counties) {
    const countyDir = path.join(stagedDir, county);
    const files = fs.readdirSync(countyDir).filter(f => f.endsWith('.html'));
    byCounty[county] = files.map(f => {
        const slug = f.replace('.html', '');
        return {
            title: toTitle(slug),
            url: '/florida/' + county + '/' + slug,
            county: county,
            type: getType(slug),
            stagedDate: '2026-01-17'
        };
    });
}

// Output grouped by county
const order = ['miami-dade', 'broward', 'palm-beach', 'monroe'];
for (const county of order) {
    if (byCounty[county]) {
        const displayName = county.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
        console.log(`                // ${displayName} (${byCounty[county].length} pages)`);
        byCounty[county].forEach((p, i, arr) => {
            const isLast = (county === 'monroe' && i === arr.length - 1);
            const comma = isLast ? '' : ',';
            console.log(`                { title: '${p.title}', url: '${p.url}', county: '${p.county}', type: '${p.type}', stagedDate: '${p.stagedDate}' }${comma}`);
        });
    }
}
