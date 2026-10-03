# Change Brief: SWE STEM-OPT Runway

## 1. Career Situation & Engine Layers
- **Situation:** F-1 STEM Information Systems student, pre-OPT, targeting broader Software Engineering/Development roles (SWE, DevOps, Test). Wants to maximize 3-year OPT runway.
- **Layers Used:** DOL H-1B history, SEC Form D funding, BLS Wages, O*NET ability levels, ATS job posting data (Location/Work model).

## 2. Reuse & Proposed Additions
- **Reuse:** `data/80-days-to-stay/` (H-1B and Form D mapping), `data/bls/compact/soc_occupation_compact.csv`.
- **Additions [TODO: DEV]:** A `model-judgment` wrapper to parse JDs for international student bans, and a CLI parser for `--exclude-roles`.

## 3. Gates
- **Gate 1:** Does the JD explicitly ban international students? (Human verify: Check the JD text against the LLM's explanation).
- **Gate 2:** Does the job title match user's excluded roles? (Human verify: Check the title).

## 4. Predicted Failure Cases
1. **Failure Case 1 (Missing Company Data):** The company is a small startup with no H-1B history or Form D in the CSV. 
   - *Check:* The script will simply award 0 bonus points for these categories and evaluate based on salary/resilience. It will not hallucinate a record.
2. **Failure Case 2 (Job Exception):** The job URL is behind a captcha or the JD cannot be fetched.
   - *Check:* The script will catch the exception, score the job as `-1`, and list "Fetch Error" as the reason, allowing the rest of the batch to complete.

## 5. First Pass Prediction
I predict the first pass of the prototype will struggle with the `model-judgment` gate (parsing "US Citizen only" text) because LLMs might hallucinate or misinterpret boilerplate EOE (Equal Opportunity Employer) statements as sponsorship bans.

## 6. Later Revisions (Added during Planning)
- **Prediction 3 (Data Silencing):** I predict jobs will get 0 points for H-1B/Form D not because they lack it, but because of string-matching failures (e.g., "Google" vs "Google LLC"). I will explicitly tag these as `no-matched` rather than silently scoring 0.
- **Prediction 4 (Liveness False Negatives):** The ATS Liveness gate might fail to find a job because it is too new or the parser is outdated, not because it is closed. I must ensure the script distinguishes between a verified 404 (dead) and a parsing error (script failure = -1).
- **Prediction 5 (LinkedIn Easy Apply / Non-ATS URLs):** I predict that providing LinkedIn "Easy Apply" URLs or custom startup website URLs will trigger the `-1` Parsing Exception. The engine is a direct URL parser, not a search engine, so if the URL does not resolve to a supported ATS domain (Greenhouse, Lever, etc.), it will fail to parse rather than definitively skipping the job.
