import fs from 'fs';

const indexPath = 'scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js';
let content = fs.readFileSync(indexPath, 'utf-8');

// Remove csv-parse import
content = content.replace("import { parse } from 'csv-parse/sync';\n", "");

// Replace parsing logic
const oldParse = "const records = parse(csvData, { columns: true, skip_empty_lines: true });";
const newParse = `function parseCSV(text) {
    const lines = text.trim().split('\\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] ? values[i].replace(/^"|"$/g, '') : '');
        return obj;
    });
}
const records = parseCSV(csvData);`;

content = content.replace(oldParse, newParse);
fs.writeFileSync(indexPath, content);
