# Visual System Mapping - Task

[x] 1. Confirm that `project-docs/appearance-update/reference-brief.md` and the approved `## Audit Findings` in `project-docs/appearance-update/current-ui-audit-subprocess.md` are complete, then translate their carry-forward decisions and source ownership findings into a finite set of semantic visual roles. Do not infer unresolved design decisions directly from the inspiration sources.
[x] 2. Map those roles into the vendored sources under `src/styles/tokens/`, covering color, typography, spacing, borders and corner treatment, shadows and effects, and motion while preserving a clear distinction between primitive values and semantic or component roles.
[x] 3. Update `src/styles/ds-components.css` and the shared design-component implementations only as needed to consume the mapped tokens; replace reusable literal color, glow, and timing values and provide complete reduced-motion behavior without changing component APIs or route behavior.
[x] 4. Synchronize the app-facing integrations: expose tokens used by Tailwind utilities through `src/styles.css`, keep font stacks and their `index.html` loading configuration aligned, and maintain the typed Lucide vocabulary in `src/components/design/Icon.tsx`.
[x] 5. Audit token resolution and shared-component states, perform a focused browser smoke check of the existing routes, and run the repository quality gates.

## Scope Boundaries

- This task owns the token definitions, their consumption by the shared `ds-*` component layer, the Tailwind bridge, font-source synchronization, and the centralized icon vocabulary.
- Route composition, shell layout, and route-local styling belong to lifecycle points 4 and 5. Detailed graph, chart, timeline, status-display, and bespoke animation redesign belongs to lifecycle point 6. This task may replace their shared literals with tokens, but must not pre-empt those later visual or structural changes.
- Preserve the existing router-only architecture, public component APIs, local data, interactions, responsive behavior, and route behavior. Add no runtime data-fetching or unrelated dependencies.

## Acceptance Criteria

- The completed `project-docs/appearance-update/reference-brief.md` and approved `## Audit Findings` in `project-docs/appearance-update/current-ui-audit-subprocess.md` are used as inputs. The mapping preserves the CV application's identity and content, adapts rather than copies the reference, and does not silently decide any design question those inputs leave unresolved.
- The token sources in `src/styles/tokens/` define the mapped visual system for near-black surface levels, warm-gold emphasis, semantic status colors, readable text roles, editorial display and body typography, the spacing scale and composition dimensions, border widths/colors and corner treatments, shadows and effects, and restrained motion.
- Primitive palette values are separated from semantic roles such as surfaces, text, borders, focus, and statuses. Default text/surface pairings meet WCAG AA contrast for their rendered text size, focus remains clearly visible, and statuses do not rely on color alone in the existing shared components.
- Reusable visual values are expressed through semantic custom properties. `src/styles/ds-components.css` contains no reusable raw hex, RGB/HSL color, color-bearing shadow/filter, or animation/transition duration that should vary with the visual system; deliberate non-theming literals remain only when they describe component geometry or behavior.
- Shared design-system components consume the mapped semantic tokens so changing a semantic role propagates through the component layer without editing individual routes. No new route- or page-level override is introduced to complete this task, and public component props and behavior remain compatible.
- `src/styles.css` remains synchronized with the token source: every token used by app-layer Tailwind classes has the appropriate theme alias or custom utility, removed or renamed tokens leave no stale bridge entries, and tokens that are not consumed by utilities are not duplicated unnecessarily.
- Font-family declarations in `src/styles/tokens/fonts.css` and the mirrored `@theme` declarations in `src/styles.css` are identical. If the selected webfont families or weights change, the stylesheet loading configuration in `index.html` is updated to match, with usable fallback stacks retained.
- Iconography remains centralized through the Lucide-backed `src/components/design/Icon.tsx`: current and audit-approved glyph needs are represented in its typed map, defaults for size and stroke treatment are consistent, intentional brand substitutions remain documented, and feature screens do not import Lucide glyphs directly.
- Motion tokens define each shared duration and easing used by the design-system CSS; shared components contain no one-off transition or animation durations that belong to the system. Under `prefers-reduced-motion: reduce`, continuous and decorative animations stop, essential state changes remain perceivable, and no animation delays or blocks interaction.
- Every custom property referenced by `src/styles/tokens/`, `src/styles/ds-components.css`, and the token bridge in `src/styles.css` resolves to a definition or an explicitly documented fallback; removed tokens have no remaining references.
- A focused browser smoke check of `/`, `/pipeline`, and `/replay` at one narrow and one desktop viewport confirms that the mapped tokens do not produce unreadable text, invisible focus, indistinguishable component states, missing icons/fonts, or new overflow. Route-level visual refinement remains deferred to later lifecycle stages.
- `npm run check`, `npx tsc --noEmit`, and `npm run build` complete successfully after the mapping changes.

## Semantic Visual Role Mapping

### 1. Inputs Confirmed

- **Reference Brief.** No file is literally named `reference-brief.md`; every project document (this file, `project-lifecycle.md`, and the audit) uses that name as shorthand for the `## Reference Brief` section inside `project-docs/appearance-update/reference-capture-task.md`. That section is fully populated (Sources and Scope, Video Evidence table, Reddit Guidance, Project Guardrails, Carry Forward / Avoid) and its checklist item is ticked `[x]` both in its own file and as item 1 in `project-lifecycle.md`. Treated as complete and authoritative under the same naming resolution the audit stage already used.
- **Audit Findings.** The `## Audit Findings` section of `current-ui-audit-subprocess.md` is fully populated (baseline, route/viewport inventory, ownership map, interaction/keyboard/motion findings, a disposition for all 42 audit units, cross-route themes, risks, and a lifecycle handoff summary) and its checklist item is ticked `[x]` as item 2 in `project-lifecycle.md`. Treated as complete and approved.

No unresolved item was found in either input during this read.

### 2. Central Decisions

#### 2.1 Warm-gold accent: a new primitive ramp, distinct from `--amber-*`

**Decision:** The new warm-gold/cream accent is a **new, distinct color primitive ramp**, separate from the existing `--amber-300/500/700` ramp. `--signal-primary` — and everything currently derived from lime for brand/emphasis purposes — is repointed to this new ramp. `--amber-*` and `--signal-warn` are left untouched in hue and value.

**Rationale:**

- The brief's carry-forward is about the *accent role*, not this app's own status vocabulary: "near-black surfaces with **one** warm gold/cream accent used sparingly" (reference-capture-task.md §5) describes a single emphasis/brand color. The brief never discusses the CV app's pre-existing five-way status system (idle/running/ok/warn/fail) — that system belongs to this application, not the reference.
- The audit treats the pipeline node/badge/toast status colors as an existing, working, hue-coded vocabulary (idle=grey, running=cyan, ok=lime, warn=amber, fail=magenta) that is "restyle-only" (new values, not new logic) everywhere it appears. Moving the new accent onto amber's hue would collapse two of those five states — today's "ok"/primary and "warn" — onto neighboring shades of one hue family, weakening the at-a-glance distinctness the current system already relies on, and compounding rather than helping the "statuses must not rely on color alone" requirement below.
- `--signal-warn`'s existing values (`#ffd689` / `#ffb020` / `#a86c05`) already read as a genuine warm gold/amber family. Reusing them for the *confident, default* accent risks primary buttons, links, and the main CTA inheriting a cautionary undertone — the opposite of the calm, restrained emphasis the brief's "gold/cream" language and its "never decorative" motion guardrail both imply. Keeping the two hue-distinct keeps "emphasis" and "warning" unambiguous by construction, before any icon/shape reinforcement is even added.
- This is the more surgical change: it touches only the role the brief actually discusses (the accent) and leaves the status system's five-hue structure — which nothing in the brief or audit asks to change — untouched.

**Consequence carried into the catalogue below:** `--node-ok-fg` / `--node-ok-line` are defined today as exactly `var(--lime-500)` / `var(--lime-700)` — the same values as `--signal-primary` / `--signal-primary-dim`, not independently chosen. The minimal-change reading of "repoint the accent" keeps that coupling intact: `node-ok` moves to the new gold ramp together with `signal-primary`, rather than this mapping inventing a split neither source asks for.

**Follow-on requirement this decision does not itself satisfy:** per the acceptance criteria, statuses must not rely on color alone regardless of which hue plan is chosen. `ok` and `warn` will remain hue-distinct (gold vs. amber), which helps, but does not by itself close the gap described under Status/Signal below — sighted users currently distinguish pipeline node states only by border/icon hue, with no shape or glyph difference.

#### 2.2 Display typeface: replace Michroma

**Decision:** Replace `--font-display` (currently `"Michroma"`). Keep `--font-mono` (IBM Plex Mono) and `--font-sans` (Space Grotesk) exactly as they are. Recommended direction: a Google Fonts geometric-sans family that ships genuine sub-400 static weights and reads as an oversized editorial voice at hero/h1/h2 sizes. **Sora at weight 200 (ExtraLight) or 300 (Light)** is proposed as a concrete candidate — it stays in the same geometric-sans territory as Space Grotesk, keeping the three-voice system's character coherent rather than swapping in an unrelated genre (e.g. a serif). Task 2 owns the final family/weight/CSS choice and the `index.html` / `fonts.css` / `styles.css` wiring; this decision fixes the *role* — "the display voice must be a genuinely light weight" — and offers one defensible candidate, not a locked implementation.

**Rationale:**

- The brief's language is explicit and repeated, not incidental: "large, **light-weight** editorial headings" / "oversized, **lightweight** editorial headings as the dominant typographic voice" / video evidence of "a large, **light-weight** heading" and "a very large, **thin-weight** editorial heading" (reference-capture-task.md §2, §4, §5).
- This is a technical constraint, not only a taste call. Michroma ships from Google Fonts as a **single static weight (400/Regular)** — confirmed from `fonts.css`'s own comment and from `index.html`'s font link, which requests `family=Michroma` with no `:wght@` parameter at all, unlike the Plex Mono and Space Grotesk links in the same tag, which both specify `:wght@300;400;500;600;700`. There is no lighter cut of Michroma to switch to; `typography.css`'s `--type-hero` / `--type-h1` / `--type-h2` currently pin `--fw-regular` for exactly that reason. A family with no light weight cannot satisfy a "light-weight" requirement at any setting.
- Michroma's letterforms are a uniform-stroke, blocky, technical/HUD-style geometric face — a reasonable read for a "pipeline console" identity, but not the "editorial" register the brief pairs with lightness (muted body copy, small tracked-uppercase labels alongside the heading). Replacing it also resolves that qualitative mismatch, though the single-weight limitation above is sufficient justification on its own.
- The task's own acceptance criteria anticipates exactly this outcome ("If the selected webfont families or weights change, the stylesheet loading configuration in `index.html` is updated to match, with usable fallback stacks retained") — a font change is an expected, in-scope result, not a surprise.
- IBM Plex Mono and Space Grotesk are not reopened here: neither the brief nor the audit raises a concern with either, and this task's own framing treats both as already satisfying their voices (data/label and body/UI respectively).

### 3. Semantic Role Catalogue

The token layer already keeps primitive values (raw ramps `--void-*`, `--lime-*`, `--amber-*`, `--ink-*`; raw scales `--s-*`, `--fs-*`, `--fw-*`, `--ls-*`; raw durations/easings `--dur-*`, `--ease-*`) separate from semantic/component roles (`--surface-*`, `--text-*`, `--signal-*`, `--type-*`, `--gutter-*`/`--stack-*`, `--t-hover`, etc.) throughout `colors.css`, `typography.css`, `spacing.css`, and `motion.css`. This mapping preserves that existing discipline rather than introducing a new one: every role below is a *semantic* role, most already exist under a name that is already correct, and the two central decisions above change some of their backing *primitives*, not the role structure.

Status key: **Keep name, change value** = existing token, name/purpose already correct, only its backing primitive moves. **Keep name, keep value** = existing token, unaffected by this mapping. **New** = does not exist today and must be added (an illustrative name is given; Task 2 may rename).

#### Surfaces (near-black levels)

The existing near-black ramp already forms a clean, ordered set of levels and needs no hue change — near-black surfaces are a pure carry-forward. Re-deriving the ordering from the primitives confirms it: `surface-input` (well, darkest) < `bg-app` < `surface-panel` < `surface-card` < `surface-raised` (lightest of the near-blacks, still far below any border or text value).

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `bg-app` | Keep name, keep value | Application-level background, darkest "field" level. | `body` (base.css), `/`'s page frame. |
| `surface-panel` | Keep name, keep value | Shell/panel-level surface one step up from `bg-app`. | Overview card (`BootScreen`), `ds-video`, `ds-dialog`, rail/top-bar backdrop. |
| `surface-card` | Keep name, keep value | Card/component-level surface. | `Card`, pipeline nodes, `ds-stat`, `ds-tag`, `ds-badge--ok` family. |
| `surface-raised` | Keep name, keep value | Slightly raised surface for popovers/callouts and idle badges. | `NodeCallout`, `ds-badge--idle`. |
| `surface-input` | Keep name, keep value | Recessed "well" surface for editable/log fields. | `Input`, `Select`, `Switch` track, `LogStream`. |
| `surface-hover` | Keep name, keep value | Neutral hover overlay. | Ghost button hover, schema row hover. |
| `surface-active` | Keep name, change value | Accent-tinted active/selected overlay (currently a lime alpha). | Selection/active-state fills tied to the accent. |
| `scrim` | Keep name, keep value | Full-screen dialog backdrop. | `ds-dialog__scrim`. |

#### Text

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `text-strong` / `text-body` / `text-muted` | Keep name, keep value | Primary/body/secondary reading-copy hierarchy. | Headings, body copy, most component text. |
| `text-dim` | Keep name; **value flagged for review** | Lowest-emphasis copy: timestamps, meta rows, hints, captions. | `ds-log__ts`, `ds-node__meta`, `ds-callout__meta`, `ds-video__tc`, `ds-ticker__label`, field hints. |
| `text-on-signal` | Keep name, change value | Foreground color rendered on top of an accent-colored fill. | Primary button label, `ds-badge--solid`, checkbox/radio check glyph. |
| `text-link` / `text-link-hover` | Keep name, change value | Hyperlink color and hover state (currently a direct alias of the accent). | `base.css` global `a` / `a:hover`. |

**Flagged AA risk (found during this mapping, independent of either central decision):** computing WCAG relative luminance from the hex values already in `colors.css` gives `text-dim` (`--ink-3`, `#859390`) a contrast of **5.04:1 against `bg-app`**, but only **4.09:1 against `surface-card`** and **3.53:1 against `surface-raised`** — below the 4.5:1 AA threshold for normal-size text on the two lighter surfaces. `text-dim` is used at exactly the small sizes (`fs-micro` / `fs-caption` / `fs-meta`) where the large-text 3:1 exception does not apply, so this is a real, pre-existing shortfall, not one introduced by the decisions above. It sits squarely inside this task's "default text/surface pairings meet WCAG AA" acceptance criterion, so it is flagged here rather than left for Task 2 to discover late. A full pairwise sweep belongs to this task's own item 5 ("audit token resolution and shared-component states"); this is the one concrete pairing this mapping pass already found and verified (by contrast, `text-muted` against `surface-card` measures a comfortable 6.16:1 — no issue there).

**Reassurance on the new accent's own contrast:** `lime-500` measures 12.44:1 against `bg-app` today. A gold in roughly `amber-500`'s value range (`#ffb020`) measures 8.80:1 against `bg-app` — still comfortable AA headroom for text/borders/focus indicators, just less extreme than lime's, which is consistent with the brief's "restrained"/"sparingly" language rather than a problem to solve. Task 2 should still re-verify whichever exact value is chosen, and separately re-verify `text-on-signal` against the *fill* color itself (foreground-on-accent), not against `bg-app` (foreground-on-near-black) — those are two different pairings.

#### Borders & Focus

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `border-hair` | Keep name, keep value | The hairline rule — the brief's primary structural device, replacing card/box/shadow-heavy chrome. | Nearly every component: card, dialog, tabs, section header, callout, log, ticker, schema table. |
| `border-line` / `border-strong` | Keep name, keep value | Slightly more visible neutral border steps for inputs/dividers. | Inputs, selects, switches, run-bar divider. |
| `border-signal` | Keep name, change value | Translucent accent-tinted border for "emphasized/selected" edges short of a full glow. | `Card--signal`, `IconButton` hover/active, node hover, `Tag--signal`, callout border. |
| `focus-ring` | Keep name, change value | The single focus-visible color used everywhere via `:focus-visible`. | `base.css` global rule — every interactive element on every route (confirmed working consistently in the audit's interaction pass). |

**Constraint the value must satisfy (not a value itself):** the audit's interaction pass confirmed the current 2px lime focus ring is visible and consistent across every interactive control on every route. Because `focus-ring` moves to the new gold primitive under decision 2.1, Task 2 must re-verify that whichever exact value is chosen stays clearly visible against both the `bg-app` family and the `surface-card`/`surface-raised` family before treating the accent swap as complete — this is named explicitly in the acceptance criteria ("focus remains clearly visible") and is not automatically guaranteed just because a value reads as "gold."

#### Status/Signal

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `signal-primary` / `signal-primary-dim` | Keep name, change value | The single accent color (decision 2.1) and its dimmer variant. | Buttons, checks/radio/switch-on, active tab indicator, selection highlight, links, `text-glow`. |
| `node-ok-fg` / `node-ok-line` | Keep name, change value (coupled to `signal-primary` / `-dim`, per decision 2.1) | Pipeline node "completed OK" state. | `PipelineNode`, `PipelineGraph`. |
| `signal-running` + `node-running-fg`/`-line` | Keep name, keep value | In-progress status (cyan) — untouched by either central decision. | Nodes, badges, toasts, log levels, ticker values. |
| `signal-warn` + `node-warn-fg`/`-line` | Keep name, keep value — **explicitly untouched by decision 2.1** | Warning status (amber) — stays on the existing ramp precisely so it stays hue-distinct from the new gold accent. | Nodes, `Badge--warn`, toast rail, log level, `hatch-warn`. |
| `signal-fail` + `node-fail-fg`/`-line` | Keep name, keep value | Failure status (magenta) — untouched. | Nodes, badges, toasts, danger button, log level. |
| `signal-idle` + `node-idle-fg`/`-line` | Keep name, keep value | Idle/neutral status (grey) — untouched. | Nodes, `Badge--idle`. |

**Constraint carried from decision 2.1 (statuses must not rely on color alone):** source-reading for this mapping found that today a sighted user distinguishes an `ok` pipeline node from a `warn` one *only* by border/icon hue — there is no icon-shape, glyph, or always-visible text difference at the node level (the existing `sr-only` status prefix on `PipelineNode` reaches only screen-reader users). This was already true before either central decision and becomes marginally more important once `ok` sits on a new hue that must stay unambiguous next to the still-amber `warn`. Closing it is a component-level change (an icon or shape difference per state), not a token, so it is out of this task's scope to implement — the mapping should be treated as incomplete on this point until Task 3, or a flagged follow-up to Data Visualization and Motion (which already owns the pipeline graph's visual language), adds that redundant cue.

#### Typography (display + body + label/data pairing)

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `font-display` | Keep name, change value (decision 2.2) | The oversized editorial heading voice. | `type-hero`/`h1`/`h2`, `ds-dialog__title`, `ds-stat__value`, `ds-section__title`. |
| `font-mono` | Keep name, keep value | Data/label voice (IBM Plex Mono) — unaffected. | `type-data`, `type-label`, `type-body-mono`; every uppercase tracked label and mono data value. |
| `font-sans` | Keep name, keep value | Body/UI voice (Space Grotesk) — unaffected. | `type-body`, `type-lead`, `type-h3`/`h4`. |
| `type-hero` / `type-h1` / `type-h2` | Keep name; **weight component changes** | Composed display roles pairing `font-display` with size/line-height/weight. | Overview name heading; other section-level display numerals/titles. |
| `type-h3` / `type-h4` | Keep name, keep value | Sub-heading roles already on `font-sans` at `fw-semibold` — not the display voice, unaffected by decision 2.2. | Dialog title (h4-sized), timeline role title, smaller section titles. |
| `type-label` / `type-data` | Keep name, keep value | The small tracked-uppercase label voice and the compact data-value voice — already exactly what the brief calls "small tracked-uppercase labels" paired with the editorial heading. | Nearly every field label, badge, tag, meta row, and table header. |
| `type-body` / `type-body-mono` / `type-lead` | Keep name, keep value | Muted/secondary body-copy voice(s), including the already-light (`fw-light`) `type-lead`. | Dialog body, callout body, timeline body, stage-pane prose. |

**Note on the weight scale:** `--fw-light` (300) already exists and already backs `type-lead`. Whether it is light enough for `font-display` at hero/h1/h2 sizes, or whether an additional lighter primitive step (e.g. an ExtraLight/200 step) is needed, depends on which static weights the family Task 2 lands on actually ships. This mapping does not fix that number — only the requirement that `type-hero`/`type-h1`/`type-h2`'s weight component must move off `fw-regular` onto a genuinely light weight.

#### Spacing & Composition dimensions

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `s-0`…`s-13` | Keep name, keep value | The raw 2px-substrate spacing primitive scale. | Backs every semantic spacing role below; not consumed directly by components. |
| `gutter-panel` / `gutter-card` / `gutter-field` | Keep name, keep value | Semantic internal-padding roles built from the primitive scale. | Card/dialog/panel bodies, field groups. |
| `stack-tight` / `stack` / `stack-loose` / `inline` | Keep name, keep value | Semantic vertical/horizontal rhythm roles. | Layout spacing throughout `design/` components. |
| `rail-w` / `sidebar-w` / `inspector-w` / `topbar-h` / `statusbar-h` | Keep name, keep value | Shell/composition frame dimensions. | `Shell.tsx` rail/top bar, pipeline inspector column, run-status bar. |
| `content-max` / `prose-max` | Keep name, keep value | Maximum content/reading-measure widths. | Timeline body copy, general prose blocks. |

The primitive/semantic split already exists here exactly as it does for color; this mapping adds no new spacing primitive or role. "Generous negative space" (brief §5) is a *composition* decision — how much of the existing scale each route spends around its content — and belongs to App Shell Transformation and Route-by-Route Restyling, not to this token-definition task. The scale already reaches a large-enough step (`s-13` = 120px) to support that later composition work without needing a new one.

#### Borders/Corner treatment

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `border-w-hair` (illustrative name) | **New** | 1px width step. Today every hairline/line border in `ds-components.css` hardcodes the literal `1px` rather than referencing a token. | Nearly all `border: 1px solid ...` rules across the component layer. |
| `border-w-emphasis` (illustrative name) | **New** | 2px width step for deliberately heavier accents. | Focus outline, active tab indicator, toast rail, `ds-stat` left border. |
| `r-0` / `r-1` / `r-2` / `r-3` / `r-pill` | Keep name, keep value | Corner-radius steps — the system is mostly square/hard-cornered by existing design, not something either source asks to round off. | Buttons, cards, inputs, badges. |
| `notch-8` / `notch-14` / `notch-tr` | Keep name, keep value | The cut-corner "notch" clip-path motif — an existing, distinctive identity element. | Cards, dialog, primary button (`--notched` variant), pipeline nodes, video panel, callout. |

Border **widths** are named explicitly in the acceptance criteria alongside colors and corner treatment, and today have no token at all — every width is a bare literal in `ds-components.css`. That is a real gap, flagged here rather than left for Task 2 to notice on its own.

**Non-mandate on pill shapes:** the reference video shows literal pill-shaped buttons and chips, but the brief's own guardrails treat the video's specific component shapes as source-specific implementation, not a transferable quality ("neither dictates specific... component implementations," reference-capture-task.md §5 Avoid). This app's own controls (buttons, switch track) are already deliberately non-pill; `r-pill` remains available where it is already used (the radio dot) without this mapping mandating a system-wide shift to rounded/pill geometry. A genuine pill/chip component inspired by the brief is a later stage's call if it is ever wanted, not pre-empted here.

#### Shadows & Effects

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `shadow-panel` / `shadow-card` / `shadow-pop` / `shadow-inset-well` | Keep name; **de-emphasize, don't remove** | Neutral (non-accent) elevation shadows. | Overview card, `Card`, dialog/tooltip/toast pop-elevation, recessed inputs. |
| `glow-primary` / `text-glow` | Keep name, change value | Accent-colored glow, the signature "selected/emphasized" treatment. | Selected/running-adjacent nodes, callout, checks, switch-on, tab indicator, stat/meter/timeline accents, video CTA. |
| `glow-running` / `glow-fail` | Keep name, keep value | Status-colored glows — untouched. | Running/fail nodes and their callout equivalents. |
| `grid-fine` / `grid-coarse` / `scanlines` / `protect-top` / `protect-bottom` | Keep name, keep value | Neutral background textures. | Page frame, graph frame, video empty state. |
| `vignette` | Keep name, change value | Accent-tinted radial vignette behind the overview heading. | `BootScreen` page frame. |
| `blur-glass` / `glass` | Keep name, keep value | Neutral glass/backdrop treatment. | Dialog scrim, toast. |
| `hatch-warn` | Keep name, keep value — **explicitly untouched by decision 2.1** | Warn-specific hatch texture, stays on amber. | Warn-state fills. |

**De-emphasis note, not a value change:** the brief's carry-forward explicitly prefers "hairline rules... instead of heavy cards, boxes, or shadows," yet several components (e.g. `Card`) already pair a hairline border *and* a box-shadow. This mapping does not remove the shadow roles — dialogs/toasts/popovers still benefit from some elevation above other content — but flags that their prominence (blur/opacity) is a value-tuning lever Task 2 should lean toward reducing, so hairlines read as the dominant structural device the brief asks for.

**Literal-glow adoption gap (found during this mapping):** `effects.css` already defines `glow-primary`/`text-glow`, but several accent-glow effects in `ds-components.css` are written as inline `rgba(124,255,61,...)` box-shadow/filter literals instead of referencing those custom properties — confirmed present at, at least: the primary button's own shadow, the checkbox/switch "on" glow, the active tab indicator's shadow, the run-bar fill glow, the timeline node glow, and the meter "on" tick glow. Once `signal-primary`'s hue changes, every one of these literals needs to change too; routing them through the semantic glow role(s) instead of hunting each literal individually is exactly the consolidation the acceptance criteria's "no reusable raw hex/RGB/HSL color... that should vary with the visual system" language calls for. Handed to Task 2/3 as a concrete punch list rather than a general instruction to "check for literals."

#### Motion (durations, easing, and the reduced-motion contract)

| Role | Status | Description | Consumers |
| --- | --- | --- | --- |
| `dur-instant` / `dur-fast` / `dur-base` / `dur-slow` | Keep name, keep value | The collapsing duration scale (already zeroed under reduced motion). | Hover/press transitions, dialog/toast/tooltip appear, switch knob, tab/callout transitions, graph fit/actual-size zoom. |
| `dur-flow` | Keep name; **add to the reduced-motion contract** | Duration for the pipeline graph's animated "live" edge dash-flow. | `ds-graph__edge--live`. |
| `ease-out` / `ease-in-out` / `ease-snap` / `ease-linear` | Keep name, keep value | The easing vocabulary — already restrained/purposeful per the brief's language. | Throughout. |
| `t-hover` | Keep name, keep value | Composed hover-transition shorthand. | Buttons, icon buttons, inputs, tags, cards. |
| `dur-pulse` (illustrative name) | **New** | Shared duration for continuous "live/running" indicator pulses, consolidating three currently-inconsistent hardcoded values (1.1s / 1.1s / 1.2s) into one role. | `ds-badge--running` dot, `ds-node--running` icon, `ds-video__dot--live`. |
| `dur-blink` (illustrative name) | **New** | Dedicated duration for the boot-log text cursor's blink, replacing its hardcoded `1s`. | `ds-log__cursor` (`LogStream`, consumed by `BootScreen`). |

**The reduced-motion contract, and closing the boot-log gap.** The audit already confirmed one real gap: the boot log's `.ds-log__cursor` blink is a hardcoded `1s` value, not one of the collapsing `--dur-*` tokens, and is not among the five selectors `motion.css` explicitly disables (`.ds-node--running::after`, `.ds-ticker__track`, `.ds-spark__head`, `.ds-spark__line--draw`, `.ds-video__scan`). Re-reading `motion.css` and `ds-components.css` directly during this mapping found the same shape of gap in **three further places** the audit's task-4 pass did not enumerate individually:

- `.ds-badge--running .ds-badge__dot` (`animation: ds-pulse 1.2s ...`) — hardcoded, uncollapsed, not on the disabled-selector list.
- `.ds-node--running .ds-node__icon` (`animation: ds-pulse 1.1s ...`) — a *different* rule from the already-covered `.ds-node--running::after` sweep; hardcoded, uncollapsed, not listed.
- `.ds-video__dot--live` (`animation: ds-pulse 1.1s ...`) — the replay panel's "recording" dot; hardcoded, uncollapsed, not listed.
- `.ds-graph__edge--live` uses `--dur-flow`, which is a real token but is **not** one of the three durations the reduced-motion block collapses (only `--dur-fast`/`base`/`slow` collapse) — so this animation keeps running at full speed under reduced motion today even though it is already token-driven.

All four are continuous "this is live/running" indicators — the same category the audit already judged safe to fully stop under reduced motion, since no information is lost by stopping a pulse or a flow animation (the state is still shown by color and label). The role-level fix: give the three hardcoded pulses the new shared `dur-pulse` role and either collapse it alongside `dur-fast`/`base`/`slow` or add their selectors to the explicit-disable list; do the equivalent for `dur-flow` (already a token — it only needs to be added to one of the two existing mechanisms). Choosing between the two mechanisms (both already coexist in `motion.css` today) is Task 2/3's implementation call, not fixed here.

**Explicitly out of scope for the token layer:** the boot log's *pacing* (`BootScreen.tsx`'s own `setInterval`/`LINE_EVERY` reveal timer) has no `prefers-reduced-motion` check at all, but that is a JavaScript interaction-logic change in a route/feature file, not a shared `design/` component or a token. The audit's own lifecycle handoff already assigns that half of the fix to Data Visualization and Motion (stage 6), and this mapping does not pre-empt it — only the CSS/token half (the cursor's blink *duration* living on a token a reduced-motion rule can reach) is this task's concern.

### 4. Explicit Non-Decisions

The following are deliberately left open here because they belong to a later lifecycle stage per this task's own Scope Boundaries — named explicitly so Task 2 does not accidentally decide them while mapping tokens:

- **Exact primitive values.** The specific hex steps of the new gold/cream ramp, the exact replacement font-family string and numeric weight(s), the exact px values for the new border-width steps, and the exact ms values for `dur-pulse`/`dur-blink` are Task 2's job, not decided here.
- **Bespoke diagram/chart/meter redesign.** Turning the pipeline graph's node/edge visual language, the sparkline, or the linear meter/tick row into the reference's more elaborate diagram vocabulary (circular counters, segmented rings, axis/gridlines) is explicitly Data Visualization and Motion's (stage 6) territory; this mapping only retargets the tokens those components already consume.
- **The two confirmed structural-change bugs** (the `390×844` pipeline-graph clipping and the intermittent `700×900` toolbar-hidden-behind-header auto-scroll) are unrelated to styling per the audit's own disposition matrix and are owned by Route-by-Route Restyling; no token in this mapping is expected to fix either.
- **Route/shell composition.** How much negative space each route spends, and any change to `rail-w`/`sidebar-w`/`inspector-w`/`topbar-h`/`statusbar-h`'s actual values, belongs to App Shell Transformation and Route-by-Route Restyling; this mapping preserves those dimension roles as-is.
- **Pill/rounded-corner component shapes.** Not mandated by this mapping (see Borders/Corner treatment above); left to a later stage if ever wanted.
- **The boot log's `setInterval` reveal pacing.** The JavaScript-level reduced-motion gate belongs to Data Visualization and Motion per the audit's own handoff; only the CSS duration role is addressed here.
- **The status "not color alone" redundant cue** (an icon or shape difference per pipeline-node/badge state) is a component-level change, flagged under Status/Signal above but not designed here.
- **Pre-existing functional inconsistencies unrelated to appearance** — the replay video's `src`/caption not following the selected run, and the Run-duration sparkline's bespoke `Math.sin` simulation — remain exactly as the audit left them: preserved, entirely out of this project's scope.

## Verification

Task 5 of 5. Audited the token layer and shared-component states, ran a live browser smoke check of `/`, `/pipeline`, `/replay`, and ran the repository quality gates. One genuine defect was found and fixed (Part C); everything else below is a finding or a confirmation.

### A. Token resolution audit

- **Method:** extracted every `var(--x)` reference (156 unique names) across `src/styles/tokens/*.css`, `src/styles/ds-components.css`, and `src/styles.css`, and cross-referenced them against every `--x:` definition in the same files, including `@theme inline`'s aliasing shape (e.g. `--color-void-0: var(--void-0);`). A first mechanical pass over-reported some definitions (BEM modifier classes immediately followed by a pseudo-class/element, e.g. `.ds-btn--danger:hover`, superficially match a `--danger:` custom-property pattern) — spot-checked and confirmed as false positives, not real declarations, per this task's own instruction not to trust the diff blindly.
- **Result: zero dangling references.** Every `var(--x)` resolves to a real definition. Zero `var(--x, fallback)` patterns exist anywhere in these files, so nothing is hiding behind a fallback either.
- **No stale removed/renamed-token references.** Repo-wide grep for `lime` and `Michroma` (outside intentional historical rationale) found:
  - `fonts.css`'s own changelog-style comment — intentional, matches this task's carve-out.
  - `--lime-100/300/500/700/900`, their 3 alpha utilities (`--lime-a08/16/32`), and 5 Tailwind bridge entries (`--color-lime-*` in `styles.css`) are still validly defined (not dangling) but now have **zero consumers anywhere in `src/`** — confirmed by repo-wide grep, including a check for dynamic/templated Tailwind class construction (none found; there is no Tailwind JS config to carry a safelist either). This is a direct, correct consequence of decision 2.1 (accent repointed to gold) plus Task 4's fix of the last 5 `text-lime-500` usages. Same category as Task 3's already-recorded `--hatch-warn` finding (defined-but-unconsumed is informational, not a defect); left in place rather than deleted, since pruning a still-valid primitive ramp is a hygiene/design call outside this audit's remit.
  - **8 stale prose mentions of "lime" survived in present-tense doc comments** describing now-gold treatments, one each in `src/components/design/{StatReadout,Card,Radio,Tag,Badge,Checkbox,Input}.tsx` and one in `src/features/cv/data.ts:262`. Unlike `fonts.css`'s comment these were not framed as history — they asserted current behavior incorrectly (e.g. "Lime hairline — marks the active/selected card"). **Found and fixed within this same change** (corrected to "gold" in all 8 locations, re-grep confirms zero remaining) rather than deferred — see Known Limitations.

### B. Shared-component state audit

Contrast ratios computed from the actual hex values in `colors.css` (WCAG relative-luminance, not eyeballed):

| Pairing | Ratio | 4.5:1 (text) | 3:1 (UI/large) |
| --- | --- | --- | --- |
| `text-dim` `#9daba8` vs `surface-card` `#273143` | 5.49:1 | PASS | PASS |
| `text-dim` vs `surface-raised` `#2f3b50` | 4.74:1 | PASS | PASS |
| `text-dim` vs `bg-app` `#1a2130` | 6.77:1 | PASS | PASS |
| `text-dim` vs `surface-panel` `#212a3b` | 6.05:1 | PASS | PASS |
| `text-dim` vs `surface-input` `#141a26` | 7.32:1 | PASS | PASS |
| `signal-primary` (gold-500 `#ebcc33`) vs `bg-app` | 10.13:1 | PASS | PASS |
| `signal-primary` vs `surface-panel` | 9.06:1 | PASS | PASS |
| `signal-primary` vs `surface-card` | 8.23:1 | PASS | PASS |
| `signal-primary` vs `surface-raised` | 7.10:1 | PASS | PASS |
| `signal-primary` vs `surface-input` | 10.96:1 | PASS | PASS |
| `text-on-signal` `#1a1206` vs `signal-primary` fill | 11.67:1 | PASS | PASS |
| `text-on-signal` vs `gold-300` (primary-button hover fill) | 14.66:1 | PASS | PASS |
| `text-muted` vs `surface-card` | 6.16:1 | PASS | PASS |
| `text-muted` vs `bg-app` | 7.59:1 | PASS | PASS |
| `text-strong` vs `surface-card` | 12.19:1 | PASS | PASS |
| `text-strong` vs `bg-app` | 15.01:1 | PASS | PASS |

Task 2's AA fix for `text-dim` holds with the final, fully-merged value: both previously-failing pairings (vs `surface-card` 4.09:1→5.49:1, vs `surface-raised` 3.53:1→4.74:1) now clear 4.5:1 with margin. `text-muted`/`text-strong` show no regression. Beyond the requested list: `signal-primary-dim` (gold-700, `#9a7b13`) measures 4.00:1 against `bg-app` — under the 4.5:1 *text* threshold, but its only two consumers (`ds-badge--ok`'s `border-color`, `node-ok-line`) are non-text UI borders subject to the 3:1 threshold, which it clears; grep-confirmed it is never used as a `color:` value. Not a defect.

**Component-state distinctness**, verified live (computed styles + accessibility tree, not screenshots alone):

- Pipeline node states idle/running/ok/warn/fail confirmed mutually distinguishable by color via `getComputedStyle` on a live run and `/replay`'s History panel (4 real runs rendering OK/WARN/OK/FAIL side by side): idle `#a8b5b0`, running `#35d6ff`, ok `#ebcc33`, warn `#ffb020`, fail `#ff3d7f`. Confirmed still true *only* by hue — see Known Limitations.
- `Badge` text labels are intact: live DOM `textContent` reads "Available" / "ok" / "warn" / "fail" (rendered uppercase via CSS), not just colored dots.
- `PipelineNode`'s `sr-only` status prefix is intact and status-specific for all 5 states — confirmed in source (`STATUS_LABELS` map in `PipelineNode.tsx`) and in live `textContent` (e.g. `"idle: src_profile…"`). The icon glyph itself never varies with `status` (always the `icon` prop), reconfirming the known limitation below is accurately scoped.
- `Button` (primary hover → `gold-300` bg + larger glow; secondary hover → `border-signal`/`surface-active`), `IconButton` (hover → gold color/bg/border vs. resting `text-muted`), `Tag`/`Tab` (active `Tab` = gold + underline; hovered-inactive `Tab` = brighter grey, distinct from both resting-inactive and active) all confirmed via live `:hover` matching + `getComputedStyle`.
- Focus-visible rings (gold, 2px solid, per `--focus-ring`) confirmed via real keyboard Tab navigation on: a rail `IconButton` (Settings), a primary `Button` (Run pipeline), a form `Input` (Contact dialog, via the `.ds-input:focus-within` wrapper pattern), and a `PipelineNode` — one control per surface level as required, plus `Tab`, secondary `Button`, and `Switch`.

### C. Reduced-motion cascade verification

**The theorized risk is real and was confirmed empirically, not just by reading source.** `styles.css` imports `motion.css` before `ds-components.css`; the reduced-motion block's 10-selector list and its `.ds-spark__line--draw{stroke-dashoffset:0}` companion share identical specificity with their normal-state counterparts in `ds-components.css` (confirmed by inspecting the live `document.styleSheets` CSSOM, not just the source files — this also confirmed both rules are unlayered, so Tailwind v4's internal `@layer` scheme is not a factor). Equal specificity plus later source position means `ds-components.css`'s normal declarations were winning.

Verified by direct cascade experiment in the running dev server: inserted an unconditional copy of the reduced-motion block's rules at the exact position its `@media` block occupies, then read `getComputedStyle(...).animationName` on live elements for all 10 selectors (not just the 3 minimum). **Before the fix, all 10 kept their normal animation** (e.g. `.ds-node__icon` → `ds-pulse`, `.ds-graph__edge--live` → `ds-flow`, `.ds-log__cursor` → `ds-blink`) and `.ds-spark__line--draw`'s `stroke-dashoffset` stayed `1px` instead of snapping to `0px` — i.e. **the reduced-motion override was losing the cascade for all 10 selectors, not only the 5 this pipeline newly added.** This is a pre-existing latent defect (the file-import order predates this pipeline); the original audit had only ever source-confirmed it, never runtime-verified it, and this task is the first to actually check.

**Fix applied** (`src/styles/tokens/motion.css`, inside the existing `@media (prefers-reduced-motion: reduce)` block only): added `!important` to the shared `animation:none` declaration and to `.ds-spark__line--draw{stroke-dashoffset:0}`, with an inline comment explaining why it's load-bearing. `!important` was chosen over reordering imports or hand-inflating selector specificity because it is the standard, robust idiom for an accessibility-critical override that must keep winning regardless of which component file is added or reordered later — reordering imports would fix today's 10 selectors but silently reintroduce the same bug the next time a new animated component lands after `motion.css`. The `:root{--dur-fast/base/slow:0ms}` collapse mechanism was already unaffected (it only competes against another `:root` rule inside `motion.css` itself, which it already wins) and was left untouched.

**Re-verified after the fix** with the same experiment: all 10 selectors now resolve to `animationName: "none"` and `.ds-spark__line--draw` resolves to `stroke-dashoffset: 0px`. Confirmed present in the production bundle too (`dist/assets/index-*.css` contains `animation:none!important` and `stroke-dashoffset:0!important` after `npm run build`). Because the fix lives entirely inside the existing `@media (prefers-reduced-motion: reduce)` block, it has zero effect when the preference is not set — normal-motion rendering is unchanged (also logically guaranteed: media-conditioned rules don't participate in the cascade at all when their condition is false).

### D. Browser smoke check

`/`, `/pipeline`, `/replay` at 390×844 and 1440×900 (dev server via `.claude/launch.json`):

| Route | 390×844 | 1440×900 |
| --- | --- | --- |
| `/` | Card scales down cleanly, no clipping (matches audit baseline). Focus ring visible (`Tab` → `.ds-log`, gold). Console clean of app errors. | Heading renders in Sora (confirmed via `document.fonts`, not just visually), gold cursor/button/full-stop render correctly. Focus ring visible on primary button. |
| `/pipeline` | **Pre-existing node-graph clipping reproduced exactly as baseline** (callout/graph overflow the narrow pane) — not re-flagged as new, not worse. Toolbar, tabs, badges, rail all render correctly with visible gold focus rings. | Full graph/toolbar/inspector/callout/run-status bar render correctly; ran a full simulated pipeline (idle→running→ok) without incident; hover/active/selected states on Button/IconButton/Tag/Tab/node all confirmed distinct. |
| `/replay` | History's 4 run cards (OK/WARN/OK/FAIL) fully legible and mutually distinct; live throughput sparkline renders in gold; bottom stats bar truncates via its existing marquee-style overflow (pre-existing/expected, not new). Focus ring confirmed on a History card. | History panel, replay video panel (gold play-button glow), and live sparkline all render correctly; video's own baked-in colors are still lime because it is a pre-recorded placeholder capture (static pixels), not live CSS — expected, not a missed retokenization instance. |

Across all 6 loads: no unreadable text, no invisible focus, no indistinguishable states, zero 404s (network log clean), and both webfonts actually in use were confirmed genuinely loaded via `document.fonts` (`Sora 400`, `IBM Plex Mono 400/500`, `Space Grotesk 400` all report `status: "loaded"`; `Sora 200` never loads because nothing on these routes uses it yet — see Known Limitations). Console showed a stable, non-growing count (~200) of `net::ERR_CONNECTION_REFUSED` entries on every route; investigated and attributed to dev-only tooling (see Known Limitations), not to this pipeline's changes.

### E. Quality gates

Run in order, after the Part C fix (re-run to completion following that edit, per the task's requirement to see a clean run after the last change):

1. `npm run check` (Biome) — **pass**: "Checked 47 files in 34–38ms. No fixes applied."
2. `npx tsc --noEmit` — **pass**: no output, exit 0.
3. `npm run build` (Vite) — **pass**: "2073 modules transformed… built in ~170ms", 12 output chunks, no errors or warnings.

No fixes were needed for any of the three gates at any point in this task.

### Known limitations carried forward

- **Pipeline-node status has no non-color cue.** Re-verified via `PipelineNode.tsx` source and live DOM: the icon glyph never changes with `status`; only CSS color and the `sr-only` text prefix differ. Unchanged by this task. Owner: Data Visualization and Motion (needs a new `Icon.tsx` glyph + `PipelineNode.tsx` logic change).
- **`BootScreen`/`Shell`/`Panes` headings render Sora at ambient weight 400, not `--fw-extralight` (200).** Re-verified with new runtime evidence beyond source-reading: `document.fonts` shows `Sora 400` loaded (from these headings) while `Sora 200` never loads on any of the 3 routes because nothing currently requests it. Unchanged by this task. Owner: Route-by-Route Restyling / App Shell Transformation.
- **Reduced-motion cascade loss — found and fixed by this task**, not carried forward. See Part C. All 10 `motion.css` disabled-selectors now verified to actually stop under `prefers-reduced-motion: reduce`, at runtime, in both dev and production output.
- **`--hatch-warn` has no consumer anywhere in the codebase.** Re-confirmed unchanged (Task 3's finding). Informational; no lifecycle stage.
- **`--lime-100/300/500/700/900`, `--lime-a08/16/32`, and their 5 `styles.css` Tailwind bridge entries are now fully unconsumed.** New finding (Part A). Direct, correct consequence of the accent repoint plus Task 4's cleanup — not broken, just dead weight. Informational; no lifecycle stage owns removing it, though a future general token-pruning pass could.
- **8 stale "lime" doc comments — found and fixed within this same change**, not carried forward. See Part A. All 8 locations (`src/components/design/{StatReadout,Card,Radio,Tag,Badge,Checkbox,Input}.tsx`, `src/features/cv/data.ts:262`) now correctly say "gold"; re-grep confirms zero remaining.
- **~200 stable `net::ERR_CONNECTION_REFUSED` console entries appear in this browser-preview sandbox on every route.** New observation (Part D). Investigated: unrelated to fonts (which load successfully per `document.fonts`), unrelated to this pipeline's CSS-only changes (no networking code was touched by any of Tasks 1–5), and confirmed dev-only (`vite build`'s own output confirms devtools code is stripped from production: "`[@tanstack/devtools-vite] Removed devtools code from: /src/routes/__root.tsx`"). Same category as the original audit's already-recorded TanStack DevTools trigger-position-drift: an environment artifact, not an application risk. Out of scope; no lifecycle stage.
- **The two confirmed structural bugs** (`390×844` pipeline-graph clipping, intermittent `700×900` toolbar auto-scroll) were both re-observed at baseline severity during the Part D smoke check — not worsened by this pipeline's retokenization. Unchanged; owned by Route-by-Route Restyling per the audit's original disposition.
