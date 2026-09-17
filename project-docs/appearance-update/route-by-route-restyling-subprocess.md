# Route-by-Route Restyling - Subprocess

## Preconditions and Scope

Begin after lifecycle points 1–4 are complete. Use `project-docs/appearance-update/reference-brief.md` for visual direction, the approved `## Audit Findings` in `project-docs/appearance-update/current-ui-audit-subprocess.md` for route ownership and structural-change handoffs, the mapped tokens and shared components from Visual System Mapping, and the transformed shell from App Shell Transformation. Do not invent replacements for unresolved decisions in those inputs.

This subprocess owns route-local composition in `src/features/cv/BootScreen.tsx`, `src/features/cv/PipelineScreen.tsx`, and `src/features/cv/ReplayScreen.tsx`: content order and grouping, route-level grids and flex layouts, spacing, alignment, responsive stacking, and route scroll ownership. It may change route-local markup when an approved audit finding requires a structural change. It does not own shared-shell chrome; token definitions or shared control states; or the detailed appearance and motion of graphs, nodes, charts, timelines, meters, status displays, and other visualization components. If the route work exposes a missing shared capability, hand it back to lifecycle point 3, 4, or 6 instead of cloning a component or adding a page-level visual-system override.

Preserve the router-only SPA, existing URLs and one-shot `/pipeline?run=true` behavior, local CV and run data, simulated run timing and order, component accessibility semantics, and public shared-component APIs. Do not manually edit `src/routeTree.gen.ts` or add a runtime dependency unless a separately approved requirement makes it necessary.

[x] 1. Confirm the prerequisite outputs and turn their route-specific audit findings and visual decisions into an implementation checklist for `/`, `/pipeline`, and `/replay`. Re-observe the current default and stateful layouts before editing so intentional behavior and scroll regions are not mistaken for visual defects.
[x] 2. Restyle `/` as a focused overview and handoff experience. Establish a clear relationship among the identity, role, progressive boot log, **Initialise** action, and keyboard hint while retaining vertical access on short or narrow viewports.
[x] 3. Restyle `/pipeline` at the route-composition level. Refine the hierarchy and responsive relationship among the action strip, graph viewport, log stream, run status, ticker, and Stage/Schema inspector while retaining the narrow stacked layout and the split-pane console workflow.
[x] 4. Restyle `/replay` at the route-composition level. Refine the hierarchy and responsive relationship among the replay identity, media panel, metric tabs and chart region, CV statistics, run history, run-specific log, and rerun action while keeping the main content and history visually distinct.
[x] 5. Browser-check every route at `390×844`, `700×900`, `900×900`, and `1440×900` CSS pixels, covering the current `<540px`, `540–849px`, `850–1099px`, and `≥1100px` layout regimes. Exercise the representative states named below with pointer and keyboard, repeat motion-bearing flows with reduced motion enabled, resolve route-level regressions, and run `npm run check`, `npx tsc --noEmit`, and `npm run build`.

## Acceptance Criteria

- The completed, approved outputs of lifecycle points 1–4 are used as inputs. `/`, `/pipeline`, and `/replay` consistently use the mapped dark editorial visual system through semantic tokens and existing shared components; the implementation adapts the reference without copying its branding, copy, or exact layouts.
- Route-local styling introduces no raw color values, color-bearing shadows or filters, or one-off motion values. Reusable visual decisions are made at their mapped token or shared-component source; route-specific measured layout dimensions may remain local when they are necessary to composition and are not a reusable visual-system value.
- `/` retains its progressive boot log, primary identity and role, **Initialise** action, keyboard hint, and Enter-key navigation to `/pipeline`. The panel remains reachable when its content is taller than the viewport, and restyling does not make the timed information unavailable in reduced-motion mode.
- `/pipeline` retains its run action and progress through every stage in `RUN_ORDER`, CV download and feedback, Live tail and Fit to view/Actual size controls, node selection and callouts, Stage/Schema inspector, logs, status bar, ticker, and contact access. Restyling does not change the underlying CV data, stage order, simulated run behavior, or one-shot consumption of `?run=true`.
- The pipeline layout gives the action strip, graph, output, and inspector an unambiguous hierarchy. Below the `850px` split breakpoint, the inspector remains reachable in the stacked route scroll region; at and above it, the graph/output and inspector remain usable within the height-locked split layout. Intended graph or pane scrolling is not mistaken for document-level overflow.
- `/replay` retains run selection, the recording or its designed fallback, Throughput/Run duration tabs, run-specific metadata and logs, CV statistics, and the **Re-run this dag** link to `/pipeline?run=true`. Selecting each run updates its associated metadata and log, selecting each metric tab updates its labelled chart content, and rerunning still starts and consumes a fresh pipeline-run request.
- The replay layout keeps the media and metric narrative distinct from run history at every breakpoint. Its single-column and split-column arrangements preserve a sensible reading and tab order, and media, history controls, logs, statistics, and the rerun action remain reachable without relying on viewport-specific hidden duplicates.
- Browser checks cover all three routes at each of `390×844`, `700×900`, `900×900`, and `1440×900`. At minimum, they inspect the completed boot state; pipeline idle, active-run, selected-callout, both inspector-tab, and both fit states; and every replay run, both metric tabs, and the available media or fallback state.
- The browser matrix shows no unintended document-level horizontal scrolling, overlapping regions, clipped essential controls or text, unreachable route content, unexpected console/runtime errors, or regressions in the intended pane-scroll model. Layout transitions around the `540px`, `850px`, and `1100px` breakpoints do not strand content or controls.
- Each route presents a clear identity, primary task, main content region, and secondary metadata with consistent alignment and spacing. Route-specific content remains distinguishable without duplicating navigation, breadcrumbs, contact entry points, toasts, or other shared-shell UI.
- Existing keyboard-operable controls, semantic roles, accessible names, logical focus order, visible focus treatment, and reduced-motion behavior remain intact. Restyling does not make a pointer-only path necessary for boot navigation, pipeline controls and node selection, inspector or metric tabs, replay run selection, media controls, or scrolling regions.
- Scope remains at the route-composition level. Shared-shell transformation remains owned by lifecycle point 4, while detailed graph, node, chart, timeline, status, and animation work remains owned by lifecycle point 6; no route-local fork of a shared component is introduced to bypass those boundaries.
- `npm run check`, `npx tsc --noEmit`, and `npm run build` complete successfully after the route changes.

## Task 1 — Prerequisite Confirmation and Implementation Checklist

This task only verified the setup and wrote documentation. No application source, lifecycle tracker, or checkbox was changed. Every claim below was re-derived on 2026-09-16 from the current checkout and a live browser pass, and is tagged **runtime** (observed in the browser this session), **source** (read from the checkout), or **both**.

### Baseline

| Field | Value |
| --- | --- |
| Checkout | `feat/route-by-route-restyling` at `e6cc711` (same as `origin/main`); working tree clean apart from untracked `.claude/` |
| Server | `preview_start` `dev` (`npm run dev`), `http://localhost:3000` |
| Browser | Claude Code built-in Browser pane (Chromium). `tabs_context` reported the pane **hidden** for the whole pass, which throttles frame-driven work (see "Not verified"). |
| Viewports | `390×844`, `700×900`, `900×900`, `1440×900`, each set with `resize_window` followed by a fresh `navigate`. `/` also probed at `390×360` and `390×260` for short-height reachability. |
| Motion | Default (`no-preference`); reduced motion not emulated |
| Console | No error- or warning-level entries on any route (only Vite `debug` and React DevTools `info` lines) |
| Environment artifact | The TanStack Devtools trigger is pinned top-left by `localStorage.tanstack_devtools_settings.triggerCoords {x:7.5,y:7.5}` (the artifact the audit already resolved). It overlaps the rail monogram in screenshots. Not an app element; left untouched. |
| Scroll-restoration hygiene | Because of P-S2 below, `sessionStorage["tsr-scroll-restoration-v1_3"]` was cleared (and cleared again on `pagehide`) before every measured load except the deliberate reproductions. |

### 1. Prerequisite outputs — confirmed

| Input | State in the checkout | Evidence |
| --- | --- | --- |
| Lifecycle tracker | Points 1–4 `[x]`, points 5–7 `[ ]` | `project-lifecycle.md:25,29,33,37,41,45,49` (**source**) |
| Reference brief | Complete. `project-docs/appearance-update/reference-brief.md` does not exist (`ls`: no such file). The brief is `## Reference Brief` at `reference-capture-task.md:23`, the same name resolution stages 3 and 4 recorded. The carry-forward points that drive route composition: hairline rules instead of boxes and shadows; oversized light display headings with small tracked uppercase labels; generous negative space with compact controls; one gold CTA; "stable card shape with swappable content … restyle in place rather than re-arranging the layout" (00:09.5); a hairline rule is enough to separate content from an action area (00:25.5). | **source** |
| Audit Findings | Complete: 42 units (34 restyle-only, 2 structural change, 6 preserve). The handoff to stage 5 (`current-ui-audit-subprocess.md:399`) covers `/`'s frame, card, heading, and boot-log chrome; `/pipeline`'s callout, Stage/Schema tabs, stage pane content, and `SchemaTable`; `/replay`'s section header and History panel; and both structural defects. | **source** |
| Visual System Mapping | `[x] 1–5`, and the checkout matches it: gold ramp with `--signal-primary: var(--gold-500)` (`colors.css:9,47`); Sora 200/400/600 loaded (`index.html:16`); `--fw-extralight` (`typography.css:8`); `--border-w-hair`/`--border-w-emphasis` (`spacing.css:19`); `--dur-pulse`/`--dur-blink` and the `!important` reduced-motion block (`motion.css:3,20-30`). | **both** (`document.fonts` shows Sora 200 and 400 loaded) |
| App Shell Transformation | `[x] 1–6`. Source changes in `e6cc711`: `font-extralight` on the BootScreen heading (`BootScreen.tsx:61`) and TopBar wordmark (`Shell.tsx:92`); `--font-weight-*` bridge (`styles.css:113-118`); `.ds-section__title` weight, `.ds-iconbtn:active`, and `.ds-switch__track:hover` in `ds-components.css`. Its Task 1 Reconciliation settles that stage 4 owned the standalone `/` viewport frame and boot-card chrome, and stage 5 owns route composition inside them. That subprocess file has no written verification section for its tasks 2–6; their evidence is only in the squash-commit message. Not blocking. | **source** |

**No unresolved upstream design decision blocks Tasks 2–4.** The palette, type roles, spacing scale, borders, effects, motion tokens, breakpoints, and ownership boundaries are all decided and present in the checkout. Three open questions belong to this subprocess's own composition work, which the audit deliberately left open ("Do not choose token values or design solutions in this audit", `current-ui-audit-subprocess.md:25`): D-1, D-2, and D-3 below. Each has a recommendation and should be confirmed before the rows that depend on it (B-1, R-8, P-1, P-4) are implemented. All other rows can proceed.

### 2. Re-observation before edits

#### 2.1 States observed

| Route and state | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| `/` boot completed | yes, plus 390×360 and 390×260 | yes | yes | yes |
| `/pipeline` idle default | yes | yes | yes | yes |
| Active run, sampled mid-run | yes | yes | yes | yes |
| Callout for a non-default node | `stg_projects` | run-driven nodes | `src_experience` | `fct_cv` |
| Stage and Schema tabs | both | both | both | both |
| Actual size and Fit to view | both | both | both | both (Fit is a no-op) |
| `/replay` runs 4193, 4192, 4191, 4190 | all | all | all | all |
| Throughput and Run duration tabs | both | both | both | both |
| Media or fallback | media; fallback forced | media | media (playing) | media; Play/Pause toggled |
| **Re-run this dag** | — | — | — | yes: URL consumed to `/pipeline`, run in progress |

Interaction method: pointer clicks on element refs for Fit/Actual size, the Schema tab, node selection at 390, the callout Close button, run 4192, **Open in inspector** at 700, and **Re-run this dag**. Timing-sensitive samples (run start, the other run rows, the Run duration tab, fit toggles at 700–1440) used DOM `click()` or `mousedown` dispatch from `javascript_tool`. No keyboard events were sent.

#### 2.2 Measured layouts

`/` (**runtime**)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Card size, padding | 366×332, 20px | 620×377, 32px | 620×377, 32px | 620×425, 56px |
| Name heading | Sora 200, 28px | Sora 200, 38px | same | same |
| Boot log when complete: box / content / `scrollTop` | 104 / 194 / 92: only lines 3–4 visible | 104 / 122 / 20 | 104 / 122 / 20: row 1 top at 427, box top at 434 | 104 / 122 / 20 |
| Initialise button + hint | 161×44 + 101×16 on one row (274 of 324px) | same | same | same |
| Frame computed `background-image` | `none` | `none` | `none` | `none` |

Short height: at 390×360 the card fits. At 390×260 the frame scrolls (372/260), the card top stays at 12px (safe alignment), and Initialise is reachable at the end of the scroll.

`/pipeline` (**runtime**; the DAG extent is 896×332 at every size)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Screen root | column, `overflow-y:auto`, 1039/792 | column, auto, 906/848 (max scroll 57.5) | row, `hidden`, 848/848 | row, `hidden`, 848/848 |
| Action strip | 325×97 (two rows) | 635×59 | 504×59 | 1036×59 |
| Graph canvas client size | 316×311: pans both axes | 626×311: pans both axes | 504×611: pans horizontally | 1036×620: no pan |
| Default callout | 300px wide, left side, clamped to `left: 8px`; covers `src_profile` and 80% of the canvas | right of the node (`left: 216px`); covers the `stg_*` nodes, not the selected node | left side, clamped to `left: 8px`; covers `src_profile` and every `src_*` node | right of the node; no overlap |
| Callout over the active node during a run | overlaps in 3/3 samples | 0/3 | overlaps in 4/4 samples and at the end | 0/3 |
| Fit to view scale | 0.363 (nodes 64×31; labels illegible; callout still covers the DAG) | 0.709 (nodes 125×60) | 0.5625 (all 7 nodes visible) | `transform: none`, so the toggle does nothing |
| Log | 104px box | 104 | 104 | 104; 15 lines after a run, about 4 visible |
| Inspector | stacked, top at y=638; tabs at y=651 | stacked, top at y=600 | 340px column; Experience pane body scrolls 1077/798 | 340px column |
| Run button label change | "Run pipeline" (135px) → "Running" (97px); Download CV moves 38px left. Measured at 700; the label changes the same way at every size. | | | |

`/replay` (**runtime**)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Grid | one column, 293px; padding 16; gap 20 | one column, 595px; padding 20 | `451px 320px`; padding 20; gap 24 | `975px 320px`; padding 24; gap 24 |
| Pane scroll | 1617/756 | 1531/812 | 831/812 (+19) | 839/812 (+27) |
| History header top | y=942, below the first screen | y=883 | beside the main column | beside the main column |
| "Run replay" header height | 79: title and note each wrap to two lines | 46 | 46 | 46 |
| Video panel / frame height | 293×374 / 268: bar label and timecode wrap | 595×344 / 268 | 451×344 / 268; panel grows to 359 for runs 4192 and 4190 (caption wraps) | 975×344 / 268 |
| CvStats | one readout, 293px wide | 595 | 451 | 975; bottom 3px under the ticker |
| History log, box / content for run 4193 | 148 / 212 | 148 / 146 | 148 / 176 | 148 / 176 |
| Pane computed `background-image` | `none` | `none` | `none` | `none` |

At every size, selecting a run updated the header note, the video label, the caption, the active row, and the transcript. The video `src` stayed `/media/run-4193.webm` (a known limitation that is preserved). The Run duration tab changed the card title to "run duration · last 24 runs" and the axis labels to "run 4170 → run 4193". The fallback was forced at 390 by swapping `src` at runtime and calling `load()`: the empty state rendered, the frame stayed 268px, and the Play hit target and live dot were removed.

#### 2.3 Intentional behavior — do not "fix"

- **The document never scrolls.** On all three routes at all four sizes, `scrollWidth` equals `innerWidth` and `scrollHeight` equals `innerHeight` (`styles.css:209-211`). **both**
- **`/` scrolls only when the card is taller than the viewport.** `items-center-safe` keeps the top reachable (`BootScreen.tsx:51-54`). **both**
- **`LogStream` auto-scrolls to its tail** (`LogStream.tsx:31-34`). Internal log scrolling is intended; the defect is that short completed sequences are clipped (B-2, R-9). **source**
- **`/pipeline` has one stacked scroll region below 850px** (`PipelineScreen.tsx:241`). At 850px and above, the row is height-locked and only the inspector body scrolls (`:398`). **both**
- **The graph canvas pans at Actual size.** This is the component's contract (`PipelineGraph.tsx:97-101`), and point 6 requires off-screen nodes to stay "reachable through the intended graph scroller". Text cut off at the canvas edge is scroller clipping, not a reflow bug. **both**
- **The graph scrolls to the selected or running node** (`PipelineGraph.tsx:153-178`). Fit mode hides overflow, resets scroll to the origin, and never magnifies, so it does nothing at 1440×900. **both**
- **The callout body scrolls**, and the `display:block; overflow-y:auto` fallback applies when the callout has less than 200px (`PipelineScreen.tsx:321-330`). **source**
- **Open in inspector scrolls the stacked region** (`:164-183`); at 850px and above it does nothing. **both**
- **The Schema table is a focusable horizontal scroller** (331/291 at 390, 331/297 at 1440). **runtime**
- **`/replay` is one scrolling pane at every size**; it is not height-locked at `split`. Its ticker sits outside the pane (`ReplayScreen.tsx:84-88,175`). **both**
- **The MetricTicker marquee is clipped on both routes** by design. **runtime**
- **TanStack Router element scroll restoration** (`src/main.tsx:8`) is an intentional app feature, but it causes P-S2. **source**

#### 2.4 Structural defects: confirmed, with root causes

**P-S1 — `390×844` graph "clipping" (deterministic).** Reproduced. Root cause (**both**):

1. The graph pans instead of reflowing. The DAG is 896×332 (`data.ts:296-351` node coordinates; `PipelineGraph.tsx:100-101`) inside a 316×311 canvas.
2. The route gives the stacked graph a fixed `h-[320px]` (`PipelineScreen.tsx:281`). The canvas client height (311) is less than the DAG depth (332), so the graph also pans vertically.
3. The defect itself is how the route places the callout. `calloutBox()` (`PipelineScreen.tsx:68-93`) only places it to the right or left of the node. For a node at canvas x=24, the right side needs a canvas of at least 24+176+16+300+8 = 524px, and the left side needs the node at x ≥ 324. When neither fits, the callout is clamped to `left: 8px` and sits on top of its own node. The route opens the callout by default (`openId = "src_profile"`, `:101`) and on every run step (`setOpenId(id)`, `:199`).
   - At 390×844 the callout covers the selected node in idle, after selection, and in every active-run sample, and it covers 80% of the canvas.
   - **The same occlusion happens at 900×900** (split canvas 504px). The audit did not record this.
   - From the source and the measured canvas widths, occlusion is expected below a viewport of about 598px when stacked and between 850 and about 920px when split. This was observed only at 390 and 900.
4. Fitting on load is not a fix. At 390×844 the fit scale is 0.363, labels are illegible, and the open callout still covers the whole scaled DAG.

**P-S2 — `700×900` action strip hidden behind the top bar ("intermittent").** Root cause found and reproduced deterministically. It is router scroll restoration, not a mount-time ResizeObserver or scroll-anchoring effect (**both**):

- **What restores the offset.** `src/main.tsx:5-9` creates the router with `scrollRestoration: true`. `src/router.tsx` has the same config, but nothing imports `getRouter`. `@tanstack/router-core@1.171.27` (`dist/esm/scroll-restoration.js`) records the offset of every element that fires a scroll event. It keys each entry by history entry and a DOM `nth-child` selector path, saves the cache to `sessionStorage` on `pagehide`, and re-applies it on `onRendered` when that entry is reloaded or reached with back/forward.
- **Why the strip disappears.** At 700×900 with the default Profile pane, the stacked region can scroll at most 57.5px (906−848), the audit's exact figure, and the action strip is 59px tall. Pointer **Open in inspector** scrolled the region to 57.5, and wheel scrolling or a click tool's scroll-into-view can do the same. Reloading that entry restored 57.5, and all four strip controls then hit-tested to the top bar (`WAQAS.YOUSAFZAI`, `Available`, `Contact`). Reproduced twice on history key `14if`.
- **Control check.** Same history key with the cache entry removed: `scrollTop` 0 and all four controls hit-test OK. The in-memory cache is written back on `pagehide`, so once an entry is cached the strip stays hidden on every reload of that entry until the entry is overwritten.
- **Why it looked intermittent.** 20 of 20 fresh iframe loads at 700×900 (new history keys, empty cache) kept `scrollTop` at 0 when sampled every 10ms from about 100ms to 1800ms. The audit's "1 in 5" is explained by whether the reused history entry already held a non-zero cached offset from earlier interactions in the same tab.
- **Why only 700×900.** At 850px and above the root has `overflow: hidden` and nothing to scroll. At 390×844 the maximum scroll is 247px, so a restored offset looks like an ordinary scrolled page. The mechanism itself does not depend on width.
- **Caveat.** The pane was hidden, so the cache-free sample cannot rule out a timing contribution when the pane is visible and animating. Task 3 must repeat the reproduction with the pane visible.

### 3. Implementation checklist

These rules apply to every row:

- Use the existing bridge utilities (`s-*`, `border-hair`, `bg-*`, `text-*`, `font-data`, `tracking-*`, and the `row:`/`split:`/`console:` variants) or `var(--token)`.
- Add no raw color, color-bearing shadow or filter, or one-off motion value.
- Measured layout dimensions (`h-[…]`, `min-w-[…]`, `scroll-mt-[…]`) may stay local, with a comment saying what each one measures.
- Never override `ds-*` component classes from a route. Pass props or layout-only utilities to the component instance instead.

#### Decisions to confirm (recommended, not upstream blockers)

| ID | Question | Evidence | Recommendation |
| --- | --- | --- | --- |
| D-1 | Where should the fix go for grid textures that never render? `--grid-coarse`/`--grid-fine` are `background` shorthand values (an image plus position and size such as `0 0/100% 96px`), but all five consumers use them as `background-image`, which drops the whole declaration. `/` loses both the grid and the valid `--vignette` in the same declaration; the `/replay` pane, `.ds-graph-frame`, `.ds-card--grid`, and `.ds-video__empty` lose their grids. The token has had this shape since `0e391f7`, and stages 3 and 4 approved the look without the textures. | **both**: computed `background-image: none` on the `/` frame at all four sizes, on the `/replay` pane, on `.ds-graph-frame`, `.ds-card--grid`, and `.ds-video__empty`. On a test element, `var(--vignette)` alone is valid, `var(--grid-coarse)` alone gives `none`, and the same token as `background:` is valid. Source: `effects.css:12-15`, `BootScreen.tsx:55`, `ReplayScreen.tsx:87`, `ds-components.css:71,139,241`. | Hand the token shape back to point 3 so one fix covers all five consumers: image-only tokens plus size tokens, or documented shorthand use with the three `ds-components.css` consumers updated. B-1 and R-8 then follow that decision. Restoring the textures visibly changes both route frames, so confirm before Tasks 2 and 4 touch frame backgrounds. |
| D-2 | How should P-S2 be fixed? | §2.4 | Route-local: below `split` only, make the action strip `sticky top-0` on an opaque surface token (`split:static` above). Its z-index must be above `.ds-graph__overlay` (z-index 5; the graph frame does not create its own stacking context). Add `scroll-margin-top` to the inspector equal to the strip's measured height so **Open in inspector** does not land under the strip. This keeps DOM selector paths, router restoration, the split layout, and the reveal. The alternative, an app-level restoration opt-out in `src/main.tsx` (`scrollToTopSelectors` or a `scrollRestoration` function), is outside stage-5 ownership and needs explicit approval. |
| D-3 | How should P-S1 be fixed? | §2.4 | Route-local: when neither side fits, have `calloutBox()` place the callout below or above the node using `NodeCallout`'s existing `side="bottom" \| "top"` API, at the canvas width minus `EDGE`, clamped inside the graph frame (a point-6 acceptance criterion). Grow the stacked graph region (`:281`) to a measured height that fits the node, the stub, and a usable callout. Keep the default-open callout, the Actual size default, and horizontal panning. Do not default to Fit to view below 540px (labels are illegible). Agree the final callout look with point 6. |

**Decisions confirmed by the user on 2026-09-16:**

- **D-1 — leave as-is and hand back.** Tasks 2 and 4 do not change the `/` frame or `/replay` pane backgrounds. B-1 and R-8 become no-ops for this subprocess. The grid-texture token shape is recorded as a handback to point 3 for a separate follow-up.
- **D-2 — route-local sticky action strip below `split`.** P-1 is implemented as recommended in `PipelineScreen.tsx`; `src/main.tsx` router scroll restoration is not changed.
- **D-3 — above/below callout placement plus a taller stacked graph.** P-4 and the stacked part of P-5 are implemented as recommended; final callout visuals remain with point 6.

#### Task 2 — `/` (`src/features/cv/BootScreen.tsx`)

| ID | Target | Intended change | Tokens / shared components | Breakpoints | Preserve | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| B-1 | Viewport frame, `:50-56` | Settle D-1 first. If the textures are restored, apply them with a property that accepts the token shape, and keep `bg-void-0` effective (an inline `background` shorthand resets `background-color`). Otherwise leave the frame background as it is. | `--vignette`, `--grid-coarse`, `bg-void-0` | all | `h-full`, `overflow-y-auto`, `items-center-safe`, `p-s-5`; stage 4 owns the frame visuals, so add none | D-1 |
| B-2 | Boot log, `:75-77` (`LogStream height={104}`) | Reserve height for the full four-line sequence from first paint, so no completed line is clipped and the reveal causes no layout shift. At 540px and wider the content needs at least 122px (today row 1 starts 7px above the box, `scrollTop` 20). Below 540px the lines wrap to 194px. Use a local measured height: either per-breakpoint utilities with the `height` prop neutralized, or one value that covers the narrow wrap. | `LogStream` (no API change), `s-*` | all; worst below 540 | Timed reveal (`LINE_EVERY` 260ms and `BOOT` lines, `:8-39`); tail auto-scroll; log stays a focusable scroll region | §2.2 |
| B-3 | Identity block, `:61-74` | Give the name, role, and log a clear editorial hierarchy: an oversized light name, the role as a distinct small tracked-uppercase label, and generous space before the log. Stay on the mapped display scale (today `text-h3`, then `row:text-h2`). Use `text-h1` at larger breakpoints only if each name part still fits the card without wrapping. Replace `leading-[1.05]` with the existing token of the same value, `leading-(--lh-tight)`. | `font-display font-extralight`, `text-h3`/`text-h2`/`text-h1`, `font-data`, `tracking-tag`/`tracking-label`, `text-dim`, `border-hair`, `mt-s-*` | all; size steps at `row:`/`console:` | One line per name part, the gold full stop, `CV.role` text, stage 4's `font-extralight` | `:61`; `typography.css:6` |
| B-4 | Action row, `:78-88` | Make the action row read as one handoff: separate it from the log with a hairline rule, keep Initialise as the only gold CTA, and render the key name in the hint as `<kbd>` inside the existing span, styled with tokens. At 390 the hint must stay on the button row or wrap cleanly beneath it. | `Button` primary/lg/notched (unchanged), `Icon power`, `border-hair`, `font-data`, `text-dim`, `s-*` | all; check the 390 wrap | Window Enter handler (`:41-47`), Initialise → `/pipeline`, button semantics and focus ring | §2.2 |
| B-5 | Card, `:57-60` | Keep the chrome. Adjust internal spacing only where B-3 or B-4 need it. `max-w-[620px]` is a measured composition width and may stay local. | `p-s-7`/`p-s-9`/`p-s-11`, `border-hair`, `bg-panel`, `shadow-panel`, `--notch-14` | all | Stage 4's border, notch, and shadow; the panel stays reachable at short heights (verified at 390×260) | §2.2 |
| B-6 | Task 5 checks | Re-measure at all four sizes and 390×260: the completed log is unclipped, the scroll reaches Initialise, the document never scrolls. Under reduced motion all four lines stay available (the pacing itself belongs to point 6). | — | all, plus a short height | — | — |

#### Task 3 — `/pipeline` (`src/features/cv/PipelineScreen.tsx`, and `Panes.tsx` where noted)

| ID | Target | Intended change | Tokens / shared components | Breakpoints | Preserve | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| P-1 | Action strip, `:243-280` | Implement D-2. Verify with the deterministic reproduction at 700×900: pointer **Open in inspector**, reload the same entry, then check that all four controls hit-test OK. Repeat with back/forward, and with 10 or more fresh loads while the pane is visible. | Opaque surface (`bg-void-0` or `bg-panel`), `border-hair border-b`, z-index above the graph overlay, measured `scroll-mt-[…]` on the inspector | below 850 (390, 700) | Run, Download, Live tail, and Fit controls in their current order; `disabled` while running; the Fit tooltip; the `split:` layout | P-S2 |
| P-2 | Run button, `:244-253` | Reserve the idle label's width so "Running" does not move Download CV 38px left. Use a measured `min-w-[…]`. | `Button` (no variant change) | all | Label and icon swap, `disabled` | §2.2 |
| P-3 | Strip wrapping, `:243` | At 390 the strip wraps to two rows (97px). Keep both rows, but align the second row's grouping with the first using spacing tokens so the sticky strip stays as short as possible. Do not hide any control or label. | `gap-s-*`, `px-s-*`/`py-s-*`, `row:flex-nowrap` | below 540 | All four controls visible and labeled | §2.2 |
| P-4 | Callout placement, `:68-93`, `:281`, `:294-353` | Implement D-3. At 390×844 and 900×900, a callout must never cover its own selected or running node, whether idle, after selection, or during a run. It must stay inside the graph frame after graph scroll, resize, and both fit toggles. | `NodeCallout` `side` (existing API), `EDGE`/`STUB`/`CALLOUT_*` constants, measured stacked height | below ~598 and 850–~920; regression-check 700 and 1440 | `onViewport` clamping, the max-height scroll fallback, reachable Close and **Open in inspector**, default `openId`, `fit=false` default, `STAGE_MS`, `RUN_ORDER` | P-S1 |
| P-5 | Graph and log heights, `:281`, `:356-362` | In the height-locked split the canvas is 611–620px tall for a 332px DAG (about 290px of empty canvas at Actual size), while the log shows about 4 of a run's 15 lines. Rebalance the two with measured heights, keeping the canvas tall enough for the full DAG plus scrollbar at Actual size (at least 341px). Below `split`, take the stacked graph height from D-3 (today's 320px is under the 332px depth and forces a 21px vertical pan). | `LogStream height`, `h-[…]` with `split:`, `border-hair` | all | Height-locked split with no document scroll, independent inspector scroll, run status and ticker visible at the foot of the graph column, fit behavior | §2.2 |
| P-6 | Stacked region order, `:241-407` | Keep the order action strip → graph → log → run status → ticker → inspector; it is also the tab order. Make the inspector boundary clearly separate (today `border-t` plus `bg-panel`, with the tabs at y=651 of 844 at 390) using only spacing and hairline tokens. | `border-hair`, `bg-panel`, `px-s-*`/`console:px-s-7` | below 850 | DOM and tab order, the `tabIndex={-1}` reveal target, `aria-label="Pipeline inspector"` | §2.2 |
| P-7 | Inspector column, `:381-407` | Align the tab strip's padding (`px-s-5 pt-s-5`) and the body's (`p-s-6`, with `console:` steps) with the graph column's rhythm. Keep `split:w-inspector`. | `--inspector-w`, `s-*` | 850 and wider | Body `split:overflow-auto`, `Tabs` API | **source** |
| P-8 | Profile pane name, `Panes.tsx:48` | Add `font-extralight`; the computed weight today is Sora 400 at 22px. Stage 4 fixed the same gap on BootScreen, TopBar, and SectionHeader. The audit hands stage pane content to stage 5, and the mapping's Known Limitations name this heading. | `font-display font-extralight text-h4` | all | Pane content, `CV.name` | **runtime**: computed weight 400 |
| P-9 | Callout key column, `:342` | `w-[88px]` is a measured label column and may stay local. Change it only if D-3 makes the callout narrower than about 200px. | — | below 540 | `wrap-anywhere` values | **source** |
| P-10 | Task 5 checks | Re-verify after P-1 to P-8: a full `RUN_ORDER` run; `?run=true` consumed exactly once (working from `/replay` at 1440 today); the CV download toast; the Live tail slice; both fit states (Fit stays a no-op at 1440); the focusable Schema scroller; no document scroll. | — | all | — | §2.3 |

#### Task 4 — `/replay` (`src/features/cv/ReplayScreen.tsx`)

| ID | Target | Intended change | Tokens / shared components | Breakpoints | Preserve | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| R-1 | Main content vs. History, `:89-172` | Below 850px, History starts below the first screen (y=942 at 390, 883 at 700), separated only by `gap-s-7` (20px) and its section rule. Make the two regions clearly distinct with a larger spacing step and/or a hairline boundary. Keep two columns at 850px and wider. | `gap-s-*` / `--stack-loose`, `border-hair`, `SectionHeader` | below 850; check 850 and wider | Left-then-right DOM order (reading and tab order); no viewport-specific hidden duplicates | §2.2 |
| R-2 | "Run replay" header, `:91-95` | At 390 the title and the note each wrap to two lines (79px instead of 46px). Let the note drop to its own line cleanly with layout-only utilities passed through `className`, without overriding `.ds-section*` visuals. If that is not enough, hand a wrapping variant back to point 4. | `SectionHeader` `className`, `gap-s-*` | below 540 | `index="REC"`, title, note content (`run {id} · {when}`) | **runtime** (79px) |
| R-3 | Media metadata, `:96-106` | At 900, selecting run 4192 or 4190 grows the panel from 344 to 359px (the caption wraps) and pushes the tabs, chart, and stats down 15px, against the brief's "restyle in place" principle. Redistribute run metadata between the caption and the header note so caption length stays stable across runs, without dropping any metadata or the "generated placeholder capture" disclosure. If a fixed caption area is needed, hand it to point 6. | `VideoPanel` props (no API change) | 540–1099, especially 900 | `label`, `duration`, empty-state label and hint, `autoPlay`, `notched`; the literal `src` (known mismatch, preserved) | **runtime** |
| R-4 | Metric tabs and chart card, `:107-139` | Keep the tabs directly above their card, and tighten the spacing between them (today `gap-s-6`) in line with R-1. | `Tabs`, `Card`, `s-*` | all | Tab labels, card titles, axis labels, `Sparkline` props (series color belongs to point 6) | **runtime** |
| R-5 | CV statistics, `:143` | `CV.stats` has one entry, so `CvStats` renders a single readout stretched 293–975px wide. Constrain it at this call site with a wrapper; do not edit `CvStats`, which the Overview pane also uses, and add no statistics. | Wrapper `max-w-*` or grid utilities; `StatReadout` unchanged | 540 and wider, especially 1440 | No fabricated stats; `useCountUp` | **runtime**; `data.ts:82` |
| R-6 | Split columns, `:89` | Replace the literal `320px` History column with the mapped composition role, so both app routes share one secondary-column width: `var(--inspector-w)`, 340px. Re-measure at 900, where the main column shrinks from 451 to 431px. | `--inspector-w` | 850 and wider | `minmax(0,1fr)` main column, `items-start` | **both** |
| R-7 | Split vertical fit | At 900 the pane overflows by 19px, so the main column's bottom padding is hidden; at 1440 it overflows by 27px and the bottom 3px of the stats readout is under the ticker until scrolled. After R-1 and R-5, re-measure. Adjust padding and gap tokens so the main column ends with its padding visible, or accept the intended pane scroll as long as no essential text is clipped. | `p-s-*`, `gap-s-*` | 850 and wider | Single-pane scroll (replay is not height-locked); ticker outside the pane | **runtime** |
| R-8 | Pane background, `:87` | Follow D-1. | `--grid-coarse`, `bg-void-0` | all | `min-h-0 flex-1 overflow-auto` | D-1 |
| R-9 | History log, `:161` | `height={148}` clips run 4193's transcript at 390 (212px of content) and at 900 and 1440 (176px; run 4192 needs 174px, run 4190 156px). Nothing is clipped at 700. As in B-2, size the log to the longest `RUN_LOG` transcript per breakpoint with a measured value. | `LogStream` | 390, 900, 1440 | Per-run `logs` mapping, tail auto-scroll | **runtime** |
| R-10 | History list and rerun, `:145-172` | Keep the History header, rows, log, and **Re-run this dag** together as one region, and separate the rerun action from the log with a hairline or a spacing step. | `Button asChild block variant="secondary"`, `Link search={{run:true}}`, `border-hair`, `gap-s-*` | all | A real `<a href="/pipeline?run=true">`; selecting a row still updates the header, label, caption, and log | **runtime** |
| R-11 | Task 5 checks | At all four sizes: every run row, both tabs, Play/Pause, the forced fallback, rerun consumption, and no document scroll. | — | all | — | — |

### 4. Out of scope and handbacks

| Item | Evidence | Owner |
| --- | --- | --- |
| Grid texture token shape and its three `ds-components.css` consumers | D-1 | Point 3 |
| A wrapping `SectionHeader` variant (only if R-2's instance utilities are not enough); Button, IconButton, Switch, and Tabs states; rail and top bar; dialog and toast; `.ds-dialog__title` | — | Point 4 |
| Router scroll-restoration config in `src/main.tsx` (only if D-2's route-local fix is rejected); the unused duplicate router in `src/router.tsx` | §2.4 | No lifecycle owner; needs explicit approval |
| Graph, node, and callout visuals; a cue that the canvas scrolls horizontally; a non-color status cue on nodes | Mapping Known Limitations | Point 6 |
| `LogStream` cursor rendering on its own line (adds about 20px); log visuals | §2.2 | Point 6 |
| `RunStatusBar`; `MetricTicker`; `Sparkline`, including the Run duration series colored `var(--signal-warn)` (`ReplayScreen.tsx:128`), which reuses the warning hue for a series that is not a warning; `.ds-stat__value` weight (renders Sora 400) | **both** | Point 6 |
| `VideoPanel`: fixed 268px frame at every width (975×268 at 1440 and 293×268 at 390, with `object-fit: cover` cropping the capture); header bar wrap at 390; a stable caption area | **runtime** | Point 6 |
| History row selected and status styling, and selection semantics: `RunRow` shows selection only through `border-signal shadow-glow` and has no `aria-pressed` | `ReplayScreen.tsx:36-43` | Point 6 (its task 5 names run-history rows) |
| Boot reveal pacing under reduced motion. The inputs conflict: the audit assigns a `matchMedia` gate to point 6, but point 6's own scope says to keep the timed boot reveal as content behavior. | Audit `:305`; point-6 Inputs and Scope | Point 6 |
| Replay video `src` and caption run number not following the selected run; the `Math.sin` Run duration series; stale "two statistics" comments (`live.tsx:100-104`, `data.ts:467-468`) when `CV.stats` has one entry | **both** | No stage (preserve) |
| TanStack Devtools trigger position | Environment | No stage |

### 5. Not verified in this task

- **Keyboard.** No key events were sent. Focus and tab order are reasoned from DOM order only; Task 5 must test them.
- **Reduced motion.** Not emulated; the tool has no media-feature emulation.
- **Hidden pane.** Frame-driven behavior was throttled. Autoplay was paused on the 390, 700, and 1440 replay loads (playing at 900). A smooth `scrollIntoView` inside a test iframe never ran. A screenshot showed the sparkline only partly drawn. Layout measurements are unaffected (layout is forced on read), but P-S2's cache-free sample should be repeated with the pane visible.
- **Media fallback.** Forced only at 390×844, by swapping `src` at runtime (no source edit).
- **P-S2 scope.** The reproduction and control ran at 700×900 only. The restorer also copies cached entries between locations by selector path; that was read in source but not exercised (the one iframe back/forward and rail sequence did not scroll the pane first, so it proves nothing).
- **P-S1 thresholds.** The occlusion ranges (below about 598px stacked, 850 to about 920px split) are calculated, not measured; occlusion was observed at 390 and 900 only.
- **Behavior not re-tested.** `/` Initialise and Enter navigation, CV download, Live tail, and the contact dialog and toasts were not re-exercised. They are behavior rather than layout, and the audit verified them.

## Task 2 — `/` Restyle

Only `src/features/cv/BootScreen.tsx` changed; no shared component, token, shell, or other route file was touched. Every value below was measured on 2026-09-16 in the built-in Browser pane (Chromium, pane **hidden** throughout) against the dev server, before and after the edit. "Reveal" figures come from remounting `/` client-side (Initialise → `history.back()`) with a `MutationObserver` sampling the card, log, and button on every DOM change, plus a `layout-shift` `PerformanceObserver`.

### Rows

| ID | Outcome |
| --- | --- |
| B-1 | **No change** (D-1). The frame's `backgroundImage` style and `bg-void-0` are untouched (`:54-55`). |
| B-2 | `LogStream` now takes `className="h-[214px] row:h-[124px]"` with `style={{ height: undefined }}`, which clears the prop's inline px so the classes apply (`:79-92`). There is no API change. The heights were measured from the completed sequence: 214px fits the wrapped lines from a 356px viewport (365px when the frame itself scrolls), and 124px fits them unwrapped from 545px. Below those widths the log still scrolls internally. At 390–430px this leaves about 18px of empty well, and up to 90px just under 540. That trade-off keeps 360/375px phones unclipped. `tabIndex={0}` was added because the log only got keyboard focus as an overflowing scroller: before the change it was focusable with `tabIndex` −1 and no attribute. Without the attribute it would drop out of the tab order once it stopped overflowing. |
| B-3 | The name steps up from `text-h3`→`row:text-h2` to `text-h2`→`row:text-h1`, and `leading-[1.05]` becomes `leading-(--lh-tight)` (`:61`). The role label moves from `tracking-tag` to `tracking-label`, the app's label convention, with `mt-s-5`→`mt-s-6`. `CV.role` is `text-muted` and the build tag stays `text-dim`. Each half is `whitespace-nowrap`, so a wrap falls at the slash (`:72-77`). The text content is unchanged. The log gap is `mt-s-9 row:mt-s-10` (`:78`). |
| B-4 | The action row gets `border-hair border-t`, `flex-wrap`, and `gap-x-s-6 gap-y-s-4` (`:94-95`). `ENTER` is a `<kbd>` inside the existing span, styled `rounded-1 border-hair bg-raised text-muted font-data` (`:104-109`). `Button` is unchanged, and Initialise is the only gold control. |
| B-5 | Card padding and chrome are unchanged. The only spacing changes are those listed under B-3 and B-4: `pt-s-7 row:pt-s-8` and `mt-s-8 row:mt-s-9` around the rule. |

### Measurements (completed state)

| | 390×844 | 700×900 | 900×900 | 1440×900 | 390×260 |
| --- | --- | --- | --- | --- | --- |
| Card, before → after | 366×332 → 366×488 | 620×377 → 620×472 | 620×377 → 620×472 | 620×425 → 620×520 | 357×348 → 357×488 |
| Log box / client / scroll / `scrollTop`, before | 104 / 102 / 194 / 92 | 104 / 102 / 122 / 20 | same | same | 104 / 102 / 212 / 110 |
| Same, after | 214 / 212 / 212 / 0 | 124 / 122 / 122 / 0 | same | same | 214 / 212 / 212 / 0 |
| Name size, lines | 38px, 2 (245 of 324px) | 52px, 2 (335 of 554px) | same | 52px, 2 (335 of 506px) | 38px, 2 |
| Role lines; hint position | 1; same row as the button | 1; same row | 1; same row | 1; same row | 1; same row |
| Reveal (0→4 rows) | Card, log, and button rects stayed the same in all 13 samples at every size. Log `scrollTop` stayed at 0; before the change it moved 0→16→54→92 at 390. No `layout-shift` entries. | | | | |
| Document `scrollWidth`/`scrollHeight` | equal to the viewport at all five sizes | | | | |

At 390×260 the frame scrolls (512/260) and the card top stays at 12px. A wheel scroll reached `scrollTop` 252.5 (the maximum), where Initialise was fully visible and hit-tested correctly. Edge checks: a fresh remount at 356×800 gave 212/212 with the role and hint each wrapping cleanly (at the slash, and under the button). A fresh remount at 545×900 gave 122/122. At 540 (122/140) and at 355 and 320 the log scrolls, as expected. **Resize hysteresis:** live-resizing from a clipped width to just above a threshold keeps the log's scrollbar and its extra wrapping (545 after 540 gave 122/140); a remount clears it.

### Verification

- **Observed.** Pointer: clicked Initialise at 390×844, and at 390×260 after the wheel scroll; both went to `/pipeline`. Keyboard: from `body`, Tab went to the log (`:focus-visible`, with a visible 2px gold outline in the screenshot), then to Initialise. Enter with `body` focused (390) and with the button focused (1440) both went to `/pipeline`, and back returned to `/` with all four lines. Screenshots of the completed state were taken at 390×844 and 1440×900. No error-level console entries.
- **Simulated.** Reduced motion: every `prefers-reduced-motion: reduce` CSSOM media rule was rewritten to `all` and `window.matchMedia` was stubbed, then `/` was remounted at 390×844. `--dur-base` was `0ms` and the cursor `animation-name` was `none`. Lines still arrived about 260ms apart (the pacing belongs to point 6). All four messages were present at 212/212/0, and the card stayed 488.4px throughout.
- **Commands.** `npm run check`, `npx tsc --noEmit`, and `npm run build` all exit 0.
- **Not verified.** Real media-feature emulation. Painting with the pane visible: screenshots lagged a frame and `requestAnimationFrame` did not fire, but timers ran at about 260ms. No screenshots at 700 or 900 (measured only). Browsers other than Chromium, and overlay-scrollbar (touch) devices, where the frame-scroll threshold variant does not apply. Screen-reader output for the `<kbd>` and for the focusable log.

### Handbacks

- **Point 4 (pre-existing, not caused by this task).** Initialise has no visible focus indicator. Keyboard focus matches `:focus-visible` with a computed 2px gold outline, but `.ds-btn--notched`'s `clip-path` clips the outline. This was reproduced with HEAD's `BootScreen.tsx` temporarily restored. It cannot be fixed from the route without overriding `ds-btn`, and it affects every notched button.
- **Point 6 (optional).** `LogStream`'s `height` accepts only a number, so the route clears it through `style` in order to use breakpoint heights. A CSS-length or content-reserving option would remove that workaround. Boot pacing under reduced motion remains with point 6, as already recorded.
- **Unchanged by decision.** D-1 grid textures (point 3). The name is still a `div`, not a heading element: semantics were preserved, not changed.

## Task 3 — `/pipeline` Restyle

Only `src/features/cv/PipelineScreen.tsx` and `src/features/cv/Panes.tsx` (P-8) changed. No shared component, token, shell, router, or other route file was touched. Measurements were taken on 2026-09-16/17 in the built-in Browser pane (Chromium) against the dev server, before and after the edit. The pane was **hidden** throughout: `document.hidden` was true, and rAF, `scroll` events, `ResizeObserver` callbacks, and CSS transitions did not run. So after every node selection a synthetic `scroll` event was dispatched on `.ds-graph`, which makes `onViewport` republish as it would after a real scroll. Pending `CSSTransition`s were finished through `getAnimations()` before each measurement. Callout geometry was read from `offsetLeft`/`offsetTop`, because the `ds-callout-in` transform froze at its first keyframe. `sessionStorage["tsr-scroll-restoration-v1_3"]` was cleared, and cleared again on `pagehide`, before every load except the P-S2 reproduction.

### Rows

| ID | Outcome |
| --- | --- |
| P-1 | Done (D-2), with one change of mechanism. The strip is `sticky top-0 z-10 … bg-void-0 … split:static split:z-auto` (`:323`). Below `split` the graph column is `contents` (`:317`), because sticky only holds within its parent, and the old column ended above the inspector. Its children and `RunStatusBar`/`MetricTicker` get `flex-none` so they don't shrink in the region (`:323`, `:467`, `:483`). **Deviation:** the measured offset is `scroll-padding-top` on the scroll region, set from the strip's `offsetHeight` by a `ResizeObserver` (`:235-252`, ref `:312`). The recommendation was a `scroll-margin-top` on the inspector. Chrome's keyboard focus scrolling ignores sticky overlap: with the scroll-margin version, Shift+Tab back into the graph at 390 left 6 of 7 nodes wholly or partly under the strip. Scroll padding fixes both that and **Open in inspector**. The strip is 85, 93, or 59px depending on width, so no class value fits every width. `src/main.tsx` is unchanged. |
| P-2 | The Run button has `min-w-[136px]` (measured idle width 135.2) (`:330`). It is 136px for both "Run pipeline" and "Running", and Download CV no longer moves. |
| P-3 | Run and Download are now one group and the view controls another, inside `justify-between flex-wrap` (`:323-326`). A wrapped group starts at the left edge. Padding is `py-s-4 row:py-s-5` and gaps are `gap-x-s-5 gap-y-s-4`. `row:flex-nowrap` was removed: at 850–884px it squeezed the switch track to 29.7px and Fit to 27.4px wide (pre-existing, found at 851). The strip now wraps at 540–~554px and 850–~884px instead. All four controls stay labeled and full size. |
| P-4 | Done (D-3). `calloutBox()` (`:72-140`) keeps the right/left placement when a flank fits at full width. Otherwise it uses `side="bottom"`, or `"top"` when there is more room above and less than `CALLOUT_WANT_H` below. A vertical box starts at the node's left edge (so the stub lands on the node), narrows to `CALLOUT_MIN_W` before sliding left, and is clamped inside the visible canvas. A top box is anchored by `bottom: calc(100% - …px)` (`:421`). New measured constants: `NODE_H = 85` (rendered node height, `:45`) and `CALLOUT_WANT_H = 248` (the old literal, `:50`). `openId`, the `fit=false` default, `STAGE_MS`, `RUN_ORDER`, and the `<200px` block-scroll fallback are unchanged. |
| P-5 | Stacked graph `h-[550px]` (`:377`): stg_education y 184 + 85 node + 16 stub + 248 callout + 8 edge = 541 of canvas, plus a 9px scrollbar. The DAG no longer pans vertically. The log is `h-[104px] split:h-[164px]` with the `height` prop cleared, as in Task 2 (`:461`); 164px is 6 rows + cursor line + padding + the 1px `.ds-log` border that the route's `border-0` cannot remove. In the split the graph takes the remainder: 560px at 900 tall, which still leaves 551px of canvas. Stacked log unchanged. |
| P-6 | DOM order unchanged. Stacked, the inspector gets `mt-s-8 split:mt-s-0` (`:488`), a band of app surface between the ticker and the panel. `tabIndex={-1}` and `aria-label` are unchanged. |
| P-7 | In the split the tab wrapper is `split:flex split:h-[59px] split:flex-col split:justify-end split:pt-s-0` (`:495`), so the tab rule lines up with the action strip's rule (both at y=111 at 900 and 1440). The body is `px-s-5 py-s-6 … console:p-s-7` (`:506`), so the content aligns with the strip's 12/20px inset. In 850–~884 the strip wraps (93px), so the two rules don't line up there. |
| P-8 | `font-extralight` (`Panes.tsx:48`); computed Sora 200 at 22px (was 400), with the Sora 200 face loaded. |
| P-9 | No change. Vertical callouts are ≥200px wide at every tested width (200px minimum at 900 for serve_contact). |

### Measurements (before → after)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Callout covers its own node, each of the 7 nodes selected | 7/7 → **0/7** | 1/7 (`fct_cv`) → **0/7** | 7/7 → **0/7** | 0/7 → 0/7 |
| Full run, samples where the callout covers the running node (after) | 0/15 | 0/15 | 0/15 | 0/15 |
| Fit to view, 7 nodes (after) | 0/7, scale 0.363 | 0/7, 0.709 | 0/7, 0.5625 | 0/7, still a no-op |
| Callouts outside the visible canvas (after, all states) | 0 | 0 | 0 | 0 |
| Strip height | 97 → 85 (sticky) | 59 → 59 (sticky) | 59 (static) | 59 (static) |
| Graph frame / canvas height | 320 / 311 → 550 / 541 | 320 / 311 → 550 / 541 | 620 / 611 → 560 / 551 | 620 / 620 → 560 / 560 |
| Log box (client) | 104 (102) | 104 (102) | 104 → 164 (162) | 104 → 164 (162) |
| Stacked region scroll / client; inspector top | 1039 / 792, 638 → 1281 / 792, 880 | 906 / 848, 600 → 1160 / 848, 854 | locked 848 | locked 848 |
| Run button idle / running; Download CV shift | 135.2 / 97, −38px → 136 / 136, 0 | same | same | same |
| Document `scrollWidth`×`scrollHeight` | = viewport | = viewport | = viewport | = viewport |

Breakpoint probes (fresh loads): 539 (strip 85), 541 (93, wrapped), 556 (59), 849 (stacked, 59), 851 (split, strip wraps to 93, switch track 38 instead of 29.7), 890, 1099, and 1101 (59; `fct_cv` opens below). At every width: 0/7 overlaps, no callout outside the canvas, all strip controls hit-test, no document scroll, and scroll padding equal to the strip height.

### Verification

- **Observed.**
  - **P-S2 at 700×900.** Pointer **Open in inspector** smooth-scrolled the region to 311.5 (the maximum). Reloading the same history entry (`hx2mx`) restored 311.5 from `sessionStorage`. The strip stayed at 52–111 and all four controls hit-tested OK. Going to `/replay` and back, then forward and back again, restored 311.5 each time, and every control hit-tested OK. On 10 fresh same-origin iframe loads, sampled every 10ms for 1.8s, there were 0 blocked hit-tests.
  - **Reveal.** **Open in inspector** lands the inspector at the strip's bottom edge (137 at 390, 145 at 541), or lower when the region is already at its maximum scroll.
  - **Keyboard.** At 700: Tab order was rail and top bar, Run, Download, Live tail, Fit, the 7 nodes, Close, **Open in inspector**, then the Stage tab. ArrowRight selected Schema and rendered its table. Tab reached the Schema scroller (`tabIndex` 0). ArrowLeft returned to Stage. At 390, Shift+Tab from the revealed inspector back to the strip left no focused element under the strip, and `:focus-visible` matched every stop.
  - **Pointer.** Real clicks on Close, a node, Live tail (15 → 1 → 15 rows), **Open in inspector**, Download CV, and **Re-run this dag** all worked. Download CV showed the toast "CV downloaded · Waqas-Yousafzai-CV.txt · 3.7 KB"; the anchor `click` was stubbed, so no file was saved.
  - **Runs.** Full runs through all 7 `RUN_ORDER` stages at 390, 700, 900, and 1440 each ended with the "Run complete" toast.
  - **`?run=true`.** From `/replay`, the URL was consumed to `/pipeline` and the run started. A reload was idle, back went to `/replay`, and forward was idle. A direct load of `/pipeline?run=true` was consumed and ran.
  - **Split behavior.** In the split, the Experience pane body scrolls on its own (1025/789) while the region stays locked.
  - **Screenshots.** Taken at 390×844 (idle callout below `src_profile`; mid-run `fct_cv`) and 1440×900 (idle; mid-run `stg_education`). At 1440 the tool returned only an 800×600 crop, or the whole view at 0.6 scale.
  - **Console.** No error or warning entries.
- **Simulated.**
  - **Reduced motion.** 21 CSSOM `prefers-reduced-motion: reduce` rules were rewritten to `all` and `matchMedia` was stubbed, then the screen was remounted client-side at 700. `--dur-base` was 0ms, the cursor animation was `none`, and the callout animation lasted 0s. Pointer **Open in inspector** scrolled instantly and focused the inspector.
  - **Hidden-pane substitutes.** Graph scroll events and transition completion were driven by script, as described in the intro.
- **Not verified.**
  - **Enter/Space activation.** The tool sends keydown/keyup without a keypress, and even a plain button (**Open in inspector**) did not activate. Nodes and buttons are unchanged native `<button>`s.
  - **Live resize across the strip's wrap thresholds** (the `ResizeObserver` path). Every width was measured after a reload.
  - **Pane visible or real reduced-motion emulation.**
  - **Overlay-scrollbar platforms,** where the 550px frame leaves 9px more canvas.
  - **No screenshots at 700 or 900; non-Chromium browsers.**

### Handbacks

- **Point 6.** The callout stub never renders on any side: `.ds-callout`'s own `clip-path: var(--notch-14)` clips the stub, which sits outside the box (**source**, and absent from the screenshots). `ds-callout-in` still slides in horizontally for top/bottom placements. At 700, a right-side callout still covers the neighboring `stg_*` nodes, so a pointer user closes it first (as in the Task 1 baseline). `LogStream` accepts only a numeric `height`, and the route cannot remove the `.ds-log` border (`border-0` has no effect; pre-existing).
- **Point 4 (pre-existing, not re-tested).** Notched buttons clip their focus ring.
- **Accepted trade-off.** In 850–~884px the wrapped strip (93px) breaks the P-7 rule alignment, and the stacked graph now fills most of the first screen at 390 (as confirmed in D-3).

## Task 4 — `/replay` Restyle

Only `src/features/cv/ReplayScreen.tsx` changed. No shared component, token, shell, router, or other route file was touched. Measurements were taken on 2026-09-17 in the built-in Browser pane (Chromium) against the dev server, before and after the edit. The pane was **hidden** throughout (`document.hidden` true). `sessionStorage["tsr-scroll-restoration-v1_3"]` was cleared before every measured load and again on `pagehide`. One early batch of stacked probes ran without the `pagehide` clear, so the router restored a 560px pane offset; sizes were unaffected, and the positions in that batch were measured again. Sweeps selected runs with DOM `click()` and switched metric tabs by dispatching `pointerdown`/`mousedown`. The observed checks below used real pointer clicks and key presses.

### Rows

| ID | Outcome |
| --- | --- |
| R-1 | Below `split`, the grid gap is `gap-(--stack-loose)` (32px) and the History column has `border-hair border-t pt-(--stack-loose)` (`:94`, `:178`), so 32px + a hairline + 32px separate the statistic from the History header (was a 20px gap). In the split the column swaps the top rule for `split:border-l split:pl-s-8 split:self-stretch` (`:178`), a full-height hairline like `/pipeline`'s inspector boundary. The grid keeps `items-start`; only this column stretches, and its content stays at the top. DOM order is unchanged. |
| R-2 | The REC header takes `className="flex-wrap"` (`:101`); `.ds-section` sets no `flex-wrap`, so the utility applies. At 390 the title stays on one line and the note drops to its own right-aligned line. The wrapped row gap stays the component's 16px: a `gap-y-*` utility would lose to the unlayered `.ds-section` rule, and it is not needed. No wrapping variant is handed to point 4. The header is 93px at 390 (was 79) because the note is now two lines (R-3). |
| R-3 | Done by redistribution. The caption is `{stages} stages · {elapsed} · generated placeholder capture` (`:121-123`), 54 characters for every run. The variable outcome note moved into the header note as a second line under `run {id} · {when}` (`:103-116`). Both lines sit in a `flex flex-col items-end` span with `min-width: NOTE_CH ch` (`:26-29`): 28ch, the longest line, computed from `RUNS`. The block's width is fixed, so where the header wraps never depends on the run. No metadata is dropped, and `label`, `duration`, the empty state, `autoPlay`, `notched`, and the literal `src` are unchanged. **Why the header takes a line:** a caption that includes the note runs 69–85 characters (6px each). Whatever the order, the widths at which the shortest caption fits on one line but the longest does not fall inside both the 540–849 and 850–1099 regimes. A single-line header note has only about 27 characters of room at 850. **Cost:** the header is 56px at 540 and wider (was 46), and in the split its rule sits 10px below the History header's rule. |
| R-4 | The gap between the tabs and the card is `gap-s-4` (8px, was 16) (`:132-133`). |
| R-5 | `CvStats` is wrapped in `<div className="max-w-inspector">` (`:166-172`): 340px when the column is wider, the full column below that. `CvStats` and its single statistic are unchanged. |
| R-6 | `split:grid-cols-[minmax(0,1fr)_var(--inspector-w)]` (`:94`). `max-w-inspector` resolves through `--spacing-inspector: var(--inspector-w)` (`styles.css:92`). |
| R-7 | The main column's gap is `gap-s-6` (was `gap-s-8`) (`:95-97`), the same 16px rhythm as the History column. At 900×900 the pane no longer scrolls (812/812): the statistic ends 23px above the ticker, all its padding shows, and the scrollbar is gone, so the main column is 440px, not 431. At 1440×900 the pane still scrolls 5px (817/812): the statistic is fully visible 19px above the ticker, with 5 of its 24px bottom padding below the fold. This is accepted as the intended pane scroll. Closing it would need 20px `console:` padding, which fits with only 3px to spare. |
| R-8 | No change (D-1). `backgroundImage: "var(--grid-coarse)"` and `bg-void-0` are untouched (`:90-93`); computed `background-image` is still `none`. |
| R-9 | `className="h-[250px] row:h-[124px] split:h-[178px]"` with `style={{ height: undefined }}` (`:195-204`). The heights were measured by cloning the log with each `RUN_LOG` transcript at 2px column-width steps. Run 4193 is the longest: 214px at a 293px column (390), 250px from a 254px column (351 viewport), 124px from 406px (every `row:` width), and 178px at the split column's 315px content width. **Trade-off:** at 390 the log is 36px taller than 4193 needs, and up to 124px taller just under 540, in exchange for no clipping on 360px phones. Below 351px, 4193 scrolls inside the log (350: 284/248). **Side effect:** Chrome makes the log a Tab stop only while it overflows. Before, it overflowed and took focus for 4193 at 390, 900, and 1440; now it fits and is skipped there. `tabIndex` was not added, because nothing needs scrolling. |
| R-10 | **Re-run this dag** is wrapped in `<div className="border-hair border-t pt-s-6">` (`:205-216`), so 16px + a hairline + 16px separate it from the log (was 16px). It is still `Button asChild block` around `<a href="/pipeline?run=true">`. |

### Measurements (before → after)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Grid columns | 293 → 293 | 595 → 595 | `451 320` → `440 340` | `975 320` → `955 340` |
| Pane scroll / client | 1617/756 → 1763/756 | 1531/812 → 1547/812 | 831/812 → 812/812 | 839/812 → 817/812 |
| Statistic bottom vs. ticker top | — | — | 1.4 above → 23.2 above | 2.6 under → 19.2 above |
| History header top | 942 → 969 | 883 → 906 | beside | beside |
| REC header height | 79 → 93 | 46 → 56 | 46 → 56 | 46 → 56 |
| Media panel, runs 4193/4192/4191/4190 | 374 all → 374 all | 344 all → 344 all | 344/359/344/359 → 344 all | 344 all → 344 all |
| Tabs top across runs | 569 → 567 | 510 → 504 | 510 or 525 → 504 | 514 → 508 |
| Statistic width | 293 → 293 | 595 → 340 | 451 → 340 | 975 → 340 |
| History log box / content, run 4193 | 148/212 → 250/212 | 148/122 → 124/122 | 148/176 → 178/176 | 148/176 → 178/176 |
| Log to rerun | 16 → 33 | 16 → 33 | 16 → 33 | 16 → 33 |
| Document `scrollWidth`×`scrollHeight` | = viewport | = viewport | = viewport | = viewport |

Breakpoint probes (fresh loads, all four runs swept at each width): 320, 350, 360, 477, 481, 539, 541, 849, 851, 1099, and 1101. At every width, the header height, media panel height, caption line count, and tabs top each took a single value across the four runs, and the document did not scroll. The note drops under the title below about 479px (93px at 477, 56px at 481). From 539 to 541 the log goes from 250 to 124px and the padding from 16 to 20. From 849 to 851 the one column becomes `391 340` and the pane goes from 1547 to 812/812 (no scroll). From 1099 to 1101 the padding goes from 20 to 24 and the pane from 812 to 817. Only at 350 and 320 does any transcript scroll inside the log.

### Verification

- **Observed.**
  - **Runs.** Pointer clicks at 1440 (4190, 4192, 4191, 4193) and at 390 (4192) updated both header note lines, the video label, the caption, the active row, and the transcript. The panel stayed 344 at 1440.
  - **Metric tabs.** Pointer clicks on Run duration and Throughput at 1440 switched the card title and the axis labels (`run 4170 → run 4193`, `−52 min → now`). With a tab focused, ArrowRight and ArrowLeft switched both ways.
  - **Tab order.** At 1440 and 390: the rail and top bar, then Play, then Throughput (the tablist is one stop), then the four run rows, then **Re-run this dag**. Every stop matched `:focus-visible`. At 390 each stop was scrolled into the visible pane.
  - **Media.** Pointer Play/Pause toggled `paused`, the accessible name, and the live dot. Chrome paused playback on its own about 3s after it started, because the pane was hidden.
  - **Fallback.** Forced at 390 and 1440 by swapping `src` at runtime and calling `load()`. The empty state rendered, the frame stayed 268, and the Play hit target and live dot were removed. The panel height stayed the same across runs: 359 at 390 (the short timecode stops the bar wrapping) and 344 at 1440.
  - **Rerun.** A pointer click at 1440 went to `/pipeline` with the param consumed and the run started ("Running"). Back returned to `/replay`, forward was idle, and a load of `/pipeline` was idle.
  - **Screenshots.** 390×844 at the top and scrolled to the end (the whole transcript, the rule, and the rerun 16px above the ticker); 1440×900.
  - **Console.** One error: `ReferenceError: NOTE_CH is not defined`, from an HMR update between two of my edits (the constant was added in the next one). No error on any load after that.
- **Simulated.** Reduced motion at 1440: 21 CSSOM `prefers-reduced-motion: reduce` rules were rewritten to `all`, `matchMedia` was stubbed, and the screen was remounted through the `/pipeline` and `/replay` links. `--dur-base` was 0ms, and the sparkline draw, log cursor, live dot, and ticker animations were `none`. The statistic read `7` 50ms after the remount. Layout was identical: pane 817, header 56.2, panel 344, statistic top 766.2, log 178.
- **Commands.** `npm run check`, `npx tsc --noEmit`, and `npm run build` all exit 0.
- **Not verified.**
  - **Enter/Space on run rows.** Keydown arrived (Space as key `""`) but nothing activated, as in Task 3. The rows are unchanged native `<button>`s.
  - **Visible pane or real media emulation.** No real autoplay and no real reduced-motion emulation.
  - **Live resize across 540/850/1100.** Every width was measured after a reload.
  - **No screenshots at 700 or 900; non-Chromium browsers; overlay scrollbars,** where the stacked column is 9px wider.
  - **Screen-reader output** of the two-line note (`innerText` gives the two lines separated by a newline).

### Handbacks

- **Point 6.** `VideoPanel`'s header bar still wraps at 390, and the frame stays 268px at every width. A stable caption area is not needed for the current data. `RunRow`'s meta line wraps inside its segments at 390 for runs 4191 and 4190 ("2 days ago / 04:00 · … 7 / / 7"); this predates the change (same 293px column), with row styling already handed back. `LogStream` still accepts only a numeric `height` (Tasks 2 and 3).
- **Point 4 (pre-existing, not re-tested).** Notched buttons clip their focus ring.
- **For Task 5 or the user.** The History log is no longer a Tab stop where it fits (R-9). The narrow log well is up to 124px taller than the transcript. A 5px pane scroll remains at 1440×900 (R-7). In the split, the REC header rule sits 10px below the History header rule, on the other side of the new vertical hairline (R-3).

## Task 5 — Browser Matrix and Validation

Run on 2026-09-17 against the dev server (`preview_start dev`, reused) in the built-in Browser pane (Chromium, classic scrollbars). The pane was **hidden** throughout (`document.hidden` true): `requestAnimationFrame` and `ResizeObserver` callbacks never fired (a test observer on a resized element fired 0 times), smooth scrolls finished only after 2–4s, CSS transitions froze, and autoplay was paused. So, as in Tasks 3–4, a synthetic `scroll` event was dispatched on `.ds-graph` after each selection or resize (it makes `onViewport` republish), and finite animations were finished through `getAnimations()` before measuring. `sessionStorage["tsr-scroll-restoration-v1_3"]` was cleared before every measured load and on `pagehide`, except in the P-S2 reproduction. Everything was re-measured; no earlier figure was reused. "Script" means DOM `click()` or a dispatched `pointerdown`/`mousedown`; "pointer" means a real `computer` click; "keyboard" means real `computer` key presses.

### Fixes made

| File:line | Change | Why |
| --- | --- | --- |
| `BootScreen.tsx:79-89` | Removed `tabIndex={0}` and its comment from the boot `LogStream`. | Required fix. Now matches `/pipeline` and `/replay`: the log is a Tab stop only while it overflows. Checked: at 390×844 (212/212) Tab goes from `body` to Initialise. At 340×700 (266/212) Tab goes to the log, then to Initialise, both with `:focus-visible`. |
| `PipelineScreen.tsx:109-115`, `:125`, `:137` | Above/below callouts keep the full callout width (`min(300, canvas − 16)`), start at the node's left edge when that fits, and otherwise slide left. They no longer shrink to `CALLOUT_MIN_W` first. | **Regression found.** Task 3 narrowed vertical callouts to 200–231px near the right edge of the visible canvas. That ellipsized the title and hard-clipped the meta line, which cannot wrap. Before the fix: at 390 (`serve_contact`, 200px) title 119/96 and meta 222/198; at 900 (`serve_contact`, 200px) title +41px and meta +30px; at 900 in Fit (`fct_cv`, 231px) meta +49px. D-3 as confirmed says "at the canvas width minus EDGE". A box below or above its node cannot cover the node, whatever its horizontal offset. The stub it was aligned for never renders (point 6). After the fix, no callout title or meta line is clipped at any size, probe, run, or fit state below. |

### Matrix — `/` (completed boot, fresh loads)

| | 390×844 | 700×900 | 900×900 | 1440×900 | 390×260 |
| --- | --- | --- | --- | --- | --- |
| Card | 366×488 | 620×472 | 620×472 | 620×520 | 357×488, top 12 |
| Name / role | Sora 200 38px / 1 line | 52px / 1 | 52px / 1 | 52px / 1 | 38px / 1 |
| Log box, content / client, rows clipped | 214, 212/212, 0 | 124, 122/122, 0 | same | same | 214, 212/212, 0 |
| Initialise hit-test; hint on the button row | OK; yes | OK; yes | OK; yes | OK; yes | Frame scrolls 512/260; at max scroll (252.5) OK |
| Document `scrollWidth`/`scrollHeight` = viewport | yes | yes | yes | yes | yes |
| Verdict | pass | pass | pass | pass | pass |

Probes: 539 (214, 212/212), 849, 851, 1099, and 1101 (124, 122/122) all pass. **541: the log is 124px, content 140px, `scrollTop` 18.** The row breakpoint shrinks the box before the lines stop wrapping at 545px, so the first row sits 18px above the box and can be scrolled into view. This is pass-with-note: the log is an intended scroller and is a Tab stop while it overflows. At 340×700 the log (266/212) scrolls as its comment says.

### Matrix — `/pipeline` (after the fix unless marked)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Scroll model | Stacked, `overflow-y:auto`, 1281/792 | Stacked, 1160/848 | Split, locked 848/848 | Split, locked 848/848 |
| Strip; `scroll-padding-top`; four controls hit | 85 sticky; 85px; OK | 59 sticky; 59px; OK | 59 static; OK | 59 static; OK |
| Graph frame / canvas | 550 / 325×541, horizontal pan only | 550 / 635×541 | 560 / 504×551 | 560 / 1036×560, no pan |
| Log / run bar / ticker | 104 / 792 / 820–856 (in region) | 104 / 766 / 794–830 | 164 / 836 / 864–900 | 164 / 836 / 864–900 |
| Inspector | Top 880, tabs 893 | Top 854, tabs 867–905 | 340×848, tab rule at 111 = strip rule | Same |
| Default callout | Bottom, 300, covers own node 0, inside | Right, 300, 0, inside | Bottom, 300, 0, inside | Right, 300, 0, inside |
| 7 nodes at Actual size: covers own node / outside canvas / text clipped | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| 7 nodes in Fit (scale): same | 0/0/0 (0.363) | 0/0/0 (0.709) | 0/0/0 (0.5625 inline; transition frozen) | 0/0/0 (`none`, no-op) |
| Full run, 33 samples at 300ms | Pointer run before the fix, script run after: `RUN_ORDER` in order, 0 covering, 0 outside, 0 text clipped (after), Run 136px, Download left edge fixed (216), 15 log rows, 100%, "Run complete" toast | Script (before the fix; no narrowed callout at 700): same | Script (after the fix): same, 0 text clipped | Script (before the fix; no vertical placement at 1440): same; after the run, all 7 callouts in the `ok` state, 0 text clipped |
| Stage / Schema | Both select; last Schema row and last Stage element reachable; Schema scroller 331/299, `tabIndex` 0 | Same (609/609) | Same (331/313) | Same (331/297) |
| Document = viewport | yes | yes | yes | yes |
| Verdict | pass | pass (tabs below the fold, see trade-offs) | pass-with-note (run bar stage label, handbacks) | pass |

Probes (fresh loads, after the fix; each ran the full idle, Actual, Fit, Schema, and Stage sweep): 539 (85 sticky, 1208/848), 541 (93, `scroll-padding-top` 93), 598 (59), 849 (59 sticky, 1137/848), 851 (split; strip wraps to 93; canvas 455×517), 920, 1099, and 1101. At every width: no document scroll, all four controls hit, 0/7 covering, 0 outside, 0 callout text clipped in Actual or Fit, and every inspector pane reachable. The only clipped text was `RunStatusBar`'s stage label (ellipsized) at 541 (94/63) and 851 (94/42). With the long label `src_experience` it also truncates at 560 (101/82), 880 (101/71), and **900×900 (101/91)**; it fits at 390, 580, 700, and 1440. That markup predates this subprocess (see handbacks).

### Matrix — `/replay` (fresh loads; the four runs selected in turn by script at each size)

| | 390×844 | 700×900 | 900×900 | 1440×900 |
| --- | --- | --- | --- | --- |
| Grid; padding | 293; 16 | 595; 20 | `440 340`; 20 | `955 340`; 24 |
| Pane scroll | 1763/756 | 1547/812 | 812/812 | 817/812 (5px) |
| Header / media panel / caption lines / tabs top, across the 4 runs | 93 / 374 / 2 / 567 (one value each) | 56 / 344 / 1 / 504 | 56 / 344 / 1 / 504 | 56 / 344 / 1 / 508 |
| Per run: note (2 lines), video label, caption, active row, transcript | All update | All update | All update | All update (pointer clicks on all 4 rows) |
| Log box; content (4193/4192/4191/4190) | 250; 212/174/118/156 | 124; 4193 fits | 178; 4193 fits | 178; fits |
| Metric tabs | Run duration → "run duration · last 24 runs", "run 4170 → run 4193"; Throughput → "rows / minute · live", "−52 min → now" | same | same | same (pointer) |
| At max scroll: rerun, rows, Play, tabs hit | OK | OK | OK | OK |
| Statistic vs. ticker; History boundary | In pane; top rule | In pane; top rule | 23 above; left rule | 19 above; left rule |
| Forced fallback (`src` swap + `load()`) | Empty state, frame 268, panel 359, no Play target, no live dot, no clipping | Same, panel 344 | Same | Same |
| Document = viewport | yes | yes | yes | yes |
| Verdict | pass | pass | pass | pass |

Probes (fresh loads): 539 (442; 1665/812; log 250), 541 (436; 1547; 124), 849 (744; 1547), 851 (`391 340`; 812/812; 178), 1099 (`639 340`; 812), and 1101 (`616 340`; 817). At each, all four runs gave the same header, panel, caption, and tabs positions, and nothing was clipped.

### Live resize (no reload)

- **`/pipeline`.** Start at 390 with `stg_education` selected, the Schema tab open, and the region scrolled to 401. Then 541 → 849 → 851 → 1440 → 849 → 539 → 390. At every step: no document scroll; all four strip controls hit-test at the current scroll and at max scroll; the inspector is reachable; the callout (after a synthetic scroll event) covers 0 and stays inside; Schema stays selected. Nothing stranded. **Not verifiable:** `scroll-padding-top` stayed 85px throughout, because `ResizeObserver` never runs while the pane is hidden. Fresh loads at every probe show it equal to the strip height (59, 85, 93).
- **`/replay`.** Start at 390 with run 4192 selected and the pane scrolled to 600. Then 541 → 849 → 851 → 1440 → 849 → 539 → 390. At every step the rerun link, tabs, and active row hit OK, nothing is clipped, and there is no document scroll. **Hysteresis:** going 849 → 851 kept the stacked pane's scrollbar gutter, so the main column was 382 and not 391. The REC header wrapped (93), and the pane scrolled 34px (846/812). A fresh load at 851, or a live resize straight to 856, gives 56 and 812/812. It happens only with classic scrollbars, in about 851–854, and nothing becomes unreachable.

### P-S2 at 700×900

Pointer **Open in inspector** scrolled the region to 311.5 (max 312). Reloading the same history entry (`2gsd5l`, cache kept) restored 311.5. The strip stayed at 52–111 and all four controls hit-tested OK. Going to `/replay` through the rail and then back restored 311.5 again, with all four OK.

### Pointer and keyboard

- **Pointer (observed).**
  - `/`: Initialise → `/pipeline` at 390, and at 390×260 at max frame scroll.
  - `/pipeline` at 390:
    - Run completed the full run order.
    - Download CV showed the "CV downloaded" toast (anchor `click` stubbed, no file saved).
    - Live tail went 15 → 1 → 15 rows.
    - Open in inspector focused the inspector and scrolled to max, with the inspector top (218) below the strip (137).
    - Schema selected.
    - Top bar Contact opened the dialog with focus inside; Escape closed it and returned focus.
  - `/replay` at 1440: all four run rows; both metric tabs; Play → Pause → Play (`paused`, label, and live dot all follow); rail Contact opened and Escape closed the dialog.
  - `/replay` at 390: **Re-run this dag** → `/pipeline`, "Running", history 17 → 18. The run completed; reload was idle; back went to `/replay`; forward was idle. A direct load of `/pipeline?run=true` was consumed and ran.
- **Keyboard (observed).**
  - `/`: 390 Tab → Initialise; 340 Tab → log → Initialise.
  - `/pipeline` at 390:
    - Tab order: rail (5), top bar Contact, Run, Download, Live tail, Fit, 7 nodes, Close, Open in inspector, Stage tab.
    - ArrowRight selected Schema and rendered the table. Tab reached the Schema scroller. Shift+Tab, ArrowLeft returned to Stage. Shift+Tab went back through Open, Close, and the nodes.
    - Every stop matched `:focus-visible`, and no focused element sat under the sticky strip.
  - `/pipeline` at 1440: same order. The overflowing Experience pane body (1085/789) is a Tab stop after the Stage tab.
  - `/replay` at 390 and 1440: rail, Contact, Play, Throughput. ArrowRight and ArrowLeft switch the card. Then the four rows and Re-run. Each stop is in view with `:focus-visible`.
  - Enter on `/` navigates through the window handler.
- **Tool-limited (not observed).** With a button focused, `key "Enter"` sends keydown/keyup (`key` "Enter", `keyCode` 0) with no `keypress` and no `click`. `"Return"`, `"space"`, `"Space"`, and `"KP_Enter"` arrive with an empty `key`, and `type " "` sends nothing. So Enter/Space activation of focused Initialise, Run, Download, Fit, nodes, Close, Open in inspector, run rows, and Play could not be observed. All of these are unchanged native `<button type="button">` elements (nodes keep `aria-pressed`). The Live tail switch keeps `role="switch"`, and Re-run is a real `<a href="/pipeline?run=true">`.
- **Hidden-pane observation.** At 390, keyboard focus on `stg_projects`, `stg_education`, and `serve_contact` left each node partly outside the graph viewport; `scrollLeft` did not change. This is the shared graph scroller, not route layout, and was not checked with the pane visible.

### Reduced motion (simulated)

All 21 `(prefers-reduced-motion: reduce)` CSSOM media rules were rewritten to `all`, and `window.matchMedia` was stubbed for that query. Routes were then remounted client-side at 390×844.

- **`/`** (reached with `history.back()`). `--dur-base` is 0ms and the cursor animation is `none`. The lines arrived at 283, 542, 802, and 1063ms, and all four messages were present. The card stayed at 488.4 and the log at 212/212 with `scrollTop` 0. Initialise stayed at top 601, and the document did not scroll.
- **`/pipeline`** (Initialise). The callout's `animation-duration` is 0s. The running node's `::after`, its icon, and the ticker have `animation: none`. The full run completed (15 rows, 100%). **Open in inspector** reached max scroll (662) within 30ms, focused the inspector, and left its top (218) below the strip (137).
- **`/replay`** (rail link). The statistic read "7" at 60ms with no intermediate values. The spark head, video scan, live dot, log cursor, and ticker all have `animation: none`. The Run duration line has animation `none` and `stroke-dashoffset` 0. Selecting run 4190 updated the header, and the panel stayed 374. The video still autoplayed: `VideoPanel` does not gate autoplay on reduced motion (component, point 6).

### Static audit

- **Added lines.** The 244 added lines in the four source files contain no `#hex`, `rgb(`, `hsl(`, `oklch(`, or `color-mix`. They add no shadow or filter, no `duration-`/`ms`/`transition`/`animate-`/`ease`/`delay` value, and no `.ds-*` selector or override. Component instances receive only layout utilities: `flex-wrap` on `SectionHeader`, `min-w-[136px]` on `Button`, `flex-none` on `RunStatusBar` and `MetricTicker`, and heights on `LogStream`.
- **Arbitrary values.** Every arbitrary dimension has a comment saying what it measures: `h-[214px]`/`row:h-[124px]`, `min-w-[136px]`, `h-[550px]`, `split:h-[164px]`, `split:h-[59px]`, and `h-[250px]`/`row:h-[124px]`/`split:h-[178px]`. `h-[104px]` is the log's previous `height` prop carried over (pass-with-note). `leading-(--lh-tight)`, `gap-(--stack-loose)`, `pt-(--stack-loose)`, and `split:grid-cols-[minmax(0,1fr)_var(--inspector-w)]` reference tokens.
- **Inline styles.** `scrollPaddingTop` and `bottom: calc(…)` are measured, `minWidth: NOTE_CH ch` is computed from `RUNS`, and `height: undefined` clears the prop.
- **Built CSS.** All 105 distinct class tokens in the changed `className`s exist in `dist/assets/index-*.css`. Bridged ones resolve to tokens, for example `max-w-inspector` → `var(--inspector-w)`, `rounded-1` → `var(--r-1)`, `bg-raised` → `var(--surface-raised)`, and `tracking-label` → `var(--ls-label)`.
- **Untouched files.** `git diff` is empty for `src/components`, `src/styles`, `src/styles.css`, `src/main.tsx`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/routes`, `Shell.tsx`, `package.json`, and `package-lock.json`. Only `BootScreen.tsx`, `PipelineScreen.tsx`, `ReplayScreen.tsx`, and `Panes.tsx` differ.

### Trade-off verdicts

| Trade-off | Measured | Verdict |
| --- | --- | --- |
| `/pipeline` graph fills most of the first screen at 390 | Frame 137–687. The log, run status, and ticker (820–856) still sit at the foot of the first screen; the inspector starts at 880. | Accept (D-3). Output stays in view, and Open in inspector and the stacked scroll reach the inspector. |
| Inspector tabs just below the fold at 700×900 | Inspector top 854; tabs 867–905 (33 of 38px visible) | Accept. The panel edge and tab labels show there is more below, and the stacked scroll is the intended model. |
| Tab-rule misalignment where the strip wraps (850–~884) | At 851 the strip rule is at 145 and the tab rule at 111 | Accept. It is a narrow band, and squeezing the strip back onto one row broke the switch and Fit (P-3). |
| `/replay` REC rule 10px below the History rule at ≥850 | 10.2px at 851–1440 | Accept. The rules sit on either side of the full-height vertical hairline, and aligning them would undo R-3's stable header. |
| `/replay` log taller than its transcript on narrow widths | 390: 38px empty for 4193, 132 for 4191; 539: 128 for 4193, 168 for 4191 | Accept. The fixed well keeps the rerun action still across runs and holds 4193 unclipped on 360px phones. A content-reserving `LogStream` option goes to point 6. |
| `/` boot log empty space at 390 | Box 214, content 194 (20px) | Accept |
| New: `/` log overflows 18px at 540–544 | 541: 140/122 | Accept (intended log scroll, Tab stop while overflowing) |
| New: `/replay` 851–~854 scrollbar hysteresis on live resize | Header 93, pane 846/812 | Accept (classic scrollbars only; nothing stranded) |
| New: run bar stage label ellipsized when the `analytics_wh · XS` badge shows in a narrow graph column | 900×900 `src_experience` 101/91; 541, 560, 851, 880 | Pre-existing (unchanged markup and column widths). Not fixed: hiding the badge until `console:` would drop warehouse information across 540–1099, which is a design decision. Handed back. |

### Acceptance criteria

| Criterion | Result | Evidence |
| --- | --- | --- |
| Inputs 1–4 used; mapped system through tokens and shared components | pass | Static audit; screenshots at 390×844 and 1440×900 for all three routes |
| No raw color, color-bearing effects, or one-off motion; measured dimensions local | pass-with-note | Static audit; `h-[104px]` is the carried-over prop value |
| `/` boot log, identity and role, Initialise, hint, Enter, reachability, reduced motion | pass | `/` matrix; 390×260; Enter observed; simulated reduced motion kept four lines |
| `/pipeline` behavior retained | pass | Runs at all four sizes; download toast; Live tail; Fit; callouts; tabs; contact; `?run=true` once |
| Pipeline hierarchy; stacked below 850; locked split at and above | pass-with-note | Pipeline matrix and probes; P-S2; live `scroll-padding-top` updates not verifiable while hidden |
| `/replay` behavior retained | pass | Replay matrix; pointer rows, tabs, Play; rerun consumption |
| Replay distinct at every breakpoint; reading and tab order; no hidden duplicates | pass | Top rule stacked, left rule split; tab order observed at 390 and 1440; no `hidden` class in `ReplayScreen.tsx` |
| Browser checks cover every size and state | pass | All three matrices; media playback only toggled (autoplay paused while hidden); fallback at four widths |
| No document scroll, overlap, clipping, unreachable content, console errors, or stranding at breakpoints | pass-with-note | One regression fixed (callout clipping). Notes: `/` 540–544, replay 851 hysteresis, pre-existing run bar ellipsis. Console: the only error-level entries are Task 4's stale `NOTE_CH` HMR error and one from this task's own test `MutationObserver`; none from the app. |
| Clear identity, task, content, and metadata; no duplicated shell UI | pass | Screenshots; each route renders only its own content under the unchanged shell |
| Keyboard, semantics, focus, reduced motion intact | pass-with-note | Tab order and arrows observed on all routes. Enter/Space activation is tool-limited (native buttons unchanged). Notched-button focus ring is pre-existing (point 4). Reduced motion simulated. |
| Scope at route composition | pass | No shared, token, shell, router, or package diff |
| `npm run check`, `npx tsc --noEmit`, `npm run build` | pass | All exit 0 after the fixes (Biome: 47 files, no fixes; Vite: 2073 modules) |

### Not verified

- Anything that depends on the pane being visible: `ResizeObserver` updates during live resize, smooth-scroll timing, real autoplay, and whether keyboard focus scrolls a partly visible node into the graph viewport.
- Real `prefers-reduced-motion` media emulation (simulated only).
- Enter/Space activation of focused buttons (tool limitation, above).
- Screenshots at 700 and 900 for `/` and `/replay` (measured only). `/pipeline` was screenshotted at 851 and 900.
- Non-Chromium browsers, overlay-scrollbar platforms, and screen-reader output.

### Consolidated handbacks

- **Point 3.** D-1 grid-texture token shape and its `ds-components.css` consumers (unchanged).
- **Point 4.** Notched buttons clip their focus ring (`.ds-btn--notched` `clip-path`; pre-existing, not re-tested visually).
- **Point 6.**
  - **Callout.** The stub is clipped by `.ds-callout`'s own `clip-path`. `ds-callout-in` slides horizontally even for top/bottom placement. Side callouts cover neighboring nodes: `stg_*` at 700, and at 1440 the left callout for `serve_contact` hides `fct_cv`.
  - **`RunStatusBar`.** The stage label ellipsizes in narrow graph columns when the route shows the warehouse badge (900×900 with long labels). Point 6 decides between label priority in the component and a route decision to show the badge only at `console:`.
  - **`LogStream`.** It accepts only a numeric `height`, the `.ds-log` border cannot be removed, and it has no content-reserving height option (empty log wells above).
  - **`VideoPanel`.** Header bar wraps at 390; the frame is fixed at 268; autoplay is not gated on reduced motion.
  - **`RunRow`.** The meta line wraps at 390, and selection is not exposed semantically.
  - **Graph keyboard reveal.** Keyboard focus may not reveal a partly visible node (seen only while hidden).
  - **Other open items.** Boot pacing under reduced motion; Sparkline warning hue; `.ds-stat__value` weight.
- **No lifecycle owner.** Router scroll-restoration config (unchanged by D-2); the TanStack Devtools trigger overlapping the rail monogram (environment).
