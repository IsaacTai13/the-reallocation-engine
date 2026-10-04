Assignment: The Reallocation Engine — Recipe Design Assignment
Student: Isaac Tai
GitHub handle: tisaac
Domain / situation: F-1 STEM IS student targeting SWE/DevOps. Prioritizing 3-year OPT runway and subjective/objective Role Quality over immediate H-1B sponsorship. Saves time in the '2 hours applying' phase of the 3-3-2 split by pre-filtering non-ATS and mismatched roles.
Recipe path: recipes/cases/2026fa/tisaac-swe-stem-opt.md
Prototype command: node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js
GitHub repository / branch / PR URL: IsaacTai13/the-reallocation-engine / contrib/2026fa-tisaac-swe-stem-opt / [INSERT PR URL HERE]
Submitted commit SHA: [INSERT COMMIT SHA HERE]
Lifecycle stage claimed: RUNNABLE-SAMPLE
Summary of my changes: Implemented recipe & prototype for STEM OPT persona. Added 'no-matched' honesty tagging for missing CSV data. Added '-1 Exception' catch for non-ATS scraping errors. Re-mapped Location, Remote, and Salary explicitly to 'role_quality' bucket to fix 0.35 threshold weighting issues.
Known limitations: The `model-judgment` score for the 'International Student Ban' gate is mocked to 1.0 in the offline prototype to prevent LLM hallucinations from corrupting the local CSV testing pipeline.
