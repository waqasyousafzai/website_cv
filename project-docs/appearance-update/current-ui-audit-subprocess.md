# Current UI Audit - Subprocess

## Scope and Deliverable

Begin after Reference Capture is complete, and use the approved **Carry forward / Avoid** section in `project-docs/appearance-update/reference-brief.md` plus `project-docs/appearance-update/project-lifecycle.md` as the visual-direction context. Audit the checked-out application as the authoritative current-state baseline using both source inspection and browser observation. Treat a visible region, reusable component family, interaction, or state as an **audit unit**; individual DOM nodes and repeated instances do not need separate entries unless they behave or need to change differently.

Record the completed audit under an `## Audit Findings` heading in this file. The findings must contain:

- baseline metadata: audit date, commit, relevant uncommitted application-source changes, browser, local server command and URL, exact CSS-pixel viewport sizes, and motion preference;
- a per-route inventory and behavior checklist, with each claim marked **runtime-observed**, **source-confirmed**, or **both**;
- an ownership map from audit units to source files and shared dependencies;
- one disposition and rationale for every audit unit; and
- cross-route themes, route-specific exceptions, risks or unverified states, and explicit handoffs to lifecycle stages 3–6.

Use these dispositions consistently:

- **restyle-only** — the intended direction can be achieved through existing tokens, shared component styles, or route styling without changing markup, state, data, interaction behavior, or responsive/scroll ownership;
- **structural change** — the intended direction requires changes to markup, component composition, state or interaction logic, data flow, or responsive/scroll structure; explain why restyling alone is insufficient; and
- **preserve** — no intentional visual, structural, content, or behavioral change is required, although the unit may inherit project-wide token changes.

[ ] 1. Establish the reproducible baseline and record the audit environment before evaluating the UI. Inspect the current source and run the application without changing application files.
[ ] 2. Inventory `/`, `/pipeline`, and `/replay` at `390×844`, `700×900`, `900×900`, and `1440×900`, covering the default view and every breakpoint-specific transformation in the current 540px, 850px, and 1100px layout regimes.
[ ] 3. Map every audit unit to its route module, screen or shell component, reusable design component, shadcn/Radix wrapper, token or stylesheet source, data source, and media asset as applicable. Distinguish the standalone `/` route from the `_app` shell shared by `/pipeline` and `/replay`.
[ ] 4. Exercise the stateful flows with pointer and keyboard at the narrow and full-console viewports, then check breakpoint-specific scrolling and stacking at the two intermediate viewports. Repeat motion-bearing flows with `prefers-reduced-motion: reduce`. Record the result and evidence for each check; if a state cannot be triggered safely, source-confirm it and list it as unverified rather than assuming it works.
[ ] 5. Assign exactly one disposition to every audit unit, consolidate repeated findings into cross-route themes, and identify the owning lifecycle stage for each proposed change or verification follow-up. Do not choose token values or design solutions in this audit.

## Acceptance Criteria

- The audit findings include the required baseline metadata, per-route inventory and behavior checklist, ownership map, disposition matrix, and handoff summary. Runtime observations are distinguishable from conclusions based only on source inspection, and failures or unverified states are recorded rather than silently omitted.
- The audit covers `/`, `/pipeline`, and `/replay`, plus the shared `_app` shell, at the four named representative viewports: `390×844` below 540px, `700×900` from 540–849px, `900×900` from 850–1099px, and `1440×900` at 1100px or wider. Any unavoidable substitution records its exact dimensions and remains in the same layout regime.
- Each route entry records its current visible regions, content hierarchy, page and pane scrolling model, responsive transformations, and important visual or interaction states. It also records unintended overflow, clipping, overlap, unreachable content, console/runtime errors, or missing assets observed during the audit.
- The behavior inventory verifies the overview's timed boot log and navigation by both **Initialise** and Enter; shared-shell navigation, current-route state, responsive rail and top-bar changes, tooltips, both contact entry points, dialog focus trap, Escape/close behavior, focus restoration, contact submission, and toast feedback; pipeline execution through all seven `RUN_ORDER` stages, node selection and callout actions, Stage/Schema tabs, Live tail, Fit to view/Actual size, CV download, logs, status/progress/ticker output, responsive inspector stacking, and one-shot `?run=true` handling; and replay run selection, Throughput/Run duration tabs, video load/play/pause and designed fallback states, run-specific transcript changes, and **Re-run this dag** navigation.
- Pointer and keyboard behavior is checked at `390×844` and `1440×900`, including visible focus and keyboard activation for navigation, nodes, tabs, switches, dialog controls, media controls, and scrolling regions. Breakpoint-specific stacking and scroll ownership are checked at `700×900` and `900×900`.
- Reduced-motion behavior is checked with the media preference emulated for the boot log, pipeline flow and fit/inspector transitions, ticker, sparklines, counters, video scan treatment, and other continuous or decorative motion. The audit distinguishes motion that becomes static or instant from state changes and information that must remain available.
- The ownership map identifies the relevant modules under `src/routes/`, `src/features/cv/`, `src/components/design/`, and `src/components/ui/`; the Tailwind bridge and layout rules in `src/styles.css`; the vendored sources in `src/styles/tokens/` and `src/styles/ds-components.css`; the local data and simulation sources; and `public/media/run-4193.webm`.
- Every audit unit receives exactly one disposition: **restyle-only**, **structural change**, or **preserve**, using the definitions above. Each entry records its rationale, affected route or routes, source owners, dependencies, and lifecycle handoff; structural-change entries state why token or CSS restyling is insufficient.
- The audit explicitly records existing architectural constraints and invariants, including the router-only SPA, deep-link behavior, local simulated data, generated route tree, vendored design-system source of truth, responsive breakpoints, accessibility semantics, and reduced-motion support.
- Findings are consolidated into actionable cross-route themes and route-specific exceptions. Each proposed follow-up is assigned to Visual System Mapping, App Shell Transformation, Route-by-Route Restyling, or Data Visualization and Motion, with dependencies or ordering constraints noted.
- Completion produces documentation in this file only. It does not define new token values, prescribe detailed visual solutions, or modify application code, styles, assets, dependencies, generated files, or behavior pending later approved work.
