import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const FIXTURE_PATH = path.join(__dirname, 'fixture.json');
const OUTPUT_JSON_PATH = path.join(__dirname, 'my-roles.json');
const REPO_ROOT = path.resolve(__dirname, '../../../../');
const CSV_PATH = path.join(REPO_ROOT, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv');

console.log("🚀 Starting SWE STEM-OPT Prototype...");

// 1. Read Fixture
const jobs = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));
console.log(`Loaded ${jobs.length} test jobs.`);

// 2. Read Real Repo CSV Data
const csvData = fs.readFileSync(CSV_PATH, 'utf-8');
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] ? values[i].replace(/^"|"$/g, '') : '');
        return obj;
    });
}
const records = parseCSV(csvData);

// Create a lookup map for faster searching
const companyMap = new Map();
records.forEach(row => {
    companyMap.set(row.company_name.trim().toUpperCase(), row);
});

// 3. Process each job based on Recipe logic
const evaluatedRoles = jobs.map(job => {
    const roleId = job.id;
    const companyUpper = job.company.toUpperCase();
    
    // Evaluate Data Layer (H-1B / Funding)
    let sponsorshipScore = 0.0;
    let sponsorshipSource = "no-matched";
    
    if (companyMap.has(companyUpper)) {
        const data = companyMap.get(companyUpper);
        if (data['Total Approvals'] && parseInt(data['Total Approvals']) > 0) {
            sponsorshipScore = 0.8; // Bonus points for H1B history
            sponsorshipSource = "record";
        } else if (data['total_funding'] && parseFloat(data['total_funding']) > 0) {
            sponsorshipScore = 0.4; // Bonus points for recent funding (Proxy for no freeze)
            sponsorshipSource = "record";
        }
    }
    
    // Evaluate Liveness & Parsing (-1 Error logic)
    let livenessFactor = 1.0;
    if (!job.url.includes("greenhouse.io") && !job.url.includes("lever.co")) {
        // Trigger our custom Exception condition for non-ATS domains
        livenessFactor = -1.0;
        console.warn(`[WARNING] Job ${roleId} triggered a Parsing Exception! (-1 Error)`);
    }

    // Mock the Model-Judgment Gate (International Student Ban)
    // We assume all our test jobs pass this gate for now.
    const fitScore = 1.0;
    const fitSource = "model-judgment";

    // Format output matching scorer schema
    return {
        "role_id": roleId,
        "company": job.company,
        "title": job.title,
        "sponsorship": { "p": sponsorshipScore, "source": sponsorshipSource },
        "fit": { "p": fitScore, "source": fitSource },
        "liveness": { "factor": livenessFactor, "source": "record" },
        "timeline": { "factor": 1.0, "source": "your-input" }
    };
});

// 4. Save output
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(evaluatedRoles, null, 2));
console.log(`✅ Saved evidence tagged output to ${OUTPUT_JSON_PATH}`);

// 5. Run the Professor's Engine
try {
    console.log("⚙️ Calling role-scorer.mjs...");
    const cmd = `npm run score -- ${OUTPUT_JSON_PATH} --out-dir ${__dirname}`;
    execSync(cmd, { cwd: REPO_ROOT, stdio: 'inherit' });
    console.log("🎉 Run complete!");
} catch (error) {
    console.error("❌ Scorer failed:", error.message);
}
