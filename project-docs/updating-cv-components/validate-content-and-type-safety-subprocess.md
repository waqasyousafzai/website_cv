# Validate Content and Type Safety - Subprocess

[x] 1. Check that all displayed content is accurate and consistently named
[x] 2. Run formatting, linting, and TypeScript validation
[x] 3. Run a production build and resolve any validation failures

Completed 2026-09-10 on `fix/validate-content-and-type-safety`, created from refreshed `origin/main` using [Task Implementation](../../Workflow/task-implementation.md#2-local-branch-setup). It follows [Update Related Components and Text](update-related-components-and-text-task.md) and checks that task's output rather than extending it.

The branch was opened as `chore/` and renamed to `fix/` before its first commit, because the content pass found real inaccuracies rather than only confirming clean tooling.

## 1. Content accuracy and naming

The Word CV in `docs/private/` was extracted again and every rendered surface was checked against it: the inspector panes, the seven stage callouts, the log lines, the row counts, the footer ticker, the boot panel, the shell lockups, the text download, the page metadata and the README.

Accurate and unchanged:

| Section | Check |
| --- | --- |
| Profile | Name, AWS Data Engineer, Sydney, New South Wales and the summary all match the source. |
| Experience | Three roles, month-level dates, both NatWest titles and the self-employed trading role match. The `$2M` initiative, the `$17M` forecast and the separate `$2M` projection stay distinct and attributed. |
| Skills | 26 labels in five categories, matching the CV's own grouping and order, with no invented ratings. |
| Projects | Three case studies, each labelled as an editorial grouping of employment already described. |
| Education | The single Biological Sciences (BSc) record, 2015, University of East Anglia. |
| Contact | Email, full LinkedIn URL and the phone number, spaced but otherwise as supplied. |
| Counts | Roles, skills, categories, projects, education and contact counts all derive from their arrays and agree across pane notes, callout heads, log lines and row counts. |
| Demo content | A repository sweep for the retired demo claims found nothing outside the design system's own API documentation comments, which the [existing-content review](review-existing-cv-content-subprocess.md) excluded. |

Four strings disagreed with the record shown beside them and were corrected:

| Surface | Was | Now |
| --- | --- | --- |
| `index.html` description | `AWS data engineer` | `AWS Data Engineer`, the title `CV.role` and the CV both use. |
| Replay capture caption | `full refresh` for every archived run, including 4190, which the row beside it shows failing at stage two | The selected run's own `note`. |
| Footer ticker | `avg run · 11.6 s`, which is run 4193's elapsed time rather than the mean of the four runs listed above it | `last run · 11.6 s`. |
| Boot transcript | A hardcoded `waqas-cv` runtime name, the last hand-written copy of the owner's name in the app | Derived from `CV.name`, like the rail initials and the topbar wordmark. |

Deliberately left alone: the simulated stage timings, warehouse and archived transcripts, which the README already identifies as the console metaphor; `Self-employed`, normalized from the CV's `Self-Employed` and used consistently; and the category labels in sentence case, which the skills pane renders uppercase anyway.

## 2. Formatting, linting and TypeScript

`npm run format`, `npm run lint` and `npm run check` reported no fixes across 47 files, both before and after the corrections. `npx tsc --noEmit` exits clean. `npm run generate-routes` leaves `src/routeTree.gen.ts` unchanged, so the generated route tree is in step with `src/routes`.

## 3. Production build

`npm run build` succeeds in both states, 2073 modules transformed. There were no validation failures to resolve. The built output was checked to confirm it carries the corrections: `dist/index.html` has the corrected description, and the bundles contain `last run` and no `avg run`.

## Verification

Content was rendered rather than read from source alone. The download text, all seven stage records, the skill groups, the ticker and the four archived runs were bundled with Vite in SSR mode and printed, then read end to end against the extracted Word CV. The four corrected strings were re-rendered afterwards to confirm each one now reads from the run or the record it describes.

No browser verification was performed here. Narrow-layout behaviour, navigation, the download, contact interaction and rerun behaviour remain with [Verify the Website Visually](verify-the-website-visually-subprocess.md).

Next: [Verify the Website Visually](verify-the-website-visually-subprocess.md).
