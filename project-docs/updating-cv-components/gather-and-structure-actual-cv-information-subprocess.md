# Gather and Structure Actual CV Information - Subprocess

[x] 1. Collect the current CV information for profile, experience, skills, projects, education, and contact details
[x] 2. Normalize names, dates, descriptions, links, and metrics for consistent presentation
[x] 3. Map the finalized information to the project's existing data shapes

Started 2026-09-10 on `docs/gather-actual-cv-information`, created from refreshed `origin/main` using [Task Initiation](../../Workflow/task-initiation.md). Completed source collection and mapping on 2026-09-10 after the owner supplied `docs/private/` as the CV location.

This document now contains the entire former worksheet, followed by the actual normalized information and implementation handoff. Application updates remain in the later central-data and related-components tasks.

## Original preparation record

The following worksheet is preserved in full. Its “awaiting source” statuses and future-tense instructions describe preparation before the owner supplied the CV; the source register and mapped records below supersede those statuses.

# Actual CV Information — Collection and Mapping Worksheet

Prepared 2026-09-10 for [Gather and Structure Actual CV Information](gather-and-structure-actual-cv-information-subprocess.md).

## Source status

No authoritative CV has been supplied in this task or found in the repository file inventory. `src/features/cv/data.ts` explicitly identifies its biography as placeholder content. The previous review documents the same evidence gap. No placeholder has been promoted to a confirmed fact, and no finalized CV records exist yet.

Provide the current CV as a file, pasted text, or an exact source location. That source should supply the bulk of the information below; only missing or ambiguous details need follow-up. Preserve source wording and record its file/page, section, or URL alongside each normalized record. Owner-supplied claims may be used as such without describing them as independently verified. Distinguish missing information from information explicitly omitted by the owner.

## 1. Collection requirements

| Section | Information to collect | Current status |
| --- | --- | --- |
| Profile | Preferred display name, professional title, publishable location, summary | Awaiting source |
| Experience | Each employer, exact role title, start/end dates, current-role status, responsibilities, achievements, technologies | Awaiting source |
| Skills | Actual tools and capabilities, proficiency descriptions, owner-selected 1–5 ratings if retaining the current meter | Awaiting source |
| Projects | Name, type (personal/open source/internal/client as applicable), contribution, description, outcomes, stack, public links where available | Awaiting source |
| Education | Qualification/certification title, institution/issuer, dates, relevant description; credential links, expiry and status where applicable | Awaiting source |
| Contact | Publishable email, full GitHub/LinkedIn URLs, phone only if intended for publication | Awaiting source |
| Supporting metrics | Value, unit, scope, time period, baseline/comparison where relevant, and source for each displayed achievement | Awaiting source |
| Employment preferences | Whether to publish availability, notice period, remote/hybrid/on-site preference, and their current values | Awaiting source |

Do not infer contact details from the git remote, employment location from the machine timezone, proficiency from tool mentions, or credentials from the existing demo. Optional absent projects, metrics or contact methods can be omitted after that intent is established; missing data must not silently become an empty final section.

## 2. Normalization rules

- Names: preserve the owner's spelling and preferred casing. Use the same employer, role, institution and project names everywhere. Preserve deliberate project identifiers and product casing such as `dbt`.
- Dates: retain source precision. Prefer `MMM YYYY — MMM YYYY` or `MMM YYYY — Present` when months are supplied; use `YYYY — YYYY` when only years are known. Use `Present` only for confirmed ongoing roles. Sort experience newest first. Do not invent months or total tenure; overlapping roles must not be double-counted if a tenure metric is later calculated.
- Descriptions: use concise sentences that preserve the owner's contribution and scope. Current responsibilities use present tense; completed work uses past tense. Preserve meaningful technical detail and distinguish team outcomes from individual ownership.
- Links: retain exact verified-by-source destinations with full `https://` URLs for web profiles/projects. Do not guess a username or reconstruct a partial LinkedIn path without confirmation. Preserve email spelling and confirmed international phone prefix; do not infer country codes from location.
- Metrics: retain units, measurement scope, period and qualifiers. Separate percentage change from percentage-point change. Do not derive a precise new claim from an approximate source. A missing delta stays absent; never substitute zero. Consolidate duplicate achievements before mapping to summary statistics.
- Skills: deduplicate equivalent names while preserving distinct technologies. The current download describes a 1–5 scale; obtain ratings from the owner instead of assigning expertise from employment duration. If ratings are not wanted, record that as a later data/UI change rather than inventing values.
- Credentials/preferences: preserve explicit status and dates. Missing expiry does not mean permanent validity. Availability and notice must come from current owner information; no reminder or delivery capability should be inferred from existing simulated UI copy.

## 3. Mapping to existing shapes

The following maps destinations, not finalized values. Interfaces and `CV` are defined in `src/features/cv/data.ts`; `src/features/cv/cv-text.ts` consumes the same records for download.

| Normalized information | Existing destination | Mapping constraint |
| --- | --- | --- |
| Display name, title, location, summary | `CV.name`, `CV.role`, `CV.loc`, `CV.summary` | Required strings in the current object |
| Achievement statistics | `CV.stats: CvStat[]` | `label` and `value` are strings; `unit` and `delta` are optional strings; keep the unit separate from value |
| Employment records | `CV.experience: CvRole[]` | Dates → `when`; title → `role`; employer → `org`; responsibilities/achievements → `body`; tools → optional `tags: string[]` |
| Skills | `CV.skills: CvSkill[]` | Tool name → `label`; owner rating → numeric `value`; proficiency description → `level`; current meter defaults to five ticks |
| Projects | `CV.projects: CvProject[]` | Name → `name`; type → `kind`; contribution/outcome → `body`; stack → required `tags: string[]` |
| Degrees/certifications | `CV.education: CvRole[]` | Dates → `when`; qualification → `role`; institution/issuer → `org`; details → `body`; optional `tags` |
| Contact methods | `CV.contact: CvContact[]` | Method → `k`; public value → `v`; existing `IconName` → `icon` (email: `at-sign`, GitHub: `github`, LinkedIn: `linkedin`, phone: `phone`) |

### Information that needs a later shape or presentation decision

- Project URLs, credential URLs/IDs/expiry and structured start/end dates have no dedicated fields. Keep supplied values in the source record so they are not lost; decide additions during central-data implementation.
- Contact entries have no separate link target. Store full public URLs in `v` for mapping; actionable links and email/phone targets need a later component change.
- Availability, notice period and work arrangement have no central fields. Record their supplied values separately for the related-components task.
- Source provenance is worksheet metadata, not part of the current rendered data model.
- `CV.schema` describes an illustrative pipeline schema rather than these TypeScript shapes. It is not a destination for actual career facts or evidence of verification.

Once source material arrives, create one record per role, skill, project, qualification and contact method, with source reference, normalized content, mapped fields and unresolved questions. Do not import incomplete draft records into the application.

## Completion and handoff

1. Collection is complete when all six sections have source content or explicit omission decisions, and supporting metrics/preferences are resolved where used.
2. Normalization is complete when the rules above have been applied to actual records and material ambiguities are resolved with the owner.
3. Mapping is complete when the normalized records have concrete field values and any unsupported fields have explicit handoff decisions.

Then mark the subprocess and lifecycle stage complete and hand the actual records to [Update Central CV Data](update-central-cv-data-task.md). The [existing-content review](review-existing-cv-content-subprocess.md) identifies duplicate output, logs, ticker, replay, shell and metadata claims for the later related-components task.

Verification of this preparation: inspected the repository inventory, existing audit, `CV` interfaces and values, download consumer, skill meter and icon vocabulary. Documentation only; application build and TypeScript checks do not validate the missing biography and are not required for these changes.


## Actual source register and decisions

The owner identified `docs/private/` as the authoritative source for this task. Read [Word CV](../../docs/private/Waqas_Yousafzai_CV.docx) and cross-checked text against the two-page [PDF CV](../../docs/private/Waqas_Yousafzai_CV.pdf). Their substantive content agrees. Source references below use PDF pages and section/role names, also present in the Word document. Claims are owner-supplied, not independently verified. No external lookup or application publication was performed.

| Section | Collection outcome |
| --- | --- |
| Profile | Name, AWS Data Engineer positioning, Sydney location and professional summary supplied |
| Experience | Three dated roles supplied; none is marked current |
| Skills | Five categories supplied; numeric proficiency ratings absent |
| Projects | No standalone section; three employment-based case studies structured below and explicitly identified as editorial summaries |
| Education | One degree supplied; no certifications or credential links supplied |
| Contact | Email, phone and full LinkedIn URL supplied; no GitHub profile supplied |
| Metrics | Four pipelines and five-person engineering team supported; monetary forecasts and trading claims retained with qualifications |
| Employment preferences | Seeking a new challenge stated; notice period and remote/hybrid preference absent; work-rights statement supplied separately |

Handoff decisions: use only supplied contact methods and education; replace demo projects with the clearly attributed case studies below; omit unsupported availability badges, notice periods, work arrangements and certification warnings. Use unscored skills, requiring a small shape/presentation change in the later implementation. Do not use zero or an invented rating to fit the existing meter. These decisions resolve missing optional source information for this mapping without claiming the owner supplied it.

## Normalized profile and contact records

Source: page 1, heading and Professional Summary.

| Destination | Value |
| --- | --- |
| `CV.name` | Waqas Yousafzai |
| `CV.role` | AWS Data Engineer |
| `CV.loc` | Sydney, New South Wales |
| `CV.summary` | AWS Data Engineer with experience at a major UK bank, engineering production ETL pipelines that turn raw data into high-quality inputs for retail pricing decisions. Recently relocated to Sydney after travelling and seeking a new professional challenge. |
| `CV.contact[0]` | `{ k: "email", v: "waqasyousafzai123@outlook.com", icon: "at-sign" }` |
| `CV.contact[1]` | `{ k: "linkedin", v: "https://www.linkedin.com/in/waqas-yousafzai/", icon: "linkedin" }` |
| `CV.contact[2]` | `{ k: "phone", v: "0468 404 422", icon: "phone" }` |

Phone spacing is normalized from `0468404422`; no country code has been added. The LinkedIn destination is supplied directly in the CV, not inferred or checked for live availability. No GitHub contact is mapped. Seeking a challenge does not establish immediate availability or a specific notice period.

## Normalized experience records

The following objects map to `CV.experience: CvRole[]` in newest-first order. Employer locations are retained in the prose because `CvRole` has no location field. All roles have ended according to the source dates. Descriptions preserve the source claims while consolidating bullets.

### E1 — NatWest, Price Optimisation Manager

Source: page 1, Work Experience, Price Optimisation Manager (Senior Data Engineer).

```json
{
  "when": "Aug 2024 — Jan 2026",
  "role": "Price Optimisation Manager (Senior Data Engineer)",
  "org": "NatWest",
  "body": "Based in London, United Kingdom. Led development for a $2M mortgage optimiser initiative, collaborating with Data & Analytics, Pricing and Finance on data products for mortgage interest-rate pricing. Finance forecast $17M in annual revenue from the delivered products. Engineered four critical AWS ETL pipelines using Glue for ingestion, EMR for Spark compute, S3 and Snowflake for storage, notebooks for exploratory data analysis, and Airflow for orchestration. Documented end-to-end data flows in Confluence with draw.io. Implemented GitLab CI/CD for integration testing, code validation and release management across a team of five data engineers. Maintained freshness, accuracy and reliability SLAs through resource optimisation, debugging and testing.",
  "tags": ["AWS", "AWS Glue", "Amazon EMR", "Apache Spark", "Amazon S3", "Snowflake", "Apache Airflow", "GitLab", "CI/CD", "Confluence", "draw.io"]
}
```

### E2 — NatWest, Data and Analytics Engineer

Source: page 1, Work Experience, Data and Analytics Engineer.

```json
{
  "when": "Jul 2023 — Aug 2024",
  "role": "Data and Analytics Engineer",
  "org": "NatWest",
  "body": "Based in London, United Kingdom. Built pricing pipelines and supported Snowflake setup and integration during migration from Teradata. Partnered with Finance and Pricing to build a what-if mortgage pricing scenario modelling KPI impacts, with projected annual revenue of $2M. Implemented AWS ETL workflows using Lambda, Glue, Step Functions and EventBridge according to compute, orchestration and cost requirements. Configured Snowflake RBAC with custom roles and least privilege. Improved queries, micro-partition pruning and warehouse sizing using query profiles and history. Used tagging for automated PII masking and team-level compute-cost attribution. Partnered with analysts on scheduled Snowflake ELT SQL tasks and presentation views for Tableau. Investigated pipeline and warehouse issues through deep dives and root cause analysis.",
  "tags": ["AWS", "AWS Lambda", "AWS Glue", "AWS Step Functions", "Amazon EventBridge", "Snowflake", "Teradata", "SQL", "Tableau"]
}
```

### E3 — Self-employed, Financial Trader

Source: page 1, Work Experience, Financial Trader (Data Scientist).

```json
{
  "when": "Jun 2016 — Jul 2023",
  "role": "Financial Trader (Data Scientist)",
  "org": "Self-employed",
  "body": "Based in Norwich, United Kingdom. Created trading strategies using machine learning and deep learning. The CV reports outperforming the S&P benchmark by 10% for three years and ranking among approximately the top 2% of retail traders. Developed profitable models using XGBoost, genetic algorithms, Bayesian optimisation, FP-Growth, KNN and Isolation Forest. Integrated Twitter sentiment analysis using NLP to add alternative data signals. Automated an Excel VBA risk-management calculator and trade logger.",
  "tags": ["XGBoost", "Genetic algorithms", "Bayesian optimisation", "FP-Growth", "KNN", "Isolation Forest", "NLP", "Excel", "VBA"]
}
```

The trading claim does not identify the S&P index, comparison methodology, precise years or whether 10% is relative return or percentage points. Preserve its original qualification in prose; do not convert it to a standalone performance statistic. Currency is printed as `$` without an ISO currency code; preserve it in attributed prose and do not label it AUD, USD or GBP. The two $2M figures refer to different scopes (initiative size and projected annual revenue), and must not be merged.

## Normalized skill records

Source: page 2, Skills. Each semicolon-separated item below is a separate normalized `label`. Category membership is retained here for later grouping; it is not a proficiency claim.

| Source category | Normalized labels |
| --- | --- |
| Cloud | AWS; Amazon EMR; Amazon EC2; AWS Glue; AWS Lambda; Apache Airflow (Amazon MWAA); Amazon S3; Snowflake |
| DevOps | GitLab; Version control; Branching; Pull requests; CI/CD pipelines; Agile |
| Languages | Python; SQL; PySpark; Scala; C++; VBA |
| Data visualization | Tableau; Matplotlib |
| Soft skills | Senior stakeholder management; Cross-functional collaboration; Data storytelling; Ownership mentality |

There are 26 explicitly listed skill entries. Source terms `EMR`, `EC2`, `Glue`, `Lambda`, `S3`, `Airflow (MWAA)` and `PRs` have been expanded for clarity. `Event Bridge` in E2 is normalized to `Amazon EventBridge`. Technologies mentioned only in role descriptions remain in role/project tags rather than being assigned additional proficiency records.

Existing shape gap: `CvSkill` requires `label`, numeric `value` and string `level`. Final mapping is the labels above, with `value` and `level` absent because the source supplies neither. Later implementation should make those two fields optional, render an unscored list when absent, and update the text download to omit `/5`. Preserve category metadata here or introduce an optional `category` field if grouping is implemented. This is an explicit implementation decision, not a claim that the records already satisfy the existing TypeScript interface.

## Normalized project records

Source: page 1, the matching experience entries E1–E3. The CV does not name separate projects. These descriptive titles and `kind` values are editorial groupings of supplied work, not official product names, separate employment, or open-source repositories. No URLs were supplied.

```json
[
  {
    "name": "Mortgage pricing data products",
    "kind": "Employment case study · NatWest",
    "body": "Led development for a $2M mortgage optimiser initiative and delivered four critical AWS ETL pipelines supporting mortgage pricing. Finance forecast $17M in annual revenue from the delivered data products.",
    "tags": ["AWS Glue", "Amazon EMR", "Apache Spark", "Amazon S3", "Snowflake", "Apache Airflow"]
  },
  {
    "name": "Mortgage pricing what-if scenarios",
    "kind": "Employment case study · NatWest",
    "body": "Partnered with Finance and Pricing to model KPI impacts from hypothetical mortgage price changes. Implemented AWS ETL workflows for a scenario with projected annual revenue of $2M.",
    "tags": ["AWS Lambda", "AWS Glue", "AWS Step Functions", "Amazon EventBridge"]
  },
  {
    "name": "Machine-learning trading strategies",
    "kind": "Self-employment case study",
    "body": "Developed trading models with XGBoost, genetic algorithms, Bayesian optimisation and data-mining techniques. Integrated Twitter sentiment analysis and automated an Excel VBA risk-management calculator and trade logger.",
    "tags": ["XGBoost", "Genetic algorithms", "Bayesian optimisation", "FP-Growth", "KNN", "Isolation Forest", "NLP", "Excel", "VBA"]
  }
]
```

Map these records directly to `CV.projects: CvProject[]`. The case studies intentionally reuse employment evidence; do not add their outcomes together as independent achievements.

## Normalized education record

Source: page 2, Education. The year is retained as supplied; no start year, degree duration or graduation month is inferred.

```json
[
  {
    "when": "2015",
    "role": "Biological Sciences (BSc)",
    "org": "University of East Anglia",
    "body": "Norwich, United Kingdom."
  }
]
```

Map to `CV.education: CvRole[]`. No certification, credential identifier, expiry or certification URL appears in the supplied CV. Omit the demo Computer Science degree and Snowflake certification during the later application update.

## Normalized metrics and additional source information

Use these two scoped statistics for `CV.stats: CvStat[]`; the existing four-card count is presentation, not a requirement to manufacture four achievements.

```json
[
  { "label": "Critical ETL pipelines delivered at NatWest", "value": "4" },
  { "label": "Data engineering team supported by CI/CD", "value": "5" }
]
```

Source: page 1, E1. The first count belongs to the Aug 2024–Jan 2026 role; it is not a current inventory. The second is team size, not direct reports or a management claim. No deltas apply. Keep the $2M initiative, $17M finance forecast and separate $2M revenue projection qualified in the experience/project prose rather than displaying ambiguous currency or realised-revenue statistics. Do not map the placeholder 1.2B rows/day, 99.98% delivery, 41 pipelines, six years or 6.2 years. No aggregate tenure is calculated from overlapping boundary months or across differing role types.

Source: page 2, Work Rights. The CV states a Working Holiday Visa is valid through **31 January 2028**, a plan to apply for a Partner visa, an anticipated Bridging Visa until an outcome, approximately three years of combined work rights, and permanent work rights conditional on a successful Partner Visa application. This is recorded as the owner's source statement, not a legal assessment or confirmation that an application has occurred. No current shape accommodates work rights. Retain this information here; defer public work-rights copy until the owner confirms its current wording. It does not block mapping the six CV sections and must not be silently converted to unrestricted or permanent work rights.

## Final handoff and verification

All three subprocess tasks are complete for the supplied source. All six sections have mapped source content or explicit source-based omission/grouping decisions. The original preparatory requirements are preserved above; source-dependent decisions are resolved here without inventing biographical values. The unscored-skill shape change and treatment of optional work-rights copy are explicit downstream decisions.

Next: [Update Central CV Data](update-central-cv-data-task.md), then [Update Related Components and Text](update-related-components-and-text-task.md). Use the normalized records above, adapt skills for absent ratings, and synchronize duplicate identity, metrics, counts and contact text identified in the [existing review](review-existing-cv-content-subprocess.md). Records total: three roles, 26 listed skills, three employment-based project summaries, one degree, three contact methods and two scoped statistics. Remove unsupported demo claims and retain simulation disclosures.

Validation: extracted Word body paragraphs and relationships; read both PDF pages and cross-checked their content against Word; checked mapped fields against `data.ts`, the skill-meter contract and download behavior. This was a content inspection, not a layout audit or independent verification of career claims. No source CV files or application code were changed. Markdown links and whitespace were checked; application build and TypeScript tests are unnecessary for this documentation-only change. The separate worksheet was removed after its full text was incorporated here.
