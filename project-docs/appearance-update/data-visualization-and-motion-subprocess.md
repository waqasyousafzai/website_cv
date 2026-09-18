# Data Visualization and Motion - Subprocess

## Inputs and Scope

Begin after lifecycle points 1–5 are complete. Use `project-docs/appearance-update/reference-brief.md`, the approved visualization and motion handoffs in the `## Audit Findings` of `project-docs/appearance-update/current-ui-audit-subprocess.md`, the mapped visual-system tokens, and the restyled routes as the design and ownership baseline; do not infer a new direction directly from the inspiration sources.

This subprocess owns the detailed visual and motion treatment of the shared pipeline graph, nodes and callouts; badges, logs, run progress and status; sparklines, stat readouts, scored skill meters, experience timelines, run-history states, the metric ticker, and visualization-specific replay treatments. Make feature-level changes in `src/features/cv/` only when required to integrate or correctly label those shared components. Shell layout, general controls, route composition, CV copy, local data, pipeline execution semantics, and media playback behavior remain owned by earlier stages and must not be redesigned here.

The timed boot reveal, pipeline stage timer, live-series sampling, and video playback are state or content behavior, not decorative animation. Preserve them under reduced motion unless changing them is necessary to keep information immediately available; reduced-motion work should remove or make instantaneous the presentation effects around those state changes.

[x] 1. Reconcile the Current UI Audit handoff with the checked-out implementation and derive a finite implementation checklist for this subprocess. Cover `PipelineGraph`, `PipelineNode`, `NodeCallout`, `Badge`, `LogStream`, `RunStatusBar`, `Sparkline`, `StatReadout`, `SkillMeter`, `TimelineEntry`, `MetricTicker`, relevant replay/run-history treatments, and every motion effect they use; do not create a duplicate audit deliverable.
[x] 2. Refine the shared components and their `ds-*` styles so graph topology, connector geometry, hierarchy, labels, units, status, selection, progress, and historical-run states use the mapped technical-diagram language consistently. Preserve public APIs where practical, and keep reusable styling in the vendored token/component layer rather than route-local overrides.
[x] 3. Integrate the refined components into `/pipeline` and `/replay` and into the pipeline inspector panes that contain the overview statistics, experience and education timelines, or scored skills. Preserve the existing `NODES`, `EDGES`, `RUN_ORDER`, `CV`, `RUNS`, `RUN_LOG`, and `TICKER` sources and the existing route workflows; do not invent ratings, metrics, run outcomes, or remote data to make a visualization look fuller.
[x] 4. Implement restrained motion only for meaningful state feedback: active edge flow, running-state emphasis, selection and callout entry, progress changes, sparkline drawing or updates, count-up presentation, ticker movement, and media-status decoration where present. Use shared motion tokens, keep simulation timing separate from presentation timing, avoid layout-shifting animation, and ensure interaction never waits for an effect to finish.
[x] 5. Complete reduced-motion and accessibility behavior. Stop continuous or decorative effects, make finite transitions immediate, replace moving-only presentation with a usable static state, and retain the underlying state changes and data. Ensure interactive nodes and run-history rows have keyboard activation and visible focus; selection, status, meter values, chart meaning, and progress are exposed through text or semantics rather than color or motion alone.
[x] 6. Browser-check the affected states at `360×800`, `700×900`, `900×900`, and `1440×900` to exercise the narrow, row, split, and full-console layout regimes. Repeat the motion-bearing flows with `prefers-reduced-motion: reduce`, resolve regressions within this subprocess's ownership, then run `npm run check`, `npx tsc --noEmit`, and `npm run build`.

## Scope Boundaries

- Keep the router-only SPA, local simulation, route URLs, query handling, scroll ownership, and existing route purposes intact. Add no data-fetching layer, charting library, or unrelated dependency.
- Token creation or correction belongs in `src/styles/tokens/`; reusable visualization styling belongs in `src/styles/ds-components.css` and `src/components/design/`. A measured geometry value that depends on a graph viewport may remain at the feature integration point, but visual color, glow, and motion values may not.
- Do not manufacture scored skill meters when the CV has no score. Unscored skills remain textual tags, and purely decorative visualization marks remain hidden from assistive technology while their meaning is available in adjacent or explicitly associated text.

## Acceptance Criteria

- The pipeline DAG renders every entry in `NODES` and every valid relationship in `EDGES` with connectors meeting the correct nodes in both Actual size and Fit to view at `360×800` and `1440×900`. Actual size keeps off-screen graph content reachable through the intended graph scroller; Fit to view shows the complete DAG without unintended graph scroll, clipping, or connector drift.
- Activating any pipeline node with a pointer or with Enter/Space visibly selects that node, opens the callout for the same id, and exposes the matching `OUTPUT` and status data. The callout and its close and **Open in inspector** actions remain reachable, and the callout stays within the visible graph frame after internal scrolling, viewport resizing, and either direction of the fit-mode toggle.
- Starting a pipeline run still advances stage selection, node status, applicable live edges, logs, run progress, and the status bar in the existing seven-stage `RUN_ORDER`; completion and the one-shot `?run=true` entry behavior remain unchanged. Idle, running, successful, warning, and failure presentations are distinguishable by text or another non-color cue wherever the existing pipeline or replay data presents those states; this criterion does not require inventing new failure paths.
- Sparklines, stat readouts, any data-backed scored skill meters, experience and education timelines, run-history rows, progress displays, badges, logs, and the metric ticker remain legible and correctly associated with their labels, values, units, and states. They use the existing `CV`, run, log, and ticker data; missing skill scores remain unscored rather than receiving fabricated values.
- Visual plots that are not self-explanatory have an accessible name or adjacent text summary; status and selection are not conveyed only by color; scored meters expose their value and scale; and run progress exposes its state and value to assistive technology. Redundant SVG paths, connector lines, glow, and other decorative marks do not add noise to the accessibility tree.
- Motion is limited to active data flow, running or selected state, progress and metric changes, and purposeful entry feedback. It uses the mapped motion tokens, does not animate layout-affecting dimensions or cause visible layout shifts, does not trap focus or steal scroll position, and never delays pointer or keyboard interaction.
- With `prefers-reduced-motion: reduce`, edge flow, pulses, sweeps, blinking cursors, ticker movement, sparkline drawing or moving heads, count-up animation, smooth scrolling, and other non-essential transitions stop or resolve immediately to their meaningful end state. The ticker exposes at least one complete, non-duplicated set of its values without depending on marquee movement, while pipeline execution, live data updates, status, progress, logs, and video controls remain usable.
- At `360×800`, `700×900`, `900×900`, and `1440×900`, the affected content respects the intended page, graph, log, and inspector scroll regions; it creates no document-level horizontal overflow, overlapping content, clipped essential control, or unreachable visualization data. Pointer and keyboard checks cover node selection, callout actions, run-history selection, metric tabs, and any visualization-related scroll region.
- Visual styling is implemented through the mapped vendored tokens and shared component classes. Route-level arbitrary color, shadow, effect, or motion overrides are not introduced; any feature-level inline geometry is derived from measured layout behavior rather than visual-system constants.
- `npm run check`, `npx tsc --noEmit`, and `npm run build` complete successfully after the changes.

## Task 1 — Audit Reconciliation and Implementation Checklist

### Baseline

- Date: 2026-09-18. Branch `feat/data-visualization-and-motion`, cut from `origin/main` at `47992f1` (*feat: restyle routes for appearance update (#35)*).
- Uncommitted application source at start: none. `Workflow/task-implementation.md` (workflow doc) and `.claude/` (untracked local config) are the only dirty paths; neither is application source.
- Browser: the built-in Chromium pane. Server: `npm run dev` → `http://localhost:3000`. Measurements taken at a real `1440×900` CSS-pixel viewport (`innerWidth 1440`, `innerHeight 900`, `devicePixelRatio 2`), `prefers-reduced-motion: reduce` not matching.
- Inputs read in full: `reference-brief.md`, the `## Audit Findings` of `current-ui-audit-subprocess.md`, `visual-system-mapping-task.md` §3 (Motion) and §4, and the consolidated handbacks of `route-by-route-restyling-subprocess.md`.

### Reconciliation — what the audit handed over vs. what is checked out

Stages 3–5 landed more of the audit's motion handoff than the audit itself recorded. Re-reading `src/styles/tokens/motion.css` against the audit's gap list:

| Audit / mapping gap | State on this branch | Consequence for this subprocess |
| --- | --- | --- |
| `.ds-badge--running .ds-badge__dot` pulse hardcoded, uncollapsed | **Closed.** Now `var(--dur-pulse)`, and the selector is on the reduced-motion disable list. | No work. Verify only. |
| `.ds-node--running .ds-node__icon` pulse hardcoded, uncollapsed | **Closed.** Same treatment. | No work. Verify only. |
| `.ds-video__dot--live` pulse hardcoded, uncollapsed | **Closed.** Same treatment. | No work. Verify only. |
| `.ds-graph__edge--live` uses `--dur-flow`, which never collapses | **Closed.** Selector added to the disable list. | No work. Verify only. |
| `.ds-log__cursor` blink hardcoded `1s`, uncollapsed | **Partly closed.** Duration is now `var(--dur-blink)` and the selector is on the disable list. | No CSS work. The JS half below is still open. |
| `BootScreen.tsx` paced `setInterval` reveal has no motion check | **Open.** `LINE_EVERY = 260` runs unconditionally. | **Owned here.** Item R-1. |
| Inconclusive `scrollIntoView` reduced-motion sample (`PipelineScreen.tsx`) | Source is correct; the runtime sample was polluted by the `700×900` bug that stage 5 has since fixed. | **Owned here.** Re-verify only — item V-3. |

Three of the four remaining `motion.css` animations still carry hardcoded durations even though they are correctly disabled under reduced motion: `.ds-node--running::after` (`1.35s`), `.ds-spark__head` (`1.6s`), `.ds-spark__line--draw` (`900ms`). These are visual-system constants living outside the token layer, which this subprocess's Scope Boundaries forbid — item M-1.

Runtime re-confirmation of the stage-5 handbacks, measured at `1440×900` with `src_profile` selected:

- **Callout stub is fully clipped.** `.ds-callout__stub` measures `x 265 → 281` while its parent `.ds-callout` starts at `x 280` and carries `clip-path: polygon(0 0, calc(100% - 14px) 0, …)`. A `clip-path` clips to the border box, so all 16px of the connector stub is outside it. The callout is visually detached from the node it describes — the single largest miss against "connector geometry".
- **`ds-callout-in` slides horizontally regardless of side.** `animationName: ds-callout-in`, whose keyframes are `translateX(-8px)`, is applied by `.ds-callout` unconditionally; a `top`- or `bottom`-placed callout therefore enters sideways, away from its own stub.
- **Side callouts cover neighbouring nodes.** The `src_profile` callout occupies `x 280 → 580`; `stg_projects` sits at graph `x 248`. Confirmed overlap.
- **The ticker cannot show one full set without marquee movement.** `.ds-ticker` `clientWidth 1036` vs. `.ds-ticker__track` `scrollWidth 2491` → one undoubled set is ~1245px, wider than the frame. With the marquee stopped under reduced motion, the tail of the set is unreachable. Both copies are also in the accessibility tree — 14 items announced for 7 values.
- **Plots and meters expose nothing.** `.ds-spark__svg` is `aria-hidden="true"` with no name on its wrapper; `.ds-meter` has no `role`/value; `.ds-runbar__meter` is a bare `span` pair.

### Implementation checklist

Finite and closed: every item below is delivered by tasks 2–6 of this subprocess. Items are referenced by id in each task's record.

**G — Graph, nodes and connectors** (`PipelineGraph.tsx`, `PipelineNode.tsx`, `.ds-graph*`, `.ds-node*`)

- G-1 Replace the single-bezier edge with orthogonal technical-diagram routing (horizontal stub → radiused corner → vertical run → radiused corner → horizontal approach), so connectors read as a schematic rather than a loose S-curve.
- G-2 Draw the port where each edge leaves and meets a node, and an arrow cap at the target, so a connector visibly terminates on the correct node at every scale and in both fit modes.
- G-3 Give each node a visible, non-color status marker (glyph) in addition to its existing `sr-only` status word, and a hierarchy pass over label/kind/rows/duration so units and figures read as a data readout.
- G-4 Keep the graph frame's grid, but tie node geometry to tokens; no new route-local color, glow or motion.

**C — Callout** (`NodeCallout.tsx`, `.ds-callout*`, `calloutBox` in `PipelineScreen.tsx`)

- C-1 Make the connector stub visible — it must escape the notch `clip-path` and meet the node.
- C-2 Make the entry animation directional per `side`, so the box enters from its own stub.
- C-3 Keep the box inside the visible graph frame after internal scroll, resize, and either direction of the fit toggle (preserve the existing measured-geometry approach; no visual constants move into the feature file).

**D — Data displays** (`Sparkline.tsx`, `StatReadout.tsx`, `SkillMeter.tsx`, `TimelineEntry.tsx`, `LogStream.tsx`, `RunStatusBar.tsx`, `Badge.tsx`, `MetricTicker.tsx`)

- D-1 `Sparkline`: add optional gridlines and an optional value summary so the plot reads as an instrument, not a squiggle. Decorative marks stay out of the accessibility tree.
- D-2 `StatReadout`: tighten the numeral/unit/delta hierarchy and make the delta's direction legible without color.
- D-3 `SkillMeter`: expose value and scale as text and semantics. Do not manufacture a score — unscored skills stay textual tags (`Panes.tsx` already splits them; preserve that).
- D-4 `TimelineEntry`: make the rail a precise diagram marker rather than a filled blob.
- D-5 `LogStream`: give each level a non-color glyph, a keyboard-reachable scroll region with an accessible name, and keep the cursor.
- D-6 `RunStatusBar`: segment the progress meter as a technical readout, expose state and value semantically, and keep the existing clip-not-wrap behaviour.
- D-7 `Badge`: differentiate the status dot by shape as well as color.
- D-8 `MetricTicker`: under reduced motion, present one complete, non-duplicated, fully reachable set; hide the duplicate copy from assistive technology at all times.
- D-9 `RunRow` (`ReplayScreen.tsx`): expose selection semantically and give it a non-color selected cue.

**M — Motion** (`motion.css`, consumers)

- M-1 Move the three remaining hardcoded animation durations (`ds-node--running::after`, `ds-spark__head`, `ds-spark__line--draw`) onto tokens.
- M-2 Restrict motion to meaningful feedback: live edge flow, running emphasis, selection/callout entry, progress change, sparkline draw, count-up, ticker, media status. Nothing animates a layout-affecting dimension.
- M-3 Keep simulation timing (`STAGE_MS`, `useLiveSeries`, `LINE_EVERY`, video playback) separate from presentation timing; no interaction waits on an effect.

**R — Reduced motion and accessibility**

- R-1 Gate `BootScreen.tsx`'s paced log reveal on `prefers-reduced-motion`, showing the complete sequence immediately while preserving the boot content.
- R-2 Extend the reduced-motion disable list to every new effect introduced here, and confirm each finite transition resolves to its meaningful end state.
- R-3 Keyboard activation and visible focus for pipeline nodes, callout actions, run-history rows, metric tabs, and every visualization scroll region.
- R-4 Status, selection, meter value, chart meaning and progress exposed through text or semantics, never color or motion alone; decorative SVG kept out of the accessibility tree.

**V — Verification**

- V-1 Browser matrix at `360×800`, `700×900`, `900×900`, `1440×900` across idle, running, complete, callout-open, and both fit modes.
- V-2 Repeat the motion-bearing flows with `prefers-reduced-motion: reduce`.
- V-3 Re-verify the previously inconclusive `scrollIntoView` reduced-motion sample.
- V-4 `npm run check`, `npx tsc --noEmit`, `npm run build`.

### Explicitly not in this subprocess

Recorded so they are not silently absorbed: the replay video's `src`/caption not following the selected run, and the Run-duration sparkline's bespoke `Math.sin` series (both preserved by the audit); route composition, shell layout, CV copy, local data, and the seven-stage execution semantics; any new dependency, charting library or data-fetching layer. No new failure path is invented to demonstrate a failure state.

## Task 2 — Shared Component and `ds-*` Refinement

Everything below is in the vendored layer (`src/styles/tokens/`, `src/styles/ds-components.css`, `src/components/design/`). No public prop was removed or renamed; five optional props were added.

### Graph, nodes and connectors

| Item | Change | Rationale |
| --- | --- | --- |
| G-1 | `PipelineGraph`'s `path()` now emits an orthogonal run — horizontal stub, quadratic corner, vertical run, corner, horizontal approach — instead of one cubic bezier. Corner radius `CORNER = 10`, capped by the space the run actually has (`min(CORNER, |Δy|/2, |mx − x1|, |x2 − mx|)`) so a short hop stays an elbow. A same-row edge degrades to `M…H…`. | A schematic states "this feeds that"; an S-curve gestures at it. |
| G-2 | New `.ds-graph__port` (5px square at each source node's right edge) and `.ds-graph__cap` (7×7 arrowhead whose tip lands exactly on each target node's left edge). Derived **per node**, not per edge: two connectors arrive at `fct_cv` on the same point, and two stacked arrowheads would double the ink for nothing. A port or cap is "live" when any edge through it is. | Without them an orthogonal run stops in mid-air at the node edge. |
| G-3 | `PipelineNode` gains `.ds-node__flag` — a 12px state badge on the stage symbol carrying `–` idle, `▸` running, `✓` ok, `!` warn, `✕` fail, `aria-hidden` because the existing `sr-only` status word already says it. The rows/duration line becomes `.ds-node__meta--figures`: brighter than the stage type, `tabular-nums` so a changing count does not jitter the column. | The flag rides the symbol because the label row has no space (below). |
| G-3a | `.ds-node__top` gap `--s-4` → `--s-3`; `.ds-node__label` gains `min-width:0` + ellipsis. | The widest name in the DAG (`src_experience`, 127.7px) needed 150.7px of a 150px row, so it was **already** losing a hairline of its last character silently. 6px gives it 129px. The ellipsis is now the visible fallback rather than a silent clip. |

### Callout

| Item | Change |
| --- | --- |
| C-1 | `.ds-callout` is now an unclipped positioning frame; the new `.ds-callout__box` child carries the notch `clip-path`, the border, the surface and the glow. A `clip-path` clips to the border box, so the connector stub could never have been visible as a child of the clipped box. The frame carries a `drop-shadow()` filter instead of a rectangular `box-shadow`, so the shadow now follows the notch. |
| C-2 | Three new keyframe sets (`ds-callout-in-left/-top/-bottom`) selected by `.ds-callout--left/--top/--bottom`, so the box enters from the side its stub is on instead of always sliding in from the left. |

### Data displays

| Item | Change |
| --- | --- |
| D-1 | `Sparkline` gains `grid` (hairline dashed rules across the plot's own 4–96 band, so they sit inside the data's range), `label` and `unit`. Given a `label` the wrapper becomes `role="img"` with a spoken summary — *"Run duration, last 24 runs — latest 12.1 seconds, low 8.9, high 13.9, 24 samples"*. Without one it stays decoration and keeps out of the accessibility tree. The emission head is now explicitly `aria-hidden`. |
| D-2 | `.ds-stat__value` is a baseline flex row with `tabular-nums`; the unit moves from three route utilities onto `.ds-stat__unit`. `.ds-stat__delta` gains a `▲`/`▼` pseudo-element so direction survives without hue. |
| D-3 | `SkillMeter` prints the score (`3/5`) beside the level and puts `role="meter"` with `aria-valuenow/min/max/valuetext` on the tick row; the ticks themselves become `aria-hidden`. New optional `name` prop for when `label` is not a plain string. |
| D-4 | `.ds-timeline__node` becomes a hollow square around a centre dot — the same mark the graph uses for a port, so a timeline record and a DAG stage read as one system. |
| D-5 | `LogStream` gains `label` (default `"Console log"`), `role="group"` and `tabIndex={0}`: the stream scrolls, and its tail was previously unreachable by keyboard. A per-level mark (`›` `✓` `!` `✕`) renders `aria-hidden` **inside** the existing 52px level cell, so it costs no column and cannot push a message into an extra wrapped line. `.ds-log__ts` gains a gutter rule. |
| D-5a | `.ds-log__row` gap `--s-5` → `--s-3` and the gutter's padding `--s-4` → `--s-3`. The rule now does the separating that the wide gap was doing, and the message column — the one that has to hold a wrapped line at 360px — ends up **14px wider than before this subprocess**. See the regression note in Task 6. |
| D-6 | `.ds-runbar__meter` is 6px, bordered, and overlaid with a repeating tick gradient so progress reads as seven discrete stages rather than a smooth wash; the fill underneath stays one animatable width. The meter is `role="progressbar"` with `aria-valuenow` and `aria-valuetext` (`"43% — running"`), and a visible `.ds-runbar__pct` figure sits beside it. |
| D-7 | `.ds-badge__dot` goes 5px → 6px and is shape-coded: square idle, circle running, diamond ok, triangle warn, cross fail. The badge's own status **word** remains the primary cue; the shape is the redundant one. |
| D-8 | `MetricTicker` marks its second copy `.ds-ticker__item--dup` and `aria-hidden` at all times — it exists only so the `-50%` keyframe lands on an identical frame, and it was previously announcing all seven values twice. Under reduced motion the component drops the duplicate entirely and takes a tab stop, while `motion.css` turns the frame into a scroll region. New `label` prop, `role="group"`. |

### Motion

- **M-1** `--dur-sweep: 1.35s`, `--dur-head: 1.6s` and `--dur-draw: 900ms` added, replacing the last three hardcoded animation durations (`.ds-node--running::after`, `.ds-spark__head`, `.ds-spark__line--draw`). No visual-system constant now lives outside the token layer.
- **M-2** `.ds-graph__cap--live` and `.ds-callout` added to the reduced-motion disable list, alongside the new `.ds-ticker` / `.ds-ticker__item--dup` rules.
- New file `src/lib/use-reduced-motion.ts` — the preference as `useSyncExternalStore` state, for the two cases where the preference changes *what is rendered* rather than only how it animates (the ticker's duplicate copy and tab stop; the boot log's paced reveal). It tracks the preference live, because `motion.css` does and the two must not disagree until the next reload.

## Task 3 — Route Integration

No `NODES`, `EDGES`, `RUN_ORDER`, `CV`, `RUNS`, `RUN_LOG` or `TICKER` entry was added, removed or altered, and no route workflow changed.

| File | Change |
| --- | --- |
| `Panes.tsx` | Overview's throughput plot takes `grid={2}` and `label="Rows per minute, live"`. |
| `ReplayScreen.tsx` | Both metric plots take `grid={3}` and a label (the duration plot also `unit="seconds"`). `RunRow` gains `aria-pressed` — the same toggle semantics a pipeline node already uses — and a reserved 13px caret gutter that shows `▸` only on the selected row, so selection is not left to a gold border and a glow. The transcript names itself `Run <id> transcript`. |
| `PipelineScreen.tsx` | The live console names itself `Pipeline run log`. |
| `BootScreen.tsx` | Names its log `Boot log`; the reveal gate is Task 5. |

`Shell.tsx`'s topbar sparkline was deliberately left unlabelled: it sits behind a visible `thrpt` label and a tooltip, which is the "adjacent text summary" the criterion allows, and the shell belongs to lifecycle stage 4.

**`SkillMeter` has no live instance.** All 26 entries in `CV.skills` are unscored (`value` absent, source-confirmed), so `Panes.tsx` renders every one as a textual `Tag` and no meter is mounted anywhere in the app. Manufacturing a score to demonstrate the component is explicitly out of scope, so D-3 is source-verified plus a DOM-probe check of its `.ds-meter*` styling (Task 6).

## Task 4 — Motion

Motion is limited to: live edge flow (`ds-flow`), the arrival cap on a live edge and the running node's symbol and badge dot (`ds-pulse`), the running node's sweep (`ds-sweep`), callout entry (`ds-callout-in-*`), progress-fill width, sparkline draw and emission head (`ds-draw`, `ds-head`), count-up, ticker travel (`ds-marquee`), and the log cursor (`ds-blink`). Every one is a state or data change, and every duration is a token.

- **No layout-affecting dimension is animated.** The only animated width is `.ds-runbar__fill` inside a fixed-size meter; everything else animates `opacity`, `transform`, `stroke-dashoffset` or `filter`.
- **Simulation timing stays separate from presentation timing** (M-3): `STAGE_MS`, `useLiveSeries`'s interval, `LINE_EVERY` and video playback are untouched and do not read a motion token; `--dur-*` never gates a state change.
- **No interaction waits on an effect.** Node selection, the callout, the fit toggle and run-history selection all commit on the event; the entry animation plays over already-committed state.

## Task 5 — Reduced Motion and Accessibility

- **R-1** `BootScreen`'s paced reveal is gated. Under `reduce` the completed four-line sequence is set in one pass; otherwise the 260ms interval runs unchanged. The panel is already sized for the finished sequence, so neither path moves the layout. The four lines are known at first paint — the timer only withholds them — so showing them at once *is* the meaningful end state, and it makes "press enter to initialise" available a second earlier.
- **R-2** Every animation observed running anywhere in the app is on the disable list; see Task 6 for the enumeration.
- **R-3** Keyboard: pipeline nodes, callout close and action, both log scroll regions, metric tabs and run-history rows are all in the tab order with a visible `:focus-visible` ring; the ticker takes a tab stop only while it is a scroll region.
- **R-4** Status, selection, meter value, plot meaning and progress are each carried by text or semantics: node `sr-only` status word plus flag glyph, badge status word plus dot shape, run-row `aria-pressed` plus caret, `role="progressbar"` with `aria-valuetext`, `role="meter"` with `aria-valuetext`, `role="img"` with a range summary. Decorative marks — edge paths, ports, caps, gridlines, baseline, emission head, tick segments, level glyphs, the ticker's duplicate copy — are all `aria-hidden` or inside an `aria-hidden` SVG.

## Task 6 — Browser Matrix and Validation

Built-in Chromium pane, real CSS-pixel viewports (`innerWidth`/`innerHeight` confirmed at each size), `npm run dev` on `http://localhost:3000`.

### Matrix

| Viewport | Route | Result |
| --- | --- | --- |
| `360×800` | `/pipeline` | 7 nodes, 7 edges, 6 ports, 4 caps. No document or body horizontal overflow. Graph scroller `clientWidth 295` / `scrollWidth 896` — the intended graph scroll, nothing else. Callout placed `bottom` with a vertical stub, inside the frame, close and **Open in inspector** both present. No node label clipped. Status bar not clipped, `0%` figure visible. |
| `360×800` | `/pipeline` fit-to-view | All seven nodes inside the frame, `overflow: hidden`, `scrollLeft 0`, scale `0.329`. Callout still inside the frame with its stub. |
| `360×800` | `/replay` | No horizontal overflow. Transcript fits its 250px box exactly (0 overflow). Tab order: rail → Contact → video Pause → metric tabs → four run rows → transcript → **Re-run this dag**. |
| `360×800` | `/` | Boot log fits its 214px box exactly (0 overflow, `scrollTop 0`) — see the regression below. |
| `700×900` | `/pipeline` | Callout `right`, inside frame. Nothing clipped. Progress bar `0% — idle`. Console log named and focusable. |
| `700×900` | `/` | Boot log fits its 124px box (0 overflow). |
| `900×900` | `/pipeline` | Callout `bottom`, inside frame. No pre-scrolled region on fresh load — the stage-5 `700×900` auto-scroll fix holds. |
| `1440×900` | `/pipeline` | Stub bridges node edge `264` → box edge `280` exactly. Full `?run=true` run to completion: all seven stages `ok`, status bar `100%`, toast fired, URL consumed. |
| `1440×900` | `/replay` | Badge dots render as diamond (ok), triangle (warn), cross (fail) at 6px, each beside its status word. |

### Motion and reduced motion

Every animation actually running in the app was enumerated from computed style during an active run, then checked against the reduced-motion block read back from the CSSOM:

| Animation | Element | On disable list |
| --- | --- | --- |
| `ds-flow` ×2 | `.ds-graph__edge--live` | yes |
| `ds-pulse` | `.ds-graph__cap--live` | yes (added here) |
| `ds-pulse` | `.ds-node--running .ds-node__icon` | yes |
| `ds-pulse` | `.ds-badge--running .ds-badge__dot` | yes |
| `ds-sweep` | `.ds-node--running::after` | yes |
| `ds-head` | `.ds-spark__head` | yes |
| `ds-blink` | `.ds-log__cursor` | yes |
| `ds-marquee` | `.ds-ticker__track` | yes |
| `ds-callout-in-*` | `.ds-callout` | yes (added here) |

No animation is unaccounted for. The `.ds-callout--left/--top/--bottom` rules set only `animation-name`, so the block's `animation:none!important` on `.ds-callout` wins over all four variants regardless of specificity.

**How reduced motion was driven.** This browser pane exposes no `prefers-reduced-motion` emulation, so the two halves were driven separately and the method is recorded rather than glossed:

1. *CSS half* — the media block's rules were read out of `document.styleSheets` and matched against the running-animation list above. The ticker's scroll behaviour was then confirmed by applying the block's own declarations directly: with the marquee stopped and `overflow-x: auto`, the strip scrolls its full `385px` range and the last item (`availability date · Immediate`) lands fully in view.
2. *JS half* — `window.matchMedia` was replaced with one reporting `reduce`, then the component tree remounted via a client-side route change (`matchMedia` returns a new `MediaQueryList` per call, so the hook's own object cannot be reached with a synthetic `change` event). Under that preference `MetricTicker` renders **7 items, 0 duplicates**, all seven values present exactly once, `tabIndex 0`. `BootScreen` showed all four log lines at **80ms** where the paced reveal takes 1040ms; reloading without the patch restored the pacing (0 → 1 → 3 → 4 rows over 1.3s).

**V-3 — the previously inconclusive `scrollIntoView` sample is now conclusive.** Rather than timing a scroll, `Element.prototype.scrollIntoView` was instrumented to record its arguments. **Open in inspector** at `700×900` calls it on the inspector element with `{behavior: "smooth", block: "start"}` under full motion and `{behavior: "auto", block: "start"}` under `reduce`. The call fires in both cases — it is not a no-op — and the audit's open question is closed.

### Keyboard

Real `Tab` presses move focus and produce a `2px rgb(235,204,51)` `:focus-visible` outline (`element.matches(':focus-visible')` true). The `/pipeline` tab order runs rail → Contact → Run pipeline → Download CV → Live tail → Fit to view → all seven nodes in DAG order → callout close → **Open in inspector** → console log → Stage/Schema.

**Enter/Space activation remains source-confirmed, now with a controlled negative result.** A focused node receives trusted `keydown` and `keyup` for Enter but no `click` follows. A freshly created plain `<button type="button">`, added to the same page and focused, behaves identically — trusted `keydown`, no `click` — for both Enter and Space. The tool cannot dispatch native button activation; this is not an application defect, and every control involved is a real `<button>`. The audit's recommendation of a manual keyboard pass still stands.

### Regression found and fixed during this task

The D-5 log gutter (`padding-right` + `border-right` on `.ds-log__ts`) widened the timestamp column by 9px, which narrowed the message column and pushed the boot sequence past its measured 214px box at `360×800` — the log auto-scrolled and the first line was cut. Fixed by D-5a: the rule now replaces the wide inter-column gap rather than adding to it (`.ds-log__row` gap `--s-5` → `--s-3`, gutter padding `--s-4` → `--s-3`). The message column went `118.2px` (pre-subprocess) → `109.2px` (broken) → `132.2px` (fixed), and every log on every route was re-measured at 0 overflow.

### `SkillMeter` DOM probe

With no scored skill in the CV there is no live instance, so the `.ds-meter*` rules were checked against a hand-built probe carrying exactly the markup the component emits, inserted at the inspector's 300px content width: three ticks lit `rgb(235,204,51)`, two unlit, `3/5` in gold, `role="meter"` with `aria-valuetext "3 of 5 — daily driver"`, and no overflow in the top row. This verifies the styling only; the component's logic is verified by TypeScript and source review.

### Quality gates

| Command | Result |
| --- | --- |
| `npm run check` | Checked 48 files, no diagnostics. |
| `npx tsc --noEmit` | Clean. |
| `npm run build` | `✓ built in 279ms`; CSS `55.28 kB` (gzip `11.46 kB`). |

## Handbacks and Known Limitations

Recorded so nothing is silently dropped. None of these block this subprocess's acceptance criteria.

- **Side callouts still cover neighbouring nodes** — at `1440×900` the `serve_contact` callout opens left over `fct_cv`, and `src_profile`'s opens right over `stg_projects`. `calloutBox` picks the first flank that fits the viewport and does not consider other nodes. The criteria require the callout to stay in frame and reachable, which it does, and C-1's now-visible stub makes the owning node unambiguous — which was the actual confusion. Changing the placement heuristic would disturb geometry that stage 5 measured and verified, so it is handed back rather than done here. **Owner: Release Readiness, as a judgement call.**
- **`SkillMeter` is dormant.** Unverifiable in the running app until a CV skill carries a score. See Task 3.
- **Enter/Space activation** — tool-limited, as above. A manual keyboard pass is still owed.
- **Real OS-level `prefers-reduced-motion`** was not available; the method used instead is documented in full above.
- **Unchanged, by the audit's own disposition:** the replay video's `src`/caption not following the selected run, and the Run-duration sparkline's bespoke `Math.sin` series.
- **Not re-tested:** non-Chromium browsers, overlay-scrollbar platforms, and real screen-reader output.

## Acceptance Criteria — Verdict

| Criterion | Verdict |
| --- | --- |
| Full DAG rendered; connectors meet the correct nodes in both fit modes at `360×800` and `1440×900` | **Met.** 7/7 nodes, 7/7 edges, ports and caps landing on node edges; fit shows the whole DAG with no scroll or clipping, actual size keeps off-screen content in the graph scroller. |
| Node activation selects, opens the matching callout, exposes `OUTPUT` and status; callout stays in frame through scroll, resize and both fit modes | **Met by pointer at all four viewports; Enter/Space source-confirmed only** (tool limitation, proven with a control). |
| Run still advances the seven-stage `RUN_ORDER`; `?run=true` one-shot unchanged; states distinguishable by non-color cue | **Met.** Full run verified end to end. Pipeline reaches idle/running/ok (its data defines no warn or fail path); replay presents ok/warn/fail. No failure path invented. |
| Plots, meters, timelines, run rows, progress, badges, logs and ticker legible and correctly associated; no fabricated values | **Met.** No score fabricated; unscored skills remain tags. |
| Accessible names, non-color status, exposed meter and progress values, quiet decoration | **Met.** |
| Motion restrained, token-driven, no layout shift, never blocking interaction | **Met.** |
| Reduced motion stops or resolves everything non-essential; ticker exposes one complete non-duplicated set; execution stays usable | **Met**, by the two-part method documented above. |
| Four viewports respect scroll regions; no horizontal overflow, overlap, clipping or unreachable data | **Met**, after fixing the log-gutter regression found here. |
| Styling through vendored tokens and shared classes; no route-level arbitrary color, shadow, effect or motion | **Met.** The only feature-level inline values remain the measured callout geometry, unchanged; the one route utility added (the 13px caret gutter) is a measured reserved width, not a visual-system constant. |
| `npm run check`, `npx tsc --noEmit`, `npm run build` | **Met.** |
