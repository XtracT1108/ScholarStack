import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src', 'components');

const replacements = {
    // Text colors
    'text-slate-900': 'text-white',
    'text-slate-800': 'text-slate-100',
    'text-slate-700': 'text-slate-200',
    'text-slate-600': 'text-slate-300',

    // Backgrounds
    'bg-white': 'bg-slate-950', // deep background
    'bg-slate-50': 'bg-slate-900', // cards/panels
    'bg-slate-100': 'bg-slate-800', // hovers/secondary panels
    'bg-slate-200': 'bg-slate-700', // dividers/borders

    // Borders
    'border-slate-100': 'border-slate-800/50',
    'border-slate-200': 'border-slate-800',
    'border-slate-300': 'border-slate-700',

    // Divide
    'divide-slate-50': 'divide-slate-800/50',
    'divide-slate-100': 'divide-slate-800',
    'divide-slate-200': 'divide-slate-700',
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    for (const [light, dark] of Object.entries(replacements)) {
        // Use word boundaries or exact whitespace matching to prevent partial matches
        // But since Tailwind classes are space-separated or quote-bound:
        const regex = new RegExp(`(?<=[_"'\\s])` + light + `(?=[_"'\\s])`, 'g');
        newContent = newContent.replace(regex, (match) => {
            // If the line already has the dark version right next to it, we don't want duplicates, 
            // but just replacing it is fine.
            return dark;
        });
    }

    // Clean up double classes that might have been formed when dark: was removed
    // e.g. text-white text-white -> text-white
    // bg-slate-900 bg-slate-950 -> bg-slate-950
    newContent = newContent.replace(/bg-slate-950\s+bg-slate-900/g, 'bg-slate-950');
    newContent = newContent.replace(/text-white\s+text-white/g, 'text-white');
    newContent = newContent.replace(/bg-slate-900\s+bg-slate-900/g, 'bg-slate-900');
    newContent = newContent.replace(/border-slate-800\s+border-slate-800/g, 'border-slate-800');

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
// Also process App.tsx in root src
processFile(path.join(__dirname, 'src', 'App.tsx'));

console.log('Deep color inversion complete.');
