# Verify the Website Visually - Subprocess

[x] 1. Review the boot, pipeline, replay, inspector, and contact views in a browser
[x] 2. Check narrow, intermediate, and wide layouts for clipping or overflow
[x] 3. Confirm navigation, CV download, contact interaction, and rerun behavior

Completed 2026-09-10 on `fix/verify-website-visually`, created from refreshed `origin/main` at `fb7d4a6` using [Task Initiation](../../Workflow/task-initiation.md). The branch began as `chore/verify-website-visually` and was renamed after browser checks found four rendering defects.

## Browser and coverage

Verified in the Codex in-app browser using screenshots, accessibility state, real clicks and keyboard input, and read-only DOM measurements. Initial inspection used Vite development on port 3000; the substantive checks and fix verification used the production build served by `npm run preview -- --host 127.0.0.1 --port 4173`.

| Layout | Viewports | Coverage |
| --- | --- | --- |
| Narrow | 375 × 812 | Boot, pipeline, all seven inspector panes, Schema tab, contact dialog, replay capture, metrics, history and rerun. |
| Intermediate, stacked | 768 × 1024 | Boot, pipeline and inspector, contact dialog, replay and history. |
| Intermediate, split | 1024 × 768 | Pipeline with side inspector, replay with side history, contact dialog. |
| Wide | 1440 × 900 | Boot, pipeline, all seven inspector panes, contact dialog, replay and completed run. |
| Boundary checks | 320, 540, 850 and 1100 pixels wide | Pipeline toolbar, topbar, profile, callout and run strip. Also checked the 320 × 700 stacked profile. |

Long role titles, paragraphs, project headings, skill categories and contact values wrap within their panes at the main review widths. The graph deliberately scrolls at actual size; Fit to view brings the full graph into its canvas. The footer ticker deliberately clips its animated stream. Long inspectors and replay history remain accessible through their own vertical scroll regions.

## Defects found and corrected

| Defect | Correction | Browser confirmation |
| --- | --- | --- |
| At 375 pixels, the Schema tab and Overview table expanded the stacked pipeline scroll region from 310 to 348 pixels, moving the entire pane sideways. | `SchemaTable` now supplies a named, keyboard-focusable horizontal scroll region around its table. | The outer pane no longer overflows; the table scrolls within its 276-pixel card. ArrowRight changes the table region's scroll offset. |
| At 540, 850 and 1100 pixels, the availability sentence wrapped outside a badge with a fixed 20-pixel height. | The shared badge uses a 20-pixel minimum height. | Two-line badges expand to contain their text; wide single-line badges retain their original size. |
| At 320 and 850 pixels, the stage label's minimum width could force the `prod` badge beyond the run strip. | Allow the stage label to shrink below its former 12-character minimum, using its existing ellipsis. | The run strip's scroll width equals its client width at all four boundary widths; `prod` remains visible. |
| The run progress value changed, but its inline span did not paint a visible bar. | Render the shared progress fill as a block. | A completed run displays a full green bar, measured at 4 pixels high with `width: 100%`. |

The three shared CSS corrections live in `src/styles/ds-components.css`; preserve them when re-syncing the vendored design system. No CV content, routing or dependencies changed.

## Interaction results

| Interaction | Result |
| --- | --- |
| Boot | Both Initialise and Enter navigate to `/pipeline`; the four boot log entries appear. |
| Navigation | Rail links switch pipeline/replay, active navigation and breadcrumbs follow the route, and browser Back/Forward work. Reloading `/pipeline` and `/replay` renders the respective view through the local preview server. |
| Inspector | All seven nodes select the corresponding pane and callout. Stage/Schema switching works. Open in inspector returns from Schema to Stage, reveals the stacked pane and focuses its `tabindex=-1` destination. Close dismisses the callout. |
| Graph and logs | Fit to view displays the full graph on mobile. Disabling Live tail shows the initial log entry; enabling it restores the transcript. |
| CV download | Clicking Download CV produces the 5.5 KB toast and a real 5,668-byte UTF-8 text file in Downloads. Read the downloaded file and confirmed profile, all six section headings, three roles, education and contact details. An existing same-name file caused the browser to append a numeric suffix. The browser automation download-event wait timed out, so success was verified against the actual new files and their timestamps rather than the toast alone. |
| Contact | Rail and topbar buttons open the dialog. Email/message fields accept test text. Send closes the dialog and shows Message queued; focus returns to the opener. Escape and Close also dismiss the dialog and restore focus. This confirms the existing local simulation, not message delivery. |
| Replay | The generated video plays and Pause changes to Play. Throughput/Run duration tabs change the chart. Selecting each of runs 4193–4190 updates the corresponding transcript; the failed run shows its matching caption and failure log. |
| Run/rerun | Run pipeline disables itself while running and completes all seven stages. Re-run this dag starts another run, consumes `?run=true` to leave `/pipeline`, and works again on a later visit. Reloading the consumed URL starts idle rather than rerunning. Completion restores the run button, updates node statuses and fills the progress bar. |

## Validation and limits

`npm run check`, `npx tsc --noEmit` and `npm run build` pass after the fixes. The build transforms 2073 modules. Captured production browser warnings/errors were empty when inspected.

This is a local browser verification, not a cross-browser or physical-device certification. Deployment and Cloudflare route fallback remain unverified. The contact form still has no backend or delivery validation, and replay uses the existing generated placeholder capture. Source and Settings remain scaffold buttons without handlers. These existing product limitations were not expanded into new features during this subprocess.

## Screenshot evidence

Screenshots are stored in [visual-verification](visual-verification/). They record individual moments; logs, counters, ticker and video continue to animate.

- [Boot, intermediate](visual-verification/boot-768.png)
- [Pipeline, narrow](visual-verification/pipeline-375.png)
- [Pipeline, intermediate](visual-verification/pipeline-768.png)
- [Schema after containment fix](visual-verification/schema-375.png)
- [Contact, narrow](visual-verification/contact-375.png)
- [Replay history, narrow](visual-verification/replay-history-375.png)
- [Replay, intermediate](visual-verification/replay-1024.png)
- [Replay, wide](visual-verification/replay-1440.png)
- [Completed pipeline and visible progress](visual-verification/pipeline-complete-1440.png)

Next: [Finalize the CV Update](finalize-the-cv-update-task.md).
