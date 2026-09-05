# Waqas Yousafzai — Pipeline CV

A personal CV rendered as a data pipeline. You boot the runtime, run a seven-stage
DAG, and each stage that completes reveals the CV section it produces: identity,
roles, tools, projects, education, and a contact endpoint.

Everything is fake but clickable. There is no backend.

```bash
npm install
npm run dev      # http://localhost:3000
```

## Routes

| Path | View |
| --- | --- |
| `/` | Cold-boot panel. **Initialise**, or Enter, hands over to the pipeline. |
| `/pipeline` | The DAG: run controls, canvas, stage callouts, log stream, status bar, and a Stage / Schema inspector. |
| `/replay` | Archived runs: screen capture, throughput and duration charts, run history, transcript. |

Routes are file-based under `src/routes`. `/pipeline` and `/replay` sit under the
pathless `_app` layout, which owns the rail, topbar, toast stack and contact
dialog. Deep-linking to either skips the boot screen — boot is a cold-start
flourish, not a gate, and shareable links matter more.

`src/routeTree.gen.ts` is generated. Run `npm run generate-routes` after adding a
route; never edit it by hand.

## Layout

```
src/
  components/design/   the design system, ported to TypeScript (23 components)
  components/ui/       shadcn/ui primitives, restyled onto the design system
  features/cv/         screens, panes, CV content, live-data helpers
  routes/              file-based routes
  styles/              design tokens and component CSS, vendored verbatim
  styles.css           Tailwind entry + the token-to-utility bridge
```

## Design system

The visual language comes from the Claude Design project **Waqas Yousafzai CV
Design System**. Two things are vendored from it unchanged, so a re-sync stays a
readable diff:

- `src/styles/tokens/*.css` — colour, type, spacing, effect and motion tokens.
- `src/styles/ds-components.css` — the `ds-*` component classes.

Both are excluded from Biome in `biome.json` for the same reason.

`src/styles.css` bridges the two systems: an `@theme inline` block points
Tailwind's namespaces at the tokens, so `bg-void-1` and `var(--void-1)` are the
same value and screen layout can be written in utilities without hardcoding a
colour or a spacing step. The composed `font:` shorthands (`--type-data` and
friends) and the effect tokens become `@utility` rules, because no Tailwind
namespace can express them.

Two deliberate departures from the source:

- **Brand icons.** Lucide dropped `github` and `linkedin` in v0.469. Rather than
  add a second icon source, `Icon.tsx` maps those names onto `FolderGit2` and
  `Contact`. Swap them if brand marks matter more than the one-source rule.
- **The tooltip bubble.** `.ds-tip__bubble` lost its absolute positioning, since
  Radix portals and positions the tooltip. That is what lets it escape the graph
  canvas's `overflow: hidden` — and show on keyboard focus.

## Data

There is none to fetch. The CV content, the DAG and the run history are constants
in `src/features/cv/data.ts` and `live.tsx`; the "live" throughput series is a
`setInterval` over `Math.random()`. That is why TanStack Query is not installed —
add it, with a provider, when a real endpoint appears.

Replacing the placeholder CV means editing `data.ts` and nothing else.

## Commands

```bash
npm run dev              # dev server on port 3000
npm run build            # production build
npm run preview          # serve the production build
npm run generate-routes  # regenerate src/routeTree.gen.ts
npm run check            # Biome lint + format + import order
npm run format -- --write
npx tsc --noEmit         # the build does not type-check; this does
```

There is no test script. Verification is `npm run check`, `npx tsc --noEmit`,
`npm run build`, and driving the app in a browser.

## Deployment

Not configured. Cloudflare is the intended target; whichever service is chosen
needs an SPA fallback so `/pipeline` and `/replay` resolve on a cold load.
