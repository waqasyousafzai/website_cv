# Update Central CV Data - Task

[x] Replace the placeholder values in `src/features/cv/data.ts` with the structured actual CV information.

Completed 2026-09-10 on `feat/update-central-cv-data`, created from refreshed `origin/main` using [Task Implementation](../../Workflow/task-implementation.md#2-local-branch-setup). The values come from the normalized records in [Gather and Structure Actual CV Information](gather-and-structure-actual-cv-information-subprocess.md), whose source is `docs/private/`.

## What changed

| Field | Replacement |
| --- | --- |
| `CV.name`, `role`, `loc`, `summary` | Waqas Yousafzai, AWS Data Engineer, Sydney, New South Wales, and the mapped professional summary. |
| `CV.stats` | The two scoped statistics: four critical ETL pipelines delivered at NatWest, and the five-person data engineering team supported by CI/CD. |
| `CV.experience` | Three roles, newest first, with month-level dates, employer locations kept in prose, and technology tags. |
| `CV.skills` | The 26 listed skills in the CV's own category order, with no ratings. |
| `CV.projects` | The three employment-based case studies, labelled as such in `kind`. |
| `CV.education` | The single Biological Sciences (BSc) record. |
| `CV.contact` | Email, full LinkedIn URL and phone number. No GitHub entry, because the CV supplies none. |

## Shape decisions

- `CvSkill.value` and `CvSkill.level` are now optional. The CV states no 1–5 ratings, and the gather subprocess forbids inventing them or substituting zero.
- The record now has a declared `Cv` interface, and the per-property `satisfies` clauses are gone. `satisfies` narrowed each array to the literals actually written, so removing every `unit`, `delta`, `value` and `level` deleted those optional fields from the type and broke the download's type check. Declaring the record keeps optional fields available to consumers while still checking the literal.
- No `category` field was added. The gather subprocess makes that conditional on grouping being implemented, which is a presentation decision for the related-components task; the category order and membership are preserved in that subprocess document.
- `CV.schema` is unchanged. The gather subprocess rules it out as a destination for career facts. Its `impact_pct` column is still noted as `verified`, which finding CV-12 asks to resolve.

## Two changes outside `data.ts`

Both are regressions this data change caused, fixed here rather than left for a later task.

`src/features/cv/cv-text.ts` printed each skill as `${s.value}/5 · ${s.level}`, which became `undefined/5 · undefined` for all 26 unscored skills. An unscored skill now prints as its name alone. This is one line in the download builder, taken to avoid shipping literal `undefined` in a downloadable CV. The rest of the download's headings and copy stay with the related-components task.

`src/features/cv/Panes.tsx` laid out each contact row as an unshrinkable flex line. The 340px inspector leaves roughly 182px for the value after the icon, the fixed 64px key and the padding. The demo values fit; the actual email needs about 226px and the LinkedIn URL about 343px, so the row pushed the pane into horizontal scrolling. The value span now shrinks and wraps mid-token, and the icon and key no longer shrink. Raised by the automated reviewer on pull request 18.

## Known interim state

These are the responsibility of [Update Related Components and Text](update-related-components-and-text-task.md) and are not defects in this change:

- The skills pane renders 26 empty five-tick meters, because `SkillMeter` defaults an absent `value` to zero. It needs an unscored presentation.
- `OUTPUT`, `LOG_FOR` and `ROWS` still narrate the demo: 24 tools, 6.2 years, the Acme/Northwind/Vertex roles, the certification expiry warning, the placeholder contact details and the four retired statistics.
- Hardcoded counts in `Panes.tsx` still say three projects and two education records; education now holds one.
- The name, role, availability badges, notice period, ticker metrics and replay statistics remain hardcoded in their own components.

## Verification

`npm run format -- --write`, `npm run check`, `npx tsc --noEmit` and `npm run build` all pass. The generated download text was rendered and read end to end to confirm each section carries the actual records. Content was cross-checked against the Word and PDF sources in `docs/private/`. No visual review was performed; that is the [visual verification subprocess](verify-the-website-visually-subprocess.md).

Next: [Update Related Components and Text](update-related-components-and-text-task.md).
