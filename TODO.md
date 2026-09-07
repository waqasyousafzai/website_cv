# CV handoff improvement plan

Use `claude-hand-off` as the base and adapt the working behavior from
`codex-hand-off`. Preserve Claude's file-based TanStack Router architecture,
TypeScript component APIs, design tokens, Tailwind utilities, and Radix primitives.
This checklist records progress. Steps 1 through 4 are implemented; step 5 is
implemented with spoken toast verification pending. Steps 6 and 7 are planned.

## 1. Responsive layouts and callouts

- [x] Reimplement responsive behavior with Tailwind variants using custom
  breakpoints at 540, 850, and 1100px. Default `md:` and `lg:` values do not match.
- [x] Stack the inspector, wrap the topbar, and reduce navigation rail dimensions
  as space narrows. Preserve token-backed styling; do not copy Codex's
  `!important` media-query layer or introduce its semantic class hooks.
- [x] Constrain pipeline callout width to the available canvas width and keep
  callouts within the viewport.
- [x] Include vertical scrolling in callout positioning, accounting for graph
  scaling when fit-to-view is enabled. `GraphViewport.scale` is plumbed through
  and the callout maths is written in scaled coordinates; step 2 made the value
  real, and the maths needed no change.
- [x] Verify narrow layouts and callout attachment while scrolling, including
  widths immediately above and below each breakpoint.
- [x] Keep the full callout scrollable on short canvases and size replay metric
  columns to the available content width so values remain readable.

## 2. Complete the primary actions

- [x] Implement Download CV using the local CV data and a downloadable text Blob
  named `Waqas-Yousafzai-CV.txt`. `cv-text.ts` renders the whole `CV` object, so
  the file and the inspector panes cannot drift apart.
- [x] Implement Fit to view in PipelineGraph and wire its active state to the
  corresponding control. A sticky toggle: it scales the DAG to the canvas, never
  magnifies past 1:1, and stops the canvas scrolling while engaged. Engaging it
  resets the scroll offset — the inner box keeps its unscaled layout size, so a
  leftover offset would otherwise be stranded behind `overflow: hidden`.
- [x] Implement replay's Re-run this DAG with a validated, typed search parameter:
  navigate to `/pipeline` with `search: { run: true }`. The control is a real
  `Link`, so the request survives a copied URL and the back button.
- [x] Consume the run parameter with `replace: true` once execution starts.
  Avoid a remount-key workaround and ensure ordinary navigation cannot retrigger
  a previously requested run. `validateSearch` must overwrite `run` with
  `undefined` rather than omit it: a match's search is its parent's merged with
  the route's result, and no route above validates anything, so an omitted key
  would let `?run=anything` through as a truthy string.
- [x] Verify direct links, repeated reruns, and browser back/forward navigation.
  Covered `?run=true`, `?run=1`, `?run=nonsense&x=1`, a plain reload, three
  consecutive reruns, and back/forward across the consumed entry.

## 3. Inspector navigation

- [x] Make Open in inspector select the correct content and scroll the inspector
  into view when it is stacked below the graph. The action selects the callout's
  own node rather than relying on `sel` and `openId` happening to agree, and
  reveals the panel through a counter-keyed effect: the commonest press changes
  neither `tab` nor `sel`, and the scroll has to wait for the commit because
  arriving from Schema grows the panel and with it how far the screen can
  scroll. Focus follows the scroll, so Tab does not resume behind the fold.
- [x] Verify the action in both desktop and stacked layouts. No media query is
  needed: at and above `split:` the two columns are height-locked and the same
  call is a no-op. Covered 800, 849, 851 and 1200px, arrival from the Schema
  tab, a press mid-run, keyboard and mouse activation, and both answers to
  prefers-reduced-motion.

## 4. VideoPanel resilience

- [x] Show the empty/failure state when a recording cannot load. Media errors
  use the existing empty copy and fallback duration, clear progress, and remove
  playback controls.
- [x] Handle rejection of explicit `play()` calls and keep playback controls in
  sync with actual media events, including playback ending. Blocked or
  interrupted requests remain retryable unless the media element reports an
  error. Each source owns fresh playback state; late rejections from a discarded
  recording cannot affect its replacement.
- [x] Verify missing recordings, playback failures, and switching recordings.
  Browser checks covered absent/empty sources, 404 and invalid media, blocked
  and interrupted play with retry, media errors during playback, autoplay,
  external play/pause, non-looping completion, looping, source removal and
  replacement, and pending rejections across source changes. Replay was checked
  at 390 and 1280px; Biome, TypeScript, and the production build passed.

## 5. Accessibility

- [x] Associate Input hints and errors explicitly with their controls, preserving
  Claude's richer API. The label contains only label text; the displayed error
  or hint has a stable description ID merged with caller-supplied IDs. Errors
  set `aria-invalid`, otherwise the caller's invalid state is retained. Browser
  fixtures covered input/textarea, ReactNode content, affixes, disabled fields,
  explicit/generated IDs, external descriptions, both/neither hint and error,
  native values/textarea rows, label-click focus, unique IDs, and hint/error
  transitions without changing IDs.
- [x] Give the graph the accessible group name "CV pipeline" and expose each
  node's current state through visually hidden button text. All five states
  (idle, running, completed, warning, failed) were checked in the accessibility
  tree, including ReactNode labels and selected state. Enter/Space selection
  and a full run were checked. Label changes are not live announcements.
- [x] Name the tab lists "Pipeline inspector" and "Replay metrics". Verify
  arrow-key focus and selection on both strips.
- [x] Test dialog focus restoration with the actual openers and keyboard flows.
  Both openers initially lost focus to the body after Escape. A contact-only
  override now restores the captured activating button when still connected;
  the shared Radix primitive is unchanged. Desktop checks covered both openers
  with Enter, Space, and pointer activation, each closed by Escape, Close, and
  Send, plus outside dismissal and forward/backward focus trapping. Narrow
  checks repeated both openers and focus trapping. Layouts checked at 390 and
  1280px; no visual token changes.
- [ ] Verify toast announcements before changing their semantics: `<output>`
  already has an implicit status role with polite live-region behavior.
  Browser accessibility snapshots confirmed status elements for contact, run
  completion, and repeated identical contact notifications. Semantics remain
  unchanged. Spoken announcements still require a manual screen-reader check;
  the available browser interface cannot verify speech or announcement timing.

Validation passed: `npm run check`, `npx tsc --noEmit`, and `npm run build`.
A fresh production preview also passed both Contact opener/send flows and
direct `/pipeline` and `/replay` loading without console warnings or errors.

## 6. Settings and source access

- [ ] Add a Settings dialog with a CSS motion toggle. Describe its scope
  accurately: disabling CSS animations/transitions does not stop JavaScript
  updates or video playback.
- [ ] Make Source repo open <https://github.com/waqasyousafzai/website_cv>.
  Prefer a direct link unless a dialog adds useful information.
- [ ] Put design attribution and the original design-project link in README.md.

## 7. Consistency, icons, validation, and documentation

- [ ] Deliberately use an approximately 11.6-second demo run to match run 4193 in
  the design history. Record the tradeoff: 1650ms per stage makes the seven-stage
  demo 65% longer than 1000ms per stage.
- [ ] Derive simulated stage timing and displayed log timestamps from one shared
  value. Keep simulated timing distinguishable from measured execution.
- [ ] Use honest demo messaging for run completion and contact submission; do
  not imply a network request or message delivery that never occurred.
- [ ] Correct the inaccurate claim that Lucide dropped brand icons in v0.469 in
  README.md and Icon.tsx comments. Correct the record in a new commit rather
  than rewriting published commit history.
- [ ] Restore recognizable GitHub and LinkedIn marks. Prefer dedicated brand
  assets while retaining Lucide for interface icons. If choosing an exact
  `lucide-react` 0.474.0 compatibility pin instead, first verify its exports and
  compatibility, document the choice, and update package-lock.json with npm.
- [ ] Include reusable UI components in Biome checks while retaining appropriate
  exclusions for generated files and vendored design styles.
- [ ] Run `npm run check`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Complete a browser pass covering narrow layouts, graph scrolling and fit,
  inspector navigation, downloads, video failures, keyboard interactions,
  dialogs, direct route loading, and repeated reruns.
- [ ] Update README.md and AGENTS.md to reflect the implemented behavior,
  dependencies, commands, and remaining limitations.

Suggested first implementation PR: steps 1 through 4. Keep the accessibility,
settings, and consistency work reviewable in subsequent changes.
