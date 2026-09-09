# Review Existing CV Content - Subprocess

[x] 1. Identify all current CV content sources and rendered sections
[x] 2. Map each content source to the website component that displays it
[x] 3. Record placeholder, outdated, duplicated, or missing information

Reviewed 2026-09-10 for the **Updating CV Components** project.

Scope: repository source inspection to identify content, trace its rendered consumers, and record replacement needs. Application content has not been changed. No authoritative CV was supplied or found among the repository content files inspected; biographical claims below are unverified placeholders, not confirmed facts about the owner. `data.ts` explicitly labels its content as placeholder and `README.md` describes the application as fake with no backend.

## 1. Sources and rendered sections

Paths below are relative to the repository root. Symbols identify the relevant source within each file.

| Content source | Renderer / surface | Content and current coupling |
| --- | --- | --- |
| `src/features/cv/data.ts`: `CV.name`, `role`, `loc`, `summary` | `Panes.tsx`: `Profile`, `Overview`; `cv-text.ts`: `buildCvText` | Profile identity, location, summary; overview repeats summary; download derives these values. |
| `data.ts`: `CV.stats` | `Panes.tsx`: `Overview` → `CountStat` → `StatReadout`; `buildCvText` | Four achievement statistics with units and optional delta. |
| `data.ts`: `CV.experience` | `Panes.tsx`: `Experience` → `TimelineEntry`, `Tag`; `buildCvText` | Three roles, dates, employers, achievements and stack tags. Inspector record count derives from array length. |
| `data.ts`: `CV.skills` | `Panes.tsx`: `Skills` → `SkillMeter`; `buildCvText` | Eight tools, numeric ratings and proficiency descriptions. |
| `data.ts`: `CV.projects` | `Panes.tsx`: `Projects` → `Card`, `Tag`; `buildCvText` | Three project descriptions, kinds and stacks. Inspector count is hardcoded. |
| `data.ts`: `CV.education` | `Panes.tsx`: `Education` → `TimelineEntry`; `buildCvText` | Degree and certification. Inspector count is hardcoded. |
| `data.ts`: `CV.contact` | `Panes.tsx`: `Contact`, also reused by `_app.tsx`: `ContactDialog`; `buildCvText` | Email, GitHub, LinkedIn and phone rendered as plain text. |
| `data.ts`: `CV.schema` | `Panes.tsx`: `Overview`; `PipelineScreen.tsx`: Schema inspector → `SchemaTable` | Six illustrative columns; same schema appears for every selected stage. |
| `data.ts`: `NODES`, `EDGES`, `RUN_ORDER` | `PipelineScreen.tsx` → `PipelineGraph`, `RunStatusBar`, `PANES` | Seven stage labels, kinds, connections and section routing; source/profile, experience, skills, projects, education, overview and contact. |
| `data.ts`: `OUTPUT` | `PipelineScreen.tsx` → `NodeCallout` | Independently written summaries for all seven stages; not derived from `CV`. |
| `data.ts`: `ROWS`, `LOG_FOR` | `PipelineScreen.tsx` → graph nodes, callouts, `LogStream` | Independent counts, tenure, tool totals, certification warning and availability. |
| `src/features/cv/Panes.tsx`: component literals | Inspector sections and contact dialog | Availability, 30-day notice, remote-first, section notes, contact endpoint label and Send/Queued copy. |
| `src/features/cv/BootScreen.tsx`: `BOOT`, JSX | `/` via `src/routes/index.tsx` | Hardcoded owner name, data engineer title, version v2.4, warehouse and seven-stage/seven-edge boot transcript. |
| `src/features/cv/Shell.tsx`: `Rail`, `TopBar` | Shared shell on `/pipeline` and `/replay` | Hardcoded WY initials and full name, route breadcrumbs, throughput tooltip, Source and Settings buttons. |
| `src/routes/_app.tsx`: `AppLayout`, `ContactDialog` | Shared availability badge, contact modal, toast | Hardcoded available badge and simulated Message queued / 202 accepted feedback. |
| `src/features/cv/PipelineScreen.tsx`: literals | `/pipeline` via `_app.pipeline.tsx` | Runtime messages, completion toast, 1.4s stage duration, warehouse/prod badges and download confirmation. |
| `src/features/cv/live.tsx`: `TICKER` | `MetricTicker` on pipeline and replay | Independent achievement metrics, average runtime, stale models, warehouse, notice period and availability. |
| `live.tsx`: `RUNS`, `RUN_LOG` | `ReplayScreen.tsx`: `RunRow`, `LogStream`, replay heading and caption | Four synthetic historical runs, relative dates, outcomes and certification/connection messages. |
| `live.tsx`: `useLiveSeries`; `ReplayScreen.tsx`: `dur` | Sparklines in shell, overview and replay | Locally generated throughput and duration series; no measured remote data. |
| `src/features/cv/ReplayScreen.tsx`: stats and labels | `/replay` via `_app.replay.tsx` | Four hardcoded copies of the CV statistics, chart labels and capture caption. |
| `public/media/run-4193.webm` | `ReplayScreen.tsx` → `VideoPanel` | Existing capture asset; the same URL is used for every selected run. Caption calls it a generated placeholder. Video frames were not reviewed in this source audit. |
| `src/features/cv/cv-text.ts`: `CV_FILENAME`, headings | Download CV button in `PipelineScreen.tsx` | Filename is hardcoded; plain-text body derives profile, stats, experience, skills, projects, education and contact from `CV`. No separate PDF or Word CV found. |
| `index.html`: title and description | Browser title and page metadata on all routes | Independent owner name and data engineer description. |
| `README.md`: Data section | Maintainer instructions, not website content | Incorrectly says replacing CV content only requires editing `data.ts`. |

`src/routes/__root.tsx`, `src/main.tsx`, router plumbing, toast provider, and reusable design/UI components supply structure or render passed values; they do not provide another biographical dataset. Design-component documentation examples are not additional rendered CV claims. The only public asset found was the replay video.

## 2. Current content inventory

| Section | Current values requiring owner confirmation or replacement |
| --- | --- |
| Profile | WAQAS YOUSAFZAI; Data Engineer; Sydney, Australia; six-year streaming/batch summary mentioning Kafka, warehouse, dbt and orchestration. |
| Metrics | 1.2B rows/day (+18% qoq), 99.98% on-time delivery, 41 pipelines, 6 years. |
| Experience | Senior Data Engineer, Acme Data Platform (2022–present): 180 Kafka topics, runtime 6h → 40m, pages down 70%; Data Engineer, Northwind Logistics (2020–2022): 90 dbt models; Analytics Engineer, Vertex Retail (2019–2020): 40 scripts replaced. Associated tool tags also need confirmation. |
| Skills | Airflow, dbt, Snowflake, Python: 5/daily driver; Kafka: 4/production; Spark and Terraform: 3/production; Kubernetes: 2/working. |
| Projects | `topic_to_table` (open source, 1.2B rows/day), `dq_contracts` (internal), `cost_lens` (internal, compute cut 38%). Descriptions and stack tags are placeholders. |
| Education | BSc Computer Science, NUST (2015–2019); SnowPro Advanced: Data Engineer, Snowflake (2023). Degree subject description and certification claim need confirmation. |
| Contact | `waqas@example.com`, `github.com/waqas`, `in/waqas-yousafzai`, `+92 300 000 0000`. These are not verified destinations. |
| Employment preferences | available / accepting offers; 30-day notice; remote-first. These are separate hardcoded assertions. |

## 3. Findings and follow-up

| ID | Classification | Evidence and consequence | Follow-up in later project stages |
| --- | --- | --- | --- |
| CV-01 | Placeholder / missing evidence | All biography and achievements are flagged as placeholders by `data.ts`; no actual CV establishes their accuracy. | Gather approved profile, dates, employers, achievements, tools, projects, education and contact information before replacement. |
| CV-02 | Duplicated | `OUTPUT` repeats identity, roles, project summaries, education, metrics and contact; `LOG_FOR` and `ROWS` repeat counts and claims. Editing `CV` does not update these. | Derive related content from approved data where practical, or explicitly update every mapped source. |
| CV-03 | Inconsistent | Skills pane/download list 8 tools, while logs/output say 24 tools and 8 at production depth, and `ROWS.src_skills` says 24 rows. Output additionally lists Flink, absent from `CV.skills`; only 7 listed tools are daily-driver/production. | Confirm actual tool list and proficiency meaning; align counts and summaries. |
| CV-04 | Inconsistent / potentially outdated | Summary and stats say 6 years; experience output/log says 6.2 years. The open-ended 2019–present timeline is also not aligned with those static claims as of this review. Year-only dates cannot establish exact tenure. | Gather month-level dates and an agreed tenure calculation; avoid treating 6.2 as verified. |
| CV-05 | Missing evidence / duplicated | `LOG_FOR`, `OUTPUT`, `RUN_LOG` assert a certificate expires in 2027; one log says a reminder is set. `CV.education` has no expiry field and no reminder implementation was found. | Confirm certification status and expiry; remove unsupported reminder copy or implement separately if required. |
| CV-06 | Duplicated / missing data fields | Availability and notice occur in profile badges, layout badge, output, logs and ticker; remote-first is only in profile JSX. They are absent from structured `CV` and its download. | Gather current preferences and decide which belong in the CV; use a consistent source. |
| CV-07 | Duplicated | Statistics repeat in `CV.stats`, `OUTPUT.fct_cv`, `TICKER` and replay JSX. Project claims also repeat metrics in prose. | Reconcile verified achievements and update every representation, including units and deltas. |
| CV-08 | Hardcoded counts | Projects and education headings say 3 and 2 records; output/log/row counts are literals. Boot stages/edges and completion copy are also fixed. | Derive counts from relevant collections where possible. Preserve graph labels as presentation unless structure changes. |
| CV-09 | Placeholder / missing interaction | Contact entries are plain spans with no links; LinkedIn is a partial path. Send only changes state and optionally closes the modal with success copy; no message is submitted. | Confirm full URLs, email and phone; agree working contact interaction before retaining delivery claims. Treat the Sydney location and +92 number as requiring confirmation, not proof of an error. |
| CV-10 | Simulated content | Throughput is random local data; duration is generated mathematically. Run history always uses today/yesterday labels and fixed IDs. Pipeline timers run at 1s/stage but output uses 1.4s stage durations and a fixed 11.6s completion. | Decide how simulation is disclosed; do not present it as verified employment evidence or real operational telemetry. |
| CV-11 | Placeholder / inconsistent replay | Every run uses `run-4193.webm`; caption always says full refresh even for the failed run. Statistics do not vary by selected run, and duration labels are fixed at 4170–4193. | Review/replace the capture after real content changes; align selected-run text/media or clearly identify the demonstration. |
| CV-12 | Illustrative schema / unsupported claim | Shared schema includes `impact_pct` marked verified, although no supporting evidence exists and actual `CvRole` has different fields. Every node receives this same schema. | Decide whether the schema is explanatory decoration or should represent actual content; remove unsupported verification wording. |
| CV-13 | Duplicated identity | Boot screen, shell, metadata, profile output/log and download filename independently embed the name or role. | Include these in the related-components update, alongside the central profile. |
| CV-14 | Missing optional information | Project objects have no URLs; certification entries have no credential URL/ID or expiry; contact data has no separate link target. No approved source document is present. | Gather links and credential details where applicable; extend data shapes only when approved information needs them. |
| CV-15 | Missing destination | Rail Source and Settings buttons have no handlers or destinations. | Supply the intended source link or remove misleading affordances during a separately agreed UI change; settings is peripheral to CV content. |
| CV-16 | Outdated maintainer guidance | README says editing `data.ts` alone replaces placeholders; its header comment similarly claims every rendered value lives there. The map above disproves that. | Correct guidance when central data and related content are updated. |

## 4. Handoff and verification

The source inventory, component mapping and findings complete all three review steps. The user confirmed the project and authorized completion tracking on 2026-09-10; this subprocess and its corresponding lifecycle stage are marked complete.

The next lifecycle stage is [Gather and Structure Actual CV Information](gather-and-structure-actual-cv-information-subprocess.md). Use CV-01 and the inventory to collect verified facts, then use the source map and CV-02 through CV-16 for the central-data and related-component tasks. This audit does not execute those later stages.

Verification: read all CV feature modules and route modules; searched source, metadata, README and public assets for independent content and placeholder claims; traced `CV`, `OUTPUT`, `LOG_FOR`, `ROWS`, `RUNS`, `RUN_LOG` and `TICKER` to consumers. The referenced media asset exists. No browser interaction or media-frame verification was performed; those remain in the visual-review subprocess. This is a documentation-only change, so application build and TypeScript checks are not needed for this review artifact.
