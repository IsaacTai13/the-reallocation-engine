# Submission: SWE STEM-OPT Runway

**Student Handle:** tisaac  
**Branch:** `contrib/2026fa-tisaac-swe-stem-opt`  
**Date:** 2026-10-03  

## 1. Artifact Directory
- **Recipe & Card:** `recipes/cases/2026fa/tisaac-swe-stem-opt.md`
- **Change Brief:** `course/2026fa/submissions/tisaac/CHANGE-BRIEF.md`
- **Frictional Log:** `course/2026fa/submissions/tisaac/FRICTIONAL.md`
- **Run Log (Worked Run):** `logs/runs/2026fa-tisaac-1.md`
- **Prototype Script:** `scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js`

## 2. Persona & Strategy Summary
This project implements a Reallocation Engine recipe for an **F-1 STEM Information Systems student** targeting Software Engineering roles. 

Because the persona benefits from a 3-year STEM OPT runway, the strategy fundamentally shifts away from requiring immediate H-1B sponsorship. Instead, the recipe heavily prioritizes **Role Quality**, combining objective job metrics (O*NET AI-resilience, BLS Salary) with personal lifestyle preferences (Boston location, Remote work models). Jobs are only strictly gated (Skip) if they explicitly ban international students (e.g., "US Citizens Only").

## 3. Key Technical Implementations
To ensure the prototype adheres strictly to the **Honesty Rule**, the following edge-case handling was implemented:
- **`no-matched` Tagging:** If a company is not found in the H-1B or SEC Form D CSV datasets, the script assigns a score of 0 and tags the source as `no-matched` rather than hallucinating a record or silently failing.
- **`-1` Liveness Exception:** Anticipating that custom startup URLs and LinkedIn Easy Apply links cannot be parsed by standard ATS logic, the script intercepts these URLs and assigns a Liveness score of `-1` (Exception). This safely zeroes out the job's composite score while leaving a clear audit trail of the fetch error.

## 4. Deepest Insight & System Feedback
The most significant discovery during this project was a mathematical misalignment between the Bayesian Engine's default weights and the Persona's strategy. 

Initially, the engine's high weight on Sponsorship (0.35) meant that a non-sponsoring company (0 points) required a mathematically perfect 1.0 Fit score to reach the 0.3 `Apply` threshold. 

By analyzing the engine's output, I discovered that the engine leaves a 0.35 weight unassigned by defaulting `role_quality` to 0. By re-categorizing Location, Remote work, Salary, and Resilience strictly under the `Role Quality` bucket, and explicitly demanding that the missing 0.35 weight be assigned to this bucket, the math perfectly aligns with the Persona: A job with no immediate sponsorship can still confidently pass the threshold based purely on its high Role Quality. This realization is thoroughly documented in the `FRICTIONAL.md`.

## 5. Compliance Checklist
- [x] Conformance checks passed (`node scripts/conformance.mjs`).
- [x] All development isolated to the `tisaac` namespace.
- [x] No PII, private resumes, or hallucinated records were committed.
