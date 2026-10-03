# Friction Log: tisaac

Scope: `course/2026fa/submissions/tisaac`

### 2026-10-03 13:56:00: Understanding the Engine & Data Sources

**What I tried**
I attempted to clarify the purpose and data sources of `the-reallocation-engine` because I initially thought it was a generative AI resume writer. I asked the AI to explain the core mechanics and where data like SEC Form D and DOL H-1B records come from.

**What happened**
The AI broke down the "3-3-2 Split" theory and explained that the engine is a factual evidence-checker (using Gates and Votes) built on top of pre-cleaned government datasets stored in the repository.

**What I learned**
I realized the tool is designed to automate the heavy lifting of background research (reallocating time to networking) rather than writing content. I also learned that I must use the specific namespaces (e.g., `tisaac-ds-opt`) to avoid conflicts with other students.

**What I'll change next**
I accepted the project framework and will focus my design on using real data layers (like Form D and H-1B history) to filter jobs, rather than relying on LLM generation.

### 2026-10-03 13:58:00: Handling Missing Data & The Honesty Rule

**What I tried**
I asked the AI whether the engine would definitely find matching data for every company I list, and what should happen if a company isn't in the database.

**What happened**
The AI confirmed that missing data is common and expected, especially since the repo uses sample data. The AI strongly emphasized the assignment's "Honesty Rule," which forbids using the LLM to hallucinate or guess missing visa/funding records.

**What I learned**
I learned that failing to find a company in the CSV is not a bug, but a necessary "failure case" that my prototype must handle.

**What I'll change next**
I will explicitly tag missing records (e.g., `[TODO: 缺少資料]`) in my script instead of letting the AI guess. This will also be one of my predicted failure cases for the `CHANGE-BRIEF.md`.

### 2026-10-03 18:30:00: Defining Persona and Data Constraints

**What I tried**
The user defined their specific Persona: an F-1 STEM Information Systems student (pre-OPT) targeting SWE roles. The user proposed a specific logic: Gate out jobs that explicitly refuse international students; add bonus points for H-1B history, high salaries, and AI-resilient jobs (O*NET); deduct points for past hiring freezes; and parameterize role exclusion (e.g., filtering out Data/ML).

**What happened**
I analyzed this against the Engine's available datasets. The strategy of not strictly requiring H-1B (since 3 years of STEM OPT is enough runway) is an excellent, highly specific edge case. However, "past hiring freezes" isn't a provided dataset, whereas "recent funding" (SEC Form D) is the exact opposite (proof of hiring budget) and readily available.

**What I learned**
The user's willingness to accept roles without H-1B sponsorship to maximize the 3-year OPT runway makes this a unique Recipe. I also realized that checking "does not sponsor international students" will require an LLM to parse the Job Description, making it a `model-judgment` gate, while the parameterized exclusion will be `your-input`.

**What I'll change next**
I will suggest modifying the "hiring freeze" deduction to a "recent funding (SEC Form D)" bonus. Once the user approves, I will check off Step 1 in PLAN.md and proceed to draft the `CHANGE-BRIEF.md`.

### 2026-10-03 18:35:00: Defining Stop Conditions & Populating Recipe

**What I tried**
The user explicitly defined their logic for "Stop Conditions" and error handling: job-specific errors should not halt the script but instead score the job as `-1` with a logged reason. System-wide errors should halt execution immediately. The user also asked to populate the Recipe and Card files with these rules.

**What happened**
I incorporated this elegant exception-handling logic directly into `tisaac-swe-stem-opt.md` under the "Stop Conditions" section. I also drafted the `CHANGE-BRIEF.md` based on our agreed Persona and constraints.

**What I learned**
The user's approach to scoring errors as `-1` is a very robust design pattern for batch processing jobs. It perfectly satisfies the assignment's requirement to clearly handle named failure cases without inventing values or crashing.

**What I'll change next**
I have populated the Recipe, Card, and Change Brief. I will now update `PLAN.md` to check off Steps 2, 3, and 4, moving our progress to Step 5 (Prototype Development).

### 2026-10-03 18:45:00: Expanding Target Roles

**What I tried**
After reviewing the drafted Recipe, the user pointed out that targeting strictly "Software Engineer" was too narrow. They wanted to include related roles like DevOps, Test, and general Software Dev, while still keeping the configurable exclusion for Data/ML.

**What happened**
I updated the Target Role definition across the Recipe, Card, and Change Brief to explicitly include "Software Engineering & Development (including SWE, Software Dev, DevOps, Test/QA, etc.)".

**What I learned**
This expansion makes the tool much more practical for an Information Systems student, as tech job titles are often fluid. The script will need to be flexible in how it evaluates job titles against the SOC codes (BLS data) to ensure these related roles aren't accidentally filtered out.

**What I'll change next**
When building the Prototype in Step 5, I will ensure the role-matching logic relies on a broader set of keywords or SOC code families rather than an exact string match for "Software Engineer".

### 2026-10-03 18:50:00: Adding Location and Work Model Scoring

**What I tried**
The user proposed adding two new tiered scoring criteria (Votes): 
1. Location: Boston (Max points) > Seattle/Major hubs > Secondary cities > Rural (0 points).
2. Work Model: Remote (Max points) > Hybrid > In-person (0 points).

**What happened**
I incorporated these new votes into the Recipe and Card files. I mapped these data points to the ATS (Applicant Tracking System) job posting data, as locations and work models are typically parsed directly from Greenhouse/Lever postings. 

**What I learned**
Adding structured tier-based scoring (rather than simple boolean pass/fail) perfectly utilizes the Engine Scorer`s design, which calculates a cumulative score. It also requires the script to categorize city strings (e.g., matching "Boston" or "Cambridge" into the highest tier).

**What I'll change next**
In the prototype script, I will need to build a small mapping logic or dictionary for the location tiers to properly assign these bonus points.

### 2026-10-03 19:10:00: Refining Failure Cases and Liveness Constraint

**What I tried**
The user reviewed the concept of the `CHANGE-BRIEF.md` and proposed two excellent new failure cases: 
1. Adding a `no-matched` tag to distinguish between "searched and not found" vs "searched and confirmed 0". 
2. Demoting the ATS Liveness check from a Gate to a Vote (0 points with a `not exist?` tag) because they feared false negatives (e.g., job too new, ATS parser failed). I also brainstormed additional failure cases (company name mismatches).

**What happened**
I appended these revisions to the `CHANGE-BRIEF.md`. However, I had to reject the user's proposal to demote ATS Liveness to a Vote. The assignment explicitly mandates: "Liveness and visa timeline are gates, not votes." 

**What I learned**
The user's intuition about false negatives in ATS scraping is spot on. However, to comply with the assignment's strict rubric, we must keep Liveness as a hard gate. The compromise is to clearly distinguish between a verified "404 Dead" (which triggers the Gate) and a script parsing error (which triggers the user's previously defined `-1` exception). The `no-matched` tag is a brilliant application of the Honesty Rule and was added to the Recipe.

**What I'll change next**
When coding the prototype, I must strictly implement the `no-matched` output tag for CSV lookups, and ensure the Liveness check correctly distinguishes between 404s and generic parsing exceptions.

### 2026-10-03 19:28:00: Clarifying ATS Scraper Mechanics and Link Resolution

**What I tried**
The user asked clarifying questions about how the engine actually "finds" jobs on ATS platforms, wondering if it actively searches Greenhouse/Lever for the company name, or if it crawls the company website to find the ATS link. 

**What happened**
I explained that the engine is a passive URL parser. It evaluates the exact URL provided in the JSON. If the URL (or its redirect) lands on a known ATS domain and returns a 404, it skips. If the URL stays on a non-ATS site (like LinkedIn Easy Apply or a custom startup page), the parser fails because it doesn't recognize the HTML structure.

**What I learned**
The user had a crucial "Aha!" moment, realizing that the boundary between a `Skip` (confirmed dead) and a `-1` (parsing exception) is entirely dependent on whether the input URL resolves to a supported ATS domain. This deeper understanding of web scraping mechanics directly validates the necessity of the `-1` error handling logic we designed earlier.

**What I'll change next**
I added this specific edge case (LinkedIn Easy Apply and Custom URLs failing to parse) as a formal predicted failure case in the `CHANGE-BRIEF.md`.
