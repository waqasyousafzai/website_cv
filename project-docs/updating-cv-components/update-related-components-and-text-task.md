# Update Related Components and Text - Task

[ ] Update any component-specific labels, copy, download text, pipeline output, logs, and replay content that must stay consistent with the actual CV data.

Implemented 2026-09-10 on `feat/update-related-components-and-text`, created from refreshed `origin/main` using [Task Initiation](../../Workflow/task-initiation.md). It follows [Update Central CV Data](update-central-cv-data-task.md), which listed the interim state this task clears, and resolves the duplicated-content findings in the [existing-content review](review-existing-cv-content-subprocess.md).

## Approach

The demo narration was not rewritten by hand a second time. Where a surface states something the CV already holds, it now reads `CV` instead of repeating it, so the two cannot drift apart again. Only the console metaphor — stage names, the warehouse, run timings, the archived runs — is still written by hand, because none of it is a claim about the owner.

## What changed

| Surface | Change |
| --- | --- |
| `OUTPUT` | Every stage callout is derived. Identity, roles, skills by category, project names, the degree and the contact methods come from `CV`; `fct_cv` now lists what the row holds rather than four invented operational metrics. |
| `LOG_FOR` | Log lines carry the real counts. The certification-expiry warning is gone, so `stg_education` completes `ok`. |
| `ROWS` | All five record counts derive from their arrays. Education reads `1 row`, not `2 rows`. |
| Skills pane | Renders the CV's five categories as chips instead of 26 meters drawn at zero. A skill that carries a rating still gets its meter. |
| Section notes | Experience, skills, projects and education counts derive from the arrays. Projects said `3 records`, education said `2 records`, and skills said `ticks are honest`. |
| Profile and shell badges | `available`, `notice: 30d` and `remote-first` are replaced by the one preference the CV states. |
| Footer ticker | The CV's two statistics, record counts and location, plus the simulated run time and warehouse. Rows per day, on-time delivery, pipelines owned, stale models and notice period are gone. |
| Replay statistics | The four hand-written cards are now the same `CvStats` the overview shows. |
| Replay history | Run 4192's certification warning became a retried stage, so the archived transcript asserts nothing about the CV. |
| Boot panel | Name, role and the stage and edge counts derive. |
| Shell | Rail initials and the topbar wordmark derive from `CV.name`. |
| Download | Filename derives from the name. Skills print under the CV's own categories, matching the pane. The header line carries the status. |
| `index.html` | The description said `data engineer`; the CV says AWS Data Engineer. |
| `README.md` | Corrected the claim that editing `data.ts` alone replaces the CV, and the claim that everything in the app is fake. |

## Decisions

- **`CV.status`.** Availability was asserted in five places and supported by none of them. The CV states one preference, in its summary: seeking a new challenge. That is now a field, and the profile badge, the topbar badge, the identity callout, the `serve_contact` log line and the ticker all read it. No notice period, availability date or work arrangement is published, and the work-rights statement stays out until the owner confirms its wording, as the gather subprocess asks.
- **`CvSkill.category`.** Added, because the skills pane needed a presentation for unscored skills and the CV's own five categories were already recorded in the gather subprocess. `SKILL_GROUPS` folds the flat list into those categories once, and the pane, the stage callout and the download all render from it.
- **Skills as chips.** `SkillMeter` defaults an absent rating to zero, so 26 unscored skills read as 26 skills rated zero. Chips state the same list without inventing a score. The meter is kept for any skill that does carry one, matching the branch the download already has.
- **`impact_pct`.** The illustrative schema no longer notes a column as `verified` (finding CV-12). The schema stays decoration, which is what its type comment already says.
- **Run history.** Run 4192 still fails softly, because the replay view needs a warning state to show. Its message now concerns a retried stage rather than a certification the owner does not hold.
- **Callout wrapping.** The callout's body hides horizontal overflow, so a real email address or profile URL was cut off. Values wrap mid-token, as the contact pane's rows already do.
- **Topbar badge.** The status is a sentence rather than a word, and the topbar's right-hand group cannot wrap inside itself, so the badge steps aside below 540px. The profile pane and the ticker still carry it there.

## Not changed here

- **Contact interaction (CV-09).** The addresses are still plain text and Send still reports a queued message that is never sent. The review makes working contact an agreed change, not a consistency fix, so it needs the owner's decision on what should happen when someone presses Send.
- **Rail Source and Settings buttons (CV-15).** Still without destinations. The review assigns these to a separately agreed UI change.
- **The replay capture (CV-11).** `public/media/run-4193.webm` predates the real content and every run still plays it. Its frames were not reviewed here; that belongs to [visual verification](verify-the-website-visually-subprocess.md).
- **Simulated timings.** Stage duration, elapsed run time and the archived transcripts stay as written. They describe the fake pipeline, and the README now says so.

## Verification

`npm run format -- --write`, `npm run check`, `npx tsc --noEmit` and `npm run build` all pass. The generated download text was rendered and read end to end, and every inspector pane was rendered to static markup and read, to confirm the counts, the grouped skills and the contact values. The derived stage records were printed for all seven stages and checked against the CV. The repository was swept for the retired demo claims; the only remaining matches are API examples in the design system's own documentation comments, which the review excluded.

No visual review was performed, and the browser extension was unavailable in this session, so narrow-layout behaviour of the new chips, the wrapped callout values and the hidden topbar badge is unconfirmed. That is [Verify the Website Visually](verify-the-website-visually-subprocess.md).

Next: [Validate Content and Type Safety](validate-content-and-type-safety-subprocess.md).
