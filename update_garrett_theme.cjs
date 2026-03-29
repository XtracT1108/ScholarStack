const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'src/components/GarrettModule.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Color mappings
const replacements = [
    // Slate background shifts
    { search: /bg-slate-900/g, replace: 'bg-slate-800' },
    { search: /border-slate-800/g, replace: 'border-slate-700' },
    { search: /divide-slate-800/g, replace: 'divide-slate-700' },

    // Indigo -> Sky mappings
    { search: /text-indigo-600/g, replace: 'text-sky-400' },
    { search: /text-indigo-400/g, replace: 'text-sky-400' },
    { search: /text-indigo-300/g, replace: 'text-sky-300' },
    { search: /text-indigo-900/g, replace: 'text-sky-100' }, // methodology info text

    { search: /bg-indigo-600/g, replace: 'bg-sky-500' },
    { search: /bg-indigo-500/g, replace: 'bg-sky-500' },
    { search: /bg-indigo-400\//g, replace: 'bg-sky-400/' },
    { search: /bg-indigo-50\b/g, inline: true, replace: 'bg-sky-900/20' }, // button backgrounds
    { search: /bg-indigo-50\//g, replace: 'bg-sky-900/' },
    { search: /bg-indigo-100/g, replace: 'bg-sky-900/40' },

    { search: /border-indigo-600/g, replace: 'border-sky-500' },
    { search: /border-indigo-200/g, replace: 'border-sky-700' },
    { search: /border-indigo-100/g, replace: 'border-sky-800' },

    { search: /ring-indigo-500/g, replace: 'ring-sky-500/50' },
    { search: /ring-indigo-400/g, replace: 'ring-sky-400' },

    // Text Slate shifts for better contrast
    { search: /text-slate-500/g, replace: 'text-slate-400' },

    // Specific transitions
    { search: /transition-all"/g, replace: 'transition-all duration-300 ease-in-out"' },
    { search: /transition-colors"/g, replace: 'transition-colors duration-300 ease-in-out"' }
];

replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
});

fs.writeFileSync(filePath, content);
console.log('Successfully updated GarrettModule.tsx');
