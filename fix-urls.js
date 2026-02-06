const fs = require('fs');
const path = require('path');

// Recursively get all HTML files
function getHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            getHtmlFiles(fullPath, files);
        } else if (item.name.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Fix URLs in a file
function fixUrls(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // Fix href="/" to href="https://windload.co/"
    if (content.includes('href="/"')) {
        content = content.replace(/href="\/"/g, 'href="https://windload.co/"');
        modified = true;
    }

    // Fix href="/something.html" to href="https://windload.co/something.html"
    // But NOT href="#..." or href="https://..."
    const relativeHrefPattern = /href="\/([^"#][^"]*)"/g;
    if (relativeHrefPattern.test(content)) {
        content = content.replace(/href="\/([^"#][^"]*)"/g, 'href="https://windload.co/$1"');
        modified = true;
    }

    // Fix src="/assets/..." to src="https://windload.co/assets/..."
    if (content.includes('src="/assets/')) {
        content = content.replace(/src="\/assets\//g, 'src="https://windload.co/assets/');
        modified = true;
    }

    // Fix any remaining src="/" patterns (but not src="data:" or src="https:")
    const relativeSrcPattern = /src="\/([^"]+)"/g;
    const matches = content.match(relativeSrcPattern);
    if (matches) {
        content = content.replace(/src="\/([^"]+)"/g, (match, p1) => {
            // Don't change data: URLs or already absolute URLs
            if (p1.startsWith('data:') || p1.startsWith('https:') || p1.startsWith('http:')) {
                return match;
            }
            return `src="https://windload.co/${p1}"`;
        });
        modified = true;
    }

    if (modified && content !== originalContent) {
        fs.writeFileSync(filePath, content);
        return true;
    }
    return false;
}

// Process staged pages
const stagedDir = 'staged-pages';
const stagedFiles = getHtmlFiles(stagedDir);
let stagedFixed = 0;

console.log(`Found ${stagedFiles.length} staged HTML files`);

for (const file of stagedFiles) {
    if (fixUrls(file)) {
        stagedFixed++;
        console.log(`Fixed: ${file}`);
    }
}

console.log(`\nFixed ${stagedFixed} staged files`);

// Process live florida pages
const floridaDir = 'florida';
if (fs.existsSync(floridaDir)) {
    const liveFiles = getHtmlFiles(floridaDir);
    let liveFixed = 0;

    console.log(`\nFound ${liveFiles.length} live HTML files`);

    for (const file of liveFiles) {
        if (fixUrls(file)) {
            liveFixed++;
            console.log(`Fixed: ${file}`);
        }
    }

    console.log(`\nFixed ${liveFixed} live files`);
}

console.log('\nDone!');
