# CV handoff improvement plan

Use `claude-hand-off` as the base and adapt the working behavior from
`codex-hand-off`. Preserve Claude's file-based TanStack Router architecture,
TypeScript component APIs, design tokens, Tailwind utilities, and Radix primitives.
This checklist records planned work; it does not mark any implementation complete.

## 1. Responsive layouts and callouts

- [ ] Reimplement responsive behavior with Tailwind variants using custom
  breakpoints at 540, 850, and 1100px. Default `md:` and `lg:` values do not match.
- [ ] Stack the inspector, wrap the topbar, and reduce navigation rail dimensions
  as space narrows. Preserve token-backed styling; do not copy Codex's
  `!important` media-query layer or introduce its semantic class hooks.
- [ ] Constrain pipeline callout width to the available canvas width and keep
  callouts within the viewport.
- [ ] Include vertical scrolling in callout positioning, accounting for graph
  scaling when fit-to-view is enabled.
- [ ] Verify narrow layouts and callout attachment while scrolling, including
  widths immediately above and below each breakpoint.

## 2. Complete the primary actions

- [ ] Implement Download CV using the local CV data and a downloadable text Blob
  named `Waqas-Yousafzai-CV.txt`.
- [ ] Implement Fit to view in PipelineGraph and wire its active state to the
  corresponding control.
- [ ] Implement replay's Re-run this DAG with a validated, typed search parameter:
  navigate to `/pipeline` with `search: { run: true }`.
- [ ] Consume the run parameter with `replace: true` once execution starts.
  Avoid a remount-key workaround and ensure ordinary navigation cannot retrigger
  a previously requested run.
- [ ] Verify direct links, repeated reruns, and browser back/forward navigation.

## 3. Inspector navigation

- [ ] Make Open in inspector select the correct content and scroll the inspector
  into view when it is stacked below the graph.
- [ ] Verify the action in both desktop and stacked layouts.

## 4. VideoPanel resilience

- [ ] Show the empty/failure state when a recording cannot load.
- [ ] Handle rejection of explicit `play()` calls and keep playback controls in
  sync with actual media events.
- [ ] Verify missing recordings, playback failures, and switching recordings.

## 5. Accessibility

- [ ] Associate Input hints and errors explicitly with their controls, preserving
  Claude's richer API. Keep the accessible label separate from the description.
- [ ] Give the graph an accessible name and expose each node's current state in
  its button label. Do not assume label changes are live announcements.
- [ ] Give the tabs list a meaningful accessible name.
- [ ] Test dialog focus restoration with the actual openers and keyboard flows.
  Add an override only if default restoration fails.
- [ ] Verify toast announcements before changing their semantics: `<output>`
  already has an implicit status role with polite live-region behavior.

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
