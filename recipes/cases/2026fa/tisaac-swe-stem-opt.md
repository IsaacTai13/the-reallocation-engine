---
status: DRAFT # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE
todos_open: 2
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# The Reallocation Engine Recipe: SWE STEM-OPT Runway

## 1. Executive Summary
This recipe is designed for F-1 STEM Information Systems students aiming for Software Engineering roles. Because the student has a 3-year STEM OPT runway, immediate H-1B sponsorship is not a hard requirement. Instead, the scoring model is rebalanced to heavily favor objective "Role Quality" (Location, Remote work, Salary) over immediate visa sponsorship, while strictly filtering out roles that explicitly ban international students.

## 2. Purpose and Source Inventory
- **Target Role:** Software Engineering & Development (including SWE, Software Dev, DevOps, Test/QA, etc., with configurable exclusion for Data/ML).
- **Sources Used:**
  - `model-judgment`: LLM check on Job Description for "No International Students".
  - `your-input`: CLI parameters to exclude specific specialized roles.
  - `record`: DOL H-1B data, SEC Form D funding, BLS Wages, O*NET ability levels, ATS Job Postings (Location/Remote status).

## 3. Phase Gates (Hard Stops)
- **Gate 1: International Student Ban** (If JD explicitly says no sponsorship or US citizens only -> Skip).
- **Gate 2: User Exclusion** (If job title matches user`s excluded keywords like "Machine Learning" -> Skip).

## 4. Votes (Scoring Categories)
To align with the Persona, the scoring model maps to three specific Bayesian buckets:

### A. Sponsorship 
- **H-1B History:** Bonus points if the company has sponsored H-1B before. (Not a deduction if missing).
- **Recent Funding:** Bonus points if company filed a recent SEC Form D (proxy for active hiring capacity).

### B. Fit
- **Skillset Match:** Base points awarded if the job description closely aligns with an Information Systems SWE background.

### C. Role Quality 
*Note: This bucket must be assigned a weight of 0.35 during execution, overriding the engine`s default 0 weight.*
- **Location Preference:** Boston (Max bonus), Major tech hubs like Seattle (High bonus), Secondary cities (Low bonus), Rural (0 points).
- **Work Model:** Remote (Max bonus), Hybrid (High bonus), In-person (0 points).
- **Salary Tier (Pay Level):** Scaled bonus points for $80k+, $90k+, $100k+.
- **AI-Resilience:** Bonus points for roles hard to replace by AI (O*NET).

## 5. What it can and can`t verify
- **Verified:** Past H-1B sponsorships, recent Form D funding, BLS salary baselines, ATS location tags.
- **Inferred:** Whether the current specific role will definitely sponsor (only historical data is known); whether the job description explicitly bans international students (relies on LLM reasoning).
- **[TODO: DATA SOURCE]**: We cannot definitively verify if a company is currently on a "hiring freeze" without internal data, so we use recent funding as a proxy.

## 6. Output Contract & Error Handling
- **Missing Data Handling:** If a company cannot be found in the H-1B or Form D databases, the script will NOT just silently score it 0. It will explicitly label the evidence source as `no-matched` to distinguish "Searched but missing" from "Searched and confirmed none".
- **Job-level exception (Liveness):** If a specific job URL fails to load or parsing breaks, the script will NOT stop. It will score the liveness as `-1` and log the exception reason, ensuring the human reviewer knows it was a parsing error rather than a confirmed 404 dead job.
- **System-level exception:** If the local server, database, or API is down, the script will halt immediately and report the error to the user.
- **Normal Stop:** Stops and returns the report once all jobs in the JSON list are processed.
