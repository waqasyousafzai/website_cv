# Reference Capture - Task

[x] Review the supplied reference video and Reddit post, then populate this file's **Reference Brief** section below: a concise, evidence-led brief covering the visual language, composition, controls, data visualization, motion, and usability principles to carry into later design work.

## Required Brief Structure

1. **Sources and scope** — identify both references and state that they are inspiration rather than product or implementation requirements.
2. **Video evidence** — use a table with **Timestamp**, **Observed detail**, and **Adaptable principle** columns. Include observations from the opening, middle, and closing thirds of the clip, and collectively cover surfaces and colour, typography, spacing and composition, controls, diagrams and information density, and motion or transitions.
3. **Reddit guidance** — paraphrase the relevant "less is more" guidance and explain how it constrains the desired experience.
4. **Project guardrails** — separate transferable design qualities from source-specific content, branding, and product structure. Preserve the CV-as-data-pipeline identity and the established purposes of `/`, `/pipeline`, and `/replay`.
5. **Carry forward / Avoid** — finish with two short, actionable lists that the Visual System Mapping stage can use without re-reading the sources.

## Acceptance Criteria

- This file's **Reference Brief** section identifies both reviewed sources: `docs/private/m2-res_480p.mp4` and the linked [Reddit post](https://www.reddit.com/r/ClaudeCode/comments/1wg0zp4/super_simple_ui_design_prompts_yielded_amazing/).
- The video table contains at least one timestamped observation from each of `00:00–00:08`, `00:09–00:17`, and `00:18–00:25.8`; each observation distinguishes what is visible from the principle inferred for this project.
- The video findings collectively record concrete evidence for near-black surfaces, warm gold accents, fine borders or rules, editorial typography, spacious composition, compact controls, data-rich diagrams, and restrained motion or transitions.
- The Reddit findings paraphrase the useful "less is more" guidance: strong visual impact balanced with clarity, comfort, low cognitive load, and purposeful animation.
- The brief distinguishes adaptable design qualities from source-specific copy, branding, product content, and exact layouts that must not be reproduced. It states that the application's existing CV content, data-pipeline identity, and established route purposes remain authoritative.
- The final **Carry forward / Avoid** section gives unambiguous direction for Visual System Mapping while remaining implementation-neutral.
- Completion is documentation-only: do not audit the current UI, choose token values, prescribe component-level changes, modify application code or styles, or add dependencies.

## Reference Brief

### 1. Sources and Scope

Two sources were reviewed for this brief:

- **Reference video** — `docs/private/m2-res_480p.mp4` (25.8 seconds), a screen capture of a third-party product ("Udeha").
- **Reddit post** — ["Super simple UI design prompts yielded amazing results. Why?"](https://www.reddit.com/r/ClaudeCode/comments/1wg0zp4/super_simple_ui_design_prompts_yielded_amazing/), r/ClaudeCode.

Both sources are **inspiration only**. Neither is a product specification, a design system, nor a set of implementation requirements. Nothing here should be read as "build this feature" or "copy this screen" — the brief exists to extract transferable visual and interaction *qualities*, not to import the reference product's content, branding, or information architecture into this CV hand-off application.

### 2. Video Evidence

The clip runs 00:00–00:25.8 and shows two screens of the reference product plus the transition between them: a curriculum overview, a "Role Models" browsing view, and a course-builder/configurator view. Timestamps below are approximate, read from the captured frame nearest each mark.

| Timestamp | Observed detail | Adaptable principle |
|---|---|---|
| 00:00–00:02 | Clip opens on a solid black frame before the first screen resolves. | Deliberate, restrained entrances rather than abrupt content pop-in — motion should ease the eye in, not startle it. |
| 00:02 | Near-black page background; a thin horizontal rule sits above a small tracked uppercase label ("CURRICULUM") next to a single small gold/amber dot; a large, light-weight heading spans two lines beneath it. | Near-black surfaces paired with one warm accent colour used sparingly (a single dot, not a wash), plus hairline rules used to anchor small uppercase eyebrow labels above headings. |
| 00:04 | Four stat tiles (large cream numeric value, small muted caption underneath) sit in a 2×2 grid beside the heading; body copy beneath the heading is small and muted grey against the dark surface. | Compact "stat tile" pattern — oversized number, quiet label — for surfacing metrics without heavy chrome; clear contrast hierarchy between heading, numeral, and caption type weights/sizes. |
| 00:04–00:06 | A node-and-line diagram: scattered dots on the left converge through connecting lines toward a central glowing point, then fan out into a grid of solid gold squares on the right. Below it, a four-step row (numbered 01–04) pairs a small line-icon with a one-word label and one-line caption. | Data-rich, node/flow-style diagrams as a signature visual motif for "many inputs converge into a structured output" — appropriate for a pipeline-shaped product. Numbered step rows with icon + label + caption as a compact way to narrate a process inline. |
| 00:06 | Screen transitions to a new view: a very large, thin-weight editorial heading ("Role Models") occupies the left column; a soft-glowing illustration built from many small dots forms a silhouette on the right; a top tab bar shows one tab underlined to mark the active section. | Oversized, lightweight editorial headings as the dominant typographic voice; particle/dot-built illustration with restrained glow as an alternative to photographic imagery; simple underline convention for active navigation state. |
| 00:08 | A meta-line ("21 people · 1975–2014") sits under the heading; a horizontal scrubber of small circular thumbnails runs along the bottom of the screen; a small pause icon sits near the illustration; a detail card lists labeled rows (small uppercase field labels with a value beside each) and small pill-shaped tag chips. | Small uppercase meta-lines for scope/count context; a horizontal scrubber/timeline built from compact circular thumbnails as a browsing control; label/value row pattern plus low-key pill chips for structured metadata display. |
| 00:09.5 | The same detail-card layout re-populates with different field values and different tag chips as the scrubber position changes; the transition between records is a quiet cross-fade with no layout shift. | Stable card "shape" with swappable content — changing data should restyle in place rather than re-arranging the layout, and transitions between records should be quiet, not jarring. |
| 00:11.5 | A sparse full-bleed frame briefly shows four faint outlined geometric glyphs (triangle, circle, diamond, square) linked by a dashed rule, alongside a small vertical bar-code-like pattern in gold; a breadcrumb link with a left arrow fades in at the top-left as the next screen begins. | Restrained, abstract wipes/interstitials between major views (geometric motifs, dashed connective lines) rather than hard cuts; a simple breadcrumb-with-arrow convention for "back" navigation into a builder-style screen. |
| 00:13.5 | New screen: a small uppercase label with hairline rule ("THE MODULES") introduces a list of rows, each with a small bar-chart glyph, a title, a day count, a small coloured category icon+label, and a pill-shaped "Add" button on the right. A sticky right-hand panel shows a circular counter and an empty horizontal segmented bar. | Accordion-row list pattern (icon + title + metadata + compact pill action) for dense, scannable option lists; sticky summary panel with a circular counter and a segmented bar to keep cumulative state visible while scrolling a long list. |
| 00:15.5 | One row expands in place to reveal body copy and a row of small rounded tag chips ("addresses" this item); the sidebar's circular counter now shows a live number and its segmented bar has begun filling with warm-toned blocks; small category counters tally beneath it. | Inline expand/disclosure for progressive detail (no navigation away from the list); segmented "fill" bars and live counters as feedback for cumulative selections; small tagged counters to summarise composition of a selection. |
| 00:17 | The segmented bar is now mostly filled with warm cream/gold blocks up to the running total, with numeric scale ticks below it (start / midpoint / max); selected rows in the list show a drag-handle glyph and small up/down arrow controls. | Scale ticks under a fill bar to give selections a sense of range and headroom; drag-handle plus arrow-button pairing so reordering is available both by pointer and by discrete control, aiding compact touch targets. |
| 00:18.5 | Selected rows now carry a solid gold circular checkmark and a thin gold rule along the row's left edge; a couple of not-yet-reachable rows show small muted inline text ("Adding this would take you past 35 days") instead of the add control. | Left-edge accent rule plus a filled accent-coloured check as the "selected" signature; muted inline helper text to explain why a control is disabled, kept close to the control rather than in a separate alert. |
| 00:20.5 | Checkbox controls are seen mid-toggle across the list — some still an outlined ring, others already a solid filled gold circle with check — implying an eased fill transition rather than an instant swap. | Toggle controls should animate their fill/state change (short ease), not snap, reinforcing the restrained-motion quality throughout. |
| 00:22.5 | Sidebar is now fully populated: a large circular counter ("32"), a one-line status sentence ("32 of 30–35 days. Ready to start."), and a collapsible summary row ("6 MODULES"). | Plain-language status sentences alongside numeric displays reduce cognitive load versus numbers alone; collapsible summary rows keep dense detail available without permanently consuming space. |
| 00:24.5 | The reorder list shows six numbered rows (01–06), each with a drag handle, a day-range subtitle ("Days x–y"), and an inline remove (×) control; below it, a two-column summary ("What this course addresses") pairs small icon bullets with counts, plus one further collapsible row ("26 obstacles"). | Numbered-row-with-subrange pattern for ordered, quantified lists; compact two-column icon+count summaries as a lightweight alternative to a chart when only totals matter; consistent use of collapsible rows to layer detail on demand. |
| 00:25.5 | Final frame: a solid gold "Start" button with a trailing arrow glyph, under cursor hover, separated from the list above by a single hairline rule. | Single strong accent-coloured call-to-action (gold fill, dark label) reserved for the primary action; a hairline rule is sufficient separation between content and a sticky action area — no heavy card/shadow needed. |

Collectively, this evidence documents: near-black surfaces with a single warm gold/cream accent used sparingly; fine hairline borders and rules used as structure rather than boxes/shadows; large light-weight editorial headings paired with small tracked-uppercase labels and muted body copy; generous negative space around hero content; compact controls (pill buttons, chips, small icon+label pairs, drag handles); data-rich diagrams and dense-but-orderly information display (node/flow diagrams, segmented fill bars, circular counters, numbered reorder lists, icon+count summaries); and restrained motion (fades, eased state changes, quiet cross-fades, abstract interstitial wipes) rather than decorative animation.

### 3. Reddit Guidance

The post's author reports that a short, simple prompt — asking broadly for a substantially improved page with an ambitious, visually captivating identity, a clear and comfortable presentation free of cognitive overload, and high-quality motion or animated SVG detailing — produced results they preferred over longer, more prescriptive prompts. The underlying "less is more" guidance is: pursue **strong visual impact**, but hold it in balance with **clarity**, **comfort**, and **low cognitive load**, and let **motion be purposeful** (reinforcing hierarchy and feedback) rather than decorative.

For this project, that guidance should shape *how ambitious the visual language is allowed to be* — bold typography, a confident accent colour, and considered motion are all in scope — while every screen still has to read clearly at a glance, avoid crowding the user with simultaneous detail, and use animation only where it clarifies state or transition, never as ornamentation for its own sake.

### 4. Project Guardrails

**Transferable (carry into design work):** near-black surface colour with a single warm accent; hairline rules and borders as the primary structural device; an editorial type pairing of oversized light headings with small tracked-uppercase labels; generous spacing/negative space; compact pill/chip/icon controls; data-dense but orderly diagram patterns (flow/node diagrams, segmented fill bars, circular counters, numbered/reorderable lists, icon+count summaries); restrained, purposeful motion (fades, eased state changes, quiet transitions between views).

**Source-specific (do not carry forward):** the "Udeha" name, logo, and brand marks; the curriculum/"Role Models"/course-builder subject matter and copy; the specific people, figures, numbers, and tag values shown (e.g. named individuals, obstacle/module counts); the exact screen layouts, navigation labels, and information architecture of the reference product; its specific data model (obstacles, modules, courses, "days").

This application's existing CV content, its identity as a **CV-as-data-pipeline**, and the established purposes of its three routes remain authoritative and unchanged by this brief:

- `/` — the overview/entry experience.
- `/pipeline` — the pipeline visualization.
- `/replay` — the replay interface.

Visual System Mapping should adapt the *qualities* above to these existing routes and their existing content — it should not introduce the reference product's subject matter, rename routes, or restructure what each route is for.

### 5. Carry Forward / Avoid

**Carry forward**

- Near-black surfaces with one warm gold/cream accent used sparingly (small dots, fills, checks, the primary CTA) rather than as a broad wash.
- Hairline rules/borders as the default structural device instead of heavy cards, boxes, or shadows.
- Large light-weight editorial headings paired with small tracked-uppercase labels and muted secondary copy.
- Generous negative space around primary content, with compact, low-chrome controls (pills, chips, small icon+label pairs) where density is needed.
- Data-rich diagram patterns — flow/node diagrams, segmented fill bars, circular counters, numbered/reorderable lists, icon+count summaries — as the vocabulary for representing pipeline/replay data.
- Restrained, purposeful motion: eased fades and state changes, quiet cross-fades between views, abstract interstitial transitions — always in service of clarity or feedback.
- The Reddit post's balance of ambition with clarity, comfort, and low cognitive load as the standard to weigh every visual decision against.

**Avoid**

- Copying the "Udeha" brand, logo, curriculum/course-builder subject matter, named individuals, or any of the reference product's specific copy or data values.
- Reproducing the reference's exact screen layouts, navigation structure, or route/page purposes.
- Treating the video or the Reddit post as a specification — neither dictates specific colour values, type scales, spacing units, or component implementations.
- Decorative or attention-seeking animation that doesn't communicate state, hierarchy, or transition.
- Any change to this application's existing CV content, its data-pipeline identity, or the established purposes of `/`, `/pipeline`, and `/replay`.
