#!/usr/bin/env node

/**
 * WindLoad.co Campaign Page Deployer
 *
 * Deploys pages from staged-pages/ to florida/ (live)
 * Archives deployed pages to deployed-pages/
 * Updates deployment-log.json
 *
 * Usage:
 *   node scripts/deploy-daily-pages.js              # Deploy 1 page
 *   node scripts/deploy-daily-pages.js --count 5    # Deploy 5 pages
 *   node scripts/deploy-daily-pages.js --dry-run    # Preview only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DAILY_TARGET = 14;
const ROOT_DIR = path.join(__dirname, '..');
const STAGED_DIR = path.join(ROOT_DIR, 'staged-pages');
const LIVE_DIR = path.join(ROOT_DIR, 'florida');
const ARCHIVE_DIR = path.join(ROOT_DIR, 'deployed-pages');
const LOG_FILE = path.join(ROOT_DIR, 'deployment-log.json');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const countIndex = args.indexOf('--count');
const pageCount = countIndex !== -1 ? parseInt(args[countIndex + 1]) || 1 : 1;

console.log('='.repeat(60));
console.log('WindLoad.co Campaign Page Deployer');
console.log('='.repeat(60));
console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
console.log(`Pages to deploy: ${pageCount}`);
console.log('');

// Load deployment log
function loadDeploymentLog() {
    if (fs.existsSync(LOG_FILE)) {
        return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    }
    return {
        deployments: [],
        staged: [],
        totalDeployed: 0,
        totalStaged: 0,
        goal: 500,
        dailyTarget: DAILY_TARGET
    };
}

// Save deployment log
function saveDeploymentLog(log) {
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

// Get all staged pages
function getStagedPages() {
    const pages = [];

    if (!fs.existsSync(STAGED_DIR)) {
        console.log('No staged-pages directory found.');
        return pages;
    }

    // Scan staged-pages directory recursively
    function scanDir(dir, category = '') {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory()) {
                scanDir(fullPath, item.name);
            } else if (item.name.endsWith('.html')) {
                pages.push({
                    filename: item.name,
                    category: category,
                    sourcePath: fullPath,
                    relativePath: path.relative(STAGED_DIR, fullPath)
                });
            }
        }
    }

    scanDir(STAGED_DIR);
    return pages;
}

// Check for duplicate/collision
function checkForCollision(page) {
    const targetPath = path.join(LIVE_DIR, page.relativePath);
    return fs.existsSync(targetPath);
}

// Deploy a single page
function deployPage(page) {
    const targetDir = path.join(LIVE_DIR, page.category);
    const targetPath = path.join(targetDir, page.filename);
    const archiveDir = path.join(ARCHIVE_DIR, page.category, page.filename.replace('.html', ''));
    const archivePath = path.join(archiveDir, page.filename);

    console.log(`\nDeploying: ${page.relativePath}`);

    if (dryRun) {
        console.log(`  [DRY RUN] Would copy to: ${targetPath}`);
        console.log(`  [DRY RUN] Would archive to: ${archivePath}`);
        return true;
    }

    try {
        // Create target directory if needed
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy to live
        fs.copyFileSync(page.sourcePath, targetPath);
        console.log(`  ✓ Copied to live: ${targetPath}`);

        // Create archive directory
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        // Copy to archive
        fs.copyFileSync(page.sourcePath, archivePath);

        // Create deployment info
        const deploymentInfo = {
            deployedAt: new Date().toISOString(),
            source: page.sourcePath,
            target: targetPath,
            liveUrl: `https://windload.co/florida/${page.category}/${page.filename.replace('.html', '')}`,
            deployedBy: process.env.GITHUB_ACTIONS ? 'github-actions' : 'manual'
        };
        fs.writeFileSync(
            path.join(archiveDir, 'deployment-info.json'),
            JSON.stringify(deploymentInfo, null, 2)
        );
        console.log(`  ✓ Archived with metadata`);

        // Remove from staged
        fs.unlinkSync(page.sourcePath);
        console.log(`  ✓ Removed from staging`);

        // Clean up empty directories
        const stagedCategoryDir = path.join(STAGED_DIR, page.category);
        if (fs.existsSync(stagedCategoryDir) && fs.readdirSync(stagedCategoryDir).length === 0) {
            fs.rmdirSync(stagedCategoryDir);
        }

        return true;
    } catch (error) {
        console.error(`  ✗ Error deploying: ${error.message}`);
        return false;
    }
}

// Regenerate sitemap.xml with all live pages
function regenerateSitemap() {
    const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap.xml');
    const today = new Date().toISOString().split('T')[0];

    // Static main pages (non-florida)
    const mainPages = [
        { loc: '/', priority: '1.0', changefreq: 'weekly' },
        { loc: '/engineers', priority: '0.8', changefreq: 'monthly' },
        { loc: '/architects', priority: '0.8', changefreq: 'monthly' },
        { loc: '/contractors', priority: '0.8', changefreq: 'monthly' },
        { loc: '/florida-pro', priority: '0.8', changefreq: 'monthly' },
        { loc: '/hurricane', priority: '0.8', changefreq: 'monthly' },
        { loc: '/compare', priority: '0.7', changefreq: 'monthly' },
        { loc: '/vs-buildingsguide', priority: '0.7', changefreq: 'monthly' },
        { loc: '/vs-omni', priority: '0.7', changefreq: 'monthly' },
    ];

    // Scan florida/ for all deployed campaign pages
    const floridaPages = [];
    function scanFlorida(dir) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                scanFlorida(fullPath);
            } else if (item.name.endsWith('.html') && item.name !== 'index.html') {
                const rel = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/').replace('.html', '');
                floridaPages.push(rel);
            }
        }
    }
    scanFlorida(LIVE_DIR);

    // Build sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of mainPages) {
        xml += `  <url>\n`;
        xml += `    <loc>https://windload.co${page.loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
    }

    for (const page of floridaPages) {
        xml += `  <url>\n`;
        xml += `    <loc>https://windload.co/${page}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
    }

    xml += '</urlset>\n';

    fs.writeFileSync(SITEMAP_FILE, xml);
    console.log(`\n✓ Sitemap regenerated: ${mainPages.length + floridaPages.length} URLs (${mainPages.length} main + ${floridaPages.length} campaign)`);
}

// Main deployment process
function main() {
    const log = loadDeploymentLog();
    const stagedPages = getStagedPages();

    console.log(`Found ${stagedPages.length} staged pages`);

    if (stagedPages.length === 0) {
        console.log('\nNo pages to deploy. Exiting.');
        console.log(`::set-output name=deployed::0`);
        process.exit(0);
    }

    // Check for collisions
    const validPages = stagedPages.filter(page => {
        if (checkForCollision(page)) {
            console.log(`⚠ Skipping (collision): ${page.relativePath}`);
            return false;
        }
        return true;
    });

    console.log(`\n${validPages.length} pages ready for deployment`);

    // Deploy pages
    const pagesToDeploy = validPages.slice(0, pageCount);
    let deployedCount = 0;
    const deployedPages = [];

    for (const page of pagesToDeploy) {
        if (deployPage(page)) {
            deployedCount++;
            deployedPages.push({
                path: `/florida/${page.relativePath.replace('.html', '')}`,
                category: page.category,
                deployedAt: new Date().toISOString()
            });
        }
    }

    // Update deployment log
    if (!dryRun && deployedCount > 0) {
        log.deployments.push(...deployedPages);
        log.totalDeployed += deployedCount;

        // Update staged list
        log.staged = getStagedPages().map(p => ({
            path: p.relativePath,
            category: p.category,
            stagedAt: new Date().toISOString(),
            status: 'ready'
        }));
        log.totalStaged = log.staged.length;

        saveDeploymentLog(log);
        console.log(`\n✓ Deployment log updated`);

        // Regenerate sitemap with all live florida pages
        regenerateSitemap();

        // Git operations
        try {
            console.log('\nCommitting changes...');

            // Stage only the directories/files the deploy script touches:
            //   florida/        — new live page(s)
            //   deployed-pages/ — archived copy + metadata
            //   staged-pages/   — deletion of deployed page(s)
            //   deployment-log.json — updated counts
            // NEVER use "git add -A" — that would pull in untracked files
            // from the local working tree (nul, .claude/, etc.)
            execSync('git add florida/ deployed-pages/ staged-pages/ deployment-log.json sitemap.xml', { cwd: ROOT_DIR, stdio: 'inherit' });

            const commitMsg = `Deploy: ${deployedCount} campaign page(s)

Pages deployed:
${deployedPages.map(p => `- ${p.path}`).join('\n')}

Deployed by: GitHub Actions
Timestamp: ${new Date().toISOString()}`;

            execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
            console.log('✓ Changes committed');
        } catch (error) {
            console.log('Note: Git commit skipped (no changes or not in git repo)');
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('DEPLOYMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Pages deployed: ${deployedCount}`);
    console.log(`Pages remaining in staging: ${validPages.length - deployedCount}`);
    console.log(`Total deployed (all time): ${log.totalDeployed}`);
    console.log(`Progress: ${((log.totalDeployed / log.goal) * 100).toFixed(1)}% of ${log.goal} goal`);
    console.log('='.repeat(60));

    // Output for GitHub Actions
    console.log(`::set-output name=deployed::${deployedCount}`);
    console.log(`::set-output name=pages::${JSON.stringify(deployedPages)}`);
}

main();
