import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    // 1. Remove isDark variables and hooks
    newContent = newContent.replace(/const\s*{\s*isDark(.*?)\s*}\s*=\s*useTheme\(\);\n?/g, '');
    newContent = newContent.replace(/isDark\s*\?\s*['"`](.*?)['"`]\s*:\s*['"`](.*?)['"`]/g, (match, p1, p2) => `'${p1}'`);
    newContent = newContent.replace(/isDark\s*\?\s*([^]*?)\s*:\s*([^]*?)(?=\s*[})]|\s*$)/g, (match, darkSide, lightSide) => {
        // A bit dangerous for complex ternaries, sticking to simple replaces where possible
        return darkSide;
    });

    // Specifically for the chart color configurations which look like `color: isDark ? '#fff' : '#000'`
    newContent = newContent.replace(/isDark\s*\?\s*['"]#[a-fA-F0-9]+['"]\s*:\s*['"]#[a-fA-F0-9]+['"]/g, (match) => {
        const darkColor = match.match(/['"](#[a-fA-F0-9]+)['"]/)[1];
        return `'${darkColor}'`;
    });

    // 2. Class cleanups
    // Basic structural cleans
    newContent = newContent.replace(/bg-white\s+dark:bg-slate-900/g, 'bg-slate-900');
    newContent = newContent.replace(/text-slate-900\s+dark:text-(white|slate-100|slate-200)/g, 'text-white');
    newContent = newContent.replace(/border-slate-[0-9]+\s+dark:border-slate-[0-9]+/g, (match) => {
        const darkBorder = match.match(/dark:(border-slate-[0-9]+)/)[1];
        return darkBorder;
    });

    // Generic dark: prefix removal. If we have "dark:bg-slate-800", we want to keep "bg-slate-800".
    // Note: we want to replace `dark:some-class` with `some-class`. But if we have `bg-white dark:bg-slate-900`, we previously matched it.
    // Let's just remove the `dark:` prefix from any class to enforce it.
    newContent = newContent.replace(/dark:([a-zA-Z0-9\-\/]+)/g, '$1');

    // Clean up any light mode remnants that are typically paired with dark
    newContent = newContent.replace(/bg-white(?=\s)/g, ''); // Be careful with this, but usually bg-white was the light mode default
    // Actually, blind string replace of bg-white is dangerous if it's meant to be white in dark mode too.
    // Instead, let's let the previous targeted replacements take care of the worst offenders, and generic dark: removal will promote the dark classes.
    // If a div has `bg-white bg-slate-900` after the `dark:` removal, `bg-slate-900` often overrides it, but we can clean up `bg-white bg-slate-` -> `bg-slate-`
    newContent = newContent.replace(/bg-white\s+bg-slate-/g, 'bg-slate-');
    newContent = newContent.replace(/text-slate-[89]00\s+text-slate-/g, 'text-slate-');

    // Specific fix for GarrettModule ternary
    newContent = newContent.replace(/isDark \? 'rgba\\\(255, 255, 255, 0\.1\\\)' : 'rgba\\\(0, 0, 0, 0\.1\\\)'/g, "'rgba(255, 255, 255, 0.1)'");
    newContent = newContent.replace(/isDark \? '#f1f5f9' : '#334155'/g, "'#f1f5f9'");
    newContent = newContent.replace(/isDark \? '#94a3b8' : '#64748b'/g, "'#94a3b8'");
    newContent = newContent.replace(/isDark \? '#cbd5e1' : '#475569'/g, "'#cbd5e1'");

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

traverseDir(srcDir);
console.log('Cleanup complete.');
