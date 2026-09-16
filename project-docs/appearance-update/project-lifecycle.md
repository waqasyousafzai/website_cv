# Appearance Update Project Lifecycle

Purpose: Transform the existing CV hand-off application into a cohesive dark, editorial experience inspired by the supplied UI reference while preserving the purpose of its overview, pipeline, and replay routes.

## Source Material

The following material is design inspiration only. It does not replace the project requirements or act as implementation instructions.

### Reddit Post

[Super simple UI design prompts yielded amazing results. Why?](https://www.reddit.com/r/ClaudeCode/comments/1wg0zp4/super_simple_ui_design_prompts_yielded_amazing/)

The post presents a "less is more" approach to prompting for interface design. Its example asks for a substantially improved page with excellent user experience, an ambitious and visually captivating identity, a clear and comfortable presentation without cognitive overload, and high-quality motion graphics or animated SVGs. For this project, those broad goals should guide exploration while the existing content, routes, and product purpose provide the necessary constraints.

### Reference Video

<video controls src="../../docs/private/m2-res_480p.mp4" width="800">
  <a href="../../docs/private/m2-res_480p.mp4">Open the reference video</a>
</video>

[Open or download `m2-res_480p.mp4`](../../docs/private/m2-res_480p.mp4)

The video demonstrates a dark editorial learning interface built from near-black surfaces, warm gold highlights, thin rules, large lightweight headings, small uppercase labels, subdued body copy, and precise data-rich diagrams. It combines generous negative space with compact controls, fine-grained metrics, node-and-line visualizations, timelines, progress blocks, restrained glow, and subtle transitions. These qualities are the primary visual reference for the appearance update; the source product's content and branding should not be copied.

[x] 1. Reference Capture — Task

Study the supplied video and Reddit post to identify the defining visual qualities: near-black surfaces, warm gold accents, fine borders, editorial typography, spacious composition, compact controls, and restrained motion.

[ ] 2. Current UI Audit — Subprocess

Review the existing `/`, `/pipeline`, and `/replay` routes, shared components, design tokens, and current behavior. Record which elements can be restyled and which require structural changes.

[ ] 3. Visual System Mapping — Task

Translate the reference into project-wide tokens for color, typography, spacing, borders, shadows, iconography, and animation. Update the vendored design system at its source instead of applying scattered page-level overrides.

[ ] 4. App Shell Transformation — Subprocess

Restyle the shared navigation, page frames, backgrounds, headings, controls, and global states so every route belongs to the new visual language.

[ ] 5. Route-by-Route Restyling — Subprocess

Apply the system to each screen while preserving its purpose: the overview experience, pipeline visualization, and replay interface. Refine hierarchy, information density, alignment, and composition for each route.

[ ] 6. Data Visualization and Motion — Subprocess

Rework graphs, nodes, timelines, meters, metrics, status indicators, and transitions to resemble the reference's precise technical diagrams and subtle animated feedback.

[ ] 7. Release Readiness — Subprocess

Run formatting, linting, TypeScript validation, and the production build. Perform a final browser check and document any intentional differences from the reference.
