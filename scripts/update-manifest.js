const fs = require('fs');
const path = require('path');

function getFilesRecursively(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            files.push(...getFilesRecursively(fullPath, relativePath));
        } else if (item.endsWith('.html')) {
            const stats = fs.statSync(fullPath);
            files.push({
                path: '/florida/' + relativePath.split(path.sep).join('/'),
                category: relativePath.split(path.sep)[0],
                modifiedAt: stats.mtime.toISOString()
            });
        }
    }
    return files;
}

function getStagedFiles(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            files.push(...getStagedFiles(fullPath, relativePath));
        } else if (item.endsWith('.html')) {
            files.push({
                path: relativePath.split(path.sep).join('/'),
                category: relativePath.split(path.sep)[0],
                status: 'ready'
            });
        }
    }
    return files;
}

const livePages = getFilesRecursively('./florida');
const stagedPages = getStagedFiles('./staged-pages');

// Read existing deployment log for timestamps
let existingLog = { deployments: [], staged: [] };
try {
    existingLog = JSON.parse(fs.readFileSync('./deployment-log.json', 'utf8'));
} catch (e) {}

// Create a map of existing deployments for timestamps (normalize paths)
const existingDeployMap = {};
for (const d of existingLog.deployments) {
    // Handle both /florida/county/page and /florida/county/page.html formats
    const normalizedPath = d.path.endsWith('.html') ? d.path : d.path + '.html';
    existingDeployMap[normalizedPath] = d;
    // Also store without .html for lookup
    existingDeployMap[d.path] = d;
}

// Default date for pages not in deployment log (they were created before tracking started)
const defaultDate = '2026-01-16T12:00:00.000Z'; // When bulk pages were created

// Update deployments with all live pages
const deployments = livePages.map(page => {
    // Try both with and without .html extension
    const existing = existingDeployMap[page.path] || existingDeployMap[page.path.replace('.html', '')];

    return {
        path: page.path,
        category: page.category,
        deployedAt: existing ? existing.deployedAt : defaultDate,
        // Preserve template/animation info if it exists
        ...(existing?.template && { template: existing.template }),
        ...(existing?.animation && { animation: existing.animation })
    };
});

const manifest = {
    deployments: deployments,
    staged: stagedPages,
    totalDeployed: deployments.length,
    totalStaged: stagedPages.length,
    goal: 5000,
    dailyTarget: 12,
    lastUpdated: new Date().toISOString()
};

fs.writeFileSync('./deployment-log.json', JSON.stringify(manifest, null, 2));
console.log('Updated deployment-log.json');
console.log('Live pages:', deployments.length);
console.log('Staged pages:', stagedPages.length);
console.log('Total:', deployments.length + stagedPages.length);

// Show today's deployments
const today = new Date();
const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const todayDeployments = deployments.filter(d => new Date(d.deployedAt) >= todayStart);
console.log('Deployed today:', todayDeployments.length);

// Show this week's deployments
const weekStart = new Date(todayStart);
weekStart.setDate(weekStart.getDate() - 7);
const weekDeployments = deployments.filter(d => new Date(d.deployedAt) >= weekStart);
console.log('Deployed this week:', weekDeployments.length);
