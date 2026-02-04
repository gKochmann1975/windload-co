const fs = require('fs');
const path = require('path');

// Read current deployment log
const log = JSON.parse(fs.readFileSync('deployment-log.json', 'utf8'));

// Function to recursively get all HTML files
function getFiles(dir, files = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            getFiles(fullPath, files);
        } else if (item.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Get all files in staged-pages directory
const stagedDir = 'staged-pages';
const actualFiles = getFiles(stagedDir);

// Build staged array with proper structure
const staged = actualFiles.map(f => {
    const rel = f.split(path.sep).join('/').replace('staged-pages/', '');
    const parts = rel.split('/');
    return {
        path: rel,
        category: parts[0],
        status: 'ready'
    };
});

// Update log
log.staged = staged;
log.totalStaged = staged.length;
log.lastUpdated = new Date().toISOString();

// Write back
fs.writeFileSync('deployment-log.json', JSON.stringify(log, null, 2));

console.log(`Synced ${staged.length} staged pages to deployment-log.json`);
